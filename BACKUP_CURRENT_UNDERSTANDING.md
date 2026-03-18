# Current Understanding of the App

## Purpose

This file is a backup handoff document for a new agent.
It should provide enough product and technical context to continue work in MorpBase without having to reconstruct the app from scratch.

## Product Summary

MorpBase is a structured prompt-building web app for image-generation workflows.
The app is not strongest when treated like a generic prompt textbox. It is strongest when treated like a system for:

- building prompts through guided categories
- reusing structured source material
- composing workflows from Pools and Territories
- iterating within coherent visual families

The product center is the Builder.
Most other systems matter insofar as they support Builder, organize material for Builder, or help save/share Builder outputs.

## Core System Roles

### Builder

Builder is the main creation surface.
It is responsible for:

- category-driven prompt construction
- current-node navigation
- accumulating additions from Pools / Territories
- generating and editing the final prompt output

Builder categories currently include:

- `subject`
- `style`
- `lighting`
- `camera`
- `environment`
- `quality`
- `effects`
- `post-processing`
- `actions`
- `anatomy-details`

The sidebar flow is staged as:

- `Define`
- `Refine`
- `Finish`

That staged structure is now meaningful because it supports mode-aware workflow guidance.

### Builder Workflow Modes

Builder Workflow Modes are implemented and live.
Current mode set:

- `Balanced`
- `Character-First`
- `Environment-First`
- `Scene-First`

Deferred:

- `Object-First`

Important truth:

Modes are:

- Builder-level
- guidance-oriented
- reversible
- sequencing / emphasis tools

Modes are not:

- a global product taxonomy
- a Pool property
- a Territory property
- a prompt-engine behavior system

### User Pools

User Pools are one of the strongest systems in the app.
They currently act as:

- reusable source libraries
- themed vocabularies
- structured prompt material collections
- the source layer for Territories

Pools now support:

- folders
- sectioned items
- initiative phrases
- IDP sets

This means Pools are no longer just flat fragment storage.
They are becoming structured workflow/source containers.

### Territories

Territories are composed source spaces built from `Pool + Section` combinations.
They are increasingly the stronger direction relative to older Working Sets.

When a Territory is active, it can shape:

- Builder focus
- highlighted categories
- Territory-biased navigation

Important truth:

- Territories are not Modes
- Territories define source-space focus
- Modes define Builder workflow orientation

Territory editor note:

- the Territory editor now defaults new sources to `Whole Pool`

### Pool Hub

Pool Hub is the discovery/distribution layer for official and community pools.
It supports:

- official Pool Hub entries
- community entries
- hero images
- creator metadata
- add/download behavior
- right-rail detail panels

It now also shows `IDP Sets` in the right-side detail rail for pools that have them.

### Prompt Output / Preview

Prompt Preview is the output control layer.
Current important truth:

- edited output is the effective source of truth

That means copy/save/preview behaviors should stay aligned with edited output, not older freeform assumptions.

### Prompt Library

Prompt Library stores reusable outputs.
It matters for continuity, but it is not currently the main design frontier.

### Working Sets

Working Sets still exist in the repo and product.
Current strategic reading:

- legacy relative to Pools + Territories
- should not be the main expansion target
- should be handled carefully, not expanded casually

## Strategic App Structure

The healthiest current division is:

- `Pools` = source identity and structured material
- `Territories` = composed source-space focus
- `Modes` = Builder workflow orientation
- `Builder` = active composition surface where the systems meet

This boundary matters and should be preserved.
A lot of recent work was about preventing these layers from bleeding into each other.

## Recent Important Feature Layers

### Pool Default Initiative Phrases

This MVP is implemented.
A Pool can carry default initiative phrases that:

- belong to the Pool
- are visible/editable/removable
- can be applied into Builder as prompt additions
- can optionally auto-apply on activation

Important truth:

- this is a Pool feature, not a Mode feature

The official `32x32 Pixel Art Portrait` pool uses this system and the first phrase auto-applies on activation.
`pool-default` prompt additions now persist when the user clicks `Clear Prompt`.

### IDP Sets

A newer extension now exists at the Pool level.
Pools can carry `idpSets`, where each set contains:

- set name
- phrase list

Current implemented surfaces:

- type support in `src/types/pools.ts`
- persistence support in `src/engine/poolStore.ts`
- template copy support in `src/engine/poolTemplates.ts`
- seeded support in `src/data/defaultUserPools.ts`
- Pool Hub payload support in `src/data/poolHubMock.ts` and `src/ui/components/PoolHubPage.tsx`
- User Pools overview visibility in `src/ui/components/UserPoolsPage.tsx`
- Pool Hub right-rail `IDP Sets` panel in `src/ui/components/PoolHubPage.tsx`

Important truth:

- currently the app shows IDP sets for discovery/inspection
- active Territory selection of IDP sets is still conceptual / future-facing
- the layered model is still the intended one:
  - Pools define sets
  - Territories choose sets
  - Builder applies sets

### Territory-Biased Navigation

This was a major integrity issue and is now corrected.
In `Territory-biased` mode:

- `Next` moves between Territory-mapped Builder categories
- it no longer secretly walks the normal subcategory stream underneath

This brought actual behavior in line with the concept.

## Important Official Pools

### 32x32 Pixel Art Portrait

This is now a mature official structured test asset.
It exists as:

- a default pool
- an official Pool Hub entry
- a pool with hero image
- a pool with initiative phrases
- a pool with 10 items in each main section

Sections populated:

- `Subjects`
- `Style`
- `Lighting`
- `Mood`
- `Composition`
- `Effects`

This pool was used for the first real elasticity test.
Observed result: the workflow stayed coherent and style persisted across iterations.
That supported the conclusion that the current system was sufficient for that workflow and did not justify a new Mode.

### Celestial Pixel Portrait

This is a newer official pool and the main current exploration target.
It exists as:

- a default pool
- an official Pool Hub entry
- a pool with hero image (`public/pixel_art_celestial_hero_image.png`)
- initiative phrases
- 3 visible IDP sets in Pool Hub and User Pools
- 10 items each across:
  - `Subjects`
  - `Style`
  - `Lighting`
  - `Mood`
  - `Composition`
  - `Effects`

Current IDP set family:

- `Celestial Shrine`
- `Magical Idol`
- `Occult Pastel`

The visual/product intent is:

- a strong primary identity pool
- highly iterative compatibility
- future compatibility with secondary pools

## Important Docs In Repo

These documents are useful and still relevant:

- `BUILDER_WORKFLOW_MODES_CONCEPT.md`
- `MODES_SCOPE_AND_LIMITS.md`
- `IMPLEMENTATION_PLAN_BUILDER_WORKFLOW_MODES.md`
- `BUILDER_WORKFLOW_MODES_EXPANSION_BOUNDARY.md`
- `MODE_EXPANSION_TRIGGER_CONDITIONS.md`
- `MODE_ELASTICITY_TEST.md`
- `POOL_DEFAULT_INITIATIVE_PHRASES_CONCEPT.md`
- `POOL_DEFAULT_INITIATIVE_PHRASES_MVP.md`
- `IMPLEMENTATION_PLAN_POOL_DEFAULT_INITIATIVE_PHRASES.md`
- `POOL_DEFAULT_INITIATIVE_PHRASES_PERSISTENCE_DECISION.md`
- `CURRENT_STATUS_LOG_17_03_2026.md`
- `APP_UNDERSTANDING_17_03_2026.md`

Important newer concept docs may still be local/untracked unless explicitly pushed. Do not assume every celestial / multi-IDP concept doc is already in GitHub.

## Technical Surfaces That Matter Most

Main shell:

- `src/ui/App.tsx`

Important UI components:

- `src/ui/components/CategorySidebar.tsx`
- `src/ui/components/QuestionCard.tsx`
- `src/ui/components/PromptPreview.tsx`
- `src/ui/components/UserPoolsPage.tsx`
- `src/ui/components/PoolHubPage.tsx`

Important data / stores:

- `src/types/pools.ts`
- `src/data/defaultUserPools.ts`
- `src/data/poolHubMock.ts`
- `src/data/builderModes.ts`
- `src/engine/poolStore.ts`
- `src/engine/poolTemplates.ts`
- `src/engine/territoryStore.ts`

Important migrations:

- `supabase/migrations/0013_add_pool_initiative_phrases.sql`
- `supabase/migrations/0014_add_pool_idp_sets.sql`

## Repo / Environment Notes

There are still some practical constraints:

- clean repo-wide type-checking is noisy because of existing TS/project config issues
- some features need runtime validation more than static verification
- Supabase-backed features require migrations to be applied in the real environment

Important current DB truth:

- if `0014_add_pool_idp_sets.sql` is not applied, any persisted use of `idp_sets` will fail with a schema-cache / missing-column error

## What A New Agent Should Be Careful About

1. Do not casually blur Pools, Territories, and Modes into one concept.
2. Do not assume a workflow problem means a new Mode is needed.
3. Prefer elasticity-style testing before proposing new top-level systems.
4. Be careful with Supabase migrations; app code may be ahead of the live schema.
5. The user often wants changes pushed quickly, but only after the behavior is coherent.
6. Leave unrelated local files alone:
   - `Log_13_03_2026.md`
   - `chat_log.txt`
   - `morpbaselogo.png`

## Current Best Overall Reading

MorpBase is strongest when understood as a structured creative system built around:

- Builder as the main composition surface
- Pools as structured source identity containers
- Territories as composed source-space focus
- Modes as Builder-only workflow guidance

That is the current truth of the app and the safest base for future work.
