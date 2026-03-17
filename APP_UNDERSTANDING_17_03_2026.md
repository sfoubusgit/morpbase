# App Understanding

## Date

17 March 2026

## Purpose

This document captures my current general understanding of MorpBase as a product and as a codebase.

It is meant to be a practical orientation file for future continuation work, not a historical archive.

## One-Line Product Understanding

MorpBase is a structured prompt-building app for image-generation workflows that helps users assemble prompts from reusable, organized prompt material instead of rewriting prompts from scratch.

## Current Product Center

The center of the product is:

- `Builder`

Everything else is strongest when it either:

- feeds Builder
- helps organize material for Builder
- helps save/share what Builder produces

## Current Main Systems

### 1. Builder

Builder is the main creation surface.

It is responsible for:

- navigating prompt-building categories
- collecting attribute selections
- combining those with additions from other systems
- generating the final prompt output

Builder currently includes:

- staged sidebar flow
- category navigation
- prompt generation
- prompt preview integration
- direct output editing
- Builder Workflow Modes

Important current truth:

Builder is no longer just a flat category list.
It is increasingly becoming a guided workflow surface.

### 2. Prompt Preview / Output

Prompt Preview is the output control layer.

Important current truth:

- direct edited output is now the source of truth

That means:

- preview
- copy
- save

should stay aligned with edited output rather than with some older freeform prompt concept.

### 3. User Pools

User Pools are one of the strongest systems in the app.

They currently function as:

- reusable source libraries
- themed vocabularies
- sectioned prompt material collections
- a staging ground for Territories

Recent evolution:

- Pools now support folders
- Pools support sections
- Pools support default initiative phrases

Current important truth:

Pools are no longer best understood as flat fragment dumps.
They are increasingly structured source systems.

### 4. Territories

Territories are the strongest current future-facing replacement direction for legacy Working Sets.

Territories currently act like:

- composed creative spaces
- built from selected `Pool + Section` sources
- activatable inside Builder

When active, they can shape:

- navigation emphasis
- highlighted Builder areas
- Territory-biased navigation paths

Current important truth:

Territories are not the same thing as Modes.

Best current division:

- `Territories` = source-space focus
- `Modes` = workflow orientation

### 5. Pool Hub

Pool Hub is the discovery and distribution layer for pools.

It includes:

- official entries
- community entries
- mock/discovery presentation
- add/download behavior

Current important truth:

Pool Hub is important, but it is still downstream of the core Builder + Pools + Territory relationship.

### 6. Prompt Library

Prompt Library stores generated/saved prompts and keeps them reusable.

This is important for output continuity, but it is not currently the main design frontier.

### 7. Working Sets

Working Sets still exist in the product and codebase.

But my current understanding is:

- they are legacy relative to the newer direction
- they should not be treated as the strongest long-term system
- they should be handled carefully and not expanded casually

The strategic direction is much more favorable toward:

- Builder
- User Pools
- Territories

than toward deeper Working Set investment.

## Current Strategic Understanding

The strongest current product direction is:

1. keep Builder central
2. keep User Pools strong
3. let Territories become the main structured focus layer
4. avoid multiplying overlapping systems

This means MorpBase should generally avoid:

- conceptual duplication
- too many parallel abstractions
- turning every new need into a new top-level feature type

## Current Builder Understanding

Builder currently works across these categories:

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

The sidebar is staged as:

- `Define`
- `Refine`
- `Finish`

That staged structure is important because it has become the substrate for guided Builder behavior.

## Builder Workflow Modes

Builder Workflow Modes are now a real implemented system.

Current mode set:

- `Balanced`
- `Character-First`
- `Environment-First`
- `Scene-First`

Deferred:

- `Object-First`

Current important truth:

Modes are:

- Builder-level
- workflow-oriented
- reversible
- guidance-focused

Modes are not:

- a global MorpBase taxonomy
- a property of Pools
- a property of Territories
- a prompt-engine feature

## Current Territory Navigation Understanding

Territory-biased navigation was an important integrity problem and is now in a much better place.

Current important truth:

In `Territory-biased` mode:

- `Next` moves between Territory-mapped Builder categories
- it does not secretly follow the ordinary subcategory stream underneath

That correction matters because it brought the real behavior in line with the conceptual story.

## Current Pool Initiative Understanding

Pools now support `Default Initiative Phrases`.

These are best understood as:

- Pool-level starter phrases
- visible and editable
- removable
- applied into Builder as prompt additions

Important current truth:

This is a Pool feature, not a Mode feature.

This distinction matters because it preserves the conceptual boundary between:

- source identity
- workflow orientation

Recent extension:

The official `32x32 Pixel Art Portrait` pool now uses this system so its first default phrase auto-applies on activation.

## The 32x32 Pixel Art Portrait Pool

This pool has become an important structured test asset.

It currently exists as:

- a default pool
- an official Pool Hub pool
- a pool with a hero image
- a pool with initiative phrases
- a pool with 10 items in each of its main sections

Sections currently filled out:

- `Subjects`
- `Style`
- `Lighting`
- `Mood`
- `Composition`
- `Effects`

This pool is important because it provides a concrete, medium-specific workflow case that can be used to test:

- Pool quality
- Territory usefulness
- current Builder guidance
- whether workflow friction is actually a mode problem or something else

## Current Semantic Structure Of The App

My current understanding of the best internal division is:

### Pools

- source libraries
- themed vocabularies
- optional initiative defaults

### Territories

- composed source spaces
- selected `Pool + Section` combinations
- Builder focus layers

### Modes

- Builder workflow lenses
- orientation and sequence guidance

### Builder

- active composition surface
- where all these systems meet

This division is one of the most important truths to preserve.

## Current Docs Truth

The repo now contains a stronger conceptual framework than it had earlier.

Important docs include:

- [CONTEXT_HANDOFF_15_03_2026.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/CONTEXT_HANDOFF_15_03_2026.md)
- [BUILDER_WORKFLOW_MODES_CONCEPT.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/BUILDER_WORKFLOW_MODES_CONCEPT.md)
- [MODES_SCOPE_AND_LIMITS.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MODES_SCOPE_AND_LIMITS.md)
- [BUILDER_WORKFLOW_MODES_EXPANSION_BOUNDARY.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/BUILDER_WORKFLOW_MODES_EXPANSION_BOUNDARY.md)
- [MODE_ELASTICITY_TEST.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MODE_ELASTICITY_TEST.md)
- [POOL_DEFAULT_INITIATIVE_PHRASES_CONCEPT.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/POOL_DEFAULT_INITIATIVE_PHRASES_CONCEPT.md)
- [POOL_DEFAULT_INITIATIVE_PHRASES_MVP.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/POOL_DEFAULT_INITIATIVE_PHRASES_MVP.md)

However, there is still some language drift in the broader repo and product copy.

Examples:

- some older docs still emphasize `Working Sets`
- some older docs predate the tightened Builder-only Modes framing
- some older manual/product language may not fully reflect the newer structure

## Current Technical Understanding

Main shell:

- [App.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)

Important UI surfaces:

- [CategorySidebar.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/CategorySidebar.tsx)
- [QuestionCard.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/QuestionCard.tsx)
- [PromptPreview.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/PromptPreview.tsx)
- [UserPoolsPage.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/UserPoolsPage.tsx)
- [PoolHubPage.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/PoolHubPage.tsx)

Important stores / engines:

- [poolStore.ts](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/poolStore.ts)
- [territoryStore.ts](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/territoryStore.ts)
- [workingSetStore.ts](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/workingSetStore.ts)
- [engine.ts](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine.ts)

Important seeded data:

- [defaultUserPools.ts](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/data/defaultUserPools.ts)
- [poolHubMock.ts](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/data/poolHubMock.ts)
- [builderModes.ts](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/data/builderModes.ts)

## Current Repo Health Notes

There are still some repo-level constraints that are worth remembering:

- there is a known `tsconfig` / `rootDir` issue affecting clean type-check flow
- some verification still depends on real runtime testing rather than only static checks
- Supabase-backed features require the real environment for full validation

These do not invalidate the current work, but they do affect how safely some changes can be verified.

## Current Best Judgment

If I reduce my current understanding to the most important points, they are:

1. MorpBase is strongest as a structured prompt-building system, not as a generic AI rewrite tool.
2. Builder is the center.
3. User Pools are one of the clearest strengths.
4. Territories are the strongest future-facing structured direction.
5. Working Sets should be treated as legacy relative to that direction.
6. Modes should remain a Builder workflow layer, not expand into a global taxonomy casually.
7. Pool Default Initiative Phrases are a Pool-layer feature, not a Mode feature.
8. The `32x32 Pixel Art Portrait` pool is now a meaningful structured test asset.

## Final Summary

My current understanding is that MorpBase is evolving into a more coherent system built around:

- Builder as the active creative surface
- Pools as structured source libraries
- Territories as focused source-space compositions
- Modes as Builder-only workflow orientation

That is the clearest and healthiest reading of the app right now.
