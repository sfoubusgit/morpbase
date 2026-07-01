-- v3 user-created actions — an action is a lane item (lane='actions') plus a
-- relation phrase describing how it reads between two characters
-- ("{A} {relation} {B}", e.g. "is dancing with"). This column is used only for
-- action items; null for everything else.

alter table public.v3_lane_items add column if not exists relation text;
