# Multi IDP Set System MVP

## Date

18 March 2026

## Purpose

This document defines the smallest credible MVP for the Multi IDP Set System.

The goal is to prove the value of selectable baseline identity sets without overbuilding the feature.

## MVP Goal

Allow a workflow family to offer multiple selectable identity baselines while preserving:

- Pool ownership
- Territory-level selection
- Builder visibility
- editability after application

## Core MVP Definition

A Pool may define multiple named IDP sets.

A Territory may choose one of those sets as its active set.

When the Territory is used in Builder, the selected set is applied as visible prompt additions.

That is the MVP.

## What The MVP Includes

### 1. Pool-defined IDP sets

Each Pool may store:

- zero or more IDP sets

Each set should contain:

- `id`
- `name`
- `phrases`

Each phrase should contain:

- `id`
- `text`

Optional for MVP:

- one phrase in the set can be the primary phrase

### 2. Territory-level active set selection

If a Territory uses a Pool that has IDP sets, the Territory can choose:

- which set is active for that Pool

This is the core workflow power of the feature.

### 3. Builder application

When the Territory is activated in Builder, the selected IDP set is applied as visible prompt additions.

They should remain:

- editable
- removable
- inspectable

### 4. Clear UI visibility

The user must be able to tell:

- which IDP set exists
- which IDP set is selected
- which phrases belong to it

This must not be hidden logic.

## What The MVP Should Not Include

### 1. No Mode interaction

Modes stay out of this.

### 2. No automatic set merging across multiple Pools

If a Territory contains multiple Pools with IDP sets, the MVP should not try to build a smart combined identity system yet.

That is too heavy.

### 3. No conditional logic

Do not add:

- rule-based phrase selection
- mode-dependent set changes
- automatic context-aware set switching

### 4. No public taxonomy layer

This should not become a public classification system in Pool Hub yet.

### 5. No complex inheritance system

The MVP should not try to decide:

- whether Territory can override parts of a set
- whether Pool defaults and IDP sets merge intelligently

Keep it simple.

## Recommended MVP Ownership Model

### Pools

Own:

- available IDP sets

### Territories

Own:

- selected active IDP set for a given Pool usage

### Builder

Own:

- application of the selected set as visible prompt additions

## Recommended Data Shape

### Pool

May include:

- `idpSets?: PoolIdpSet[]`

### PoolIdpSet

- `id`
- `name`
- `phrases: PoolInitiativePhrase[]`

### Territory source or Territory metadata

Should be able to remember:

- which IDP set is active for a given Pool source

That is the likely MVP persistence question.

## Best UX Shape

### In User Pools

The user should be able to:

- create IDP sets
- name them
- edit phrases inside them
- inspect all sets

### In Territory workflow

The user should be able to:

- select which IDP set is active

This could be:

- `Choose IDP Set: 1 / 2 / 3`
- or a named selector

Named selection is better than numeric-only selection if possible.

### In Builder

The user should see:

- the selected set’s phrases appear as prompt additions

This is important for trust and clarity.

## Best First Use Case

The strongest first MVP candidate is:

- `Celestial Pixel Portrait`

Why:

- strong workflow family
- multiple plausible baseline readings
- clear need for variation without mode expansion

Possible first sets:

- `Celestial Shrine`
- `Magical Idol`
- `Occult Pastel`

## Success Criteria

The MVP succeeds if:

1. users understand the difference between sets
2. selecting a set creates a meaningful workflow difference
3. the workflow family stays coherent across sets
4. the system remains compatible with future secondary Pools
5. users do not confuse this with Modes

## Failure Criteria

The MVP fails if:

1. the sets feel like random presets
2. the system is too hidden
3. it creates too many choices too early
4. users cannot tell what is active
5. it starts behaving like a second mode system

## Recommended Scope Discipline

The MVP should prove:

- controlled identity variation inside one workflow family

It should not try to prove:

- a universal identity architecture for the whole product

## Final Recommendation

The MVP should stay:

- Pool-defined
- Territory-selected
- Builder-applied
- visible
- editable
- small

That is the strongest first version of the Multi IDP Set System.
