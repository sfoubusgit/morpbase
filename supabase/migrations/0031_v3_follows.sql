-- v3 follows — follow a creator (the person), CivitAI-style. Following a
-- character/lane object means following whoever authored it, so their new work
-- can surface for you. Keyed by auth uid; only real users (not seeded 'MorpBase'
-- content) can be followed.

create table if not exists public.v3_follows (
  follower_auth_uid uuid not null,
  creator_auth_uid uuid not null,
  created_at timestamptz not null default now(),
  primary key (follower_auth_uid, creator_auth_uid),
  constraint v3_follows_no_self check (follower_auth_uid <> creator_auth_uid)
);

create index if not exists v3_follows_creator_idx on public.v3_follows (creator_auth_uid);
create index if not exists v3_follows_follower_idx on public.v3_follows (follower_auth_uid);

alter table public.v3_follows enable row level security;

drop policy if exists v3_follows_read   on public.v3_follows;
drop policy if exists v3_follows_insert on public.v3_follows;
drop policy if exists v3_follows_delete on public.v3_follows;

-- public read — so follower counts and "creators you follow" are visible
create policy v3_follows_read on public.v3_follows
  for select using (true);

-- you manage only your own follows
create policy v3_follows_insert on public.v3_follows
  for insert with check (auth.role() = 'authenticated' and follower_auth_uid = auth.uid());
create policy v3_follows_delete on public.v3_follows
  for delete using (follower_auth_uid = auth.uid());
