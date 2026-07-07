-- v3 posts — "Share what you made". Rather than a separate posts table, a post is
-- a group of v3_channel_images rows that share a post_id: one row per (image ×
-- attached subject), so every attached character/object's gallery keeps working
-- through the existing subject_id read path with no change. caption carries the
-- post's text. Legacy rows (post_id null) are treated as single-image posts.

alter table public.v3_channel_images
  add column if not exists post_id uuid,
  add column if not exists caption text;

create index if not exists v3_channel_images_post_idx
  on public.v3_channel_images (post_id);

create index if not exists v3_channel_images_author_idx
  on public.v3_channel_images (author_auth_uid, created_at desc);
