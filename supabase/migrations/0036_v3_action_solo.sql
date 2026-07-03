-- v3 solo actions — an action can now be "solo" (one character doing something
-- on their own, e.g. kneeling, jumping) rather than only a link between two
-- characters. This flag is used only for action lane items; false for the rest.

alter table public.v3_lane_items add column if not exists solo boolean not null default false;
