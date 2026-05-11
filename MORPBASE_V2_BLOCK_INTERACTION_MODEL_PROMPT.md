# MorpBase V2 Block Interaction Model Prompt

You are designing the internal interaction model for the workflow blocks inside MorpBase V2.

This is a fresh-rebuild V2 decision for a new project in a new folder.
Do not think in terms of adapting the current Builder.
Do not reuse V1 interaction assumptions by default.

Already locked:

- V2 is a true successor, not a lighter side product
- the heart is reusable prompt-workflow authoring around a live workspace + Prompt Preview loop
- V2 should be one integrated product
- the benchmark workflow is guided portrait-workflow creation ending in a saved reusable result
- the workspace structure is one guided authoring column plus one persistent Prompt Preview column
- the internal workflow model is a semi-linear phase model built from focused workflow blocks
- the chosen phases are:
  1. Define The Subject
  2. Shape The Look
  3. Stage The Image
  4. Refine And Keep
- the chosen block system is:
  1. Subject Core
  2. Presence And Signature
  3. Visual Direction
  4. Mood And Light
  5. Scene Pressure
  6. Framing And Focus
  7. Tighten The Result
- `Keep / Save` is a Preview-side handoff, not a normal authoring block

Very important working rule:

- make real-life usage drafts first
- then compare candidate interaction models
- then decide what works best, or combine

## Your Goal

Determine what a workflow block should actually feel like inside.

You must decide:

- what interaction pattern blocks should use
- how much choice density each block should contain
- what should be curated versus freely written
- whether all blocks should share one base grammar or use very different internal structures
- how Prompt Preview should respond while a block is being shaped
- how later systems could attach to the blocks without redefining them

## Questions You Must Answer

1. What is the best overall interaction model for V2 blocks?
2. Should blocks behave like:
   - forms
   - cards
   - guided picks
   - conversational prompts
   - hybrids
3. What should the shared interaction grammar of a block be?
4. How many visible controls/choices should a block expose by default?
5. What belongs in curated choices versus optional free steering?
6. Should blocks auto-update Preview live, or wait for explicit apply/confirm moments?
7. How should completion, confidence, and revisiting work?
8. How should later reusable sources, continuity systems, and community/publication attach later without hijacking the core block interactions?

## Hard Constraints

Do not let the answer become:

- a better form UI
- a wizard made of mini-forms
- a parameter dashboard
- a conversational chat interface
- a hidden technical prompt editor

The model must feel:

- creative
- guided
- quick to grasp
- good for first-time use
- fast for return use
- compatible with a live Preview loop

## Real-Life Usage Drafts First

Before locking the model, create and compare at least 4 realistic usage drafts such as:

1. first-time user shaping a portrait from scratch
2. returning user reopening a saved result and changing only one block
3. speed-focused user who wants the shortest useful path
4. later advanced user receiving block-level help from reusable source/context or continuity systems

## Candidate Interaction Models To Compare

Compare at least:

- form-control-heavy model
- visually curated card/chip model
- conversational block model
- hybrid guided-choice + optional free-steering model

## Output Requirements

Write the result to:

- `MORPBASE_V2_BLOCK_INTERACTION_MODEL_ANALYSIS.md`

Include:

- executive conclusion
- candidate interaction models
- selection criteria
- real-life usage drafts
- chosen interaction model
- shared block grammar
- per-block interaction guidance
- Preview response model
- completion / revisit logic
- later-system attachment logic
- failure conditions
- final judgment

Be decisive, but question your own assumptions before locking the result.
