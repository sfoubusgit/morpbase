# Current Status Log

## Date

17 March 2026

## Purpose

This log captures the current working state of the project after the recent Builder Workflow Modes work, Territory navigation fixes, and the official `32x32 Pixel Art Portrait` pool expansion.

It is meant to serve as a reliable checkpoint before the next round of product or implementation work.

## Current High-Level State

MorpBase currently has three important active tracks in a meaningful state:

- Builder Workflow Modes are implemented and coherent
- Territory-biased Builder navigation is working as a real category-level behavior
- the official `32x32 Pixel Art Portrait` pool is now a richer test-ready official pool with default initiative behavior

## Builder Workflow Modes

### Implemented mode set

- `Balanced`
- `Character-First`
- `Environment-First`
- `Scene-First`

Deferred:

- `Object-First`

### What is live

Builder Workflow Modes currently affect:

- Builder mode selection
- sidebar grouping and ordering
- mode-specific helper copy
- mode-aware `Next`
- suggested category behavior
- persistence across refresh

### Current product truth

Modes are currently:

- Builder-level
- workflow-oriented
- reversible
- independent from Pool identity
- independent from Territory identity

Modes are not currently:

- a global MorpBase taxonomy
- a Pool property
- a Territory property
- a prompt-engine behavior system

## Territory Navigation

The major Territory navigation issue has been corrected.

### What is now true

In `Territory-biased` mode:

- `Next` moves between Territory-mapped Builder categories
- it no longer walks the hidden normal subcategory stream underneath
- the movement respects active Builder mode ordering

This is an important integrity milestone because Territory-biased navigation now behaves like the concept says it should.

## Pool Default Initiative Phrases

The Pool Default Initiative Phrases MVP is implemented.

### What is now true

Pools can now carry initiative phrases that:

- belong to the Pool
- can be edited
- can be removed
- can be explicitly applied into Builder

The MVP is still intentionally narrow:

- Pool-first
- Builder-visible
- no Territory composition logic
- no Mode logic

## Official 32x32 Pixel Art Portrait Pool

The official `32x32 Pixel Art Portrait` pool is now in a much stronger state.

### What is included

- official Pool Hub entry
- hero image
- 10 items in each of these sections:
  - `Subjects`
  - `Style`
  - `Lighting`
  - `Mood`
  - `Composition`
  - `Effects`

### Initiative phrase behavior

The pool now carries initiative phrases, and the first default phrase is configured to auto-apply on activation:

- `clean 32x32 pixel art portrait`

The implementation was made duplicate-safe so reactivating the pool does not keep stacking the same default endlessly.

### Why this matters

This pool is now a stronger real-world test asset for:

- pixel-art portrait workflow testing
- medium-specific Territory testing
- future Mode Elasticity Tests
- evaluation of whether some workflow gaps are actually mode gaps or source-structure gaps

## Concept And Documentation State

The repo now contains a stronger concept framework than before.

Relevant docs include:

- [BUILDER_WORKFLOW_MODES_CONCEPT.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/BUILDER_WORKFLOW_MODES_CONCEPT.md)
- [MODES_SCOPE_AND_LIMITS.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MODES_SCOPE_AND_LIMITS.md)
- [IMPLEMENTATION_PLAN_BUILDER_WORKFLOW_MODES.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/IMPLEMENTATION_PLAN_BUILDER_WORKFLOW_MODES.md)
- [BUILDER_WORKFLOW_MODES_STATUS_17_03_2026.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/BUILDER_WORKFLOW_MODES_STATUS_17_03_2026.md)
- [BUILDER_WORKFLOW_MODES_EXPANSION_BOUNDARY.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/BUILDER_WORKFLOW_MODES_EXPANSION_BOUNDARY.md)
- [MODE_ELASTICITY_TEST.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MODE_ELASTICITY_TEST.md)
- [POOL_DEFAULT_INITIATIVE_PHRASES_CONCEPT.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/POOL_DEFAULT_INITIATIVE_PHRASES_CONCEPT.md)
- [POOL_DEFAULT_INITIATIVE_PHRASES_MVP.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/POOL_DEFAULT_INITIATIVE_PHRASES_MVP.md)
- [IMPLEMENTATION_PLAN_POOL_DEFAULT_INITIATIVE_PHRASES.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/IMPLEMENTATION_PLAN_POOL_DEFAULT_INITIATIVE_PHRASES.md)

## Most Recent Relevant Commits

- `82be780` `Auto-apply default phrase for official 32x32 pool`
- `630db52` `Expand official 32x32 pixel portrait pool`
- `09324e5` `Add hero image for official 32x32 pool`
- `036f1e0` `Polish pool defaults and add official 32x32 pool`
- `3bf32b3` `Add pool default initiative phrases MVP`
- `d020c44` `Polish territory-biased builder guidance`
- `253c1d3` `Make territory-biased next follow territory categories`
- `46eb8ce` `Fix territory-biased builder repositioning`

## Current Recommended Focus

The project should currently favor:

1. testing and stabilization over expansion
2. using the `32x32 Pixel Art Portrait` pool as a real evaluation asset
3. using the Mode Elasticity Test before proposing additional modes
4. keeping Pools, Territories, and Modes conceptually separate unless a real workflow failure proves otherwise

## Current Verdict

The project is in a stronger state than it was before the recent work.

The important systems are no longer just conceptually described; they are behaving in ways that are close enough to test honestly.

The most important current truth is:

- Builder Workflow Modes are real
- Territory-biased navigation is coherent
- the official `32x32 Pixel Art Portrait` pool is now a legitimate structured test asset
