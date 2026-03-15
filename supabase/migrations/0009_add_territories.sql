create table if not exists public.territories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index if not exists idx_territories_user_name
  on public.territories (user_id, lower(name));

create index if not exists idx_territories_user
  on public.territories(user_id);

create trigger set_territories_updated_at
before update on public.territories
for each row execute function public.set_updated_at();

create table if not exists public.territory_sources (
  id uuid primary key default gen_random_uuid(),
  territory_id uuid not null references public.territories(id) on delete cascade,
  pool_id uuid references public.pools(id) on delete set null,
  pool_name text not null,
  section text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_territory_sources_territory
  on public.territory_sources(territory_id);

alter table public.territories enable row level security;
alter table public.territory_sources enable row level security;

create policy territories_owner on public.territories
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

create policy territory_sources_owner on public.territory_sources
  for all using (
    exists (
      select 1
      from public.territories t
      join public.users u on u.id = t.user_id
      where t.id = territory_id and u.auth_user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1
      from public.territories t
      join public.users u on u.id = t.user_id
      where t.id = territory_id and u.auth_user_id = auth.uid()
    )
  );
