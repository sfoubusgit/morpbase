-- v3 channel social — real comments + ratings on a lane item's channel.
--
-- Keyed by subject_id (the stable seed character id), like v3_channel_images.
-- Reads are public (channels are browsable); writes require auth.

-- ── comments ─────────────────────────────────────────────────────────────────

create table if not exists public.v3_channel_comments (
  id uuid primary key default gen_random_uuid(),
  subject_id text not null,
  author_auth_uid uuid not null,
  author_label text,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists v3_channel_comments_subject_idx
  on public.v3_channel_comments (subject_id, created_at desc);

alter table public.v3_channel_comments enable row level security;

drop policy if exists v3_channel_comments_read   on public.v3_channel_comments;
drop policy if exists v3_channel_comments_insert on public.v3_channel_comments;
drop policy if exists v3_channel_comments_delete on public.v3_channel_comments;

create policy v3_channel_comments_read on public.v3_channel_comments
  for select using (true);
create policy v3_channel_comments_insert on public.v3_channel_comments
  for insert with check (auth.role() = 'authenticated' and author_auth_uid = auth.uid());
create policy v3_channel_comments_delete on public.v3_channel_comments
  for delete using (author_auth_uid = auth.uid());

-- ── ratings (one per user per subject) ───────────────────────────────────────

create table if not exists public.v3_channel_ratings (
  subject_id text not null,
  auth_uid uuid not null,
  rating smallint not null check (rating between 1 and 5),
  updated_at timestamptz not null default now(),
  primary key (subject_id, auth_uid)
);

create index if not exists v3_channel_ratings_subject_idx
  on public.v3_channel_ratings (subject_id);

alter table public.v3_channel_ratings enable row level security;

drop policy if exists v3_channel_ratings_read   on public.v3_channel_ratings;
drop policy if exists v3_channel_ratings_insert on public.v3_channel_ratings;
drop policy if exists v3_channel_ratings_update on public.v3_channel_ratings;

create policy v3_channel_ratings_read on public.v3_channel_ratings
  for select using (true);
create policy v3_channel_ratings_insert on public.v3_channel_ratings
  for insert with check (auth.role() = 'authenticated' and auth_uid = auth.uid());
create policy v3_channel_ratings_update on public.v3_channel_ratings
  for update using (auth_uid = auth.uid());
