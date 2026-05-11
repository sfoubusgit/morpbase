# Prompt Set Save Modal UX

## Purpose

Define the exact MVP UX shape for using `Prompt Sets` inside the `Save Prompt` modal.

The goal is:

- keep saving primary
- make Prompt Set assignment easy
- allow lightweight set creation without turning the modal into a management screen

## Core UX Principle

The `Save Prompt` modal is still a save modal first.

Prompt Sets should appear as:

- a helpful contextual field

not:

- the main event

## Recommended Field Placement

Inside the save modal, place `Prompt Set` after:

- `Prompt Name`

and before:

- tags / model / purpose / note

Why:

- it is more important than secondary metadata
- but less primary than the prompt name itself

## Recommended Field Behavior

### Prompt Set selector

Field:

- `Prompt Set`

Options:

- `No set`
- existing sets
- `Create new set`

This should be:

- simple
- compact
- low-friction

## Inline Creation Flow

If the user selects:

- `Create new set`

then reveal a small inline block directly beneath the selector:

- `Set name`
- optional `Set description`

Actions:

- `Create set`
- `Cancel`

On successful creation:

- the new set becomes selected automatically
- the inline creation area closes
- the user stays in the save modal

This is the ideal outcome.

## Why Inline Is Better

Inline creation is better than:

- opening another modal
- leaving the save flow
- opening a big management panel

Because the user’s real task is still:

- save this prompt

The set creation should feel like:

- one small supporting step

## Best Save Flow Example

1. user clicks `Save Prompt`
2. enters prompt name
3. sees `Prompt Set`
4. chooses `Create new set`
5. types `Gothic Portrait Tests`
6. presses `Create set`
7. new set becomes selected
8. presses `Save Locally` or `Save to Cloud`

That feels natural.

## What To Avoid

Avoid:

- showing all Prompt Set management inside the save modal
- rename/delete controls there
- large set browser UI
- nested complexity

That belongs later, if needed, in the Prompts page.

## Relationship To Quick Save

This same UX pattern should later be reusable for:

- `Quick Save`

Meaning:

- Quick Save can use the same Prompt Set selector
- and the same inline create-new-set behavior

That would keep the prompt-save model consistent.

## Honest UX Conclusion

The strongest MVP save-modal UX is:

1. `Prompt Name`
2. `Prompt Set` selector
3. optional inline `Create new set`
4. remaining metadata fields
5. save action

That is likely the cleanest balance between usefulness and restraint.
