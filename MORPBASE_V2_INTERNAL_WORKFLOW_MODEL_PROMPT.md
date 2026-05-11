# MorpBase V2 Internal Workflow Model Prompt

Use the following prompt in a fresh analysis session. This is for determining the internal workflow model of the new MorpBase V2 workspace. It is not for implementation yet.

```md
You are analyzing MorpBase in order to determine the correct `internal workflow model` for the new `MorpBase V2` workspace.

Important:

- V2 is a complete rebuild
- V2 is a new project in a new folder
- V2 is not a refactor of the current V1 codebase
- current runtime should be used only as supporting evidence or warning material
- do not preserve the current Builder structure automatically

This is not implementation planning.
This is not UI polish.
This is not a request to improve the current Builder.

Your job is to decide what the internal authoring model of the new V2 workspace should be from scratch.

The workspace structure is already directionally locked as:

- one workspace-first shell
- one guided workflow authoring column
- one persistent live Prompt Preview column

Your task is to determine what the authoring column should actually *be* internally.

## Core framing

Assume all of the following are already true:

- the V2 foundation is locked
- the master product map and guardrails are locked
- the benchmark workflow is locked
- the workspace structure is locked at the high level
- V2 must preserve the heart of MorpBase but is free to radically change terminology and structure

Assume:

- the benchmark workflow is guided portrait-workflow creation ending in a saved reusable result
- the authoring side must feel stronger than a form and clearer than the current Builder
- the workflow model must support future depth later without exposing that depth immediately

## Main objective

Determine:

1. What internal workflow model the new V2 authoring column should use
2. How the user should move through that model
3. What kind of building blocks the model should be made of
4. How structured the workflow should feel without becoming rigid
5. How the model can support later reusable context and continuity without depending on them now

## Priority of truth sources

Use this order:

1. `MORPBASE_V2_WORKSPACE_STRUCTURE_ANALYSIS.md`
2. `MORPBASE_V2_BENCHMARK_WORKFLOW_ANALYSIS.md`
3. `MORPBASE_V2_MASTER_PRODUCT_MAP_AND_GUARDRAILS.md`
4. `MORPBASE_V2_FIRST_USE_MODEL_ANALYSIS.md`
5. `MORPBASE_V2_FOUNDATION_ANALYSIS.md`
6. `MORPBASE_V2_KEEP_TRANSFORM_DROP_MATRIX.md`
7. `MORPBASE_V2_WHOLE_PRODUCT_INTEGRATION_ANALYSIS.md`
8. `PROMPT_TOOLS_COMPETITOR_MATRIX.md`
9. current runtime only as supporting evidence

If the current V1 Builder suggests a weaker model than the stronger V2 reading:

- call it out explicitly
- do not preserve it automatically

## Read in this order

1. `MORPBASE_V2_WORKSPACE_STRUCTURE_ANALYSIS.md`
2. `MORPBASE_V2_BENCHMARK_WORKFLOW_ANALYSIS.md`
3. `MORPBASE_V2_MASTER_PRODUCT_MAP_AND_GUARDRAILS.md`
4. `MORPBASE_V2_FIRST_USE_MODEL_ANALYSIS.md`
5. `MORPBASE_V2_FOUNDATION_ANALYSIS.md`
6. `MORPBASE_V2_KEEP_TRANSFORM_DROP_MATRIX.md`
7. `MORPBASE_V2_WHOLE_PRODUCT_INTEGRATION_ANALYSIS.md`
8. `PROMPT_TOOLS_COMPETITOR_MATRIX.md`
9. `MORPBASE_ONTOLOGY_REASSESSMENT.md`
10. `BACKUP_LOG_20_03_2026.md`

Then inspect these only as current-state evidence:

11. `src/ui/App.tsx`
12. `src/ui/components/CategorySidebar.tsx`
13. `src/ui/components/PromptPreview.tsx`

## What to analyze

### A. Candidate internal workflow models

Compare real models such as:

- guided question flow
- workflow cards / blocks
- staged lanes
- modular step clusters
- canvas-like composition model
- hybrid models

Do not assume the current category/question model is correct.

### B. Movement through the workflow

Determine how the user should move:

- linearly
- semi-linearly
- by grouped phases
- by cards/blocks with light ordering
- by another better model

The workflow must feel:

- guided
- alive
- refinable

but not:

- rigid
- bureaucratic
- like a long form

### C. Workflow building blocks

Decide what the internal units should be.

Examples:

- questions
- cards
- blocks
- lanes
- modules
- phases

Explain what those units should do and why they fit V2 better than V1's current pattern.

### D. Benchmark support

Judge each model by how well it supports the locked benchmark:

- quick portrait workflow entry
- visible progress
- live preview trust
- meaningful refinement
- saveable outcome

### E. Real-life usage drafts

Before choosing the model, draft at least 3 concrete real-life usage flows that simulate how an actual user would move through the workspace.

For each draft:

- describe the user goal
- describe how they move through the authoring model
- describe where the model feels strong
- describe where it feels weak or unnatural

Then use those drafts to:

- eliminate weak models
- refine stronger models
- or justify a hybrid/combined model if that is the strongest result

### F. Future depth support

Determine how the chosen model can later absorb:

- transformed source/context layers
- continuity activation
- stronger reuse hooks

without forcing them into the first proof

### G. Anti-failure analysis

Explain what models would fail because they become:

- too much like a form
- too much like a wizard
- too much like a generic prompt editor
- too much like the old Builder in new clothes

## Required output structure

Write the result as a report with these sections:

1. `Executive Conclusion`
2. `Candidate Internal Workflow Models`
3. `Selection Criteria`
4. `Real-Life Usage Drafts`
5. `Chosen Internal Workflow Model`
6. `How The User Moves Through It`
7. `What The Workflow Building Blocks Should Be`
8. `How It Supports The Benchmark`
9. `How It Supports Later Depth Without Depending On It`
10. `Why The Other Models Lose`
11. `Workflow Model Failure Conditions`
12. `Final Judgment`

## Additional requirements

- stay structural and product-behavioral, not implementation-level
- treat V2 as a fresh rebuild
- do not drift into visual design details
- do not let the answer become “current Builder, but cleaner”
- make the chosen model strong enough to become the heart of a truly new workspace

## Final deliverable

Save the report as:

`MORPBASE_V2_INTERNAL_WORKFLOW_MODEL_ANALYSIS.md`

Do not implement anything after writing the report.
Stop after the analysis.
```
