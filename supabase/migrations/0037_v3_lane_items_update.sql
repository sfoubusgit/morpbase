-- Let a creator edit their own lane objects. The base table (0030) only had
-- read/insert/delete policies, so updates were denied by RLS. This adds an
-- owner-scoped update policy.

drop policy if exists v3_lane_items_update on public.v3_lane_items;

create policy v3_lane_items_update on public.v3_lane_items
  for update using (author_auth_uid = auth.uid())
  with check (author_auth_uid = auth.uid());
