alter table public.pools
  add column if not exists idp_sets jsonb not null default '[]'::jsonb;
