# MorpBase Supporting System Relationship Decision

## Purpose

This document answers the next structural question after the user-facing center decision:

- if Builder is the primary user-facing center, what should the supporting systems feel like in relation to it?

This is still a concept-level decision.

It is not yet deciding specific UI or implementation.

## Core Answer

The supporting systems should not all feel equally important or equally close to Builder.

They should have a clear relationship hierarchy:

1. `Territories` = recommended workflow context layer
2. `Pools` = backstage source-library layer
3. `Identity systems` = optional session overlay layer
4. `Prompt Library / Prompt Sets` = downstream capture and organization layer
5. `Hub / profiles / publishing` = ecosystem layer

## Most Important Decision

Territories should currently feel like:

- **the recommended workflow context layer for Builder**

not:

- a minor optional extra
- a mandatory first step
- the primary center of the whole product

This is the best current balance.

## Why Territories Should Be The Recommended Context Layer

Territories are the strongest supporting system because they do the most meaningful contextual work relative to Builder:

- they shape Builder focus
- they bias navigation
- they create a reusable workflow lens
- they connect reusable source material to actual workflow behavior

That makes them more important than Pools at the runtime experience level.

But they should still remain clearly subordinate to Builder because:

- the user is still working inside Builder
- Territory configures the session rather than replacing the session

So the clean reading is:

- Builder is the workspace
- Territory is the recommended workflow context for that workspace

## Why Territories Should Not Yet Be Mandatory

Territories should not yet feel like a required first step because:

- they depend on Pool material
- they still require setup effort
- the current product does not yet provide enough default or starter Territory support
- forcing them too early would make the product heavier before it becomes clearer

So the right present-tense relationship is:

- recommended context layer

not:

- required gate

## Why Territories Should Not Be Just A Minor Optional Extra

Calling Territories merely "optional" is also too weak.

That framing would understate one of MorpBase's strongest real systems.

Territories should feel more important than:

- a side feature
- an advanced curiosity
- a hidden mode

They are better understood as:

- the most meaningful reusable workflow context the user can apply to Builder

## Pools

Pools should feel like:

- **the backstage source-library layer**

Pools are essential, but they should not feel like the main runtime object the user is applying directly in the same way a Territory is applied.

Pools matter because they:

- provide reusable material
- support Territories
- support prompt additions and identity baselines

So the correct relationship is:

- Pools feed workflows
- Territories shape workflows
- Builder runs the workflow session

This makes Pools important, but clearly backstage relative to the main workspace experience.

## Identity Systems

Identity systems should feel like:

- **optional session overlays**

They do not replace Territory or Pools.
They do not become the center.

They add reusable identity context to the active Builder session.

So the clean reading is:

- Territory answers workflow-space context
- Identity answers recurring subject / identity context

Both shape Builder, but in different ways.

## Prompt Library / Prompt Sets

These should feel like:

- **downstream capture and organization systems**

They should not compete with Builder, Pools, or Territories as conceptual centers.

Their job is to:

- preserve useful outputs
- organize finished or useful prompt artifacts
- support reuse after authoring

So they belong after the main workflow, not beside it as an equal concept.

## Hub / Profiles / Publishing

These should feel like:

- **ecosystem extensions**

They matter for community, distribution, and discovery.
But they should not shape the core product meaning.

## Best Relationship Model

The cleanest relationship model is:

- **Builder** = main workspace
- **Prompt Preview** = active output/control companion
- **Territory** = recommended workflow context
- **Pool** = reusable source material
- **Identity** = optional reusable overlay
- **Prompt Library / Prompt Sets** = saved output structure
- **Hub / profiles** = ecosystem layer

## What This Means Conceptually

This answers the earlier open question:

- should Territories feel like optional lens, recommended workflow mode, or eventual default context layer?

The best answer right now is:

- **recommended workflow context layer**

The likely longer-term path is:

- Territories may become a stronger default context layer later

but only if:

- MorpBase has better starter Territories or official reusable workflow presets
- the product can carry Territory-led entry without raising cognitive load

## Guardrails

### 1. Do not make every supporting system feel equally primary

That recreates the same conceptual blur we have been trying to remove.

### 2. Do not over-demote Territories

They are too important and too differentiated to be treated as a mere side feature.

### 3. Do not over-promote Pools in runtime meaning

Pools are vital, but they are source libraries, not the central runtime experience.

### 4. Keep save/reuse downstream of authoring

Prompt Sets and saved prompts should support the workflow, not define it.

## Final Verdict

Given Builder as the user-facing center, the correct present-tense relationship is:

- **Territories should feel like the recommended workflow context layer**
- **Pools should feel like backstage source libraries**
- **Identity should feel like an optional reusable overlay**
- **Prompt Library / Prompt Sets should feel downstream**

This is the cleanest supporting-system relationship model for MorpBase right now.
