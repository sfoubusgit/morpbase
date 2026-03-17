# Builder Workflow Modes Expansion Boundary

## Purpose

This document defines how Builder Workflow Modes are allowed to grow after the first coherent implementation.

Its purpose is to prevent concept drift.

Now that Modes are real inside MorpBase, the main risk is no longer underdefinition.

The main risk is that future changes could expand Modes too loosely until they become:

- a vague product-wide taxonomy
- a catch-all explanation for unrelated workflow problems
- an inflated system of labels instead of a disciplined Builder feature

This document is meant to stop that.

## Current Baseline

Builder Workflow Modes currently exist as:

- a Builder-level workflow orientation system
- a reversible guidance layer
- a mode-aware navigation system
- a mode-aware sidebar grouping and suggestion system
- a Territory-compatible feature

Current implemented set:

- `Balanced`
- `Character-First`
- `Environment-First`
- `Scene-First`

Deferred:

- `Object-First`

This baseline should be treated as the reference point for all future expansion decisions.

## Core Rule

Builder Workflow Modes may grow only when the growth strengthens workflow truth inside Builder.

Modes should not grow merely because:

- a use case sounds distinct
- an aesthetic category has a strong identity
- a label seems attractive
- a workflow has friction somewhere in the product

In short:

- expand Modes only when Builder workflow orientation is genuinely missing

not:

- whenever MorpBase encounters a new type of content

## What Counts As Legitimate Mode Expansion

The following are legitimate forms of expansion.

### 1. Stronger Builder Guidance

It is legitimate to deepen how Modes shape Builder behavior if the change remains Builder-scoped.

Examples:

- better suggested-next logic
- better mode-specific guidance copy
- better mode-specific start behavior
- better mode-specific category emphasis

This is healthy expansion.

### 2. Better Territory Coexistence

It is legitimate to improve how Modes and Territories cooperate, as long as they remain distinct systems.

Examples:

- clearer Territory-biased wording
- better highlighted relevance
- cleaner start-positioning
- cleaner mode-aware category jumping in Territory-biased mode

This is also healthy expansion.

### 3. Additional Mode Only When Orientation Is Missing

A new mode is legitimate only if it represents a genuinely missing workflow orientation.

This must be demonstrated, not assumed.

### 4. Better Evaluation Infrastructure

It is legitimate to improve how we evaluate Modes.

Examples:

- reusable test templates
- stronger QA criteria
- better documentation of mode failures
- use of the Mode Elasticity Test as standard evidence

## What Does Not Count As Legitimate Mode Expansion

The following do not justify expanding the mode system on their own.

### 1. Genre Identity

These are not automatically new modes:

- fantasy
- sci-fi
- anime
- horror
- noir

These are content or aesthetic families, not necessarily workflow orientations.

### 2. Medium Identity

These are not automatically new modes:

- pixel art
- icons
- comic panels
- UI mockups
- map design

These may reveal real system needs, but they do not automatically imply a new mode.

### 3. Territory Weakness

If a workflow fails because the Territory is weak, that is not evidence for a new mode.

### 4. Pool Weakness

If the Pools are weak or badly structured, that is not evidence for a new mode.

### 5. Builder UX Friction

If the workflow has awkward wording, weak suggestions, confusing transitions, or poor cues, that is usually a Builder UX problem before it is a mode problem.

### 6. Broader Product Taxonomy Pressure

Modes should not expand just because other systems might want a label.

Examples:

- Pool labeling
- Territory identity
- Hub browsing taxonomy
- public prompt classification

This is exactly the kind of expansion that weakens the concept.

## Evidence Standard For A New Mode

A new mode should only be considered after the following evidence threshold is met.

### Required Conditions

1. the candidate workflow is specific and realistic
2. the Pools supporting it are strong
3. the Territory supporting it is well-composed
4. existing modes were tested honestly
5. the workflow still fails in a way that points to missing orientation logic

If those conditions are not met, the candidate does not yet justify a new mode discussion.

## Required Test Method

Any serious proposal for a new mode should use:

- [MODE_ELASTICITY_TEST.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MODE_ELASTICITY_TEST.md)

This should be treated as the default evaluation method before proposing a new Builder Workflow Mode.

## Failure Interpretation Rules

When a candidate workflow struggles, interpret the failure carefully.

### 1. Orientation Failure

The workflow needs a genuinely different build priority from the existing modes.

This is the strongest evidence for a new mode.

### 2. Territory Failure

The Territory composition or Builder mapping is weak.

This suggests Territory work, not a new mode.

### 3. Pool Failure

The source material is weak or badly structured.

This suggests Pool improvement, not a new mode.

### 4. Builder Guidance Failure

The current mode is directionally correct, but the guidance is too weak or awkward.

This suggests Builder refinement, not a new mode.

### 5. Medium-Specific Failure

The workflow depends on medium-specific support that is not fundamentally about orientation.

This may justify another future system layer, but not necessarily a new Builder Workflow Mode.

## Expansion Ladder

When a workflow reveals strain in the current system, the response order should be:

1. improve Pools
2. improve Territory composition
3. improve section mapping
4. improve Builder guidance
5. improve Territory coexistence
6. only then consider a new mode

This order is important.

A new mode should be the late response, not the first response.

## Safe Expansion Zones

These are the safest areas for future mode growth.

### Safe Zone A: Better Builder Suggestions

Low risk, high value.

### Safe Zone B: Better Builder Copy

Low risk, high value.

### Safe Zone C: Better Start-Point Logic

Moderate risk, often worthwhile.

### Safe Zone D: Better Territory Interaction

Moderate risk, justified if it preserves system clarity.

## Unsafe Expansion Zones

These are high-risk areas where the concept is likely to become diluted.

### Unsafe Zone A: Turning Modes Into Pool Identity

Avoid.

### Unsafe Zone B: Turning Modes Into Territory Identity

Avoid.

### Unsafe Zone C: Turning Modes Into Product-Wide Content Taxonomy

Avoid.

### Unsafe Zone D: Adding New Modes From Aesthetic Intuition Alone

Avoid.

### Unsafe Zone E: Making Modes Do Prompt-Engine Work Without Strong Need

Avoid unless strong evidence emerges later.

## Decision Questions For Any Proposed Expansion

Before accepting any future expansion, answer these questions:

1. Is this expansion Builder-truthful?
2. Does it improve workflow orientation rather than product labeling?
3. Could the problem be solved more honestly through Pools, Territories, or Builder UX?
4. Has the Mode Elasticity Test been applied?
5. Does this preserve the distinction between Modes and Territories?
6. Does this preserve the Builder-first scope of the system?

If the answer to these questions is weak, the expansion should be rejected or delayed.

## Final Principle

Builder Workflow Modes should grow slowly, evidentially, and only in response to real workflow gaps.

Their strength comes from discipline.

The system becomes weaker if it expands simply because more labels are possible.

In short:

- protect workflow truth
- prefer refinement over inflation
- require evidence before expansion
