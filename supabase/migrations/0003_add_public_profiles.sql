-- Public creator profiles for Hub

create table if not exists public.public_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  display_name text not null,
  bio text,
  avatar_url text,
  links jsonb,
  tags text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_public_profiles_user on public.public_profiles(user_id);

create trigger set_public_profiles_updated_at
before update on public.public_profiles
for each row execute function public.set_updated_at();

alter table public.public_profiles enable row level security;

create policy public_profiles_read on public.public_profiles
  for select using (true);

create policy public_profiles_write on public.public_profiles
  for all using (
    exists (
      select 1 from public.users u
      where u.id = user_id and u.auth_user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.users u
      where u.id = user_id and u.auth_user_id = auth.uid()
    )
  );
