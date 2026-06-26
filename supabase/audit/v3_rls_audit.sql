-- v3 RLS audit — run in the Supabase SQL editor and compare against the
-- "expected" notes below. Read-only: this only introspects catalog tables.
--
-- Covers the four v3 surfaces:
--   public.v3_channel_images   (0027)  — public read,  owner write
--   public.v3_channel_comments (0028)  — public read,  owner write
--   public.v3_channel_ratings  (0028)  — public read,  owner write/update
--   public.v3_favorites        (0029)  — PRIVATE read,  owner write
--   storage bucket 'gen-images'(0027)  — public read,  owner-folder write

-- 1) Is RLS actually enabled on every v3 table?
--    Expected: rowsecurity = true for all four.
select c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('v3_channel_images','v3_channel_comments','v3_channel_ratings','v3_favorites')
order by c.relname;

-- 2) Enumerate every policy on the v3 tables.
--    Expected per table (cmd / roles / using / with_check):
--      v3_channel_images   read   SELECT  true            / -
--                          insert INSERT  -               / authenticated and author_auth_uid = auth.uid()
--                          delete DELETE  author_auth_uid = auth.uid() / -
--      v3_channel_comments read   SELECT  true            / -
--                          insert INSERT  -               / authenticated and author_auth_uid = auth.uid()
--                          delete DELETE  author_auth_uid = auth.uid() / -
--      v3_channel_ratings  read   SELECT  true            / -
--                          insert INSERT  -               / authenticated and auth_uid = auth.uid()
--                          update UPDATE  auth_uid = auth.uid() / (inherits using)
--      v3_favorites        read   SELECT  auth_uid = auth.uid()  / -   <-- PRIVATE, not true
--                          insert INSERT  -               / authenticated and auth_uid = auth.uid()
--                          delete DELETE  auth_uid = auth.uid() / -
select tablename, policyname, cmd, qual as using_expr, with_check as check_expr
from pg_policies
where schemaname = 'public'
  and tablename in ('v3_channel_images','v3_channel_comments','v3_channel_ratings','v3_favorites')
order by tablename, cmd, policyname;

-- 3) Storage bucket visibility + object policies.
--    Expected: gen-images public = true; three policies (public read,
--    owner-folder insert, owner-folder delete) scoped by bucket_id.
select id, name, public from storage.buckets where id = 'gen-images';

select policyname, cmd, qual as using_expr, with_check as check_expr
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
  and policyname like 'genimg_%'
order by cmd, policyname;
