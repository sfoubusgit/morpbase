# MorpBase Log (handoff)

Date: 2026-03-07
Repo: c:\Users\Sina\Desktop\PROMPTGEN\prompt_generator_v3.2_final
Remote: https://github.com/sfoubusgit/morpbase.git

## Current Status
- App is live on Vercel and Supabase is used for auth + data.
- Landing page implemented and shown only on first visit (localStorage key: `morpbase:seen_landing`).
- Pool Hub now supports auth-backed public creator profiles, with optional public prompt visibility.
- Cloud prompts exist in Supabase (`saved_prompts` table). Public prompts are opt-in via profile setting.

## Important Files / Features
- Landing page
  - `src/ui/components/LandingPage.tsx`
  - `src/ui/components/LandingPage.css`
  - Wire-up: `src/ui/App.tsx`
  - First-visit gating via `localStorage` key `morpbase:seen_landing`.

- Public profiles (auth-backed)
  - `src/engine/profileStore.ts`
  - `src/types/profiles.ts`
  - `supabase/migrations/0003_add_public_profiles.sql`
  - Pool Hub UI integration in `src/ui/components/PoolHubPage.tsx` + CSS.
  - Creator search + profile modal + profile editor modal.

- Public prompts (opt-in)
  - Profile toggle: `show_public_prompts`
  - Migration: `supabase/migrations/0004_add_public_prompt_visibility.sql`
  - Prompt access: `listPublicPromptsByUser` in `src/engine/promptStore.ts`
  - Displayed in Pool Hub creator modal when opt-in.

- Working Set publish uses creator profile
  - `src/ui/components/WorkingSetsPage.tsx`
  - Uses `getMyPublicProfile()` and sets `creatorId`.

- Prompt library split (local vs cloud)
  - Cloud prompts only in `Prompts` page.
  - Local prompts only in Builder.

## Supabase Actions Required (must run in SQL editor)
1) `supabase/migrations/0003_add_public_profiles.sql`
2) `supabase/migrations/0004_add_public_prompt_visibility.sql`

## Branding / Logo
- No custom logo currently in UI. Sidebar uses original SVG icon.
- `public/morpbase-mark-512.png` exists: extracted stacked symbol as PNG (transparent).
- Favicon set to `/morpbase_favicon.png` via `index.html`.

## Recent Commits
- `dad48dc` "Add landing page and public prompt visibility"

## Notes / Known UX
- Landing page shows on first visit only. Delete localStorage key to show again.
- Pool Hub: upload uses profile display name when available; creator name required.
- Profile editor now labeled "Edit profile" (not Create).

## Deploy
- Vercel auto-deploys from GitHub (if configured).
- Ensure Supabase URL + anon key present in Vercel env vars.

## Open Questions / Next Ideas
- Consider adding login CTA on landing page or auto-skip landing if logged in.
- Potential to add profile card on Pool Hub detail panel (not done).
- Confirm Supabase auth settings (email/password + Site URL).
