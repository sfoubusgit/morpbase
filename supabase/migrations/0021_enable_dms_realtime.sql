-- Add direct_messages to supabase_realtime so the postgres_changes
-- subscriptions in DMInbox (incoming + read receipts) and the unread
-- badge in the navbar receive INSERT and UPDATE events. Without this,
-- subscriptions succeed but no events ever fire.

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'direct_messages'
  ) then
    alter publication supabase_realtime add table public.direct_messages;
  end if;
end $$;
