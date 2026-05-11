# Prompt Sets UI Placement

## Purpose

Define where `Prompt Sets` should live in the MorpBase UI for the MVP.

The goal is to make Prompt Sets feel like a natural extension of saved-prompt workflow, not like a new generic file-management subsystem.

## Core Principle

Prompt Sets belong to:

- prompt saving
- prompt browsing
- prompt retrieval

They do **not** belong to:

- Builder structure
- Pools
- Territories
- Workflow Context

So the UI placement should stay close to:

- `Save Prompt`
- `Quick Save` later
- `Prompts` page / saved prompt library

## Best MVP Placement

### 1. Save Prompt flow

This is the most important placement.

The save prompt window should include:

- a lightweight `Prompt Set` selector

The user should be able to:

- leave the prompt unassigned
- choose an existing Prompt Set

This is where Prompt Sets first become practically meaningful.

### 2. Prompts page

This should be the main browsing and management surface for Prompt Sets.

The Prompts page should likely get:

- a simple set filter
- maybe a visible list of existing sets
- maybe a small create-set action

This is the right place because:

- prompts are already the subject there
- Prompt Sets are about saved prompt organization

### 3. Quick Save later

Even if Quick Save is not built yet, the intended placement should already be clear:

- Quick Save should include the same Prompt Set selector as Save Prompt

This keeps the model unified.

## What Should Not Happen

### Not in Builder main flow

Prompt Sets should not appear as:

- a Builder mode
- a Builder block
- a workflow panel

That would be the wrong conceptual level.

### Not in Workflow Context

Prompt Sets are not part of:

- current prompt generation logic
- Pool/Territory logic
- active workflow shaping

So they should not sit inside:

- `Active Workflow`
- `Workflow Context`

### Not as a separate top-level page first

A dedicated `Prompt Sets` page would be too much for the MVP.

At MVP stage, they should live inside:

- save flow
- prompts library flow

Only later, if the system grows, could a stronger set-management surface become justified.

## Best User Journey

The cleanest first user journey is:

1. user creates or edits a prompt
2. user presses `Save Prompt`
3. save modal includes optional Prompt Set choice
4. user later goes to `Prompts`
5. user filters or browses by Prompt Set

That is the most natural shape.

## Optional Small Management Entry

If needed, the Prompts page could include:

- `Manage Prompt Sets`

But for MVP, even that may be more than necessary.

The first version may be better as:

- create set inside save flow
- filter by set inside Prompts page

That is enough.

## Honest Placement Conclusion

For the MVP, Prompt Sets should primarily live in:

1. the save prompt flow
2. the Prompts page

That is the cleanest and least disruptive placement.

They should not be treated as:

- Builder content
- workflow logic
- a separate full app section

They are best understood as a saved-prompt organization layer.
