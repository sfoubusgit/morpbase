# Recent Changes

## Purpose

This file is a backup change log for a new agent.
It focuses on the most recent meaningful product and code changes so work can continue without re-discovering what happened.

## Current Date Context

This log is being written on 18 March 2026.
It covers the recent chain of Builder / Pool / Territory / Pool Hub changes leading up to the current state.

## Most Recent Pushed Commits

- `a233454` `Default territory sources to whole pool`
- `05b738d` `Add celestial pool hero image asset`
- `c0435b4` `Fix pool hub detail hero image sizing`
- `eb15475` `Fix celestial pool hero image path`
- `b4122b4` `Show IDP sets in pool hub detail rail`
- `d903835` `Feature pool IDP sets in pool overview`
- `34a2717` `Add celestial pixel portrait pool`
- `3c1b11f` `Keep sidebar anchored while centering builder`
- `2abe340` `Add mode expansion trigger conditions`
- `42eef6f` `Polish pool defaults input and preserve defaults on clear`
- `0789bb4` `Add current status and app understanding logs`
- `82be780` `Auto-apply default phrase for official 32x32 pool`

## What These Changes Actually Did

### 1. Builder layout adjustments

The Builder layout was tuned so that:

- the left sidebar is a bit wider
- the Builder reads more centered inside its own space
- the left sidebar remains anchored instead of drifting inward

The final correction commit here was:

- `3c1b11f` `Keep sidebar anchored while centering builder`

This fixed an earlier mistaken centering pass that moved the whole layout instead of only the Builder.

### 2. Pool default initiative phrase UX stabilized

The initiative phrase feature was improved so that:

- the initiative phrase input looks more intentional
- pool-default phrases remain when `Clear Prompt` is used

This made the workflow much more coherent for Pool-owned baseline phrases.

Relevant commit:

- `42eef6f` `Polish pool defaults input and preserve defaults on clear`

### 3. Mode expansion boundary tightened

A stronger decision rule for future Mode growth was added.
This matters conceptually because the project is trying to avoid adding Modes casually.

Relevant commit:

- `2abe340` `Add mode expansion trigger conditions`

### 4. 32x32 Pixel Art Portrait workflow matured

The `32x32 Pixel Art Portrait` official pool had already become a major test asset.
It now exists as:

- an official Pool Hub entry
- a richer sectioned pool
- a hero-image-backed official pool
- a pool with initiative defaults
- a successful elasticity test case

Important learned result:

- the workflow stayed coherent
- style persisted across iterations
- the current system was sufficient
- no new Mode was justified by this case

### 5. Celestial Pixel Portrait pool was added

A new official pool was introduced:

- `Celestial Pixel Portrait`

It was built as a primary identity pool for iterative luminous anime pixel portraits.
It includes:

- official Pool Hub entry
- default pool entry
- 10 items each in its main sections
- initiative phrases
- a hero image

Relevant commit:

- `34a2717` `Add celestial pixel portrait pool`

### 6. Pool IDP sets were added to the data model

A new Pool-level concept was implemented:

- `idpSets`

This added:

- new Pool types in `src/types/pools.ts`
- persistence support in `src/engine/poolStore.ts`
- template copy support in `src/engine/poolTemplates.ts`
- seeded support in `defaultUserPools.ts`
- Pool Hub payload support in `poolHubMock.ts` and `PoolHubPage.tsx`
- migration `supabase/migrations/0014_add_pool_idp_sets.sql`

Relevant commit:

- `d903835` `Feature pool IDP sets in pool overview`

Important caveat:

- live Supabase environments must apply migration `0014_add_pool_idp_sets.sql`
- otherwise actions that persist pools with `idp_sets` will fail with a missing-column / schema-cache error

### 7. IDP sets were surfaced in product UI

The user originally wanted IDP sets visible when inspecting a pool.
There was an initial misunderstanding where they were surfaced in `User Pools`.
That is still useful, but the real intended placement was the Pool Hub detail view.

The final user-facing intended placement is now:

- Pool Hub right rail
- panel order includes `Details`, `Structure`, `IDP Sets`, `Report`

Relevant commit:

- `b4122b4` `Show IDP sets in pool hub detail rail`

This is especially important for `Celestial Pixel Portrait`, whose 3 set family is now immediately visible during Pool Hub inspection.

### 8. Celestial hero image issue was resolved fully

There were three separate problems in sequence:

1. the celestial Pool Hub entry still had `heroImageUrl: null`
2. the detail preview image sizing had a rendering issue
3. the actual file `public/pixel_art_celestial_hero_image.png` had never been committed

These were fixed in order by:

- `eb15475` `Fix celestial pool hero image path`
- `c0435b4` `Fix pool hub detail hero image sizing`
- `05b738d` `Add celestial pool hero image asset`

Final result:

- the celestial hero image now shows properly

### 9. Territory editor now defaults to Whole Pool

The user asked for `Whole Pool` to be the default inside the Territory editor.
This was implemented in the Territory draft seeding logic.

Now:

- the initial Territory source defaults to `Whole Pool`
- clicking `Add Source` also defaults the new row to `Whole Pool`

Relevant commit:

- `a233454` `Default territory sources to whole pool`

## Current Product-State Consequences

Because of the recent changes, the current product behaves differently in several meaningful ways:

1. `Celestial Pixel Portrait` is now a real official workflow asset, not just a concept.
2. Pool Hub now exposes a pool's IDP-set family directly in the right detail rail.
3. Pool-level IDP sets are part of the data model and official pools can carry them.
4. Territory setup now begins from a broader `Whole Pool` baseline by default.
5. Hero-image-backed official pool presentation is stronger and more intentional.

## Open / Partially Complete Work

These are the most important current follow-up areas:

### 1. Supabase migration must exist in live environments

If the user tries to copy/import/use persisted pools with `idp_sets` before applying migration `0014`, the live app will error.

Migration file:

- `supabase/migrations/0014_add_pool_idp_sets.sql`

### 2. Multi IDP Set system is still conceptually ahead of full implementation

Current implemented state:

- Pools can store and display IDP sets

Not implemented yet:

- choosing active IDP sets inside Territories
- Builder applying a selected Territory IDP set as the live baseline workflow set

This means the concept is ahead of the live behavior.

### 3. Several concept docs may still be local only

There are additional celestial / multi-IDP concept docs that may exist locally and not yet be committed.
A new agent should check git status before assuming every recent concept file is already in GitHub.

## Files Most Affected Recently

Core files recently touched or important to these changes:

- `src/ui/App.tsx`
- `src/ui/components/UserPoolsPage.tsx`
- `src/ui/components/UserPoolsPage.css`
- `src/ui/components/PoolHubPage.tsx`
- `src/ui/components/PoolHubPage.css`
- `src/data/defaultUserPools.ts`
- `src/data/poolHubMock.ts`
- `src/types/pools.ts`
- `src/engine/poolStore.ts`
- `src/engine/poolTemplates.ts`
- `supabase/migrations/0014_add_pool_idp_sets.sql`

## Immediate Safe Next Steps For A New Agent

1. Confirm whether migration `0014` has been applied in the live Supabase environment.
2. If testing `Celestial Pixel Portrait`, use Pool Hub first because `IDP Sets` are visible there now.
3. Treat current IDP-set implementation as inspection/data groundwork, not as a finished active selection system.
4. Continue Multi IDP work only if the user still wants it; the current visible set support is not the same as Territory/Builder selection support.

## Short Summary

The recent work moved MorpBase forward in three big ways:

- official workflow pools became more presentation-ready
- Pool-level identity structure deepened through `IDP Sets`
- Territory setup became broader and more forgiving through `Whole Pool` defaults

The main caution is that the data model is ahead of some live environments unless migration `0014` is applied.
