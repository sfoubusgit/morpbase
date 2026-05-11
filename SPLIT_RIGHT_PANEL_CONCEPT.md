## Split Right Panel Concept

### Why This Exists

The current right-side Builder experience creates friction because it behaves too much like a long stacked column.

In practice, the user wants:

- the prompt to stay visible all the time
- save to stay reachable all the time
- less scrolling up and down through mixed-purpose content

This suggests the right side should be treated less like a content stack and more like a working console.

## Core Idea

Use a **Split Right Panel**:

### Upper zone

- persistent prompt area
- save / copy / edit / clear / export controls

### Lower zone

- scrollable support area
- workflow context
- prompt sources
- saved prompts

This preserves the existing systems but gives them a clearer hierarchy.

## Main Principle

The prompt is the primary object.

Everything else on the right should support:

- building it
- understanding it
- saving it
- reusing it

The current issue is that support content can compete too much with the prompt.

## Proposed Structure

### Top fixed zone

Contains:

- Prompt Preview
- Save Prompt
- Copy Prompt
- Edit Output
- Undo
- Clear
- Export Mode

This area should remain visible while the user works.

### Bottom scroll zone

Contains:

- Workflow Context
- Prompt Sources
- Saved Prompts

This area can scroll normally without taking the prompt out of view.

## Why This Is Strong

### 1. Matches actual use

The prompt is what the user is ultimately building toward.

So it should feel:

- anchored
- central
- always reachable

### 2. Solves save friction directly

Save becomes part of the persistent prompt console, not another thing the user has to go find.

### 3. Avoids adding new interface modes

Unlike a two-mode right panel, this does not add:

- another state
- another switch
- another mental branch

### 4. Keeps support material available without letting it dominate

Workflow Context and Saved Prompts still matter.
They just become clearly secondary.

## Risks

### 1. The fixed zone could become too tall

If too much is kept permanently visible, the “persistent” area can start crowding the rest of the viewport.

This means the top zone should be compact and disciplined.

### 2. Saved Prompts may feel more secondary than before

That is probably acceptable, but it should be recognized.

The product would be more clearly prioritizing:

- current prompt workflow

over:

- prompt archive browsing

### 3. Responsive behavior will need care

Desktop and smaller screens may need different behavior.

This concept is strongest on desktop first.

## Best First Version

The MVP version should be simple:

- make Prompt Preview and its action controls the fixed upper zone
- move Workflow Context and Prompt Library into the lower scrollable support zone
- do not redesign every component at once

This keeps the test focused on structure.

## Why This Is Better Than Two-Mode First

The two-mode idea is attractive, but it introduces new state complexity.

Split Right Panel is a better first move because it solves the current pain:

- prompt visibility
- action reachability

without adding a new conceptual system.

## One-Line Conclusion

The right side should evolve into a split working console where the prompt and its core actions remain persistently visible while workflow context and prompt library content live in a secondary scrollable support area.
