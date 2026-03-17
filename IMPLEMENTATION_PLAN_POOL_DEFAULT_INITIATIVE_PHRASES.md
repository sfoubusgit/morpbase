# Implementation Plan: Pool Default Initiative Phrases

## Purpose

This document maps the `Pool Default Initiative Phrases` MVP onto the current MorpBase codebase.

It is based on:

- the Pool-first concept
- the architecture review
- the MVP boundary

The goal is to define the smallest honest implementation path before code changes begin.

## MVP Summary

The MVP should allow a Pool to define a small optional set of default initiative phrases.

These phrases should be:

- editable in User Pools
- explicitly applied by the user
- inserted into Builder through the existing prompt-addition system
- visible, removable, and editable after application

The MVP should not:

- auto-inject phrases silently
- involve Territory composition logic
- involve Builder Workflow Modes
- require prompt-engine special handling

## Current System Surfaces

### Pool data model

Current Pool types live in:

- [pools.ts](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/pools.ts)

Current `Pool` shape:

- `id`
- `name`
- folder metadata
- `items`

Current `PoolItem` shape:

- `id`
- `text`
- `section`
- `tags`
- `note`

### Pool persistence

Current persistence lives in:

- [poolStore.ts](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/poolStore.ts)

This currently persists:

- pool rows
- pool items
- import/export payloads
- CSV import/export

### User Pools editing surface

Current UI lives in:

- [UserPoolsPage.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/UserPoolsPage.tsx)

This currently supports:

- pool creation
- pool item add/edit/delete
- sections
- tags
- notes
- import/export
- default pool copy

### Builder prompt-addition surface

Current Builder addition flow lives in:

- [App.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)

Important existing entry points:

- `poolPromptItems`
- `handleAddPoolItem(...)`
- `handleAppendPoolItem(...)`
- `formatPromptAdditionText(...)`

This is the key reason the feature is feasible without prompt-engine redesign.

## Recommended MVP Data Shape

### New type

Add:

- `PoolInitiativePhrase`

Recommended minimal shape:

- `id`
- `text`

### Pool extension

Add to `Pool`:

- `initiativePhrases?: PoolInitiativePhrase[]`

This should remain optional.

## Implementation Phases

## Phase 1: Type Layer

### Files

- [pools.ts](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/pools.ts)
- [index.ts](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/index.ts)

### Work

- add `PoolInitiativePhrase`
- extend `Pool`
- export the new type

### Notes

Keep the type minimal in v1.

Do not add:

- section
- tags
- weights
- conditional fields

unless implementation proves they are required

## Phase 2: Persistence Layer

### Files

- [poolStore.ts](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/poolStore.ts)
- [poolTemplates.ts](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/poolTemplates.ts)
- [defaultUserPools.ts](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/data/defaultUserPools.ts)

### Work

- extend `toPool(...)` mapping to include initiative phrases
- persist initiative phrases when loading/saving Pools
- include initiative phrases in Pool import/export payloads
- include initiative phrases when copying a default Pool into a user Pool

### Important Cost Note

This is the part with real system impact.

The current persistence model clearly stores:

- Pool rows in `pools`
- Pool items in `pool_items`

Initiative phrases will need one of these approaches:

### Option A: new field on `pools`

For example:

- JSON column such as `initiative_phrases`

Pros:

- compact
- easier MVP

Cons:

- less normalized

### Option B: new related table

For example:

- `pool_initiative_phrases`

Pros:

- more normalized
- more scalable later

Cons:

- heavier MVP

### Recommendation

For MVP, prefer:

- a simple Pool-level persisted field

if the existing Supabase schema can be updated cleanly

This keeps the MVP small.

## Phase 3: User Pools Editing UI

### File

- [UserPoolsPage.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/UserPoolsPage.tsx)

### Work

Add a dedicated editor block inside the active Pool view:

- `Default Initiative Phrases`

Support:

- list existing phrases
- add phrase
- edit phrase
- delete phrase

### UI Principle

This block must be clearly separate from ordinary Pool items.

Do not mix initiative phrases into:

- the sectioned item list
- Territory source material
- randomizer item selection

They are a different thing.

## Phase 4: Explicit Apply Action

### File

- [UserPoolsPage.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/UserPoolsPage.tsx)

### Work

Add an action such as:

- `Apply Defaults`

This should only appear when:

- the Pool has initiative phrases

It should send the initiative phrases into Builder intentionally.

### Integration shape

Recommended prop addition:

- `onApplyPoolInitiativePhrases?: (phrases: Array<{ id: string; text: string }>, pool: Pool) => void`

This keeps the Pool UI decoupled from Builder state logic.

## Phase 5: Builder Prompt-Addition Integration

### File

- [App.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)

### Work

Add a handler for initiative phrases that:

- inserts them into `poolPromptItems`
- marks them as a distinct source type

Recommended extension:

- `sourceType: 'pool' | 'territory' | 'pool-default'`

This preserves clarity while reusing the existing prompt-addition system.

### Behavior

When initiative phrases are applied:

- they become visible additions
- they can be edited
- they can be removed
- they can be weighted like other additions if weights are enabled

### Important Rule

Do not give them any hidden special treatment.

They should behave like ordinary visible additions once applied.

## Phase 6: Prompt Addition Clarity

### Files

- [App.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)
- any prompt-addition display surface that benefits from light source labeling

### Work

If needed, add a lightweight visual cue so the user understands:

- these additions came from Pool defaults

This does not need to become a large UI feature.

It just needs to preserve trust.

## Phase 7: Default Pool Support

### File

- [defaultUserPools.ts](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/data/defaultUserPools.ts)

### Work

Allow default/template Pools to define initiative phrases too.

This is useful for:

- test Pools
- starter Pools
- style-specific demonstrations

### Existing opportunity

Because default Pools can already be copied into user-owned Pools, this gives a clean path for seeded initiative behavior.

## Out Of Scope For MVP

These should not be included in the first implementation:

- Territory merging of initiative phrases
- automatic application when Territory activates
- automatic application when a Pool is selected
- Mode-specific initiative phrase behavior
- prompt-engine logic aware of initiative phrases
- deduplication intelligence beyond basic visible user control

## Verification Plan

The MVP should be verified across these cases.

### 1. Pool editing

Verify:

- initiative phrases save correctly
- edit/delete works
- pools without initiative phrases still behave normally

### 2. Builder application

Verify:

- `Apply Defaults` inserts visible additions
- inserted additions are removable
- inserted additions are editable
- prompt output updates as expected

### 3. Persistence

Verify:

- initiative phrases survive refresh
- initiative phrases survive Pool export/import
- initiative phrases survive default Pool copy

### 4. Scope integrity

Verify:

- Territories do not auto-absorb initiative phrases
- Modes remain unaffected
- randomizer behavior remains unaffected

## Main Risks

### 1. Hidden prompt injection feeling

Must be prevented through explicit application and visibility.

### 2. Persistence complexity

This is the largest implementation risk because it likely implies a Supabase schema change.

### 3. UI confusion between Pool items and initiative phrases

Must be prevented by keeping them in a separate editor block.

### 4. Concept drift into Territory or Mode systems

Must be resisted in MVP.

## Recommended Build Order

1. add types
2. decide persistence shape
3. update Pool store
4. update default/template Pool copying
5. add User Pools editor block
6. add `Apply Defaults`
7. connect Builder prompt additions
8. verify persistence and usability

## Final Recommendation

This MVP is viable in the current MorpBase architecture, but only if it is treated as:

- a Pool-layer extension
- an explicit Builder application flow
- a transparent prompt-addition feature

The implementation should stay narrow and avoid premature expansion into Territories or Modes.
