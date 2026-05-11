# IMPLEMENTATION PLAN: Floating Global Phrase Layer

## Purpose

This document maps the `Floating Global Phrase Layer` MVP onto the current MorpBase codebase.

The goal is to replace the current always-visible sidebar panel with a movable floating control that better reflects the layer’s role as a personal constant.

## Current Implementation

Right now the Global Phrase Layer is implemented as:

- `PromptFragmentsPanel`
- rendered in the Builder sidebar from `src/ui/App.tsx`

Relevant files:

- `src/ui/components/PromptFragmentsPanel.tsx`
- `src/ui/components/PromptFragmentsPanel.css`
- `src/data/promptFragments.ts`
- `src/ui/App.tsx`

Current behavior:

- phrase list is always visible in the sidebar
- phrases can be toggled on/off
- selected phrases are inserted into the prompt addition system

## Product Goal

Turn the Global Phrase Layer into:

- a small floating trigger
- draggable within screen bounds
- clickable to open its panel near the trigger
- persistent in position
- persistent in content

This should reduce sidebar weight and make the feature feel more personal and less structurally heavy.

## Recommended MVP Scope

### Include

- floating trigger button
- drag support on desktop
- open/close panel
- show selected phrase count on the trigger
- keep existing phrase toggle behavior unchanged
- remember last position in local storage
- remember open/closed state only per session or leave closed by default

### Exclude

- advanced docking
- snap-to-grid
- mobile drag optimization beyond safe fallback
- animation-heavy behavior
- phrase editing / custom phrase creation

## Best Implementation Strategy

### Phase 1: Keep the existing phrase logic, replace only the shell

Do **not** rewrite phrase behavior first.

Instead:

- keep `selectedPromptFragments`
- keep `handleTogglePromptFragment`
- keep existing prompt insertion behavior
- replace only the current visual container

This minimizes risk.

## Component Strategy

### Option A: Refactor `PromptFragmentsPanel` into a floating component

Pros:

- reuses the existing phrase UI
- smallest conceptual diff

Cons:

- current component is styled like a sidebar panel
- may need substantial CSS changes anyway

### Option B: Create a new wrapper component

Recommended.

Create something like:

- `FloatingPromptFragments.tsx`

That component would:

- render the floating trigger
- manage drag/open position UI state
- render the existing fragment chips inside a floating popover panel

The underlying phrase list can still be driven by the same fragment definitions and toggle callback.

This is cleaner than mutating the current sidebar-only component directly.

## Likely Files

### New file

- `src/ui/components/FloatingPromptFragments.tsx`
- `src/ui/components/FloatingPromptFragments.css`

### Existing files to update

- `src/ui/App.tsx`
  - replace sidebar `PromptFragmentsPanel` usage with floating component
  - pass selected fragment IDs and toggle handler

Possibly:

- `src/ui/components/PromptFragmentsPanel.tsx`
  - either keep for internal reuse, or deprecate later

## State Model

### Existing state to keep

From `App.tsx`:

- `selectedPromptFragments`
- `handleTogglePromptFragment`

### New UI state needed

Likely inside the new floating component or in `App.tsx` if shared state is preferred:

- `isOpen`
- `positionX`
- `positionY`
- maybe `isDragging`

### Persistence

Recommended MVP persistence:

- `positionX`
- `positionY`

stored in local storage, something like:

- `morpbase:global_phrase_position`

Open/closed state does not need persistence yet unless it feels important.

## Positioning Rules

### Default placement

Start with a safe default such as:

- lower-right quadrant of the Builder area
- or lower-right viewport edge with padding

### Bounds

The trigger should stay within viewport-safe bounds.

Minimum MVP behavior:

- prevent dragging fully off-screen
- keep some visible margin at all times

### Panel open behavior

The panel should open adjacent to the trigger.

MVP behavior can be simple:

- open above or to the left if near the right edge
- otherwise open to the side

This does not need a full smart-placement engine in v1.

## Trigger Design

The floating trigger should show:

- label or icon for Global Phrase Layer
- selected count if count > 0

Example:

- `Global Layer`
- or `Global (2)`

The trigger should remain compact.

## Panel Design

The opened panel should contain:

- title: `Global Phrase Layer`
- short helper copy
- existing chip list

This can reuse most of the current content from `PromptFragmentsPanel`.

## Mobile / Small Screen Behavior

For MVP:

- allow the trigger to stay fixed in a safe default position
- optionally disable drag on very small screens if needed

The important thing is not to ship a broken mobile drag experience.

So a safe fallback is acceptable.

## CSS / UX Considerations

The floating version should:

- feel lighter than the sidebar version
- not block major Builder controls
- not visually dominate the screen
- still look intentional and on-brand

The panel should feel like a workspace tool, not a toy.

## Migration / Cleanup Strategy

### First implementation

- leave `PromptFragmentsPanel.tsx` alone if reuse is easier
- stop rendering it in the sidebar
- render the floating component instead

### Later cleanup

After the floating version is stable, decide whether:

- to delete `PromptFragmentsPanel`
- or keep it as an internal subcomponent for the floating panel body

## Risks

### 1. Drag UI feels gimmicky

Mitigation:

- keep motion restrained
- keep visuals minimal

### 2. Panel obscures important workflow areas

Mitigation:

- sensible default placement
- basic bounds
- small trigger footprint

### 3. State complexity grows too fast

Mitigation:

- keep phrase logic unchanged
- add only UI-shell state first

### 4. Mobile behavior is awkward

Mitigation:

- use a simpler anchored fallback on small screens if needed

## Recommended Build Order

1. create `FloatingPromptFragments` shell
2. implement compact trigger
3. implement open/close panel with current chip list
4. add drag behavior
5. add bounded position persistence
6. remove old sidebar placement
7. test desktop and small-screen behavior

## Final Recommendation

This is a good candidate for implementation because:

- the current Global Phrase Layer is self-contained
- the floating metaphor matches the feature role well
- the existing logic can be preserved while only the shell changes

So the recommended path is:

- lightweight UI-shell refactor
- not logic rewrite

That gives MorpBase a more personal and playful interaction without destabilizing the workflow system.
