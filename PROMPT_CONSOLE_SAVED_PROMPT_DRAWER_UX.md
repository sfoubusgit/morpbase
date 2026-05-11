# Prompt Console And Saved Prompt Drawer UX

## Purpose

This document defines the strongest current right-side restructuring direction for MorpBase.

The goal is to resolve the still-active conflict between:

- active prompt work
- saved prompt archive / retrieval

The prompt should remain visible and usable as the central working object.
Saved prompts should remain accessible without competing for the same vertical workspace.

## Core Problem

The current stacked right-side structure still creates friction even after multiple refinements.

User feedback indicates:

- the prompt is not always visible when the user is in the saved prompts area
- save is not always reachable without scrolling
- the right side still does not fully feel like a persistent working console

This suggests the deeper issue is structural, not just spacing or wording.

## Recommended Direction

## `Prompt Console + Separate Saved Prompt Drawer`

### Core idea

The active prompt workspace and the saved prompt archive should stop living in the same continuous vertical flow.

Instead:

- the right side remains the active prompt console
- saved prompts open in a separate drawer/panel when needed

This preserves quick access while removing the direct layout competition.

## Desired Mental Model

### Prompt Console

This is the user’s active work surface.
It should contain only things directly relevant to the current prompt session.

### Saved Prompt Drawer

This is an archive/retrieval surface.
It is related to the current session, but it is not the current session.

That distinction is important.

## Prompt Console Contents

The permanent right-side console should include:

- `Prompt Preview`
- prompt controls:
  - `Export Mode`
  - `Edit Output`
  - `Undo`
  - `Clear`
- final actions:
  - `Save Prompt`
  - `Copy Prompt`
- possibly `Workflow Context`

### Recommendation on Workflow Context

Keep `Workflow Context` visible in the console, but visually lighter than the prompt itself.
It is supportive context, not the main artifact.

## Saved Prompt Access

Saved prompts should no longer be a full permanent block under the prompt.

Instead, there should be a trigger such as:

- `Open Saved Prompts`
- or `Prompt Library`

### Preferred location

Near the save/copy area, because that is where prompt-management intent already lives.

Example placement:

- below `Save Prompt`
- or as a smaller tertiary control in the prompt action area

## Drawer Behavior

### Open behavior

When triggered, the Saved Prompt Drawer opens as a separate panel.

Possible directions:

- slide in from the right
- or open as an overlay panel anchored to the right side

### Recommendation

Use a right-side overlay drawer.

Why:

- preserves current page context
- keeps it feeling connected to the prompt workspace
- does not force a page change
- cleaner than squeezing it into the existing right-column stack

## Drawer Contents

The drawer should contain:

- `Local Prompts`
- optionally `Cloud Prompts`
- prompt actions per item:
  - `Copy`
  - `Add to Prompt`
  - `Delete`
  - `Save to Cloud` for local items where relevant
- prompt library import/export tools if they still belong here

## Default Drawer State

Closed by default.

Why:

- the user’s current prompt should dominate by default
- saved prompts are supportive, not primary

## What Should Stay Visible Even When Drawer Is Closed

At minimum:

- current prompt
- save
- copy

Those are the non-negotiable core controls.

## Visual Priority

### Highest priority

- Prompt Preview
- Save Prompt
- Copy Prompt

### Medium priority

- edit / undo / clear
- export mode

### Lower priority

- workflow context
- saved prompt archive access

This hierarchy should be reflected visually.

## Why This Is Better Than Keeping Saved Prompts In The Same Stack

Because the current issue is not just list length.
It is role conflict.

The active prompt and the saved prompt archive represent different activities:

- creating / refining now
- retrieving / managing older work

The UI should respect that.

## Why This Is Better Than A Two-Mode Right Panel

A two-mode right panel would introduce another active state the user has to manage.

This drawer approach avoids that.

It lets the user:

- keep a stable prompt console
- open prompt history when needed
- close it and return immediately to the same active workspace

That is cleaner.

## Risks

### 1. The drawer feels too hidden

Mitigation:

- keep the trigger visible and obvious
- place it close to save/copy

### 2. Saved prompts feel one step less immediate

Mitigation:

- use a fast drawer open animation
- keep actions inside the drawer efficient

### 3. Drawer clutter simply replaces right-column clutter

Mitigation:

- keep the drawer itself compact and well structured
- local prompts recent-first by default still remains a good rule

## MVP Recommendation

For the first implementation:

1. remove the permanent `Saved Prompts` block from the right-side stack in generator view
2. add a visible `Open Saved Prompts` trigger near prompt actions
3. open the current Prompt Library content in a right-side drawer
4. keep the drawer closeable without losing current prompt state
5. preserve the current Prompt Library page / broader access patterns elsewhere if needed

## Success Criteria

The change is successful if:

- the prompt stays visible during normal prompt work
- save is always reachable without scrolling away from the prompt
- saved prompts remain easy to access
- the right side feels more like one active workspace and less like a tall mixed-content column

## Final Recommendation

This is the strongest current structural direction for the generator right side.

Not because it is visually fancier, but because it cleanly separates:

- current prompt work
- prompt archive / retrieval

That separation appears to be the real missing move.
