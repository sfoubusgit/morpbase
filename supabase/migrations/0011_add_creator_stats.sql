-- Projected creator stats for public profile and discovery surfaces

create table if not exists public.creator_stats (
  user_id uuid primary key references public.users(id) on delete cascade,
  public_pool_count integer not null default 0,
  public_prompt_count integer not null default 0,
  total_downloads integer not null default 0,
  avg_rating numeric(4,2) not null default 0,
  rating_count integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists idx_creator_stats_updated_at
  on public.creator_stats(updated_at desc);

create trigger set_creator_stats_updated_at
before update on public.creator_stats
for each row execute function public.set_updated_at();

alter table public.creator_stats enable row level security;

create policy creator_stats_read on public.creator_stats
  for select using (true);
