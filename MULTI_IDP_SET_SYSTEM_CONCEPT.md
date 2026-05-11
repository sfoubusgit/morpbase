# Multi IDP Set System Concept

## Date

18 March 2026

## Purpose

This document formalizes the idea of allowing a workflow family to have multiple selectable IDP sets.

The goal is to support:

- stronger workflow iteration
- controlled baseline variation
- compatibility with future secondary Pools

without turning every distinct aesthetic branch into a new Mode.

## Core Definition

A Multi IDP Set System allows a Pool to define multiple baseline identity sets, where each set contains a small group of initiative phrases that establish a distinct starting identity inside the same workflow family.

Example:

One Pool may support:

- `Set 1`
- `Set 2`
- `Set 3`

Each set represents:

- a different baseline reading of the same workflow family

not:

- a different Builder Mode

## Why This System Exists

Some workflows do not need a new Mode, but they do need more than one baseline identity.

For example:

- a workflow may have a stable image family
- but within that family, several different starting identities may all be valid

Without multiple IDP sets, the current choices are often too blunt:

- one default is too narrow
- many loose additions are too unstable
- a new Mode would be conceptually wrong

This system creates a middle layer:

- stable but variable

## What This Is Not

This system is not:

- a new Mode system
- a Territory style taxonomy
- a global prompt preset library
- random aesthetic bundles

It is a workflow-baseline variation system.

## Ownership Model

This concept should use a layered model.

### Pools define the available IDP sets

This is the correct ownership layer because Pools already own:

- source identity
- workflow vocabulary
- initiative phrases

### Territories choose which IDP set is active

This is the correct workflow layer because Territories already represent:

- a selected creative space
- a focused use of source material

### Builder applies the selected set

This is the correct execution layer because Builder is where the active workflow is actually used.

### Modes stay separate

Modes should not own or define IDP sets.

Modes remain:

- workflow orientation

IDP sets are:

- workflow identity baselines

## Best System Sentence

Pools define identity options. Territories choose identity options. Builder applies identity options.

That is the clearest summary of the architecture.

## Conceptual Role Of IDP Sets

An IDP set should define:

- the baseline visual identity
- the baseline image-family reading
- the baseline prompt posture

It should not define:

- every detail of the final image
- all possible symbolic content
- the entire lore
- all secondary variations

That balance is important.

## Why This Is Better Than Adding More Modes

Many workflow families need:

- multiple strong baseline readings

But that does **not** necessarily mean they need:

- multiple workflow orientations

This system is better because it preserves the current distinction:

- `Modes` = how the user builds
- `IDP sets` = what baseline identity the workflow starts from

That is a healthy product boundary.

## Example

Pool:

- `Celestial Pixel Portrait`

Possible IDP sets:

- `Set 1: Celestial Shrine`
- `Set 2: Magical Idol`
- `Set 3: Occult Pastel`

These are not different modes.

They are different identity baselines inside the same workflow family.

Then a Territory may choose:

- `active set = Set 2`

Builder then applies:

- the phrases from `Set 2`

## Product Benefits

This system could provide several benefits.

### 1. Better iteration range

A workflow can generate many related versions without losing identity.

### 2. Better future compatibility

A primary workflow can stay compatible with future secondary Pools because its identity is structured but not over-locked.

### 3. Better workflow clarity

Users can choose the kind of baseline they want before they start iterating deeply.

### 4. Reduced pressure on Modes

Some needs that might otherwise be misread as new Mode needs can instead be handled by multiple IDP sets.

## Good Candidate Use Cases

This system is especially useful when:

- the workflow family is strong and recognizable
- several baseline readings inside that family are valid
- the workflow should remain compatible with future additions

Examples:

- celestial pixel portrait
- occult portrait family
- mech showcase family
- shrine / idol / regal portrait families

## Bad Candidate Use Cases

This system is weaker when:

- the workflow has no stable family identity
- the variation is only random flavor
- the need is actually about Builder orientation
- the issue is really weak Pool structure

## Design Principles

### 1. Stable family, variable baseline

The family identity should remain recognizable.
The IDP set changes the baseline reading inside that family.

### 2. Explicit choice

The user should know:

- which IDP set is active
- what phrases belong to it

This must not be hidden.

### 3. Editable outcome

Applied IDP phrases should remain editable and removable in Builder.

### 4. Modes remain separate

This concept should not be used to smuggle style-taxonomy into the mode system.

## Likely UI Direction

A natural future UI might allow:

- choosing `IDP Set 1 / 2 / 3`
- previewing the phrases in each set
- selecting the active one inside a Territory workflow or Builder-associated workflow panel

The user’s idea of a selector in the workflow area or Territory editor is consistent with this direction.

## Current Best Architectural Conclusion

This should be treated as:

- a Pool-defined feature
- with Territory-level selection
- and Builder-level application

That is the strongest current architecture.

## Final Conclusion

The Multi IDP Set System is a strong product concept because it introduces controlled baseline variation inside a workflow family without confusing that variation with Builder Modes.

It is best understood as:

- a workflow identity variation system

not:

- a new mode system
