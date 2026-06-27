-- v3 Worlds — replaces the old seeded "universes" with an emergent, user-driven
-- grouping. A World isn't a separate object you create up front; it comes into
-- being with its first member. Each created item simply carries an optional
-- world label, and the workspace groups/filters by it.

alter table public.v3_lane_items add column if not exists world text;

create index if not exists v3_lane_items_world_idx on public.v3_lane_items (world);
