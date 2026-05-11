# MorpBase Main Identity Decision

## Purpose

This document locks the current concept hierarchy for MorpBase after the ontology reassessment.

It answers one question:

- what should MorpBase treat as its main identity?

This is not a landing-page copy document and not an implementation spec.

It is a concept-level decision reference.

## Decision

MorpBase should treat its main identity as:

- **Prompt Workflow Authoring System**

## Supporting Hierarchy

The concept stack should be understood as:

### 1. Ontology root

- workflow-session authoring environment

This is the deepest structural truth of the product.

### 2. Main identity

- prompt workflow authoring system

This is the best concept-level expression of what MorpBase actually is.

### 3. Usable expression

- prompt workflow studio

This is the softer human-facing expression of the same concept.

### 4. Strategic differentiator

- workflow spaces built from reusable sources

This is the strongest long-term differentiated expression, especially as Territories mature further.

## Why This Is The Main Identity

`Prompt Workflow Authoring System` was chosen because it is the best balance of:

- truth
- coverage
- differentiation
- future stability

It works better than alternatives because:

### It is more truthful than `Prompt Builder`

MorpBase is not just a builder for prompt text.
It includes reusable context systems, output shaping, session persistence, and reusable workflow logic.

### It is less generic than `Prompt Workflow Studio`

`Studio` is useful as a softer expression, but not strong enough as the main identity by itself.

### It is less abstract than `Workflow-Session Authoring Environment`

That phrase is structurally accurate, but too analytical to function well as the primary identity.

### It is broader and more accurate than `Territory-first`

Territories are important and highly differentiated, but they are not the ontology root.
They are a reusable context layer that shapes the active workflow session.

## System Reading Under This Decision

If MorpBase is a `Prompt Workflow Authoring System`, then the major systems fall into clearer roles:

### Core

- active workflow session
- Builder
- Prompt Preview

### Supporting context systems

- Pools
- Territories
- Character / Identity
- IDP sets

### Output artifacts

- prompts
- saved prompts
- Prompt Sets

### Ecosystem layer

- Pool Hub
- creator profiles
- publishing / discovery surfaces

## Guardrails

This decision implies several guardrails:

### 1. Do not reduce MorpBase to a prompt-text tool

That would collapse it into competitors it is not trying to be.

### 2. Do not mistake the strongest differentiator for the ontology root

Territories may be one of the strongest differentiating systems.
That does not make them the deepest identity of the product.

### 3. Do not over-center archive systems

Prompt Sets and saved prompts matter, but they preserve outputs.
They do not define the product's main identity.

### 4. Keep `prompt` attached to `workflow`

This avoids confusion with node/workflow tools like ComfyUI.

## What This Decision Does Not Yet Decide

This document does not yet decide:

- landing-page wording
- Builder first-use flow
- whether Territory should be the recommended path
- product onboarding copy
- implementation changes

Those are downstream decisions.

## Practical Meaning

Future concept and product decisions should be tested against this identity:

- does the decision strengthen MorpBase as a prompt workflow authoring system?
- does it help the user author, shape, or steer a workflow session?
- does it make supporting systems feel subordinate to workflow authoring rather than equal competing concepts?

If the answer is no, the decision is probably drifting away from the current core truth.

## One-Line Lock

MorpBase should currently think of itself first as a:

- **Prompt Workflow Authoring System**
