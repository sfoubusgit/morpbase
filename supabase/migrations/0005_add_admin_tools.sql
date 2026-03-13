-- Admin tools for internal operations

create table if not exists public.admin_users (
  user_id uuid primary key references public.users(id) on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.admin_can_manage()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  with current_user_row as (
    select id, created_at
    from public.users
    where auth_user_id = auth.uid()
    limit 1
  ),
  first_user as (
    select id
    from public.users
    order by created_at asc, id asc
    limit 1
  )
  select exists (
    select 1
    from current_user_row cur
    join public.admin_users a on a.user_id = cur.id
  ) or (
    not exists (select 1 from public.admin_users)
    and exists (
      select 1
      from current_user_row cur
      join first_user first on first.id = cur.id
    )
  );
$$;

create or replace function public.admin_is_current_user()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.admin_can_manage();
$$;

create or replace function public.admin_list_users()
returns table (
  user_id uuid,
  display_name text,
  email text,
  created_at timestamptz,
  has_public_profile boolean,
  pool_hub_visible boolean,
  upload_count integer
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
    u.id as user_id,
    u.display_name,
    u.email,
    u.created_at,
    (p.user_id is not null) as has_public_profile,
    (p.user_id is not null) as pool_hub_visible,
    (
      coalesce(pool_uploads.count_value, 0)
      + coalesce(ws_uploads.count_value, 0)
      + coalesce(prompt_uploads.count_value, 0)
    )::integer as upload_count
  from public.users u
  left join public.public_profiles p
    on p.user_id = u.id
  left join lateral (
    select count(*)::integer as count_value
    from public.pool_hub_entries e
    where e.creator_user_id = u.id
      and e.deleted_at is null
  ) pool_uploads on true
  left join lateral (
    select count(*)::integer as count_value
    from public.working_set_hub_entries e
    where e.creator_user_id = u.id
      and e.deleted_at is null
  ) ws_uploads on true
  left join lateral (
    select count(*)::integer as count_value
    from public.prompt_hub_entries e
    where e.creator_user_id = u.id
      and e.deleted_at is null
  ) prompt_uploads on true
  order by u.created_at desc, u.display_name asc;
end;
$$;

create or replace function public.admin_create_missing_public_profile(target_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  target_name text;
  inserted_count integer := 0;
begin
  if not public.admin_can_manage() then
    raise exception 'Admin access required.';
  end if;

  select u.display_name
  into target_name
  from public.users u
  where u.id = target_user_id;

  if target_name is null then
    raise exception 'User not found.';
  end if;

  insert into public.public_profiles (user_id, display_name)
  select target_user_id, target_name
  where not exists (
    select 1
    from public.public_profiles p
    where p.user_id = target_user_id
  );

  get diagnostics inserted_count = row_count;
  return inserted_count > 0;
end;
$$;

create or replace function public.admin_backfill_missing_public_profiles()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_count integer := 0;
begin
  if not public.admin_can_manage() then
    raise exception 'Admin access required.';
  end if;

  insert into public.public_profiles (user_id, display_name)
  select u.id, u.display_name
  from public.users u
  left join public.public_profiles p
    on p.user_id = u.id
  where p.user_id is null;

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

grant execute on function public.admin_can_manage() to authenticated;
grant execute on function public.admin_is_current_user() to authenticated;
grant execute on function public.admin_list_users() to authenticated;
grant execute on function public.admin_create_missing_public_profile(uuid) to authenticated;
grant execute on function public.admin_backfill_missing_public_profiles() to authenticated;
