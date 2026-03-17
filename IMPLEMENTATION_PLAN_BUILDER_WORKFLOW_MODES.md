# Implementation Plan: Builder Workflow Modes

## Status

Implementation plan for the tightened Builder-only Modes concept.

This plan is intentionally constrained by:

- [BUILDER_WORKFLOW_MODES_CONCEPT.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/BUILDER_WORKFLOW_MODES_CONCEPT.md)
- [MODES_SCOPE_AND_LIMITS.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/MODES_SCOPE_AND_LIMITS.md)

The plan assumes:

- Modes are Builder-only in first scope
- launch set is `Balanced`, `Character-First`, `Environment-First`, `Scene-First`
- mode-aware navigation is mandatory for concept integrity
- Pools and Territories remain structurally independent from hard Mode identity

## Goal

Add Builder Workflow Modes to MorpBase in a way that:

- changes real Builder behavior, not just visual order
- preserves the existing Builder architecture
- keeps Territories compatible
- avoids changing the prompt engine
- avoids spillover into Pools, Territories, Hub, or saved prompts

## Non-Goals

Do not include in this implementation:

- prompt engine changes
- Mode-aware Pool compatibility
- Mode-aware Territory identity
- Mode-aware Hub or discovery behavior
- saved prompt schema changes
- `Object-First`

## Current Technical Reality

The current implementation center is [App.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx).

Important constraints:

- category order is hardcoded via `CATEGORY_ORDER`
- usable node order is derived from that order
- `Next` depends on that ordered usable-node sequence
- territory biasing already modifies navigation and start-node logic
- `CategorySidebar` is currently driven by fixed stage definitions in [CategorySidebar.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/CategorySidebar.tsx)
- `QuestionCard` currently receives Builder state but not workflow-mode context in [QuestionCard.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/QuestionCard.tsx)

This means Modes cannot be added safely as a purely presentational feature.

## Implementation Strategy

Build Modes as a configuration-driven Builder layer.

The main idea:

1. define a typed mode config model
2. derive mode-aware category order and stage groupings from config
3. derive mode-aware usable node order from that category order
4. make `Next` and related navigation consume the mode-aware ordered nodes
5. make `CategorySidebar` render mode-aware groups and helper copy
6. expose current mode in Builder UI with live switching
7. add light Suggested next behavior

## Phase 1: Add Mode Configuration Layer

### Goal

Create a single source of truth for launch modes and their Builder behavior.

### New files

- `src/types/builderModes.ts`
- `src/data/builderModes.ts`

### Suggested type shape

`BuilderModeId`

- `balanced`
- `character-first`
- `environment-first`
- `scene-first`

`BuilderStageId`

- `define`
- `refine`
- `finish`

`BuilderModeConfig`

- `id`
- `label`
- `description`
- `categoryOrder`
- `stageGroups`
- `suggestedNextOrder`
- `startCategoryId`

### Why this phase matters

It removes the first major integrity problem:

- hardcoded order in multiple places

and replaces it with:

- one declarative source of workflow truth

## Phase 2: Refactor App-Level Navigation To Be Mode-Aware

### Goal

Make Builder navigation actually follow the active Mode.

### Primary file

- [App.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)

### Core changes

Replace direct reliance on hardcoded `CATEGORY_ORDER` for Builder navigation with:

- `activeModeConfig.categoryOrder`

Then update the functions that derive order-sensitive behavior:

- `getAllSubcategoryNodeIds`
- `usableNodeIds`
- `getAdjacentUsableNodeId`
- `getInitialUsableNodeId`
- `handleNavigateNext`
- `handleReview`
- Builder start/reset behavior

### Important requirement

Territory behavior must continue to work.

That means:

- territory bias remains a secondary layer over mode-aware usable-node ordering
- mode order should become the base ordered path
- territory-biased traversal should continue to prefer relevant nodes within that path

### Integrity checkpoint

At the end of this phase:

- changing Mode must change `Next`
- changing Mode must change Builder start bias
- territory bias must still function

## Phase 3: Add Mode State To Builder

### Goal

Store and expose the active Builder mode in `App.tsx`.

### Primary file

- [App.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)

### State additions

- `activeBuilderMode`

Recommended default:

- `balanced`

### Behavior

Changing Mode should:

- not clear selections
- not clear modifiers
- not clear Territory state
- recompute mode-aware order
- update current node only if needed to keep Builder on a usable node

### Optional v1 persistence

May store active mode in local storage if low-friction.

This is acceptable because it stays within Builder/session context and does not create schema obligations.

## Phase 4: Make Category Sidebar Mode-Aware

### Goal

Ensure the sidebar reflects the active Mode truthfully.

### Primary file

- [CategorySidebar.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/CategorySidebar.tsx)

### Needed changes

Move current fixed `CATEGORY_STAGES` behavior toward props-driven configuration:

- `modeLabel`
- `modeDescription`
- `stageDefinitions`
- optional `suggestedCategoryId`

The sidebar should display:

- current mode label
- one-line mode explanation
- mode-aware `Define / Refine / Finish` composition
- optional “Suggested next” indicator

### Important note

Do not let the sidebar independently decide mode logic.

It should render from mode-aware config supplied by `App.tsx`.

## Phase 5: Add Mode UI Controls In Builder

### Goal

Give users a visible, reversible way to switch Modes.

### Primary files

- [App.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)
- [App.css](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.css)
- possibly [CategorySidebar.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/CategorySidebar.tsx)

### Recommended UI shape

Place the selector in the Builder sidebar or Builder header, not as a separate page-level wizard.

Launch options:

- `Balanced`
- `Character-First`
- `Environment-First`
- `Scene-First`

### Required UX behavior

- instant switching
- no destructive reset
- clear but lightweight messaging

## Phase 6: Add Suggested Next Logic

### Goal

Make Modes feel like active guidance, not passive sorting.

### Primary file

- [App.tsx](c:/Users\Sina\Desktop\PROMPTGEN\prompt_generator_v3.2_final\src\ui\App.tsx)

### Suggested approach

Compute a mode-aware suggested category from:

- active mode priority order
- current committed selections
- current node category
- current usability constraints

Start simple:

- choose the highest-priority category with low or no engagement

Do not over-engineer a complex recommendation system in v1.

### Surface

Expose the result to:

- `CategorySidebar`
- optionally `QuestionCard`

## Phase 7: Light Question Card Integration

### Goal

Let the main Builder area reflect the active Mode without becoming noisy.

### Primary file

- [QuestionCard.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/QuestionCard.tsx)

### Possible additions

- current mode label
- one short helper line
- suggested-next reinforcement only if subtle

### Important restraint

Do not overload the question area with Mode branding.

The sidebar should remain the main orientation surface.

## Phase 8: Type And Test Safeguards

### Goal

Reduce regressions while introducing config-driven navigation.

### Files to update or add

- [src/types/index.ts](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/index.ts)
- `src/__tests__/...` as needed

### High-value tests

1. mode config validity
   - all categories referenced exist
   - all stage categories are valid

2. mode-aware ordered nodes
   - each mode produces a valid node order

3. navigation behavior
   - switching modes changes ordered navigation path

4. territory coexistence
   - territory-biased navigation still respects usable nodes

### Known repo note

Current `type-check` already has an unrelated `tsconfig.json` issue with `vite.config.ts`, so verification work may need to be interpreted accordingly.

## Phase 9: Documentation Alignment

### Goal

Prevent product-language contradiction once the feature exists.

### Likely files

- [public/manual.md](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/public/manual.md)
- [LandingPage.tsx](c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/LandingPage.tsx)
- possibly strategy/context docs later

### Why this matters

Current docs already contain drift around:

- Working Sets
- Freeform Prompt
- older feature framing

Once Modes are added, mismatched language will weaken trust quickly.

## Recommended Build Order

1. add types and config for modes
2. refactor mode-aware category order and usable-node ordering in `App.tsx`
3. wire mode state and switching into Builder
4. refactor `CategorySidebar` to render from mode config
5. add Suggested next
6. add light `QuestionCard` support if needed
7. test navigation and territory coexistence
8. update user-facing docs

## Risks During Implementation

Main implementation risks:

- sidebar updates without true navigation change
- territory-biased navigation breaking after refactor
- current node becoming invalid on mode switch
- duplicated workflow logic spread across `App.tsx` and `CategorySidebar.tsx`
- overexposing Mode UI and making Builder heavier

## Definition Of Done

Builder Workflow Modes v1 is done when:

1. user can switch between `Balanced`, `Character-First`, `Environment-First`, and `Scene-First`
2. category grouping and order visibly update
3. `Next` follows the active mode-aware order
4. Builder start bias follows the active mode-aware order
5. territory-biased navigation still works
6. a lightweight Suggested next signal exists
7. no prompt-engine behavior is changed
8. Pools and Territories remain structurally mode-independent

## Short Recommendation

Treat this as a Builder navigation/config refactor first and a UI feature second.

That is the safest way to preserve concept integrity while keeping the implementation bounded.
