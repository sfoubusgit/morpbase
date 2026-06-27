-- v3 generation quota — per-user daily cap so cloud GPU spend can't be abused.
--
-- The generation Edge Function checks + increments this (via the service role,
-- which bypasses RLS). Users can read their own usage to show "N left today".
-- The actual daily limit lives in the Edge Function, not here.

create table if not exists public.v3_gen_quota (
  auth_uid uuid not null,
  day date not null,
  count int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (auth_uid, day)
);

create index if not exists v3_gen_quota_uid_idx on public.v3_gen_quota (auth_uid, day desc);

alter table public.v3_gen_quota enable row level security;

drop policy if exists v3_gen_quota_read on public.v3_gen_quota;

-- users may read their own usage; all writes go through the service role
create policy v3_gen_quota_read on public.v3_gen_quota
  for select using (auth_uid = auth.uid());
