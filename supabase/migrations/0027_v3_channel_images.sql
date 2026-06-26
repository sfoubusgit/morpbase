-- v3 channel images — generated images saved into a lane item's channel gallery.
--
-- Keyed by subject_id (the stable seed character id string, e.g.
-- 'character_seed_ny_konbini_yurei'), so channel content is shared across users
-- without migrating the localStorage-seeded characters themselves into the DB.
-- Files live in a public 'gen-images' bucket at gen-images/{authUid}/{file};
-- first path segment is the owner auth uid so storage RLS scopes writes.

-- ── gen-images bucket ────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('gen-images', 'gen-images', true)
on conflict (id) do nothing;

drop policy if exists genimg_public_read  on storage.objects;
drop policy if exists genimg_owner_insert on storage.objects;
drop policy if exists genimg_owner_delete on storage.objects;

create policy genimg_public_read on storage.objects
  for select using (bucket_id = 'gen-images');

create policy genimg_owner_insert on storage.objects
  for insert with check (
    bucket_id = 'gen-images'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy genimg_owner_delete on storage.objects
  for delete using (
    bucket_id = 'gen-images'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── v3_channel_images table ──────────────────────────────────────────────────

create table if not exists public.v3_channel_images (
  id uuid primary key default gen_random_uuid(),
  subject_id text not null,
  author_auth_uid uuid not null,
  author_label text,
  url text not null,
  storage_path text,
  created_at timestamptz not null default now()
);

create index if not exists v3_channel_images_subject_idx
  on public.v3_channel_images (subject_id, created_at desc);

alter table public.v3_channel_images enable row level security;

drop policy if exists v3_channel_images_read   on public.v3_channel_images;
drop policy if exists v3_channel_images_insert on public.v3_channel_images;
drop policy if exists v3_channel_images_delete on public.v3_channel_images;

-- public read — channels are browsable by everyone
create policy v3_channel_images_read on public.v3_channel_images
  for select using (true);

-- authenticated users insert their own rows
create policy v3_channel_images_insert on public.v3_channel_images
  for insert with check (
    auth.role() = 'authenticated' and author_auth_uid = auth.uid()
  );

-- owners delete their own rows
create policy v3_channel_images_delete on public.v3_channel_images
  for delete using (author_auth_uid = auth.uid());
