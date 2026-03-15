alter table public.pool_folders
  add column if not exists sort_order integer not null default 0;

with ranked as (
  select id, row_number() over (partition by user_id order by created_at asc, id asc) - 1 as next_sort_order
  from public.pool_folders
)
update public.pool_folders pf
set sort_order = ranked.next_sort_order
from ranked
where pf.id = ranked.id;

create index if not exists idx_pool_folders_user_sort_order
  on public.pool_folders(user_id, sort_order);
