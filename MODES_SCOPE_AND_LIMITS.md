# Modes Scope And Limits

## Purpose

This memo exists to prevent the Modes concept from drifting beyond what the current MorpBase system can support honestly.

It should be read alongside [BUILDER_WORKFLOW_MODES_CONCEPT.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/BUILDER_WORKFLOW_MODES_CONCEPT.md).

## Core Rule

Modes are a Builder-level workflow orientation system first.

They are not currently:

- a universal MorpBase taxonomy
- a prompt identity system
- a Pool identity system
- a Territory identity system
- a community discovery taxonomy

## What Modes Are Allowed To Change

In the first honest version, Modes may change:

- Builder category priority
- Builder navigation order
- Builder helper copy
- Builder Suggested next behavior
- Builder starting emphasis

## What Modes Are Not Allowed To Change Yet

Modes should not initially change:

- prompt engine logic
- prompt output structure
- Pool identity
- Territory identity
- Hub taxonomy
- creator profile identity
- public content classification

## Why This Boundary Exists

MorpBase currently has multiple semantic layers:

- Builder categories
- Pool sections
- Territory sections
- prompt output sections
- legacy Working Sets language

These layers are related, but they are not yet one unified ontology.

Trying to make Modes universal before the rest of the system is semantically aligned would create false coherence.

## Relationship To Territories

Territories and Modes should coexist, but they should not mean the same thing.

Recommended split:

- Territories = source-space focus
- Modes = workflow orientation

That keeps both systems useful without forcing one to absorb the other.

## Relationship To Pools

Pools remain:

- source vocabularies
- themed libraries
- reusable fragment collections

Modes may later influence Pool recommendations, but they should not define what a Pool is.

## Relationship To Saved Prompts

Saved prompts may later remember workflow context as soft metadata.

But this is not part of the first honest implementation.

First, Modes must prove their value inside Builder itself.

## First-Wave Mode Set

Allowed first-wave modes:

- `Balanced`
- `Character-First`
- `Environment-First`
- `Scene-First`

Deferred:

- `Object-First`

Reason:

- `Object-First` is conceptually valid, but current Builder architecture supports it less naturally

## Integrity Test

If a Mode changes sidebar presentation but does not change navigation behavior, it is not real enough.

If a Mode is treated like a genre, it is conceptually drifting.

If a Mode starts defining Pools or Territories, it is expanding too far.

## Decision Rule For Future Work

Use this rule:

- if a proposed change is only needed to make Modes appear larger, do not do it
- if a proposed change improves MorpBase coherence on its own and also helps Modes, it is a better candidate

## Final Boundary Statement

Modes should earn expansion by proving Builder value first.

Until then, MorpBase should treat Modes as:

- a local workflow intelligence layer

not:

- a master organizing principle for the whole product
