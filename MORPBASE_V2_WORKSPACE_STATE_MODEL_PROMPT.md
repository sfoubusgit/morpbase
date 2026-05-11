# MorpBase V2 Workspace State Model Prompt

You are designing the workspace state model for MorpBase V2.

This is a fresh-rebuild V2 decision for a new project in a new folder.
Do not think in terms of adapting the current Builder or its current app state.
Use current V1 behavior only as warning material or evidence, not as a template.

Already locked:

- V2 is a true successor, not a lighter side product
- the heart is reusable prompt-workflow authoring around a live workspace + Prompt Preview loop
- V2 should be one integrated product
- the benchmark workflow is guided portrait-workflow creation ending in a saved reusable result
- the workspace structure is one guided authoring column plus one persistent live Prompt Preview column
- the internal workflow model is a semi-linear phase model built from focused workflow blocks
- the chosen phases are:
  1. Define The Subject
  2. Shape The Look
  3. Stage The Image
  4. Refine And Keep
- the chosen workflow blocks are:
  1. Subject Core
  2. Presence And Signature
  3. Visual Direction
  4. Mood And Light
  5. Scene Pressure
  6. Framing And Focus
  7. Tighten The Result
- `Keep / Save` is a Preview-side handoff
- the chosen block interaction model is:
  - guided-choice hybrid
  - optional free steering
  - live Preview response
  - compact summaries for revisiting

Important working rule:

- make real-life usage drafts first
- then compare candidate state models
- then decide what works best, or combine

## Your Goal

Determine how the V2 workspace should behave across a live session.

You must decide:

- how phases should appear and evolve as the user works
- how blocks should track state without becoming bureaucratic
- how progress should be communicated
- how the workspace should decide what the "next best move" is
- how users should resume, revisit, and refine saved work
- what "ready to keep" should mean
- how the state model should preserve V2's creative feel instead of becoming a task system

## Questions You Must Answer

1. What is the best overall workspace state model?
2. Should progress be shown as:
   - step completion
   - phase readiness
   - confidence/readiness
   - something hybrid
3. What states should phases have?
4. What states should blocks have?
5. How should the workspace choose and display the current active block or recommended next move?
6. What should happen when a user returns to an unfinished or saved workflow?
7. What makes a workflow "keep-ready"?
8. How should Preview relate to state progression?
9. How can later systems attach to the state model without taking it over?

## Hard Constraints

Do not let the state model become:

- a checklist product
- a tutorial flow pretending to be a workspace
- a rigid wizard
- a hidden scoring engine
- a progress bar game
- an over-abstract workflow engine no normal user can feel

The state model must preserve:

- creative momentum
- clarity
- easy re-entry
- strong Preview trust
- save/reuse significance

## Real-Life Usage Drafts First

Before choosing the model, create and compare at least 4 realistic usage drafts such as:

1. first-time user reaching a strong first result
2. returning user reopening an unfinished workflow
3. returning user reopening a saved result for small changes
4. later advanced user with supporting reusable/contextual systems attached

## Candidate State Models To Compare

Compare at least:

- completion-checklist model
- loose sandbox model
- soft-readiness model
- milestone / recommendation hybrid

## Output Requirements

Write the result to:

- `MORPBASE_V2_WORKSPACE_STATE_MODEL_ANALYSIS.md`

Include:

- executive conclusion
- candidate state models
- selection criteria
- real-life usage drafts
- chosen state model
- phase state definitions
- block state definitions
- recommended-next-move logic
- keep-readiness judgment
- resume / revisit behavior
- Preview relationship
- later-system attachment logic
- failure conditions
- final judgment

Be decisive, but question your own assumptions before locking the result.
