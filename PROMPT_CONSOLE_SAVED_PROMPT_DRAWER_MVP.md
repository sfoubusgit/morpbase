# Prompt Console Saved Prompt Drawer MVP

## Purpose

This document defines the first safe implementation of the `Prompt Console + Separate Saved Prompt Drawer` direction.

The MVP should solve the current structural conflict without redesigning the whole generator.

## Core Goal

Make the active prompt area feel like a real persistent working console by removing the permanent `Saved Prompts` block from the same vertical stack.

## In Scope

### 1. Remove permanent Prompt Library block from generator right-side stack

In generator view:

- `Prompt Library` should no longer appear as a permanent block below the prompt/workflow context

This is the key structural change.

### 2. Add visible drawer trigger near prompt actions

Add a control such as:

- `Open Saved Prompts`

Recommended placement:

- near `Save Prompt` and `Copy Prompt`

The trigger should feel like a prompt-management action, not a navigation action.

### 3. Create right-side drawer for Saved Prompts

The drawer should:

- open over the generator UI from the right side
- preserve current prompt session underneath
- close easily
- not reset builder state

### 4. Render existing Prompt Library content inside the drawer

Use the existing Prompt Library functionality as much as possible.

The MVP should not rewrite prompt library logic.

It should reuse:

- local prompts
- cloud prompts
- import/export
- save modal behavior
- prompt actions

### 5. Keep prompt console visible while drawer is closed

After this change, the generator right side should primarily show:

- `Prompt Preview`
- prompt controls
- `Workflow Context`

and no longer show a permanent prompt archive block.

## Out Of Scope

Do not do these yet:

- new prompt library data model
- multi-drawer system
- two-mode right panel
- major prompt console redesign
- mobile-specific advanced drawer behavior
- new archive filtering/search systems
- moving the dedicated Prompts page

## Behavior Details

### Drawer closed

Visible:

- prompt preview
- prompt actions
- workflow context
- saved prompt trigger

### Drawer open

Visible:

- drawer panel with Prompt Library
- close control
- current generator stays underneath unchanged

### Save flow

`Save Prompt` should still work from the prompt console directly.

The drawer is for:

- viewing older prompts
- copying/reusing them
- managing prompt archive

not for replacing the main save button.

## UX Recommendation

### Trigger label

Recommended first label:

- `Open Saved Prompts`

This is clearer than something abstract like:

- `Library`

### Drawer title

Recommended:

- `Saved Prompts`

### Close action

Provide:

- close button in drawer header
- overlay click close if it feels safe

## Implementation Strategy

### Reuse before rebuilding

The MVP should reuse `PromptLibrary` rather than re-implementing it.

That means:

- move generator-view PromptLibrary rendering into a drawer container
- keep PromptLibrary page and broader system intact

### Desktop-first

Validate first on desktop, since that is where the current structural pain is strongest.

## Success Criteria

The MVP is successful if:

- prompt stays visible more consistently during active prompt work
- save remains easy to reach
- saved prompts no longer push active prompt work down the page
- the right side feels more like one active work surface

## Recommended Next Step After MVP

Only after the drawer works well should we decide whether to:

- keep Workflow Context always visible
- compress prompt controls further
- add drawer polish or secondary prompt-management refinements

## Final Recommendation

This MVP is the right next implementation target.

It is strong because it solves the core role conflict without demanding a full redesign of the rest of the generator.
