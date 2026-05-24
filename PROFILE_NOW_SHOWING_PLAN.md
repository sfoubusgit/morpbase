# Implementation Plan — "Currently Working On" Profile Slot

A single, current, ephemeral image on a user's profile (§5b of IMAGE_CONCEPT.md).
Shows aliveness without a gallery. **Reuses the existing Supabase image pipeline**
(avatar/cover), so it's a small, low-risk build — not a new storage system.

## Existing pattern it clones
Profiles are Supabase-backed (`public_profiles` table, `PublicProfile` type,
`profileStore.ts`, `MyProfilePage` editor, `PublicCreatorPage` display). Cover
images already work: `uploadCover(authUid, file)` → `{storagePath, publicUrl}`,
stored as `coverImageUrl` + `coverStoragePath`; editor validates (image, ≤8 MB),
replaces/removes with orphan cleanup. We mirror this exactly.

## Data model
Add to `PublicProfile` (src/types/profiles.ts) and the DB:
- `currentWorkUrl?: string | null`
- `currentWorkStoragePath?: string | null`
- `currentWorkCaption?: string | null` — e.g. "Dust Run × Comic" or free text
- `currentWorkUpdatedAt?: number | null` — drives the "ephemeral / freshness" display
- *(later)* `currentWorkRecipe?: { universeId?; styleId? }` — to deep-link the caption

## Supabase migration
- `public_profiles`: add `current_work_url text`, `current_work_storage_path text`,
  `current_work_caption text`, `current_work_updated_at timestamptz`.
- New storage bucket **`current-work`** (recommended over reusing `covers` for a
  clean lifecycle), RLS policies mirroring the `avatars`/`covers` buckets.

## Engine — profileStore.ts
- `toPublicProfile`: map the 4 new columns.
- `upsertMyPublicProfile`: accept + write the 4 fields; set
  `current_work_updated_at = now()` whenever the URL changes.
- Add `uploadCurrentWork(authUid, file)` + `deleteCurrentWorkFile(storagePath)` —
  direct clones of `uploadCover`/`deleteCoverFile` against the `current-work`
  bucket.

## UI — MyProfilePage.tsx (editor)
- New "Currently working on" block mirroring the cover block:
  upload / replace / remove + orphan cleanup, 8 MB image validation.
- A **caption input** ("What are you building?").
- A **"Use current build"** button (P2) that auto-fills the caption from the
  active builder session (universe + style).
- Include the fields in the save payload.

## UI — PublicCreatorPage.tsx (display)
- A modest **"Currently working on" card**: image at a fixed *small* size, a
  caption line ("Currently working on **Dust Run × Comic**"), and a relative time
  ("updated 2 days ago").
- Singular and small — NOT a hero banner. Sidebar or a compact strip near the top.
- **Freshness:** if `currentWorkUpdatedAt` is stale (> ~30 days), soften the label
  ("last seen working on…") rather than delete. Reinforces ephemerality.

## Auto-from-session (P2)
App.tsx already persists a `BuilderSessionSnapshot` (`morpbase:builder_session`).
Expose active universe + style so "Use current build" prefills the caption (and
later one-tap attaches the recipe link).

## Anti-gallery guardrails (by design)
One image per profile · no history · no likes/counts · recipe-anchored caption ·
WIP framing. The single-slot constraint *is* the feature.

## Phasing
- **P1 (ship):** data model + migration + bucket + profileStore upload + editor
  (manual upload + caption) + display card.
- **P2:** auto-fill caption from the active session; relative-time freshness.
- **P3 (optional):** deep-link caption to the universe/style page; "studio" mini-line.

## Files touched
- Supabase migration (SQL) — columns + `current-work` bucket + RLS
- src/types/profiles.ts — 4 fields
- src/engine/profileStore.ts — mapping, upsert, upload/delete helpers
- src/ui/components/MyProfilePage.tsx (+ .css) — editor block
- src/ui/components/PublicCreatorPage.tsx (+ .css) — display card

## Open decisions
- New `current-work` bucket vs reuse `covers` (recommend **new**).
- Stale behavior: soften after 30 days? (recommend yes; never auto-delete the file).
- Manual-only first, or include "Use current build" in P1? (recommend manual in
  P1, auto in P2.)
