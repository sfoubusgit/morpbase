-- v3 Direct Messages — 1:1 threads between creators, plus blocks.
--
-- A thread has exactly two participants. The initiator's participant row is
-- accepted = true; the recipient's is accepted = false until they accept, so
-- first contact from a stranger lands in a "Requests" inbox. Thread creation
-- goes through v3_dm_get_or_create_thread() (SECURITY DEFINER) so the two
-- participant rows are created atomically and a pair can never get duplicate
-- threads (sorted pair_key). Message bodies are SFW-rated in the app on send.

create extension if not exists pgcrypto;

-- ── tables ──────────────────────────────────────────────────────────────────
create table if not exists public.v3_dm_threads (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null default auth.uid(),
  pair_key text unique not null,               -- sorted "uidA:uidB"
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create table if not exists public.v3_dm_participants (
  thread_id uuid not null references public.v3_dm_threads(id) on delete cascade,
  auth_uid uuid not null,
  accepted boolean not null default false,
  last_read_at timestamptz not null default now(),
  muted boolean not null default false,
  left_at timestamptz,
  primary key (thread_id, auth_uid)
);
create index if not exists v3_dm_participants_uid_idx on public.v3_dm_participants (auth_uid);

create table if not exists public.v3_dm_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.v3_dm_threads(id) on delete cascade,
  sender_auth_uid uuid not null default auth.uid(),
  body text not null default '',
  kind text not null default 'text',           -- 'text' | 'attachment' (phase 3)
  payload jsonb,                               -- attachment ref (phase 3)
  rating text not null default 'sfw',
  created_at timestamptz not null default now()
);
create index if not exists v3_dm_messages_thread_idx on public.v3_dm_messages (thread_id, created_at);

create table if not exists public.v3_blocks (
  blocker_auth_uid uuid not null default auth.uid(),
  blocked_auth_uid uuid not null,
  created_at timestamptz not null default now(),
  primary key (blocker_auth_uid, blocked_auth_uid),
  constraint v3_blocks_no_self check (blocker_auth_uid <> blocked_auth_uid)
);

-- ── helpers ─────────────────────────────────────────────────────────────────
-- membership check, SECURITY DEFINER so RLS policies don't recurse
create or replace function public.v3_is_dm_member(t uuid, u uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.v3_dm_participants p where p.thread_id = t and p.auth_uid = u);
$$;

-- keep last_message_at fresh (drives inbox ordering) without a threads-update policy
create or replace function public.v3_dm_touch_thread()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.v3_dm_threads set last_message_at = new.created_at where id = new.thread_id;
  return new;
end; $$;
drop trigger if exists v3_dm_touch on public.v3_dm_messages;
create trigger v3_dm_touch after insert on public.v3_dm_messages
  for each row execute function public.v3_dm_touch_thread();

-- find or create the canonical 1:1 thread with another user
create or replace function public.v3_dm_get_or_create_thread(p_other uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  key text;
  tid uuid;
begin
  if me is null then raise exception 'not authenticated'; end if;
  if p_other is null or p_other = me then raise exception 'invalid recipient'; end if;
  if exists (
    select 1 from public.v3_blocks b
    where (b.blocker_auth_uid = me and b.blocked_auth_uid = p_other)
       or (b.blocker_auth_uid = p_other and b.blocked_auth_uid = me)
  ) then raise exception 'blocked'; end if;

  key := case when me < p_other
              then me::text || ':' || p_other::text
              else p_other::text || ':' || me::text end;

  select id into tid from public.v3_dm_threads where pair_key = key;
  if tid is null then
    insert into public.v3_dm_threads (created_by, pair_key) values (me, key)
      on conflict (pair_key) do update set pair_key = excluded.pair_key
      returning id into tid;
    insert into public.v3_dm_participants (thread_id, auth_uid, accepted)
      values (tid, me, true), (tid, p_other, false)
      on conflict do nothing;
  end if;
  return tid;
end; $$;

grant execute on function public.v3_dm_get_or_create_thread(uuid) to authenticated;

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.v3_dm_threads      enable row level security;
alter table public.v3_dm_participants enable row level security;
alter table public.v3_dm_messages     enable row level security;
alter table public.v3_blocks          enable row level security;

drop policy if exists v3_dm_threads_read on public.v3_dm_threads;
create policy v3_dm_threads_read on public.v3_dm_threads
  for select using (public.v3_is_dm_member(id, auth.uid()));

drop policy if exists v3_dm_participants_read   on public.v3_dm_participants;
drop policy if exists v3_dm_participants_update on public.v3_dm_participants;
create policy v3_dm_participants_read on public.v3_dm_participants
  for select using (public.v3_is_dm_member(thread_id, auth.uid()));
create policy v3_dm_participants_update on public.v3_dm_participants
  for update using (auth_uid = auth.uid()) with check (auth_uid = auth.uid());

drop policy if exists v3_dm_messages_read on public.v3_dm_messages;
drop policy if exists v3_dm_messages_send on public.v3_dm_messages;
create policy v3_dm_messages_read on public.v3_dm_messages
  for select using (public.v3_is_dm_member(thread_id, auth.uid()));
create policy v3_dm_messages_send on public.v3_dm_messages
  for insert with check (
    sender_auth_uid = auth.uid()
    and public.v3_is_dm_member(thread_id, auth.uid())
    and not exists (
      select 1 from public.v3_dm_participants p
      join public.v3_blocks b
        on (b.blocker_auth_uid = p.auth_uid and b.blocked_auth_uid = auth.uid())
        or (b.blocker_auth_uid = auth.uid() and b.blocked_auth_uid = p.auth_uid)
      where p.thread_id = v3_dm_messages.thread_id
    )
  );

drop policy if exists v3_blocks_read   on public.v3_blocks;
drop policy if exists v3_blocks_insert on public.v3_blocks;
drop policy if exists v3_blocks_delete on public.v3_blocks;
create policy v3_blocks_read on public.v3_blocks
  for select using (blocker_auth_uid = auth.uid() or blocked_auth_uid = auth.uid());
create policy v3_blocks_insert on public.v3_blocks
  for insert with check (blocker_auth_uid = auth.uid());
create policy v3_blocks_delete on public.v3_blocks
  for delete using (blocker_auth_uid = auth.uid());

-- ── realtime (idempotent) ────────────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'v3_dm_messages'
  ) then
    execute 'alter publication supabase_realtime add table public.v3_dm_messages';
  end if;
end $$;
