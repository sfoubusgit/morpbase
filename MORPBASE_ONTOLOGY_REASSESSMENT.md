# MorpBase Ontology Reassessment

## Purpose

This document steps back from UI, landing-page wording, and even candidate product concepts.

It focuses on a more basic question:

- what is MorpBase *actually* at the system-meaning level?

The goal is to identify:

- the central object of use
- the primary and secondary systems
- what each major system really is
- which things are core versus supporting

Only after this level is clear should product-concept or presentation decisions be made.

## Short Answer

MorpBase is not fundamentally:

- a Pool system
- a Territory system
- a prompt library
- a wildcard alternative

MorpBase is most fundamentally:

- a **workflow-session authoring environment for prompt creation**

The single most central thing in the current product is:

- the **active Builder session**

Everything else mainly exists to:

- shape it
- feed it
- constrain it
- preserve its output
- or make it reusable later

## The Central Object Of Use

If forced to identify the one object the user is really "using," the best answer is:

- the **active workflow session**

This session lives most concretely in the Builder state:

- selections
- modifiers
- prompt additions
- active Territory
- active IDP baseline
- active Character
- navigation state
- edited output

This is also the thing that gets persisted as the Builder session snapshot.

So the user's real activity is not simply:

- editing a prompt

It is more accurately:

- building and steering a live prompt-authoring session

The prompt is the current output of that session, not the whole system.

## Ontology Layers

## 1. Runtime Core

### Active workflow session

This is the true runtime center.

It includes:

- current Builder selections
- prompt additions and output overrides
- active workflow context systems
- current prompt output

This is the object most directly tied to actual use.

### Builder

Builder is the main operational surface of the workflow session.

It is not the ontology root by itself.

It is better understood as:

- the main interface for steering the active workflow session

### Prompt Preview

Prompt Preview is the applied-output surface of the same session.

It is where the user sees:

- what the session currently produces
- what context is active
- what reusable systems are affecting the result

So Builder and Prompt Preview are not separate product meanings.
They are two surfaces of the same core object.

## 2. Reusable Context Systems

These are not the main runtime object.

They are systems that shape or enrich the workflow session.

### Pools

Pools are:

- reusable source libraries

They hold:

- prompt items
- initiative phrases
- IDP sets

Pools are not the thing the user most fundamentally "uses" at runtime.
They are a supply layer.

They are best understood as:

- structured source material for workflows

### Territories

Territories are:

- reusable focused workflow contexts built from Pool sources

Territories matter because they do something Pools do not:

- they shape Builder focus and workflow behavior

That makes them more central to product meaning than Pools.

But they are still not the root ontology of MorpBase.

They are best understood as:

- reusable context objects that configure the active workflow session

In other words:

- a Territory is not the thing the user is ultimately making
- and not the thing they are directly outputting
- it is a reusable workflow lens applied to the active session

### Character / Identity

Character Identity is also not the runtime center.

It is a reusable identity overlay applied to the session.

Like Territory, it changes the session's output context.
Unlike Territory, it is identity-specific rather than workflow-space-specific.

### IDP sets

IDP sets are narrower identity-baseline tools attached to Pools.

They are a contextual modifier layer, not a core product object.

## 3. Output Artifacts

These are results or preserved outputs of the workflow session.

### Prompt

A prompt is:

- the current artifact produced by the session

It matters, but it is not the deepest meaning of the product.

If MorpBase were only about prompts, the reusable systems around it would be overbuilt.

### Saved Prompt

A saved prompt is:

- a preserved output artifact

It captures useful results from the session.

### Prompt Set

A Prompt Set is:

- an organizational container for saved prompt artifacts

Prompt Sets are clearly not ontology-central.
They are archive structure.

## 4. Discovery / Social / Distribution Layer

These systems matter, but they sit even further from the core ontology.

### Pool Hub

Pool Hub is:

- a discovery and distribution layer for reusable source libraries

### Profiles / creator surfaces

These are:

- social/public identity and publishing layers

They are ecosystem features, not the core product meaning.

## What Is Core Versus Supporting

## Truly core

- active workflow session
- Builder
- Prompt Preview
- reusable context shaping of the session

## Important but supporting

- Pools
- Territories
- Character / Identity
- save / reuse

## Clearly secondary

- Prompt Sets
- Pool Hub
- creator profiles
- analytics / admin

## The Key Distinction

There is an important difference between:

- what is **ontologically central**

and

- what is **strategically differentiated**

These are not always the same.

### Ontologically central

The active workflow session is central.

### Strategically differentiated

Territories may be one of the strongest differentiated reusable systems.

This means a common mistake would be:

- treating the most differentiated object as the ontology root

That would over-center Territories.

Territories are likely one of the strongest *expressions* of MorpBase's uniqueness.
But the deeper root is still:

- workflow-session authoring through reusable context systems

## What MorpBase Is Not

This reassessment also makes several negatives clearer.

MorpBase is not mainly:

- a text templating engine
- a wildcard syntax tool
- a prompt editor enhancement
- a prompt history manager
- a library manager for Pools alone
- a Territory manager alone

Those can all be parts of the product.

But none of them individually explains the whole system correctly.

## Reassessed Meaning

The strongest current ontology-level reading is:

- MorpBase is a system for authoring prompt workflows through a live session that can be shaped by reusable context objects and preserved as reusable outputs.

That can be simplified one level without losing the truth:

- MorpBase is a workflow-session authoring environment for structured prompt creation.

This is more accurate than:

- prompt builder
- territory system
- pool system
- prompt manager

## Implications For Later Concept Work

This does **not** yet decide how MorpBase should be presented.

But it does establish some constraints:

### 1. Any winning concept should respect the session-centered truth

If the concept ignores the live workflow session, it will miss the real center.

### 2. Territories should not automatically be treated as the root concept

They may still be the strongest differentiating expression.
But they are not the deepest ontology root.

### 3. Pools should remain clearly subordinate to workflow use

Pools matter because they feed reusable workflows, not because they are the end product.

### 4. Saved prompts and Prompt Sets should not be mistaken for the main product

They preserve results.
They do not define the deepest meaning of the system.

## One-Line Verdict

The most accurate ontology-level reading of MorpBase right now is:

- **a workflow-session authoring environment**

with:

- **Territories, Pools, and Identity systems as reusable context layers**

and:

- **prompts / prompt sets as preserved output artifacts**
