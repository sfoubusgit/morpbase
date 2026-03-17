# Pool Default Initiative Phrases Concept

## Purpose

This document defines a new feature idea for MorpBase:

`Pool Default Initiative Phrases`

The goal is to give a Pool an optional built-in starter baseline, not just a library of selectable fragments.

This feature is intended to help workflows that need a recognizable default starting posture.

Examples:

- pixel art portrait
- cinematic mech showcase
- relic-centered fantasy artifact study
- manga close-up portrait

## Core Idea

A Pool may optionally contain a small set of default initiative prompt phrases.

These phrases represent the Pool's intended baseline starting layer.

They are:

- included by default when the Pool is applied in the relevant flow
- visible to the user
- fully editable
- fully removable

This means a Pool can act as both:

1. a reusable library of fragments
2. a starter baseline for a specific creative workflow

## Why This Feature Exists

Some workflows are not best represented by a loose collection of optional parts alone.

They also have a natural starting posture.

For example, a Pool like:

- `32x32 Pixel Art Portrait`

may want to establish a baseline such as:

- clean 32x32 pixel art portrait
- limited palette portrait sprite
- centered bust portrait framing

Those are not just random optional fragments.

They are closer to:

- the Pool's built-in initial stance

That is what this feature captures.

## What This Feature Is Not

This feature is not:

- a new Mode feature
- a hidden prompt injection system
- a replacement for normal Pool items
- a hard requirement that cannot be removed

It must remain transparent and optional in use.

## Correct Product Home

This feature belongs primarily to:

- `Pools`

Secondarily, it may later interact with:

- `Territories`

It should not belong to:

- `Builder Workflow Modes`

## Why It Belongs To Pools

Pools already represent:

- reusable vocabularies
- source identity
- themed material collections

So a Pool having a built-in baseline is a natural extension of Pool identity.

It means:

- the Pool does not just contain parts
- the Pool also expresses how it wants to begin

That is a Pool-level concept.

## Why It Does Not Belong To Modes

Modes are about:

- workflow orientation
- Builder sequencing
- category emphasis
- navigation guidance

Default initiative phrases are about:

- baseline prompt content
- source identity
- starter material

These are different layers.

So this feature should stay out of the mode system.

That distinction is important because it helps prevent unnecessary mode expansion.

## Why It Should Not Start In Territories

Territories are composed from multiple Pool sections.

If default initiative phrases started there first, the feature would become ambiguous:

- is the initiative coming from the Territory itself?
- from one source Pool?
- from many source Pools?
- from a merge rule?
- from source order?

That is too complex for the first version.

So the cleaner model is:

- Pools own initiative defaults
- Territories may later compose them

## Proposed Feature Definition

### Pool Default Initiative Phrases

A Pool can define a small optional starter bundle of prompt phrases that expresses its intended baseline workflow or visual identity.

These phrases are included by default when the Pool is applied in the relevant context, but remain fully visible, editable, and removable.

## Product Value

This feature could make Pools feel more like:

- ready-to-start creative systems

instead of only:

- storage bins of fragments

This is especially useful for:

- style-heavy workflows
- medium-specific workflows
- repeatable prompt formats
- structured test scenarios

## Example

### Pool

- `32x32 Pixel Art Portrait`

### Possible Initiative Phrases

- clean 32x32 pixel art portrait
- limited palette portrait sprite
- centered bust portrait framing

### Meaning

When the Pool is applied, the user starts with a coherent baseline.

The user can still:

- remove any default phrase
- edit any default phrase
- add more fragments from the same Pool

## UX Principles

If this feature is implemented, the UX must follow these rules.

### 1. Visible

The user must be able to see which phrases were added as defaults.

### 2. Removable

The user must be able to remove them easily.

### 3. Editable

The user must be able to adjust them like normal prompt material.

### 4. Non-deceptive

The system must never feel like it is secretly injecting prompt content.

### 5. Optional At The Feature Level

Pools should not be required to define initiative phrases.

This should remain an optional capability.

## Likely First-Phase Scope

The simplest honest first version would be:

- a Pool may define zero or more default initiative phrases
- these appear in a clearly identified default starter area
- they are added visibly when the Pool is used
- they can be deleted immediately

This is enough to prove the concept without overcomplicating it.

## Possible Later Territory Interaction

Later, Territories could potentially:

- surface initiative defaults from their source Pools
- combine multiple Pool defaults
- let the user accept or reject those defaults

But that should be a later design problem.

It should not define the first version.

## Relevance To Modes

This idea is strategically important because it may solve some workflow problems that might otherwise be misdiagnosed as missing modes.

If a workflow struggles, the real missing piece may be:

- stronger Pool-level baseline initiative

not:

- a new Builder Workflow Mode

This is one of the reasons the concept is valuable.

## Final Principle

Pool Default Initiative Phrases should be treated as a Pool-level baseline starter feature that strengthens source identity and workflow readiness, while remaining transparent, removable, and separate from the Modes system.
