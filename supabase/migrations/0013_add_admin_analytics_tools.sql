create or replace function public.admin_analytics_summary()
returns table (
  total_events bigint,
  unique_sessions bigint,
  identified_users bigint,
  last_24h_events bigint,
  page_views bigint,
  prompt_saves bigint,
  territory_activations bigint,
  pool_opens bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_can_manage() then
    raise exception 'Admin access required.';
  end if;

  return query
  select
    count(*)::bigint as total_events,
    count(distinct session_id)::bigint as unique_sessions,
    count(distinct user_id)::bigint as identified_users,
    count(*) filter (where created_at >= now() - interval '24 hours')::bigint as last_24h_events,
    count(*) filter (where event_type = 'page_view')::bigint as page_views,
    count(*) filter (where event_type = 'prompt_save')::bigint as prompt_saves,
    count(*) filter (where event_type = 'territory_activate')::bigint as territory_activations,
    count(*) filter (where event_type = 'pool_open')::bigint as pool_opens
  from public.analytics_events;
end;
$$;

create or replace function public.admin_recent_analytics_events(limit_count integer default 40)
returns table (
  id uuid,
  event_type text,
  page_key text,
  path text,
  user_id uuid,
  session_id text,
  referrer_host text,
  metadata jsonb,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_can_manage() then
    raise exception 'Admin access required.';
  end if;

  return query
  select
    e.id,
    e.event_type,
    e.page_key,
    e.path,
    e.user_id,
    e.session_id,
    e.referrer_host,
    e.metadata,
    e.created_at
  from public.analytics_events e
  order by e.created_at desc
  limit greatest(coalesce(limit_count, 40), 1);
end;
$$;

create or replace function public.admin_analytics_page_breakdown(limit_count integer default 12)
returns table (
  page_key text,
  event_count bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_can_manage() then
    raise exception 'Admin access required.';
  end if;

  return query
  select
    coalesce(e.page_key, 'unknown') as page_key,
    count(*)::bigint as event_count
  from public.analytics_events e
  group by coalesce(e.page_key, 'unknown')
  order by event_count desc, page_key asc
  limit greatest(coalesce(limit_count, 12), 1);
end;
$$;

grant execute on function public.admin_analytics_summary() to authenticated;
grant execute on function public.admin_recent_analytics_events(integer) to authenticated;
grant execute on function public.admin_analytics_page_breakdown(integer) to authenticated;
