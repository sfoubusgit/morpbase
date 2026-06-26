-- v3 favorites — a user's personal bookmarks over public lane content.
--
-- In the v3 model there is no "personal library": every lane object is public,
-- and what a user owns is their set of favorites. Keyed by the stable item id
-- (subject_id) across every lane. Private to each user: only the owner can read
-- or write their own rows.

create table if not exists public.v3_favorites (
  auth_uid uuid not null,
  subject_id text not null,
  created_at timestamptz not null default now(),
  primary key (auth_uid, subject_id)
);

create index if not exists v3_favorites_auth_idx
  on public.v3_favorites (auth_uid, created_at desc);

alter table public.v3_favorites enable row level security;

drop policy if exists v3_favorites_read   on public.v3_favorites;
drop policy if exists v3_favorites_insert on public.v3_favorites;
drop policy if exists v3_favorites_delete on public.v3_favorites;

create policy v3_favorites_read on public.v3_favorites
  for select using (auth_uid = auth.uid());
create policy v3_favorites_insert on public.v3_favorites
  for insert with check (auth.role() = 'authenticated' and auth_uid = auth.uid());
create policy v3_favorites_delete on public.v3_favorites
  for delete using (auth_uid = auth.uid());
