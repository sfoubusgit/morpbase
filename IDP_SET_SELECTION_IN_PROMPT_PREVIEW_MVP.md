# IDP Set Selection In Prompt Preview MVP

## Purpose

This document defines the smallest real implementation of IDP-set selection from Prompt Preview.

It follows the behavior model in `IDP_SET_SELECTION_IN_PROMPT_PREVIEW.md` but keeps the first version disciplined.

## MVP Goal

Let the user choose among already-defined IDP sets from Prompt Preview when the active workflow exposes them.

This should feel:

- visible
- reversible
- useful for iteration
- clearly separate from editing Pool data

## MVP Includes

### 1. Prompt Preview selector

Prompt Preview shows an `Active IDP Set` block when the current active workflow has available IDP sets.

The block includes:

- active set selector
- current set name
- selected set phrase preview

### 2. Selection only

The user can:

- choose among existing IDP sets

The user cannot from Prompt Preview:

- create a set
- rename a set
- edit a set
- delete a set

### 3. Visible baseline swapping

When the user chooses a different IDP set:

- the active baseline additions for that workflow update visibly
- the selected set becomes the active session baseline
- the phrase swap is reversible

### 4. Session-level scope

For MVP, the active IDP set is session-level only.

That means:

- it does not need Territory persistence yet
- it does not need saved-prompt persistence yet
- it only needs to work in the current live Builder session

## MVP Does Not Include

- Territory-level remembered IDP-set selection
- Pool editing of sets from Prompt Preview
- Mode interaction
- prompt-engine special logic
- rewriting arbitrary freeform user edits

## Ownership Model

Even in MVP, ownership remains:

- Pools define the sets
- Prompt Preview selects the active one
- Builder applies the selected baseline additions

This keeps the architecture honest.

## UX Rule

The selector should read like:

- `Active IDP Set`
- `Choose the current identity baseline for this workflow family.`

It should not read like:

- `Style Preset`
- `Theme Switch`
- `Mode`

## First Good Target

The first real target for this MVP is:

- `Celestial Pixel Portrait`

Because it already has:

- visible IDP sets
- a strong workflow identity
- a meaningful 3-set family

## Success Criteria

The MVP succeeds if:

1. the user can discover the selector easily
2. set switching feels safe and reversible
3. the selected baseline becomes visible in the prompt-building flow
4. the feature helps iteration without creating confusion about ownership

## Final Summary

The MVP is:

- Prompt Preview selector
- read-only set definitions
- session-level active-set switching
- visible baseline phrase swapping

That is enough to make the feature real without overbuilding it.
