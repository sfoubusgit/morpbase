# MorpBase V2 Workflow Block Set Prompt

You are analyzing the internal workflow block system for MorpBase V2.

This is not V1 cleanup.
This is not a refactor of the current Builder.
This is a fresh-rebuild V2 decision for a new project in a new folder.

The following truths are already locked and must be respected:

- MorpBase V2 is a true successor, not a side product.
- The heart of MorpBase is reusable prompt-workflow authoring around a live workspace + Prompt Preview loop.
- V2 should be one integrated product, not a pile of separate feature centers.
- The benchmark workflow is guided portrait-workflow creation in the main workspace, ending in a saved reusable result.
- The workspace structure is one guided authoring column plus one persistent Prompt Preview column.
- The internal workflow model is a semi-linear phase model built from focused workflow blocks.
- The chosen phase set is:
  1. Define The Subject
  2. Shape The Look
  3. Stage The Image
  4. Refine And Keep

Another important rule:

- do not decide abstractly first
- create real-life usage drafts first
- then judge what works best
- then combine if needed

Your job is to determine the actual workflow block set that should live inside this 4-phase model.

## Your Goals

Determine:

- what workflow blocks belong inside each phase
- how broad or narrow each block should be
- which blocks are required, recommended, or optional
- how many blocks V2 should expose by default in the benchmark workflow
- whether save / keep should be an authoring-column block or a Prompt Preview-side handoff
- how later systems could plug into the block system without redefining it

## Hard Constraints

Do not allow the block system to become:

- V1 categories with nicer labels
- a wizard made of mini forms
- a loose card pile with no momentum
- a hidden taxonomy
- something that depends on Territories, Identity Systems, or community to feel complete

Do not let "portrait benchmark" trick you into making the blocks too narrow to portrait only.
The benchmark is portrait-oriented, but the block system should still feel like a strong general workflow core.

## Real-Life Usage Drafts First

Before choosing a block set, create and compare at least 4 realistic usage drafts such as:

1. first-time portrait creator making one strong result
2. returning user reopening and refining a saved base
3. speed-oriented user who wants the shortest high-quality path
4. later advanced user applying deeper reusable/contextual systems without breaking the core flow

Use these drafts to test multiple candidate block-set models.

## Candidate Directions To Compare

Compare at least these kinds of candidates:

- very sparse block model
- balanced medium-granularity model
- dense detailed block model
- any hybrid model that emerges from the usage drafts

## Required Judgments

You must answer clearly:

1. What is the best overall block-set model?
2. How many visible default blocks should the benchmark workflow have?
3. What exact blocks belong in each of the four phases?
4. Which blocks are mandatory vs recommended vs optional?
5. What belongs inside each block, and what explicitly does not?
6. Should "Keep / Save" be a workflow block or a Preview-side endpoint?
7. How can later reusable sources, continuity systems, and community/publication attach later without hijacking the core?

## Output Requirements

Write the result to:

- `MORPBASE_V2_WORKFLOW_BLOCK_SET_ANALYSIS.md`

The output should include:

- executive conclusion
- candidate block-set models
- selection criteria
- real-life usage drafts
- chosen block-set model
- per-phase block definition
- mandatory / recommended / optional mapping
- Prompt Preview / keep-handoff judgment
- later-system attachment logic
- failure conditions
- final judgment

Be decisive, but question your own assumptions before locking the result.
