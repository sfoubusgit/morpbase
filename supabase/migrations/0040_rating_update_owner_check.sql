-- Harden the ratings UPDATE policy. It previously had a USING clause (you may
-- only target your own rating rows) but no WITH CHECK, so a direct API call could
-- update its own row and reassign auth_uid to someone else — an impersonation
-- vector. Add WITH CHECK so the NEW row must also belong to the caller: owner-only
-- edit in both directions.
drop policy if exists v3_channel_ratings_update on public.v3_channel_ratings;
create policy v3_channel_ratings_update on public.v3_channel_ratings
  for update using (auth_uid = auth.uid()) with check (auth_uid = auth.uid());
