# MorpBase V2 Governing Set

## Purpose

This document reduces the current V2 planning stack into a smaller governing set.

Its role is:

- to prevent document sprawl from becoming a new source of drift
- to identify which documents actually govern V2 from this point onward
- to make prototype and later implementation work easier to enter

This is not a replacement for all earlier V2 documents.
It is a control layer over them.

## The 6 Governing Documents

These are the documents that should govern V2 from now on.

### 1. Foundation

- [MORPBASE_V2_FOUNDATION_FREEZE.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_FOUNDATION_FREEZE.md)

Owns:

- what is frozen
- product hierarchy
- realm truth
- first-wave guardrails

Use it when asking:

- is this allowed to change?
- is this still a foundation question?
- are we violating the V2 core?

### 2. Product Blueprint

- [MORPBASE_V2_PRODUCT_BLUEPRINT.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_PRODUCT_BLUEPRINT.md)

Owns:

- major screen families
- object flow across the product
- top-level vs contextual access
- primary transitions

Use it when asking:

- what are the real first-wave screens?
- how do the realms connect structurally?

### 3. Interaction Blueprint

- [MORPBASE_V2_INTERACTION_BLUEPRINT.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_INTERACTION_BLUEPRINT.md)

Owns:

- how the screen families behave
- how transitions feel
- where support systems enter
- what the core loops must feel like

Use it when asking:

- how should this part actually behave?
- does this interaction preserve product hierarchy?

### 4. Terminology Freeze

- [MORPBASE_V2_TERMINOLOGY_MICROLANGUAGE_FREEZE.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_TERMINOLOGY_MICROLANGUAGE_FREEZE.md)

Owns:

- product-facing realm names
- section names
- object names
- action verbs
- tone rules

Use it when asking:

- what should this be called?
- how should the product sound?

### 5. Design-Universe Preparation

- [MORPBASE_V2_DESIGN_UNIVERSE_PREPARATION.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_DESIGN_UNIVERSE_PREPARATION.md)

Owns:

- visual/product atmosphere
- hierarchy expression logic
- surface family feel
- anti-generic design rules
- custom asset opportunities

Use it when asking:

- what should V2 feel like visually?
- how do we avoid generic design?

### 6. Prototype Execution Workflow

- [MORPBASE_V2_PROTOTYPE_EXECUTION_WORKFLOW.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_PROTOTYPE_EXECUTION_WORKFLOW.md)

Owns:

- prototype slices
- execution sequence
- review gates
- prototype completion conditions

Use it when asking:

- what do we prototype next?
- are we ready to move forward?

## Supporting Documents

These are still important, but they should now be treated as supporting references rather than primary governing docs.

### Product-shaping references

- [MORPBASE_V2_MASTER_REASSESSMENT_AND_BUILD_WORKFLOW.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_MASTER_REASSESSMENT_AND_BUILD_WORKFLOW.md)
- [MORPBASE_V2_WHOLE_PRODUCT_REASSESSMENT.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_WHOLE_PRODUCT_REASSESSMENT.md)
- [MORPBASE_V2_FIRST_WAVE_SCREEN_MAP_ANALYSIS.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_FIRST_WAVE_SCREEN_MAP_ANALYSIS.md)
- [MORPBASE_V2_TOP_LEVEL_SHELL_ANALYSIS.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_TOP_LEVEL_SHELL_ANALYSIS.md)
- [MORPBASE_V2_FIRST_USE_ENTRY_ANALYSIS.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_FIRST_USE_ENTRY_ANALYSIS.md)

### Realm-specific references

- [MORPBASE_V2_MEMORY_STRUCTURE_ANALYSIS.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_MEMORY_STRUCTURE_ANALYSIS.md)
- [MORPBASE_V2_CONTINUITY_REALM_MODEL_ANALYSIS.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_CONTINUITY_REALM_MODEL_ANALYSIS.md)
- [MORPBASE_V2_PUBLIC_COMMUNITY_LAYER_REASSESSMENT.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_PUBLIC_COMMUNITY_LAYER_REASSESSMENT.md)

### Community/public references

- [MORPBASE_V2_PUBLIC_OBJECT_MODEL_ANALYSIS.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_PUBLIC_OBJECT_MODEL_ANALYSIS.md)
- [MORPBASE_V2_PUBLIC_OBJECT_PAGE_MODEL_ANALYSIS.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_PUBLIC_OBJECT_PAGE_MODEL_ANALYSIS.md)
- [MORPBASE_V2_CREATOR_PAGE_MODEL_ANALYSIS.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_CREATOR_PAGE_MODEL_ANALYSIS.md)
- [MORPBASE_V2_DISCOVER_PAGE_MODEL_ANALYSIS.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_DISCOVER_PAGE_MODEL_ANALYSIS.md)
- [MORPBASE_V2_PUBLISHING_MODEL_ANALYSIS.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_PUBLISHING_MODEL_ANALYSIS.md)
- [MORPBASE_V2_PUBLIC_CARD_GRAMMAR_ANALYSIS.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_PUBLIC_CARD_GRAMMAR_ANALYSIS.md)

## Documents That Should Usually Not Govern Day-To-Day Prototype Decisions

These remain valuable historical/thinking records, but they should no longer be the first place to look before prototype work.

- the earlier V2 exploratory prompts
- alternative candidate documents
- intermediate reassessments that were superseded by the freeze/blueprint/interaction chain
- V1 concept/history docs unless a specific legacy question arises

This does not mean they are useless.
It means they are no longer the main steering wheel.

## Working Rule From Here

When making a V2 decision:

1. check the governing set first
2. only open supporting docs if the governing docs do not answer the question
3. only go deeper into older exploratory docs if a real unresolved conflict remains

This prevents V2 from becoming “correct, but impossible to navigate.”

## Prototype Entry Pack

If prototype work starts now, the minimum document set that should stay open is:

1. [MORPBASE_V2_FOUNDATION_FREEZE.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_FOUNDATION_FREEZE.md)
2. [MORPBASE_V2_PRODUCT_BLUEPRINT.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_PRODUCT_BLUEPRINT.md)
3. [MORPBASE_V2_INTERACTION_BLUEPRINT.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_INTERACTION_BLUEPRINT.md)
4. [MORPBASE_V2_TERMINOLOGY_MICROLANGUAGE_FREEZE.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_TERMINOLOGY_MICROLANGUAGE_FREEZE.md)
5. [MORPBASE_V2_DESIGN_UNIVERSE_PREPARATION.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_DESIGN_UNIVERSE_PREPARATION.md)
6. [MORPBASE_V2_PROTOTYPE_EXECUTION_WORKFLOW.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MORPBASE_V2_PROTOTYPE_EXECUTION_WORKFLOW.md)

That is the smallest complete V2 control stack for prototype work.

## Final Rule

From this point on:

- broad V2 truth comes from the governing set
- not from the full historical stack

That is the cleanest way to keep V2 coherent while finally moving into real prototype execution.
