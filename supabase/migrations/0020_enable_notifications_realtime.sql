-- Add the notifications table to the supabase_realtime publication so that
-- postgres_changes subscriptions filtered by auth_uid deliver INSERT events
-- to the bell + panel. Without this, the client subscribes successfully but
-- never receives events; the 5-minute poll is the only fallback.

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
end $$;
