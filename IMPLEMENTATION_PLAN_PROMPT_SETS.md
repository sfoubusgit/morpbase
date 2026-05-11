# Implementation Plan Prompt Sets

## Purpose

Map the `Prompt Sets` MVP onto the current MorpBase architecture without committing to immediate implementation.

The goal is to make the feature build-ready while keeping it small and clearly scoped.

## MVP Scope

The MVP includes:

- Prompt Set entity
- prompt-to-set assignment
- Prompt Set selector inside `Save Prompt`
- lightweight inline create-new-set flow inside save modal
- Prompt Set filtering in the Prompts page

It does not include:

- nested folder structures
- multi-set assignment
- dedicated full Prompt Set page
- heavy management tooling

## Data Model

### New entity: Prompt Set

Suggested shape:

```ts
type PromptSet = {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
};
```

### Prompt changes

Saved prompts should gain:

```ts
promptSetId?: string | null;
```

Meaning:

- a prompt may belong to one Prompt Set
- or none

## Storage Model

### Local prompts

Local prompt storage must be updated so saved prompts can persist:

- `promptSetId`

### Cloud prompts

Cloud prompt storage will also eventually need:

- `promptSetId`

If cloud schema changes are out of scope for the first pass, a staged rollout could still begin with:

- local Prompt Set support first

But the cleaner long-term path is:

- local + cloud support in the same conceptual model

### Prompt Sets storage

Need:

- local Prompt Set store at minimum

Likely later:

- cloud Prompt Set persistence

## UI Implementation Areas

### 1. Save Prompt modal

Primary implementation surface:

- `src/ui/components/PromptLibrary.tsx`

Add:

- `Prompt Set` selector
- `Create new set` option
- inline create-set fields and action

### 2. Prompts page

Primary browsing/management surface:

- `src/ui/components/PromptsPage.tsx`

Add:

- Prompt Set filter
- optional visible list of existing sets
- lightweight set creation / rename / delete handling if needed here

### 3. Prompt types

Relevant shared type files:

- `src/types/...`

Need:

- Prompt Set type
- updated SavedPrompt / prompt model

## Suggested Build Order

### Phase 1. Types and storage

1. add `PromptSet` type
2. add `promptSetId` to saved prompt model
3. create Prompt Set local storage helpers
4. update prompt storage parsing/writing

### Phase 2. Save Prompt modal

1. add Prompt Set selector
2. add inline create-new-set flow
3. ensure saved prompt stores selected `promptSetId`

### Phase 3. Prompts page

1. add Prompt Set filter
2. allow browsing prompts by set
3. expose unassigned prompts view

### Phase 4. Optional refinement

1. allow reassigning a prompt to a different set
2. allow deleting a Prompt Set while preserving prompts as unassigned

## Delete Behavior

For MVP:

- deleting a Prompt Set should not delete its prompts
- prompts should become:
  - `promptSetId = null`

This is the safest default.

## Relationship To Quick Save

Prompt Sets should be implemented so Quick Save can later reuse:

- the same Prompt Set selector
- the same inline create-new-set logic

That means:

- save-modal Prompt Set UX should be built as reusable logic where possible

## Risk Areas

### 1. Overbuilding management

Do not let Prompt Sets turn into:

- a large library admin system

### 2. Mixing with Pools/Territories

Prompt Sets must stay clearly framed as:

- saved prompt organization

not:

- workflow systems

### 3. Cloud/local mismatch

Need to decide carefully whether MVP is:

- local-first
- or local + cloud together

This is an implementation decision with product consequences.

## Honest Implementation Conclusion

Prompt Sets are highly implementable in the current architecture.

They appear to be:

- much lighter than Identity Systems
- much safer than another structural UI overhaul
- and strongly compatible with the existing save / prompt-library surfaces

This makes them a very plausible near-future feature candidate.
