-- Let users pin a small set of badges as their public "showcase" — up
-- to three, ordered. Stored as a JSON array of badge_id strings on
-- public_profiles. Empty array (or null) means "show all earned, sorted
-- by earned_at" on the public page.

alter table public.public_profiles
  add column if not exists featured_badge_ids jsonb default '[]'::jsonb;
