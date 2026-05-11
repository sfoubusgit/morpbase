# MorpBase Project Understanding Report

Date: 2026-03-20

This report was produced by executing the repository-audit prompt in `MORPBASE_FULL_PROJECT_UNDERSTANDING_PROMPT.md` against the actual workspace.

## 1. Project Identity

MorpBase is a React + TypeScript application for building structured image-generation prompts through a guided Builder workflow backed by reusable prompt-source systems such as User Pools and Territories. In practice, the app is no longer just a "prompt generator"; it is an authoring environment with prompt construction, reusable source libraries, creator profiles, sharing surfaces, and saved prompt management. The runtime center of gravity is the Builder and its connected prompt preview/library loop (`src/ui/App.tsx`, `src/ui/components/CategorySidebar.tsx`, `src/ui/components/PromptPreview.tsx`, `src/ui/components/PromptLibrary.tsx`).

Originally, the project was a Stable Diffusion-oriented prompt generator with category-driven attribute selection and classic prompt assembly (`src/engine.ts`, `src/modules/prompt-assembler.ts`, `src/data/COMPLETE_INVENTORY.md`).

It is becoming a broader MorpBase system where Pools, Territories, prompt-saving, creator identity, and hub/discovery features are meant to work together, with Territories increasingly framed as the modern organizational layer over the Builder and Working Sets pushed toward legacy status (`APP_UNDERSTANDING_17_03_2026.md`, `BACKUP_CURRENT_UNDERSTANDING.md`, `docs/user_pools_spec.md`).

## 2. Current Product Truth

The current central workflow is:

1. Enter the Builder from the landing/app shell.
2. Work through Builder categories and modes.
3. Optionally scope or enrich the Builder with User Pools and Territories.
4. Refine the generated output in Prompt Preview.
5. Save prompts locally or to Supabase-backed storage, optionally assigning them to Prompt Sets.

Major first-class systems:

- Builder: main workflow and product center (`src/ui/App.tsx`, `src/ui/components/CategorySidebar.tsx`)
- User Pools: reusable user-owned prompt sources with folders, sections, initiative phrases, and IDP sets (`src/ui/components/UserPoolsPage.tsx`, `src/engine/poolStore.ts`)
- Territories: Builder scoping/composition layer built from pool sections (`src/engine/territoryStore.ts`, `src/types/territories.ts`)
- Prompt Preview and Prompt Library: output shaping, manual edits, save/export flows (`src/ui/components/PromptPreview.tsx`, `src/ui/components/PromptLibrary.tsx`)
- Public profile / creator surfaces: creator identity, public prompts, creator stats (`src/ui/components/MyProfilePage.tsx`, `src/ui/components/PublicCreatorPage.tsx`, `src/engine/profileStore.ts`)

Legacy but still active systems:

- Working Sets: fully present in UI and DB, but increasingly described as legacy relative to Pools + Territories (`src/ui/components/WorkingSetsPage.tsx`, `src/engine/workingSetStore.ts`, `APP_UNDERSTANDING_17_03_2026.md`)
- Working Set Hub paths: still present in code and mock data, but secondary and partly sidelined (`src/engine/workingSetHubStore.ts`, `src/data/workingSetHubMock.ts`, `src/ui/components/PoolHubPage.tsx`)

## 3. System Boundary Map

- Builder: guided prompt-construction workflow and app center. Lives mostly in `src/ui/App.tsx`, `src/ui/components/CategorySidebar.tsx`, `src/ui/components/QuestionCard.tsx`. Status: implemented. Not the same thing as Pools or saved prompts.
- Pools: reusable prompt source libraries made of items, folders, sections, notes, initiative phrases, and optional IDP sets. Lives in `src/ui/components/UserPoolsPage.tsx`, `src/engine/poolStore.ts`, `src/types/pools.ts`. Status: implemented. Not the same thing as Territories.
- Territories: compositions of sources from Pool sections that bias Builder context and navigation. Lives in `src/engine/territoryStore.ts`, `src/types/territories.ts`, wiring in `src/ui/App.tsx`. Status: implemented. Not another pool type.
- Modes: Builder workflow presets such as balanced, character-first, environment-first, and scene-first. Lives in `src/data/builderModes.ts`, `src/types/builderModes.ts`. Status: implemented. Not a global product taxonomy.
- Prompt Preview: output assembly, manual edits, prompt additions, export formatting, workflow context display. Lives in `src/ui/components/PromptPreview.tsx`, `src/ui/promptAdditions.ts`. Status: implemented. Not the persistence layer.
- Prompt Library: prompt save/import/export/download flows plus Prompt Set assignment and cloud/local coexistence. Lives in `src/ui/components/PromptLibrary.tsx`, `src/engine/promptStore.ts`, `src/engine/promptSetStore.ts`. Status: implemented, with some hybrid legacy logic.
- Pool Hub: browse/share/discover pool content and creator surfaces. Lives in `src/ui/components/PoolHubPage.tsx`, `src/engine/poolHubStore.ts`. Status: partial and somewhat split-brain, because runtime uses local/mock storage while schema includes hub tables.
- Working Sets: older reusable selection bundles sourced from pools and activated in Builder. Lives in `src/ui/components/WorkingSetsPage.tsx`, `src/engine/workingSetStore.ts`, `src/types/workingSets.ts`. Status: implemented but strategically legacy.
- Prompt Sets: grouping system for saved prompts. Lives in `src/engine/promptSetStore.ts`, `src/ui/components/PromptLibrary.tsx`, `supabase/migrations/0015_add_prompt_sets.sql`. Status: implemented, though docs still sometimes describe it as near-term.
- Character Identity / reusable identity concepts: future-facing identity framework language found mostly in docs, not core runtime. Status: conceptual. Not a first-class implemented app subsystem today.

## 4. Architecture Map

UI entry points and state owners:

- App entry: `src/main.tsx`
- Main shell/state owner: `src/ui/App.tsx`
- Page routing is local state via `activePage`, not a dedicated router.

Prompt-generation pipeline:

- Category/question content is loaded from JSON by `src/data/loadAttributeDefinitions.ts` and `src/data/loadQuestionNodes.ts`.
- Validation/generation/order/assembly flow runs through `src/engine.ts` and `src/modules/*`.
- The current engine validates selection presence, generates fragments, applies modifiers, orders fragments, and assembles prompt strings/sections. Conflict handling is intentionally minimal.

Persistence layers:

- Supabase-backed: users, public profiles, pools, pool items, territories, working sets, saved prompts, prompt sets, creator stats, analytics, and admin tools (`src/engine/*.ts`, `supabase/migrations/*.sql`).
- localStorage/sessionStorage-backed: builder session/UI state, local prompt library content, active territory/working set IDs, hub preview stores, analytics session IDs, prompt-set migration backups.

Seeded and mock data:

- Default/official pools: `src/data/defaultUserPools.ts`
- Pool hub mock content: `src/data/poolHubMock.ts`
- Working set hub mock content: `src/data/workingSetHubMock.ts`
- Historical inventory: `src/data/COMPLETE_INVENTORY.md`

External dependencies:

- React 18 + Vite 5 + TypeScript 5
- Supabase JS client
- Vitest for tests
- GitHub Pages-aware Vite base-path handling in `vite.config.ts`

## 5. Data Model Summary

Core entities:

- Builder entities: categories, question nodes, attributes, prompt fragments (`src/types/entities.ts`, `src/types/index.ts`)
- Pools and pool items, including sections/folders/initiative phrases/IDP sets (`src/types/pools.ts`)
- Territories and territory sources (`src/types/territories.ts`)
- Working Sets and working set hub types (`src/types/workingSets.ts`, `src/types/workingSetHub.ts`)
- Saved prompts and Prompt Sets (`src/types/prompts.ts`)
- Pool Hub types (`src/types/poolHub.ts`)

Important relationships:

- Pools own many pool items.
- Territories compose multiple sources that point back to pools and optionally sections/categories.
- Working Sets group selected source items for Builder use.
- Saved prompts can belong to Prompt Sets.
- Public creator/profile surfaces aggregate visible pools and prompts.

DB-backed entities and migration dependencies:

- Core schema begins in `supabase/migrations/0001_init.sql`
- Public profile features depend on `0003_add_public_profiles.sql` and `0010_expand_public_profiles_phase1.sql`
- Territory support depends on `0009_add_territories.sql`
- Pool structure expansion depends on `0006_add_pool_folders.sql`, `0008_add_pool_item_section.sql`, `0013_add_pool_initiative_phrases.sql`, and `0014_add_pool_idp_sets.sql`
- Prompt Sets depend on `0015_add_prompt_sets.sql`

## 6. Feature Maturity Table

Implemented:

- Builder core workflow
- Prompt generation pipeline
- User Pools CRUD and import/export
- Territories
- Prompt Preview
- Prompt Library
- Public creator profiles
- Creator stats and analytics/admin surfaces

Implemented but fragile:

- Prompt Sets, because store logic contains cloud/local migration and fallback complexity (`src/engine/promptSetStore.ts`)
- Pool Hub, because runtime uses local preview/mock persistence despite DB schema support (`src/engine/poolHubStore.ts`, `supabase/migrations/0001_init.sql`)
- Data loading, because some meaningful-looking JSON files are ignored by the current attribute loader shape rules (`src/data/loadAttributeDefinitions.ts`)

Partial:

- Hub unification with real backend tables
- Account deletion (`src/engine/authStore.ts`)
- Some creator/discovery flows still feel first-pass

Legacy:

- Working Sets as a strategic center, even though the feature still works
- Old generator inventory/preset concepts as primary framing

Concept-only:

- Quick Save as a mature system
- Character Identity / Reusable Identity as a concrete runtime subsystem

## 7. Contradictions And Drift

- `README.md` is too thin to describe the current MorpBase reality.
- `src/ui/components/LandingPage.tsx` still frames the pipeline around Working Sets, while newer docs increasingly elevate Territories.
- The schema includes `pool_hub_entries` and `working_set_hub_entries` in `supabase/migrations/0001_init.sql`, but runtime hub behavior still depends on local/mock stores in `src/engine/poolHubStore.ts` and `src/engine/workingSetHubStore.ts`.
- `src/data` contains flat JSON files such as `character-archetype.json` and `style-art.json` that look relevant, but `src/data/loadAttributeDefinitions.ts` only loads wrapped `{ category, attributes }` objects.
- Working Sets are fully implemented and visible in UI, but strategy docs repeatedly down-rank them.
- Prompt Sets are live in code/UI/schema, while docs sometimes still describe them as near-term.
- There are two migration files using the `0013` prefix, which is a potential migration-order footgun depending on tooling/order assumptions.

## 8. Remaining Unknowns

- Whether the live Supabase project has all migrations applied in the intended order, especially the duplicate `0013` numbering. This needs a live DB check.
- Whether hub features are intentionally staying local-preview or are simply unfinished backend integration. This needs either maintainer confirmation or runtime/API wiring checks against the live backend.
- Whether the ignored flat JSON attribute files are intentional legacy leftovers or accidental dead data. This needs maintainer intent or a cleanup pass.
- Whether Working Sets will remain supported long-term or eventually be hidden behind legacy UX. Docs suggest one direction, but runtime still treats them as active.
- Whether Prompt Sets are considered production-complete from a product perspective. Code says "usable"; docs still sound transitional.

## Verification Notes

- `npm.cmd test` did not complete because Vite/Vitest startup failed with `spawn EPERM` in this environment.
- `npm.cmd run type-check` failed because `vite.config.ts` is included while `tsconfig.json` keeps `rootDir` under `src`, producing `TS6059`.
