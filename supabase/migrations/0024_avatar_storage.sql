-- Avatar uploads via Supabase Storage + missing cover_image_url column.
--
-- avatar_storage_path was added in 0010 but never wired. Avatars are
-- currently base64-stuffed into avatar_url, bloating rows and slowing
-- profile loads. This migration creates the bucket, opens public read,
-- and restricts writes/deletes to the owning user. Avatar files live
-- at avatars/{userId}/{filename}.
--
-- cover_image_url is read/written by the existing profile code (and the
-- cover banner on the public creator page) but the column was never
-- created. Adding it here so the upsert stops silently dropping the
-- field.

-- ── cover_image_url column ────────────────────────────────────────────────────

alter table public.public_profiles
  add column if not exists cover_image_url text;


-- ── avatars bucket ───────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;


-- ── storage.objects policies for avatars ─────────────────────────────────────

drop policy if exists avatars_public_read   on storage.objects;
drop policy if exists avatars_owner_insert  on storage.objects;
drop policy if exists avatars_owner_update  on storage.objects;
drop policy if exists avatars_owner_delete  on storage.objects;

-- Anyone can read avatar files (URLs are embedded in public pages).
create policy avatars_public_read on storage.objects
  for select using (bucket_id = 'avatars');

-- Only the file owner (first path segment = user id) can insert.
create policy avatars_owner_insert on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy avatars_owner_update on storage.objects
  for update using (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy avatars_owner_delete on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
