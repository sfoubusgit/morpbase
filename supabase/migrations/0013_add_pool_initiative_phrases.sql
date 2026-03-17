alter table public.pools
add column if not exists initiative_phrases jsonb not null default '[]'::jsonb;
