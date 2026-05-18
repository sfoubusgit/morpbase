-- Track which profile-completion onboarding steps have already been
-- awarded XP. Without this, users could toggle a field on and off to
-- repeatedly farm the reward. The array stores step keys (e.g.
-- 'display_name', 'bio', 'avatar', 'cover', 'tags', 'visibility');
-- a step is only rewarded the first time it transitions to done.

alter table public.public_profiles
  add column if not exists profile_xp_steps_claimed text[] default '{}'::text[];
