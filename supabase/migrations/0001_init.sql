-- MorpBase initial schema (Supabase/Postgres)
-- Portable core tables + hub/community tables

create extension if not exists "pgcrypto";

-- Generic updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Users profile table (decoupled from auth)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

-- Saved prompts (private)
create table if not exists public.saved_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  positive text not null,
  negative text,
  tags text[],
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_saved_prompts_user on public.saved_prompts(user_id);
create index if not exists idx_saved_prompts_created on public.saved_prompts(created_at);

create trigger set_saved_prompts_updated_at
before update on public.saved_prompts
for each row execute function public.set_updated_at();

-- Pools (private)
create table if not exists public.pools (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_pools_user on public.pools(user_id);

create trigger set_pools_updated_at
before update on public.pools
for each row execute function public.set_updated_at();

-- Pool items (private)
create table if not exists public.pool_items (
  id uuid primary key default gen_random_uuid(),
  pool_id uuid not null references public.pools(id) on delete cascade,
  text text not null,
  tags text[],
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_pool_items_pool on public.pool_items(pool_id);

create trigger set_pool_items_updated_at
before update on public.pool_items
for each row execute function public.set_updated_at();

-- Working sets (private)
create table if not exists public.working_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_working_sets_user on public.working_sets(user_id);

create trigger set_working_sets_updated_at
before update on public.working_sets
for each row execute function public.set_updated_at();

-- Working set items (private)
create table if not exists public.working_set_items (
  id uuid primary key default gen_random_uuid(),
  working_set_id uuid not null references public.working_sets(id) on delete cascade,
  pool_id uuid,
  pool_item_id uuid,
  category_id text not null,
  text text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_working_set_items_ws on public.working_set_items(working_set_id);

-- Hub type enum
create type public.hub_type as enum ('prompt', 'pool', 'working_set');

-- Prompt Hub entries (public read)
create table if not exists public.prompt_hub_entries (
  id uuid primary key default gen_random_uuid(),
  creator_user_id uuid references public.users(id) on delete set null,
  creator_label text not null,
  title text not null,
  summary text not null,
  description text not null,
  tags text[] default array[]::text[],
  category text not null,
  languages text[] default array[]::text[],
  license text not null,
  hero_image_url text,
  payload jsonb not null,
  downloads integer not null default 0,
  rating_avg numeric(3,2) not null default 0,
  rating_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_prompt_hub_created on public.prompt_hub_entries(created_at);

create trigger set_prompt_hub_updated_at
before update on public.prompt_hub_entries
for each row execute function public.set_updated_at();

-- Pool Hub entries (public read)
create table if not exists public.pool_hub_entries (
  id uuid primary key default gen_random_uuid(),
  creator_user_id uuid references public.users(id) on delete set null,
  creator_label text not null,
  title text not null,
  summary text not null,
  description text not null,
  tags text[] default array[]::text[],
  category text not null,
  languages text[] default array[]::text[],
  license text not null,
  hero_image_url text,
  payload jsonb not null,
  downloads integer not null default 0,
  rating_avg numeric(3,2) not null default 0,
  rating_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_pool_hub_created on public.pool_hub_entries(created_at);

create trigger set_pool_hub_updated_at
before update on public.pool_hub_entries
for each row execute function public.set_updated_at();

-- Working Set Hub entries (public read)
create table if not exists public.working_set_hub_entries (
  id uuid primary key default gen_random_uuid(),
  creator_user_id uuid references public.users(id) on delete set null,
  creator_label text not null,
  title text not null,
  summary text not null,
  description text not null,
  tags text[] default array[]::text[],
  category text not null,
  languages text[] default array[]::text[],
  license text not null,
  hero_image_url text,
  payload jsonb not null,
  downloads integer not null default 0,
  rating_avg numeric(3,2) not null default 0,
  rating_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_working_set_hub_created on public.working_set_hub_entries(created_at);

create trigger set_working_set_hub_updated_at
before update on public.working_set_hub_entries
for each row execute function public.set_updated_at();

-- Hub comments
create table if not exists public.hub_comments (
  id uuid primary key default gen_random_uuid(),
  hub_type public.hub_type not null,
  hub_entry_id uuid not null,
  author_user_id uuid references public.users(id) on delete set null,
  author_label text not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_hub_comments_entry on public.hub_comments(hub_type, hub_entry_id);

create trigger set_hub_comments_updated_at
before update on public.hub_comments
for each row execute function public.set_updated_at();

-- Hub ratings
create table if not exists public.hub_ratings (
  id uuid primary key default gen_random_uuid(),
  hub_type public.hub_type not null,
  hub_entry_id uuid not null,
  user_id uuid not null references public.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_hub_ratings_unique on public.hub_ratings(hub_type, hub_entry_id, user_id);

create trigger set_hub_ratings_updated_at
before update on public.hub_ratings
for each row execute function public.set_updated_at();

-- Hub flags
create table if not exists public.hub_flags (
  id uuid primary key default gen_random_uuid(),
  hub_type public.hub_type not null,
  hub_entry_id uuid not null,
  user_id uuid references public.users(id) on delete set null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_hub_flags_entry on public.hub_flags(hub_type, hub_entry_id);

-- RLS enablement
alter table public.users enable row level security;
alter table public.saved_prompts enable row level security;
alter table public.pools enable row level security;
alter table public.pool_items enable row level security;
alter table public.working_sets enable row level security;
alter table public.working_set_items enable row level security;
alter table public.prompt_hub_entries enable row level security;
alter table public.pool_hub_entries enable row level security;
alter table public.working_set_hub_entries enable row level security;
alter table public.hub_comments enable row level security;
alter table public.hub_ratings enable row level security;
alter table public.hub_flags enable row level security;

-- Users: only owner
create policy users_select_own on public.users
  for select using (auth_user_id = auth.uid());
create policy users_insert_own on public.users
  for insert with check (auth_user_id = auth.uid());
create policy users_update_own on public.users
  for update using (auth_user_id = auth.uid());
create policy users_delete_own on public.users
  for delete using (auth_user_id = auth.uid());

-- Private tables
create policy saved_prompts_owner on public.saved_prompts
  for all using (exists (select 1 from public.users u where u.id = user_id and u.auth_user_id = auth.uid()));

create policy pools_owner on public.pools
  for all using (exists (select 1 from public.users u where u.id = user_id and u.auth_user_id = auth.uid()));

create policy pool_items_owner on public.pool_items
  for all using (
    exists (
      select 1
      from public.pools p
      join public.users u on u.id = p.user_id
      where p.id = pool_id and u.auth_user_id = auth.uid()
    )
  );

create policy working_sets_owner on public.working_sets
  for all using (exists (select 1 from public.users u where u.id = user_id and u.auth_user_id = auth.uid()));

create policy working_set_items_owner on public.working_set_items
  for all using (
    exists (
      select 1
      from public.working_sets ws
      join public.users u on u.id = ws.user_id
      where ws.id = working_set_id and u.auth_user_id = auth.uid()
    )
  );

-- Hub entries: public read, owner write
create policy prompt_hub_read on public.prompt_hub_entries
  for select using (true);
create policy prompt_hub_write on public.prompt_hub_entries
  for all using (
    exists (select 1 from public.users u where u.id = creator_user_id and u.auth_user_id = auth.uid())
  ) with check (
    exists (select 1 from public.users u where u.id = creator_user_id and u.auth_user_id = auth.uid())
  );

create policy pool_hub_read on public.pool_hub_entries
  for select using (true);
create policy pool_hub_write on public.pool_hub_entries
  for all using (
    exists (select 1 from public.users u where u.id = creator_user_id and u.auth_user_id = auth.uid())
  ) with check (
    exists (select 1 from public.users u where u.id = creator_user_id and u.auth_user_id = auth.uid())
  );

create policy working_set_hub_read on public.working_set_hub_entries
  for select using (true);
create policy working_set_hub_write on public.working_set_hub_entries
  for all using (
    exists (select 1 from public.users u where u.id = creator_user_id and u.auth_user_id = auth.uid())
  ) with check (
    exists (select 1 from public.users u where u.id = creator_user_id and u.auth_user_id = auth.uid())
  );

-- Hub comments: public read, author write
create policy hub_comments_read on public.hub_comments
  for select using (true);
create policy hub_comments_write on public.hub_comments
  for all using (
    exists (select 1 from public.users u where u.id = author_user_id and u.auth_user_id = auth.uid())
  ) with check (
    exists (select 1 from public.users u where u.id = author_user_id and u.auth_user_id = auth.uid())
  );

-- Hub ratings: public read, author write
create policy hub_ratings_read on public.hub_ratings
  for select using (true);
create policy hub_ratings_write on public.hub_ratings
  for all using (
    exists (select 1 from public.users u where u.id = user_id and u.auth_user_id = auth.uid())
  ) with check (
    exists (select 1 from public.users u where u.id = user_id and u.auth_user_id = auth.uid())
  );

-- Hub flags: write-only for authenticated users
create policy hub_flags_insert on public.hub_flags
  for insert with check (auth.uid() is not null);

