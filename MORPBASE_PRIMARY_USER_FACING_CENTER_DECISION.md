# MorpBase Primary User-Facing Center Decision

## Purpose

This document answers a narrower question than the main identity decision:

- if MorpBase is a `Prompt Workflow Authoring System`, what system should be treated as the primary user-facing center?

This is still not a UI implementation document.

It is a concept-level structural decision.

## Decision

MorpBase should treat its primary user-facing center as:

- **the active Builder workspace**

More precisely:

- the **active workflow session as experienced through the Builder + Prompt Preview loop**

If one visible system must be treated as the main center, that system is:

- **Builder**

But Builder should be understood as:

- the main workspace for authoring the live prompt workflow session

not merely:

- a generic prompt questionnaire
- a basic prompt-part picker
- or a blank prompt builder

## Why Builder Is The User-Facing Center

The ontology reassessment established that the deepest runtime center is:

- the active workflow session

But that session is not a user-facing product object on its own.

Users experience it through:

- Builder
- Prompt Preview

Builder is the main operational surface.
Prompt Preview is the applied-output surface of the same session.

That makes Builder the clearest user-facing center, while Prompt Preview remains inseparable from it in practice.

## What This Means

The user should feel that they are primarily:

- working inside the Builder workspace

while:

- Prompt Preview shows what that workspace is currently producing

This means the main user-facing center is not:

- Pools
- Territories
- Prompt Library
- Prompt Sets
- Pool Hub

Those systems are important, but they should read as supporting systems around the main workspace.

## Why Other Candidates Should Not Be The Main Center

## Territories

Territories are highly important and strategically differentiated.

But they should not be treated as the primary user-facing center because:

- they are reusable context objects
- they shape the workspace rather than replacing it
- over-centering them risks confusing the strongest differentiator with the ontology root

Territories are best understood as:

- a powerful workflow lens applied to the Builder workspace

not:

- the primary place where the user lives at all times

## Pools

Pools should not be the center because:

- they are source libraries
- they feed workflows
- they are not the main runtime object of use

They are infrastructure for reuse, not the main surface of authoring.

## Prompt Preview

Prompt Preview is essential, but it should not become the primary center by itself because:

- it reflects and applies the session
- it does not replace the active authoring flow

It is best treated as:

- the paired output/control surface of the Builder workspace

## Prompt Library / Prompt Sets

These should not be the center because:

- they preserve and organize output artifacts
- they do not define the live authoring session itself

## Better Reading Of Builder

This decision requires a more precise understanding of Builder.

Builder should not be read as:

- "the old generic base builder"

It should be read as:

- the main prompt-workflow workspace

That means the current concern about the `General Base Builder` being too generic is still valid.

The correction is:

- do not demote the workspace itself
- do demote the idea of Builder as a generic blank prompt-builder product promise

In other words:

- **Builder as workspace stays central**
- **Builder as generic identity should not**

## Relationship To Prompt Preview

The cleanest user-facing reading is:

- Builder = where the workflow session is actively shaped
- Prompt Preview = where that session is seen, applied, edited, and saved

So the user-facing center is most accurately:

- **Builder workspace with Prompt Preview attached**

If the product ever gets a stronger umbrella label later, it may refer to this pair together.

But at the current system level, Builder remains the clearest primary center.

## Implications For Other Systems

Under this decision:

### Territories

- should shape Builder
- should contextualize Builder
- should not compete with Builder as an equal center

### Pools

- should feed reusable material into workflows
- should support Builder and Territories
- should not feel like something the user "applies" in the same way a session context is applied

### Prompt Library

- should capture useful results from Builder sessions
- should remain clearly downstream of authoring

### Identity systems

- should be understood as reusable overlays on the active Builder session

## Guardrails

### 1. Do not turn the app into a collection of equal centers

If Builder, Pools, Territories, Prompt Library, and Hub all feel equally primary, the product meaning will stay muddy.

### 2. Do not confuse the center of use with the strongest differentiator

Territories may still become the strongest differentiator.
That does not make them the primary center of use.

### 3. Do not reduce Builder back to a generic prompt-builder identity

The workspace remains central, but the framing around it must become more specific and more truthful.

## Final Verdict

The correct primary user-facing center for MorpBase is:

- **the active Builder workspace**

with:

- **Prompt Preview as its inseparable output/control companion**

and:

- **Territories, Pools, and other systems as supporting workflow-shaping layers**
