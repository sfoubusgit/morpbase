# MorpBase Builder-Centered Realignment Plan

## Purpose

This document turns the recent concept work into a practical priority order.

It answers:

- if MorpBase should feel Builder-centered in meaning, what should change first?

This is still not a technical implementation checklist.

It is a product realignment plan.

## Decision Premise

The recent concept decisions already established:

- MorpBase main identity = `Prompt Workflow Authoring System`
- primary user-facing center = `Builder workspace + Prompt Preview loop`
- Territories = recommended workflow context layer
- Pools = backstage source-library layer
- Prompt Library / Prompt Sets = downstream capture layer

The current problem is:

- the product still teaches a more multi-center, prompt-parts-oriented story than the system actually is

So the realignment plan should focus first on:

- repairing the product center of gravity

not:

- adding more new concepts
- adding more new systems
- or polishing secondary layers first

## Core Goal

Make MorpBase feel like:

- one main workspace
- shaped by strong supporting systems
- with clear downstream save/reuse

not like:

- a collection of adjacent tools or feature areas with equal conceptual weight

## Priority Order

## Priority 1: Re-center the product around Builder

This is the highest-leverage change.

The product needs to make Builder read as:

- the main place where MorpBase happens

That means the product must stop implying:

- Builder is just one tab or one feature area among peers

The user should feel:

- everything important either shapes Builder, supports Builder, or preserves what Builder produces

Why this is first:

- if the center stays muddy, every other concept repair remains weaker

## Priority 2: Reposition Territory as the strongest supporting context around Builder

Territory should become clearly legible as:

- the recommended workflow context layer for Builder

This is the best way to make Builder feel more specific without replacing Builder as the center.

The relationship should be obvious:

- Builder = workspace
- Territory = recommended focus context for that workspace

Why this is second:

- Territory is the strongest supporting differentiator
- it helps solve the generic-builder problem
- it gives Builder a clearer shape without making Territory the ontology root

## Priority 3: Push Pools into a more backstage role

Pools need to remain important, but they should stop competing for conceptual center.

Pools should feel like:

- the reusable source-material layer behind workflows

not like:

- a parallel runtime center
- or the main thing the user is directly "using"

Why this is third:

- Pools are necessary for reuse and Territory composition
- but over-foregrounding them keeps MorpBase too close to "reusable prompt pieces" thinking

## Priority 4: Make Prompt Preview reinforce the hierarchy

Prompt Preview already does useful work.

But its role should become more conceptually precise:

- it should feel like the output/control companion of the Builder workspace

It should help users understand:

- what the session is producing
- what context is shaping it
- what can be refined or saved next

without flattening every supporting system into the same level of meaning.

Why this matters:

- Prompt Preview is one of the strongest places to teach the session model correctly

## Priority 5: Keep save/reuse clearly downstream of authoring

Prompt Library and Prompt Sets should feel like:

- capture and organization of useful results

not:

- an equal conceptual center beside Builder

Why this matters:

- if save/reuse becomes too central too early, MorpBase starts drifting toward prompt-manager identity

## Priority 6: Delay deeper conceptual expansion until the center is repaired

This includes things like:

- stronger Territory-first entry moves
- more Identity depth
- further ecosystem emphasis

These may all become valuable.

But they should come after Builder-centered meaning is repaired, not before.

Why this matters:

- adding more concept weight before the center is clear risks making the product heavier again

## What Should Not Be Prioritized First

The following should not be first-move priorities:

### 1. New major feature systems

The product does not mainly need more concepts right now.

### 2. Deeper Identity expansion

Identity may matter later, but it is not the current center-of-gravity problem.

### 3. Hub / profile polishing as a lead move

Those are ecosystem layers, not the core meaning problem.

### 4. Pure cosmetic polish without hierarchy repair

Better visuals alone will not solve a product-center mismatch.

## First Recommended Move

If only one realignment move were chosen first, it should be:

- make the live product unmistakably Builder-centered in hierarchy

That means:

- Builder should feel like the primary workspace
- supporting systems should be narrated in relation to it
- the app should stop feeling like a row of conceptually equal destinations

This first move would create the strongest foundation for every later improvement.

## Success Criteria

The realignment is working if users begin to feel:

- "Builder is the main workspace."
- "Territory is the main way to focus that workspace."
- "Pools supply the reusable material behind that."
- "Prompt Preview shows and controls what that workflow is currently producing."
- "Saved prompts are what I keep after useful workflow work."

It is not working if users still mainly feel:

- "This is another prompt-parts tool."
- "This is several equal systems at once."
- "I am not sure what the main thing here actually is."

## One-Line Plan

The correct realignment order for MorpBase is:

- **Builder first**
- **Territory around Builder second**
- **Pools backstage**
- **Prompt Preview as companion**
- **save/reuse downstream**
