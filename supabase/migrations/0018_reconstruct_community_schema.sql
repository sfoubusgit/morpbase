-- Reconstruction of community tables that were created directly in the Supabase
-- dashboard without corresponding migration files.
--
-- All statements use CREATE TABLE IF NOT EXISTS / CREATE INDEX IF NOT EXISTS /
-- CREATE OR REPLACE FUNCTION so this migration is a safe no-op against the
-- live database, while establishing a version-controlled baseline for future
-- ALTER TABLE migrations.
--
-- Tables covered:
--   wall_posts, wall_post_likes, user_xp, user_badges,
--   community_identities, follows, notifications,
--   challenges, challenge_entries, direct_messages
--
-- RPCs covered:
--   award_xp, increment_wall_post_likes, decrement_wall_post_likes,
--   increment_remix_count


-- ── wall_posts ────────────────────────────────────────────────────────────────

create table if not exists public.wall_posts (
  id              uuid        primary key default gen_random_uuid(),
  auth_uid        text        not null,
  author_id       uuid        references public.users(id) on delete set null,
  author_name     text        not null,
  caption         text,
  prompt_text     text        not null,
  identity_tags   jsonb       not null default '[]'::jsonb,
  like_count      integer     not null default 0,
  created_at      timestamptz not null default now()
);

create index if not exists idx_wall_posts_created
  on public.wall_posts(created_at desc);

create index if not exists idx_wall_posts_auth_uid
  on public.wall_posts(auth_uid);

alter table public.wall_posts enable row level security;

create policy if not exists wall_posts_read on public.wall_posts
  for select using (true);

create policy if not exists wall_posts_insert on public.wall_posts
  for insert with check (auth_uid = auth.uid()::text);

create policy if not exists wall_posts_delete on public.wall_posts
  for delete using (auth_uid = auth.uid()::text);


-- ── wall_post_likes ───────────────────────────────────────────────────────────

create table if not exists public.wall_post_likes (
  post_id  uuid not null references public.wall_posts(id) on delete cascade,
  auth_uid text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, auth_uid)
);

create index if not exists idx_wall_post_likes_auth_uid
  on public.wall_post_likes(auth_uid);

alter table public.wall_post_likes enable row level security;

create policy if not exists wall_post_likes_read on public.wall_post_likes
  for select using (true);

create policy if not exists wall_post_likes_insert on public.wall_post_likes
  for insert with check (auth_uid = auth.uid()::text);

create policy if not exists wall_post_likes_delete on public.wall_post_likes
  for delete using (auth_uid = auth.uid()::text);


-- ── user_xp ───────────────────────────────────────────────────────────────────

create table if not exists public.user_xp (
  auth_uid  text    primary key,
  total_xp  integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.user_xp enable row level security;

create policy if not exists user_xp_read on public.user_xp
  for select using (true);

create policy if not exists user_xp_own on public.user_xp
  for all using (auth_uid = auth.uid()::text);

-- RPC: upsert xp for a user
create or replace function public.award_xp(p_auth_uid text, p_amount integer)
returns void as $$
begin
  insert into public.user_xp(auth_uid, total_xp, updated_at)
    values (p_auth_uid, p_amount, now())
  on conflict (auth_uid) do update
    set total_xp   = user_xp.total_xp + excluded.total_xp,
        updated_at = now();
end;
$$ language plpgsql security definer;

-- RPC: increment cached like count
create or replace function public.increment_wall_post_likes(post_id uuid)
returns void as $$
begin
  update public.wall_posts
    set like_count = like_count + 1
  where id = post_id;
end;
$$ language plpgsql security definer;

-- RPC: decrement cached like count (floor 0)
create or replace function public.decrement_wall_post_likes(post_id uuid)
returns void as $$
begin
  update public.wall_posts
    set like_count = greatest(0, like_count - 1)
  where id = post_id;
end;
$$ language plpgsql security definer;


-- ── user_badges ───────────────────────────────────────────────────────────────

create table if not exists public.user_badges (
  auth_uid   text   not null,
  badge_id   text   not null,
  earned_at  timestamptz not null default now(),
  primary key (auth_uid, badge_id)
);

create index if not exists idx_user_badges_auth_uid
  on public.user_badges(auth_uid);

alter table public.user_badges enable row level security;

create policy if not exists user_badges_read on public.user_badges
  for select using (true);

create policy if not exists user_badges_insert on public.user_badges
  for insert with check (auth_uid = auth.uid()::text);


-- ── community_identities ──────────────────────────────────────────────────────

create table if not exists public.community_identities (
  id                    uuid        primary key default gen_random_uuid(),
  name                  text        not null,
  type                  text        not null,
  phrases               text[]      not null default array[]::text[],
  summary               text        not null default '',
  author_id             text,
  author_name           text        not null,
  author_cover_image_url text,
  featured              boolean     not null default false,
  created_at            timestamptz not null default now(),
  parent_id             uuid        references public.community_identities(id) on delete set null,
  remix_count           integer     not null default 0
);

create index if not exists idx_community_identities_created
  on public.community_identities(created_at desc);

create index if not exists idx_community_identities_type
  on public.community_identities(type);

create index if not exists idx_community_identities_author
  on public.community_identities(author_id);

alter table public.community_identities enable row level security;

create policy if not exists community_identities_read on public.community_identities
  for select using (true);

create policy if not exists community_identities_insert on public.community_identities
  for insert with check (author_id = auth.uid()::text);

create policy if not exists community_identities_delete on public.community_identities
  for delete using (author_id = auth.uid()::text);

-- RPC: increment cached remix count
create or replace function public.increment_remix_count(identity_id uuid)
returns void as $$
begin
  update public.community_identities
    set remix_count = remix_count + 1
  where id = identity_id;
end;
$$ language plpgsql security definer;


-- ── follows ───────────────────────────────────────────────────────────────────

create table if not exists public.follows (
  follower_auth_uid   text not null,
  following_auth_uid  text not null,
  created_at          timestamptz not null default now(),
  primary key (follower_auth_uid, following_auth_uid)
);

create index if not exists idx_follows_following
  on public.follows(following_auth_uid);

alter table public.follows enable row level security;

create policy if not exists follows_read on public.follows
  for select using (true);

create policy if not exists follows_insert on public.follows
  for insert with check (follower_auth_uid = auth.uid()::text);

create policy if not exists follows_delete on public.follows
  for delete using (follower_auth_uid = auth.uid()::text);


-- ── notifications ─────────────────────────────────────────────────────────────

create table if not exists public.notifications (
  id         uuid        primary key default gen_random_uuid(),
  auth_uid   text        not null,
  type       text        not null,
  payload    jsonb       not null default '{}'::jsonb,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_auth_uid
  on public.notifications(auth_uid, created_at desc);

alter table public.notifications enable row level security;

create policy if not exists notifications_own on public.notifications
  for all using (auth_uid = auth.uid()::text);

create policy if not exists notifications_insert_service on public.notifications
  for insert with check (true);


-- ── challenges ────────────────────────────────────────────────────────────────

create table if not exists public.challenges (
  id              uuid        primary key default gen_random_uuid(),
  number          integer     not null unique,
  title           text        not null,
  constraint_text text        not null,
  description     text,
  type            text        not null default 'weekly',
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  created_at      timestamptz not null default now()
);

create index if not exists idx_challenges_dates
  on public.challenges(starts_at, ends_at);

alter table public.challenges enable row level security;

create policy if not exists challenges_read on public.challenges
  for select using (true);


-- ── challenge_entries ─────────────────────────────────────────────────────────

create table if not exists public.challenge_entries (
  id           uuid        primary key default gen_random_uuid(),
  challenge_id uuid        not null references public.challenges(id) on delete cascade,
  auth_uid     text        not null,
  author_id    uuid        references public.users(id) on delete set null,
  wall_post_id uuid        references public.wall_posts(id) on delete set null,
  created_at   timestamptz not null default now(),
  unique (challenge_id, auth_uid)
);

create index if not exists idx_challenge_entries_challenge
  on public.challenge_entries(challenge_id);

alter table public.challenge_entries enable row level security;

create policy if not exists challenge_entries_read on public.challenge_entries
  for select using (true);

create policy if not exists challenge_entries_insert on public.challenge_entries
  for insert with check (auth_uid = auth.uid()::text);


-- ── direct_messages ───────────────────────────────────────────────────────────

create table if not exists public.direct_messages (
  id                  uuid        primary key default gen_random_uuid(),
  sender_auth_uid     text        not null,
  sender_name         text        not null,
  recipient_auth_uid  text        not null,
  recipient_name      text        not null,
  body                text        not null,
  prompt_snapshot     text,
  read_at             timestamptz,
  created_at          timestamptz not null default now()
);

create index if not exists idx_direct_messages_sender
  on public.direct_messages(sender_auth_uid, created_at desc);

create index if not exists idx_direct_messages_recipient
  on public.direct_messages(recipient_auth_uid, created_at desc);

alter table public.direct_messages enable row level security;

create policy if not exists direct_messages_own on public.direct_messages
  for all using (
    sender_auth_uid    = auth.uid()::text or
    recipient_auth_uid = auth.uid()::text
  );
