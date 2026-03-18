# Backup Log 18 03 2026

## Purpose

This is the next backup handoff log.
It captures the important state after the previous backup files and is meant to let a new agent continue work without reconstructing the last stretch of decisions manually.

## High-Level State

MorpBase is currently in a stronger and more coherent state than before.

Important truths right now:

- Builder Workflow Modes are live and conceptually bounded
- Territory-biased navigation now behaves coherently
- Pool Default Initiative Phrases are implemented and usable
- Pool-level IDP Sets exist and are visible in product surfaces
- official primary and secondary pools now exist with clearer roles
- the Global Phrase Layer has been turned into a floating movable tool
- a major future expansion concept, `Character Identity System`, has now been explored deeply but is not recommended as the immediate next build

## Most Important New Pushed Changes Since Earlier Backup Logs

### 1. Active Workflow summary improved

Prompt Preview now uses:

- `Pools: ...`

instead of the more confusing singular `Pool`.

This reflects a better product truth, especially when a Territory contributes more than one pool.

Relevant files:

- `src/ui/App.tsx`
- `src/ui/components/PromptPreview.tsx`

### 2. Floating Global Phrase Layer implemented

The old always-visible sidebar panel for `Global Phrase Layer` was replaced with:

- a floating trigger
- movable desktop positioning
- persisted trigger position
- a popover/panel that opens near the trigger

This was done to make the feature feel:

- lighter
- more personal
- more truthful to its role as a user-level constant layer

Relevant pushed commits:

- `998f6ca` `Add floating global phrase layer`
- `a0d1005` `Keep floating phrase layer above builder nav`
- `da97054` `Render floating phrase layer above builder UI`

Relevant files:

- `src/ui/components/FloatingPromptFragments.tsx`
- `src/ui/components/FloatingPromptFragments.css`
- `src/ui/App.tsx`

Important note:

- the portal-based render in `FloatingPromptFragments.tsx` was necessary because the floating layer was still getting trapped under Builder UI until it was moved to `document.body`

### 3. Global Phrase Layer is now becoming a true personal constant layer

There is now **local-only** work in progress that makes the floating Global Phrase Layer user-adjustable.

This local work adds:

- custom global phrases
- local persistence for those custom phrases
- a `Your constants` block inside the floating panel
- add / toggle / remove behavior

This is **not pushed yet**.

Local files changed:

- `src/ui/App.tsx`
- `src/ui/components/FloatingPromptFragments.tsx`
- `src/ui/components/FloatingPromptFragments.css`

Important truth:

- built-in phrases still exist
- the new custom phrases are meant to sit alongside them, not replace them

## Current Pool / Workflow State

### Primary Pools

`32x32 Pixel Art Portrait`

- remains the first successful elasticity-test case
- proved that the current system could support a specific workflow without requiring a new Mode

`Celestial Pixel Portrait`

- is now a real official primary pool
- has hero image support
- has initiative phrases
- has 3 visible IDP sets:
  - `Celestial Shrine`
  - `Magical Idol`
  - `Occult Pastel`

This pool is currently the strongest concept/test bed for more advanced workflow thinking.

### Secondary Pools

`Sacred Emblems and Handheld Relics`

- exists as a real official secondary pool
- is intentionally narrower than a primary pool
- has no IDPs
- acts as the first concrete test of primary + secondary pool composition

### Pool role labeling

Pool Hub now shows:

- `Primary Pool`
- `Secondary Pool`

in both card view and detail view.

Relevant pushed commit:

- `6af8be6` `Add pool role labels to pool hub`

## Character Identity System Exploration

This is the biggest conceptual development in the current local state.

The original instinct started as:

- `Character Builder`

After exploration, the stronger framing became:

- `Character Identity System`

### Most important conclusion

The idea is real because MorpBase may currently lack:

- a reusable cross-workflow subject identity layer

The system is strongest if it is treated as:

- a reusable character entity system
- broader than niche pools
- applied into workflows explicitly
- separate from Pools, Territories, and Modes

### Most important recommendation

It is a serious future candidate, but **not recommended as the immediate next build**.

Reason:

- the concept is strong
- but it is a major system
- MorpBase still benefits a lot from clarity work and more workflow validation first

## Character Identity Docs Created Locally

The following Character Identity docs now exist locally:

- `CHARACTER_IDENTITY_SYSTEM_EXPLORATION.md`
- `CHARACTER_IDENTITY_SYSTEM_THEORETICAL_WORKFLOW.md`
- `CHARACTER_IDENTITY_SYSTEM_SCOPE_BOUNDARY.md`
- `CHARACTER_IDENTITY_SYSTEM_MVP.md`
- `CHARACTER_IDENTITY_SYSTEM_ENTRY_POINTS.md`
- `CHARACTER_IDENTITY_SYSTEM_ARCHITECTURE_ANALYSIS.md`
- `CHARACTER_IDENTITY_SYSTEM_PROMPT_PREVIEW_FLOW.md`
- `CHARACTER_IDENTITY_SYSTEM_DATA_SHAPE.md`
- `CHARACTER_IDENTITY_SYSTEM_CREATION_EDIT_UX.md`
- `CHARACTER_BUILDER_VS_CHARACTER_IDENTITY_SYSTEM.md`
- `CHARACTER_IDENTITY_SYSTEM_MASTER_CONCEPT.md`
- `CHARACTER_IDENTITY_SYSTEM_FICTIONAL_EXAMPLE.md`
- `IMPLEMENTATION_PLAN_CHARACTER_IDENTITY_SYSTEM.md`
- `SHOULD_CHARACTER_IDENTITY_BE_NEXT.md`

Important status:

- these are conceptual docs
- they are **not pushed yet**

## Current Recommendation State

The best product recommendation right now is:

### Do not rush Character Identity into implementation yet

Instead:

1. keep it documented as a serious next-tier expansion
2. continue improving the current live workflow/product with smaller gains
3. continue validating user behavior and feedback

This is the current best sequencing judgment.

## Current Untracked / Local-Only State To Be Careful About

There are still many local untracked docs in the repo.
Do not assume they are all in GitHub.

Also leave these unrelated local files alone:

- `Log_13_03_2026.md`
- `chat_log.txt`
- `morpbaselogo.png`

## Best Resume Point For A New Agent

If a new agent takes over from here, the safest next continuation is:

### Option A: Current-product improvements

Continue with:

- smaller workflow clarity improvements
- prompt-layer clarity
- validating the floating Global Phrase Layer custom-content UX
- refining current live systems rather than adding a new major system

### Option B: Push / preserve concept work

If the user wants preservation first:

- push the Character Identity docs
- push the custom Global Phrase Layer changes once reviewed

### Option C: Re-open Character Identity later

If the user wants to revisit the big concept:

- start from `CHARACTER_IDENTITY_SYSTEM_MASTER_CONCEPT.md`
- then use `SHOULD_CHARACTER_IDENTITY_BE_NEXT.md`

Those two docs are the best re-entry point.

## Honest Summary

MorpBase is currently in a productive state:

- the live workflow is getting more coherent
- the pool/territory/IDP structure is stronger
- the floating Global Phrase Layer gives the app more personality
- and the Character Identity System is now a serious, well-developed future concept

The key current recommendation is:

- strengthen and validate the current product a bit more before committing to the next major architectural expansion.
