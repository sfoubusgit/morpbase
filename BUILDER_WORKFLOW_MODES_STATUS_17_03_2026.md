# Builder Workflow Modes Status

## Date

17 March 2026

## Purpose

This note captures the current real state of Builder Workflow Modes after implementation, runtime testing, and Territory-biased navigation fixes.

It is meant to prevent conceptual drift and to document what is actually true in the product right now.

## Current Status

Builder Workflow Modes are now implemented as a real Builder-layer workflow system.

The feature is no longer just conceptual or cosmetic.

At this point, Modes affect:

- visible Builder mode selection
- mode-specific sidebar grouping
- mode-specific guidance text
- mode-aware Builder traversal
- mode-aware suggested category behavior
- mode persistence across refresh

## Active Mode Set

Current implemented set:

- `Balanced`
- `Character-First`
- `Environment-First`
- `Scene-First`

Deferred:

- `Object-First`

## What Is Working

### Builder-level behavior

The following are now working together as one system:

- mode selector in the sidebar
- mode description in the sidebar
- mode-specific `Define / Refine / Finish` grouping
- mode-aware `Next`
- non-destructive mode switching
- persistence of selected mode

### Territory coexistence

Territories now coexist with Modes in a coherent way.

In `Full Builder`:

- the full Builder remains visible
- Territory-relevant areas are highlighted

In `Territory-biased`:

- the sidebar is limited to Territory-mapped Builder areas
- `Next` jumps between Territory-mapped Builder categories
- the sequence of those categories still respects the active Builder mode order

This is the important current behavior:

`Territory-biased` is not normal subcategory traversal with a Territory skin.

It is now a distinct navigation behavior.

## Important Current Product Truth

Builder Workflow Modes are currently:

- Builder-first
- workflow-oriented
- reversible
- structurally independent from Pool identity
- structurally independent from Territory identity

They are not currently:

- a whole-product taxonomy
- a property of Pools
- a property of Territories
- a saved prompt identity system
- a prompt-engine behavior system

## Known Boundaries

### 1. Modes are still a Builder-layer feature

This is intentional.

The concept is strongest and most honest here.

### 2. Territory-biased mode is category-level

This means:

- `Next` is category-jumping in biased mode
- it does not attempt to preserve ordinary deep subcategory traversal there

This should be understood as part of the design, not as an accidental side effect.

### 3. Territory creation still depends on sectioned pools

The Territory composer requires Pools with sectioned items.

This is now explained more clearly in the UI, but it remains a real requirement.

### 4. The broader repo still contains language drift

Modes are in a tighter and more coherent state than some older docs and product copy.

Examples:

- some manual text still reflects older `Working Sets` framing
- some older documents predate the tightened Builder-only Modes framing

This does not block current use, but it remains cleanup work.

## What Changed During Runtime Fixing

The most important implementation correction was this:

Early versions of the feature made Territory-biased navigation look mode-aware while still walking the normal subcategory stream underneath.

That was conceptually dishonest.

The fix changed Territory-biased `Next` so that it now:

- moves between Territory-mapped Builder categories
- uses the active mode order as the base ordering logic
- exposes that behavior clearly in the UI

This was the key correction that made the system feel coherent.

## Recommended Next Phase

The next phase should be stabilization, not expansion.

That means:

- avoid adding more modes immediately
- avoid broadening Modes into other systems too quickly
- prefer cleanup, QA, and documentation alignment

Recommended priorities:

1. keep testing existing modes in real workflows
2. use the Mode Elasticity Test before proposing additional modes
3. clean up product-language drift in older manuals/docs
4. avoid structural expansion unless a real workflow gap appears

## Current Verdict

Builder Workflow Modes are now in a credible first implementation state.

The system is:

- conceptually coherent
- behaviorally real
- Territory-compatible
- ready for continued testing and refinement

It should now be treated as:

- a live Builder feature

not:

- an unresolved concept draft
