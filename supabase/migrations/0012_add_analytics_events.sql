-- Built-in lightweight website analytics for MorpBase

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  user_id uuid references public.users(id) on delete set null,
  event_type text not null,
  page_key text,
  path text,
  referrer_host text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_analytics_events_created_at
  on public.analytics_events(created_at desc);

create index if not exists idx_analytics_events_event_type
  on public.analytics_events(event_type);

create index if not exists idx_analytics_events_page_key
  on public.analytics_events(page_key);

create index if not exists idx_analytics_events_user_id
  on public.analytics_events(user_id);

alter table public.analytics_events enable row level security;

create policy analytics_events_insert on public.analytics_events
  for insert with check (true);
