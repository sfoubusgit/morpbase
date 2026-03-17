# QA Checklist: Builder Workflow Modes

## Purpose

This checklist is for practical runtime validation of the first Builder Workflow Modes implementation.

It is designed to verify:

- mode-aware Builder behavior
- mode-aware navigation integrity
- Territory coexistence
- absence of destructive side effects

## Test Setup

Recommended baseline:

- use a clean Builder state first
- test with no active Territory
- then repeat key checks with an active Territory

Mode set to test:

- `Balanced`
- `Character-First`
- `Environment-First`
- `Scene-First`

## Core Checks

### 1. Mode Selector Visibility

Verify:

- the mode selector appears in the Builder sidebar
- the current mode label is visible
- the current mode description is visible
- switching the selector updates the visible mode immediately

### 2. Sidebar Grouping Changes

Verify for each mode:

- `Define`, `Refine`, and `Finish` group contents change according to the mode config
- the changes are noticeable, not purely cosmetic
- the sidebar still renders correctly with expand/collapse behavior

### 3. Suggested Category Signal

Verify:

- a `Suggested` badge appears on one category at a time when appropriate
- the suggested category changes when mode changes
- the suggested category changes as selections accumulate

### 4. Navigation Order Changes

Verify:

- clicking `Next` follows the active mode-aware order
- `Balanced` feels neutral
- `Character-First` reaches character-relevant areas earlier
- `Environment-First` reaches environment-relevant areas earlier
- `Scene-First` reaches subject/environment/action interplay earlier

### 5. Non-Destructive Mode Switching

Verify:

- switching mode does not clear selections
- switching mode does not clear modifiers
- switching mode does not clear edited selection output overrides
- switching mode does not clear prompt additions
- switching mode does not reset Prompt Preview content unexpectedly

### 6. Current Node Behavior On Mode Switch

Verify:

- switching mode feels stable
- the current Builder step does not jump unpredictably
- when repositioning happens, it feels understandable rather than random

### 7. Start Over / Review Integrity

Verify:

- `Start Over` uses the correct mode-aware starting path
- `Review` still works without breaking mode state
- completion/reset logic remains intact

### 8. Local Persistence

Verify:

- active Builder mode persists after refresh
- persisted mode restores the correct sidebar grouping and guidance

## Territory Coexistence Checks

### 9. Territory Sidebar Coexistence

With an active Territory:

- mode controls remain visible
- Territory info remains visible
- neither system visually suppresses the other

### 10. Territory-Biased Navigation

With Territory navigation set to `biased`:

- `Next` moves between Territory-mapped Builder categories rather than walking the normal subcategory stream
- the sequence of Territory categories still reflects the active Builder mode order underneath
- the current step lands in a sensible first usable node for each Territory category
- switching to `Full Builder` restores ordinary Builder traversal while keeping Territory highlighting

### 11. Territory Highlighting

Verify:

- Territory-relevant categories still highlight correctly
- suggested mode category does not break Territory badges
- in `biased`, the suggested category aligns with the next Territory-mapped Builder area
- both visual cues can coexist

## Error And Edge Checks

### 12. Empty Or Limited Builder State

Verify:

- no crash when usable Builder nodes are limited
- unavailable-section fallback still works
- `Go to Next Available Section` still behaves sensibly

### 13. Mode Switching With Few Selections

Verify:

- switching mode early in a session feels helpful
- switching mode with no selections does not create weird navigation history

### 14. Mode Switching Mid-Progress

Verify:

- switching mode after several steps does not corrupt navigation history
- back navigation still works
- completion state does not trigger incorrectly

## Visual Quality Checks

### 15. Sidebar Layout

Verify:

- mode description fits without awkward wrapping
- selector spacing looks intentional
- `Suggested`, `Advanced`, and `Territory` badges do not visually clash

## Pass Criteria

Builder Workflow Modes v1 is behaving credibly if:

1. mode changes are visible
2. mode changes affect real navigation behavior
3. Territory coexistence still feels coherent
4. switching modes is safe and non-destructive
5. the feature helps orientation instead of adding confusion
6. Territory-biased navigation feels intentional rather than like hidden standard Builder traversal
