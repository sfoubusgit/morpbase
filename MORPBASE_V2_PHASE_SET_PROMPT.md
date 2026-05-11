# MorpBase V2 Phase Set Prompt

Use the following prompt in a fresh analysis session. This is for determining the actual phase set for the MorpBase V2 benchmark workflow. It is not for implementation yet.

```md
You are analyzing MorpBase in order to determine the correct `phase set` for the new `MorpBase V2` authoring core.

Important:

- V2 is a complete rebuild in a new project folder
- this is not a refactor of the V1 Builder
- current runtime is only supporting evidence, not a structural template

This is not implementation planning.
This is not visual design.
This is not a request to improve the old category model.

Your job is to choose the actual 3-5 phases that the V2 benchmark workflow should use.

The higher-level decisions are already locked:

- V2 uses a workspace-first shell
- with a guided authoring column and persistent Prompt Preview
- the benchmark workflow is guided portrait-workflow creation ending in a saved reusable result
- the internal workflow model is a semi-linear phase model built from focused workflow blocks

Now determine the actual phase set.

## Core framing

Assume:

- phases must feel like meaningful creative movements
- phases must not be renamed V1 categories
- phases must support first-time guidance and repeat-use refinement
- phases must work for the portrait benchmark first
- phases must still leave room for later reusable context and continuity layers

## Main objective

Determine:

1. What the actual phase set should be
2. What each phase owns
3. What kinds of workflow blocks belong in each phase
4. How the user should move between phases
5. Why this phase set is stronger than other plausible sets

## Priority of truth sources

Use this order:

1. `MORPBASE_V2_INTERNAL_WORKFLOW_MODEL_ANALYSIS.md`
2. `MORPBASE_V2_WORKSPACE_STRUCTURE_ANALYSIS.md`
3. `MORPBASE_V2_BENCHMARK_WORKFLOW_ANALYSIS.md`
4. `MORPBASE_V2_MASTER_PRODUCT_MAP_AND_GUARDRAILS.md`
5. `MORPBASE_V2_FIRST_USE_MODEL_ANALYSIS.md`
6. `MORPBASE_V2_FOUNDATION_ANALYSIS.md`
7. current runtime only as supporting evidence

If V1 categories or stages push toward a weaker answer:

- call that out
- do not preserve them automatically

## Read in this order

1. `MORPBASE_V2_INTERNAL_WORKFLOW_MODEL_ANALYSIS.md`
2. `MORPBASE_V2_WORKSPACE_STRUCTURE_ANALYSIS.md`
3. `MORPBASE_V2_BENCHMARK_WORKFLOW_ANALYSIS.md`
4. `MORPBASE_V2_MASTER_PRODUCT_MAP_AND_GUARDRAILS.md`
5. `MORPBASE_V2_FIRST_USE_MODEL_ANALYSIS.md`
6. `MORPBASE_V2_FOUNDATION_ANALYSIS.md`
7. `MORPBASE_ONTOLOGY_REASSESSMENT.md`
8. `BACKUP_LOG_20_03_2026.md`

Then inspect current Builder surfaces only as warning material:

9. `src/ui/App.tsx`
10. `src/ui/components/CategorySidebar.tsx`

## What to analyze

### A. Candidate phase sets

Draft multiple real candidate phase sets, such as:

- compressed 3-phase model
- balanced 4-phase model
- detailed 5-phase model
- any stronger alternative you judge better

### B. Real-life usage drafts

Before choosing, draft at least 3 real-life usage flows showing how a user would move through each candidate phase set.

For each:

- describe the user goal
- describe how they move phase to phase
- describe where the phase set feels strong
- describe where it feels weak, confusing, or too rigid

### C. Phase ownership

For the chosen set, define:

- what each phase is for
- what it should not be responsible for
- what kinds of workflow blocks belong there

### D. Phase movement

Decide how movement between phases should feel:

- strongly suggested
- lightly suggested
- gated
- open

Explain why.

### E. Future support

Explain how the chosen phase set can later support:

- transformed source/context layers
- continuity injection
- stronger archive/reuse hooks

without needing them now

### F. Anti-failure analysis

Explain what phase sets fail because they become:

- too generic
- too wizard-like
- too detailed
- too abstract
- too close to V1

## Required output structure

Write the result as a report with these sections:

1. `Executive Conclusion`
2. `Candidate Phase Sets`
3. `Selection Criteria`
4. `Real-Life Usage Drafts`
5. `Chosen Phase Set`
6. `What Each Phase Owns`
7. `What Workflow Blocks Belong In Each Phase`
8. `How The User Moves Between Phases`
9. `How The Phase Set Supports Later Depth`
10. `Why The Other Phase Sets Lose`
11. `Phase Set Failure Conditions`
12. `Final Judgment`

## Additional requirements

- choose one phase set
- keep it benchmark-first and V2-new
- do not let the answer become “current categories grouped differently”
- make the phases feel like creative workflow movements, not taxonomy buckets

## Final deliverable

Save the report as:

`MORPBASE_V2_PHASE_SET_ANALYSIS.md`

Do not implement anything after writing the report.
Stop after the analysis.
```
