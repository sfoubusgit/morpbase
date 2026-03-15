alter table public.pool_items
add column if not exists section text;

create index if not exists idx_pool_items_section on public.pool_items(section);
