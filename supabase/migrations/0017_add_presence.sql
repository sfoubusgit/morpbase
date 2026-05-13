alter table public.public_profiles
  add column if not exists last_seen_at timestamptz;

create index if not exists idx_public_profiles_last_seen_at
  on public.public_profiles(last_seen_at desc);
