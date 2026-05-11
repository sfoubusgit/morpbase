# Character Identity System Architecture Analysis

## Purpose

Now that the concept has been explored as:
- a reusable character identity layer
- broader than niche pools
- applied into workflows rather than owned by them

the next question is:

- does this fit MorpBase architecturally?

This analysis checks whether the idea integrates cleanly with the current product model or would fight it.

## Short Conclusion

Architecturally, the idea **can fit** MorpBase.

But only if it is treated as:
- a new reusable entity layer
- clearly separate from Pools
- clearly separate from Territories
- intentionally surfaced through workflow application

If implemented that way, it is additive.
If implemented as a Pool variant or Builder variant, it would likely create harmful overlap.

## Current MorpBase Architecture

Right now the major layers are approximately:

### Builder
Owns:
- step-by-step prompt construction
- active workflow progression
- output assembly

### Pools
Own:
- reusable source material
- workflow/style identity
- initiative phrases
- IDP sets

### Territories
Own:
- source composition
- focused source-space use
- workflow bias/context

### Modes
Own:
- Builder orientation

### Prompt Preview
Owns:
- visible prompt state
- active workflow summary
- some workflow-facing controls

This is important because Character Identity should not collapse into any of these.

## Where Character Identity Fits Best

The cleanest fit is:

### New reusable entity layer

This means:
- Characters sit alongside Pools conceptually
- but do a different job

Pools:
- workflow/style/image-family hosts

Characters:
- reusable subject identity entities

That is the clearest architecture.

## Why It Should Not Be A Pool Extension

There is a tempting path:
- just make a "character pool"

That would be a mistake.

Why:
- characters are meant to be broader than niche pools
- pools already carry workflow/style identity
- a character pool would blur identity and style again

Architecturally that would weaken the distinction we are trying to create.

## Why It Should Not Be A Territory Extension

Territories are composed source spaces.

A character is not:
- a source-space map
- a focus bias
- a sectioned source composition

Territories may later include a chosen character in context,
but Territory should not own the concept.

## Why It Should Not Be A New Mode

Modes are Builder orientation controls.

Character identity is:
- subject identity

Completely different layer.

So architecturally:
- keep Modes out.

## Best Architectural Model

### Layer 1: Character library / entity store
This would store:
- saved characters
- identity fields
- prompt-facing character phrase bundle

### Layer 2: Workflow application state
The current Builder session could have:
- zero or one active character

### Layer 3: Prompt assembly integration
When active, the character contributes a visible prompt layer.

This is probably the cleanest integration.

## How It Would Interact With Prompt Assembly

Current prompt assembly already merges:
- Builder selections
- Pool additions
- IDP baselines
- Global Phrase Layer
- other additions

That is actually a good sign.

Because a character layer could likely enter this same general assembly path as:
- another explicit prompt influence layer

That means the architecture already has a place for it.

## Best Prompt-Layer Position

Character identity should probably sit:
- early enough to matter
- but not in the same semantic slot as pool IDP sets

Possible order:

1. character identity layer
2. pool / IDP baseline
3. global phrases
4. builder selections
5. other additions

This is plausible because:
- character = who
- pool = style/workflow identity

That order is conceptually coherent.

## Data Model Implications

The feature would likely require:

### A new `Character` type
Separate from `Pool`.

Potential shape:
- id
- name
- core identity fields
- prompt phrases
- timestamps / ownership metadata

### Possibly a `CharacterPhrase` subtype
If structured character prompt output is needed.

### Active workflow character state
Probably stored near:
- Builder session state
- current active workflow context

This is not trivial, but it is cleanly separable.

## Storage Implications

Because characters are saved reusable entities, this feature likely needs:

- local persistence
and later:
- Supabase persistence

That implies:
- a new storage surface or table

This is heavier than a small UI tweak, but still conceptually contained.

## UI Architecture Implications

The feature likely needs:

### A character library surface
Dedicated page or modal

### A character creation/edit surface
Probably structured, but restrained

### A workflow application control
Likely in Prompt Preview / Active Workflow area

This is a meaningful new UI layer, but it does not require rewriting Builder.

That is good.

## Interaction With Existing Pool Systems

This is one of the most important integration points.

Characters and Pools should not compete for the same semantic responsibility.

### Character owns:
- recurring subject identity

### Pool owns:
- style/workflow/image-family realization

If this rule is respected, the interaction is healthy.

If not, the system becomes muddy quickly.

## Interaction With IDP Sets

IDP sets define:
- workflow baseline identity inside a pool

Character identity defines:
- reusable subject identity across pools

This is actually a promising complement.

Architecturally:
- IDP sets can remain pool-owned
- character identity can remain character-owned

These layers can coexist if the UI makes the distinction visible.

## Interaction With Secondary Pools

This could actually become interesting later.

A character might be used with:
- a primary pool
- secondary pools

That would be a very strong test of whether the character layer is working.

Why:
- character = identity continuity
- primary pool = host image family
- secondary pool = modular variation

Architecturally this is coherent.

## Main Architectural Risks

### 1. Overlap with Pools
This is the biggest risk.

If characters begin carrying:
- style identity
- workflow-specific image logic
- too much aesthetic realization

then the system duplicates Pools badly.

### 2. Too many prompt influence layers
MorpBase already has many layers.

A character system would add another.

So its influence must be:
- visible
- explicit
- conceptually clear

### 3. Too much UI expansion too early
The feature probably needs:
- a library
- an edit surface
- an application surface

That is a real product cost.

### 4. Weak proof of reuse
If users do not actually reuse the same character across workflows,
the feature may not justify its architecture cost.

## Best Architectural Reading

This idea fits best as:

- a new reusable entity system
- with a workflow application hook
- and prompt-layer integration

Not as:
- a Pool extension
- a Territory extension
- a Mode extension
- a Builder category set

That is the strongest architectural interpretation.

## Honest Conclusion

The Character Identity System can fit MorpBase cleanly if and only if:

1. it is treated as a distinct reusable entity layer
2. it remains separate from Pools conceptually and structurally
3. it is applied into workflows explicitly
4. it contributes a visible prompt layer
5. it proves real cross-workflow reuse

If those conditions are not met, the feature would likely add too much overlap.

If they are met, it could become one of the more meaningful expansions MorpBase has.
