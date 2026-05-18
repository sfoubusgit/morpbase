-- Cover image uploads via Supabase Storage.
--
-- Mirrors the avatars setup from 0024 with a separate 'covers' bucket
-- (so URL inspection is honest about what's stored) and adds the
-- cover_storage_path column so we can clean up files on replace/remove.
-- Cover files live at covers/{authUid}/{filename}; first path segment
-- is the owner auth uid so RLS scopes writes correctly.

-- ── cover_storage_path column ────────────────────────────────────────────────

alter table public.public_profiles
  add column if not exists cover_storage_path text;


-- ── covers bucket ────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;


-- ── storage.objects policies for covers ──────────────────────────────────────

drop policy if exists covers_public_read   on storage.objects;
drop policy if exists covers_owner_insert  on storage.objects;
drop policy if exists covers_owner_update  on storage.objects;
drop policy if exists covers_owner_delete  on storage.objects;

create policy covers_public_read on storage.objects
  for select using (bucket_id = 'covers');

create policy covers_owner_insert on storage.objects
  for insert with check (
    bucket_id = 'covers'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy covers_owner_update on storage.objects
  for update using (
    bucket_id = 'covers'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy covers_owner_delete on storage.objects
  for delete using (
    bucket_id = 'covers'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
