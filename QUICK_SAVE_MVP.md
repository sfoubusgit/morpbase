# Quick Save MVP

## Purpose

This document defines the MVP for a `Quick Save` function beside the normal `Save Prompt` action.

The goal is to let users capture prompt iterations made outside the current MorpBase builder flow quickly and with low friction.

## Core Problem

The current `Save Prompt` flow assumes the user is saving:

- the current prompt built inside MorpBase

But in real use, users often:

- tweak prompts externally
- generate iterations elsewhere
- want to bring a result back into MorpBase quickly
- do not want to fill the full current save form just to archive one variation

## Core Idea

Split the current save capability into two neighboring actions:

- `Save Prompt`
- `Quick Save`

### `Save Prompt`

Keeps its current job:

- save the current prompt from the active MorpBase session

### `Quick Save`

Adds a new job:

- quickly save an external or manually pasted prompt iteration

## Recommended Placement

`Quick Save` should appear next to `Save Prompt` in the Prompt Preview action area.

Reason:

- both are save-related actions
- users will look there first
- it makes the distinction clear without scattering prompt-management actions

## MVP Behavior

Clicking `Quick Save` opens a small modal.

### Required fields

- `Prompt Name`
- `Prompt Text`

### Optional field

- `Negative Prompt`

### Save actions

- `Save Locally`
- `Save to Cloud`

That is enough for the MVP.

## Out Of Scope For MVP

Do not require full metadata here:

- tags
- model
- purpose
- note

Do not add these yet:

- prompt parsing
- prompt validation beyond basic non-empty checks
- tagging system for quick save
- automatic import into current prompt

The point is speed.

## Why This Should Stay Smaller Than Save Prompt

Because `Quick Save` exists for:

- fast capture
- external iterations
- low-friction archiving

If it becomes another full metadata form, it loses its purpose.

## Save Targets

The MVP should still support both:

- local save
- cloud save

Why:

- users may want speed, but still want the same storage options

## Validation Rules

### Required

- name must not be empty
- prompt text must not be empty

### Optional

- negative prompt may be empty

## Suggested UX Copy

### Button label

- `Quick Save`

### Modal title

- `Quick Save Prompt`

### Short helper copy

- `Paste a prompt iteration and save it quickly without filling the full prompt form.`

## Why This Is Strong

This feature supports an important real behavior:

- MorpBase is not only for building prompts from scratch
- it can also become a place to collect and organize prompt iterations made elsewhere

That makes the system more useful as a workflow hub.

## Risks

### 1. Overlap with normal Save Prompt

Mitigation:

- keep the difference explicit:
  - `Save Prompt` = current prompt
  - `Quick Save` = pasted external iteration

### 2. Too much complexity in one area

Mitigation:

- keep the modal minimal
- do not add metadata-heavy fields in v1

### 3. Quick Save becomes a hidden import system

Mitigation:

- frame it clearly as save/capture, not prompt injection

## Success Criteria

The MVP is successful if users can:

- paste a prompt variation quickly
- give it a name
- save it without friction
- feel that MorpBase supports iteration capture beyond the current live session

## Final Recommendation

This is a good small feature candidate.

It fits the real workflow well and adds practical value without requiring a new major system.
