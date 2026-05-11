# Prompt Sets MVP

## Purpose

Define the first safe implementation shape for `Prompt Sets`.

The goal is to prove that saved prompts benefit from meaningful grouping without turning MorpBase into a full file-management system.

## Core MVP Goal

Allow users to:

- create simple Prompt Sets
- assign saved prompts to a Prompt Set
- assign quick-saved prompts to a Prompt Set later
- filter or browse saved prompts by Prompt Set

That is enough to prove the value.

## What The MVP Should Include

### 1. Prompt Set entity

Each Prompt Set should have:

- `id`
- `name`
- optional `description`
- `createdAt`
- `updatedAt`

That is enough for a first version.

### 2. Prompt-to-set assignment

Saved prompts should gain:

- `promptSetId?: string | null`

Meaning:

- a prompt may belong to one set
- or to no set

For the MVP, a prompt should belong to:

- zero or one Prompt Set

Not:

- many sets

### 3. Save flow support

When saving a prompt, the save UI should allow:

- no set
- or choose an existing Prompt Set

The field should be:

- optional
- lightweight
- not visually dominant

### 4. Prompt library filtering

The Prompts view should allow:

- filter by Prompt Set
- show all prompts
- show only unassigned prompts

This is the minimum needed to make sets actually useful.

### 5. Basic set management

Users should be able to:

- create a Prompt Set
- rename a Prompt Set
- delete a Prompt Set

For MVP delete behavior:

- deleting a set should not delete prompts
- prompts should become unassigned

That is the safest behavior.

## What The MVP Should Not Include

Do not include yet:

- nested folders
- drag-and-drop hierarchy
- prompts in multiple sets
- smart auto-grouping
- AI-generated set suggestions
- set colors, icons, covers, or elaborate visual identity
- set-level sharing
- set permissions

That would be too much too early.

## Relationship To Quick Save

The MVP should be designed with `Quick Save` in mind, even if Quick Save is not built at the same moment.

Meaning:

- Prompt Sets should already be a simple selectable destination in the save model
- later, Quick Save can plug into the same set selector

This keeps the architecture clean.

## Best UX Reading

Prompt Sets should feel like:

- a saved-prompt context layer

Not:

- a major new app mode
- a replacement for Pools
- a replacement for Territories

## Best First User Value

The first version should let a user say:

- this prompt belongs to `Gothic Portrait Tests`
- this one belongs to `ComfyUI External Iterations`
- this one belongs to `Celestial Shrine Variants`

That alone will make the archive feel much more intentional.

## Honest MVP Conclusion

The MVP should stay very small:

1. create Prompt Sets
2. assign prompts to one set
3. filter prompts by set
4. leave everything else out

That is enough to prove whether the concept improves saved-prompt workflow in a meaningful way.
