-- Community Phase 0: schema prerequisites for the community redesign.
--
-- Changes to wall_posts:
--   post_type        — classifies the post ('standard' | 'share_event' | 'response')
--   active_universe_id — the universe active in the workspace when the post was made
--   parent_post_id   — self-reference for Response Chain threading
--
-- New tables:
--   post_reactions   — replaces the like system with typed emoji reactions
--   identity_usages  — passive tracking of which community identities are used
--                      in workspace sessions (feeds Reach reputation in Phase 2)
--
-- Note: like_count on wall_posts is intentionally left in place. It represents
-- existing data and will stop being written to once post_reactions is live in
-- Phase 1. Column removal is a separate cleanup migration after Phase 1 stabilises.


-- ── wall_posts additions ──────────────────────────────────────────────────────

alter table public.wall_posts
  add column if not exists post_type          text        not null default 'standard',
  add column if not exists active_universe_id uuid,
  add column if not exists parent_post_id     uuid        references public.wall_posts(id) on delete set null;

-- Constraint: only valid post types accepted
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'wall_posts_post_type_check'
  ) then
    alter table public.wall_posts
      add constraint wall_posts_post_type_check
      check (post_type in ('standard', 'share_event', 'response'));
  end if;
end $$;

create index if not exists idx_wall_posts_post_type
  on public.wall_posts(post_type);

create index if not exists idx_wall_posts_parent
  on public.wall_posts(parent_post_id)
  where parent_post_id is not null;

create index if not exists idx_wall_posts_universe
  on public.wall_posts(active_universe_id)
  where active_universe_id is not null;


-- ── post_reactions ────────────────────────────────────────────────────────────
-- One row per (user, post, emoji). Unique constraint prevents duplicates.
-- Emoji is stored as the raw character (e.g. '🔥', '💜', '✨').

create table if not exists public.post_reactions (
  id         uuid        primary key default gen_random_uuid(),
  post_id    uuid        not null references public.wall_posts(id) on delete cascade,
  auth_uid   text        not null,
  emoji      text        not null,
  created_at timestamptz not null default now(),
  unique (post_id, auth_uid, emoji)
);

create index if not exists idx_post_reactions_post
  on public.post_reactions(post_id);

create index if not exists idx_post_reactions_auth_uid
  on public.post_reactions(auth_uid);

alter table public.post_reactions enable row level security;

create policy post_reactions_read on public.post_reactions
  for select using (true);

create policy post_reactions_insert on public.post_reactions
  for insert with check (auth_uid = auth.uid()::text);

create policy post_reactions_delete on public.post_reactions
  for delete using (auth_uid = auth.uid()::text);


-- ── identity_usages ───────────────────────────────────────────────────────────
-- Written once per workspace session when a community identity is loaded into
-- a lane. Used in Phase 2 to compute Reach reputation for identity authors.
-- identity_id is nullable — if the shared identity is later deleted, the usage
-- record remains (for aggregate stats) but the FK goes null.

create table if not exists public.identity_usages (
  id              uuid        primary key default gen_random_uuid(),
  identity_id     uuid        references public.community_identities(id) on delete set null,
  identity_name   text        not null,
  identity_type   text        not null,
  author_auth_uid text        not null,
  user_auth_uid   text        not null,
  created_at      timestamptz not null default now()
);

create index if not exists idx_identity_usages_identity
  on public.identity_usages(identity_id)
  where identity_id is not null;

create index if not exists idx_identity_usages_author
  on public.identity_usages(author_auth_uid);

create index if not exists idx_identity_usages_user
  on public.identity_usages(user_auth_uid);

-- Self-use rows are valid but low-signal for reputation; filtered in queries.
-- No RLS write restriction — any authenticated user can log a usage.
alter table public.identity_usages enable row level security;

create policy identity_usages_read on public.identity_usages
  for select using (true);

create policy identity_usages_insert on public.identity_usages
  for insert with check (user_auth_uid = auth.uid()::text);
