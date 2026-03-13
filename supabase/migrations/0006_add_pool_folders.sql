create table if not exists public.pool_folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_pool_folders_user_name
  on public.pool_folders (user_id, lower(name));

create index if not exists idx_pool_folders_user
  on public.pool_folders(user_id);

create trigger set_pool_folders_updated_at
before update on public.pool_folders
for each row execute function public.set_updated_at();

alter table public.pools
  add column if not exists folder_id uuid references public.pool_folders(id) on delete set null;

create index if not exists idx_pools_folder
  on public.pools(folder_id);

alter table public.pool_folders enable row level security;

create policy pool_folders_owner on public.pool_folders
  for all using (
    exists (
      select 1
      from public.users u
      where u.id = user_id and u.auth_user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1
      from public.users u
      where u.id = user_id and u.auth_user_id = auth.uid()
    )
  );
