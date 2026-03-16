-- Phase 1 profile expansion: public pool visibility, discovery, and avatar storage

alter table public.public_profiles
  add column if not exists show_public_pools boolean not null default false;

alter table public.public_profiles
  add column if not exists discoverable_in_search boolean not null default true;

alter table public.public_profiles
  add column if not exists show_links_publicly boolean not null default true;

alter table public.public_profiles
  add column if not exists avatar_storage_path text;

create index if not exists idx_public_profiles_discoverable
  on public.public_profiles(discoverable_in_search);

create index if not exists idx_public_profiles_display_name
  on public.public_profiles(display_name);

create index if not exists idx_public_profiles_tags
  on public.public_profiles using gin(tags);
