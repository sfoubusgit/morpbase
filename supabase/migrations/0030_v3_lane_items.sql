-- v3 lane items — user-created lane objects (scenery, objects, mood, lighting,
-- composition, environment). The first lane content users author themselves.
--
-- A lane object is a lightweight, reusable prompt fragment: a name, a short
-- summary, and a handful of phrases that feed synthesis, plus an optional cover.
-- Public, browsable community content (the v3 model); writes require auth.
-- Covers reuse the public 'gen-images' bucket (path {authUid}/lane-...).

create table if not exists public.v3_lane_items (
  id uuid primary key default gen_random_uuid(),
  lane text not null,
  name text not null,
  summary text,
  phrases text[] not null default '{}',
  cover_url text,
  storage_path text,
  author_auth_uid uuid not null,
  author_label text,
  created_at timestamptz not null default now()
);

create index if not exists v3_lane_items_lane_idx
  on public.v3_lane_items (lane, created_at desc);

alter table public.v3_lane_items enable row level security;

drop policy if exists v3_lane_items_read   on public.v3_lane_items;
drop policy if exists v3_lane_items_insert on public.v3_lane_items;
drop policy if exists v3_lane_items_delete on public.v3_lane_items;

-- public read — lanes are browsable by everyone
create policy v3_lane_items_read on public.v3_lane_items
  for select using (true);

-- authenticated users insert their own rows
create policy v3_lane_items_insert on public.v3_lane_items
  for insert with check (auth.role() = 'authenticated' and author_auth_uid = auth.uid());

-- owners delete their own rows
create policy v3_lane_items_delete on public.v3_lane_items
  for delete using (author_auth_uid = auth.uid());
