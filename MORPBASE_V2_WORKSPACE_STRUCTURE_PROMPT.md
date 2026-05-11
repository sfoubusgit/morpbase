# MorpBase V2 Workspace Structure Prompt

Use the following prompt in a fresh analysis session. This is for determining the correct workspace structure for MorpBase V2 based on the locked benchmark workflow. It is not for implementation yet.

```md
You are analyzing MorpBase in order to determine the correct `workspace structure` for `MorpBase V2`.

This is not implementation planning.
This is not visual design polish.
This is not a feature-inventory exercise.

Your job is to define what the main V2 workspace should structurally be if MorpBase V2 is optimized around its chosen benchmark workflow.

The benchmark workflow is already locked:

- guided portrait-workflow creation in the main workspace
- live refinement through Prompt Preview
- ending in a saved reusable result

Your task is to determine what workspace structure best supports that benchmark while still preserving MorpBase's larger future potential.

## Core framing

Assume all of the following are already true:

- the V2 foundation is locked
- the keep / transform / drop matrix is locked
- the first-use model is locked
- the whole-product integration model is locked
- the master product map and guardrails are locked
- the benchmark workflow is locked

Assume:

- V2 must keep Builder + Prompt Preview as the live center
- V2 should feel clearer, faster, and more integrated than V1
- V2 should not expose too many product layers at once
- V2 should not collapse into a simple prompt form or generic editor

## Main objective

Determine:

1. What structural shape the V2 workspace should have
2. What the user should see first inside that workspace
3. What parts of the workflow should be primary, secondary, and hidden/later
4. How Prompt Preview should relate structurally to the authoring area
5. How save/reuse should be present without overpowering the live workflow
6. How the workspace can support future depth without showing all depth immediately

## Priority of truth sources

Use this order:

1. `MORPBASE_V2_BENCHMARK_WORKFLOW_ANALYSIS.md`
2. `MORPBASE_V2_MASTER_PRODUCT_MAP_AND_GUARDRAILS.md`
3. `MORPBASE_V2_FIRST_USE_MODEL_ANALYSIS.md`
4. `MORPBASE_V2_FOUNDATION_ANALYSIS.md`
5. `MORPBASE_V2_KEEP_TRANSFORM_DROP_MATRIX.md`
6. `MORPBASE_V2_WHOLE_PRODUCT_INTEGRATION_ANALYSIS.md`
7. `PROMPT_TOOLS_COMPETITOR_MATRIX.md`
8. current runtime surfaces only as supporting evidence

If the current V1 workspace structure conflicts with the stronger V2 benchmark reading:

- call it out explicitly
- do not preserve it automatically

## Read in this order

1. `MORPBASE_V2_BENCHMARK_WORKFLOW_ANALYSIS.md`
2. `MORPBASE_V2_MASTER_PRODUCT_MAP_AND_GUARDRAILS.md`
3. `MORPBASE_V2_FIRST_USE_MODEL_ANALYSIS.md`
4. `MORPBASE_V2_FOUNDATION_ANALYSIS.md`
5. `MORPBASE_V2_KEEP_TRANSFORM_DROP_MATRIX.md`
6. `MORPBASE_V2_WHOLE_PRODUCT_INTEGRATION_ANALYSIS.md`
7. `PROMPT_TOOLS_COMPETITOR_MATRIX.md`
8. `MORPBASE_ONTOLOGY_REASSESSMENT.md`
9. `BACKUP_LOG_20_03_2026.md`

Then inspect these runtime surfaces only for cross-check:

10. `src/ui/App.tsx`
11. `src/ui/components/CategorySidebar.tsx`
12. `src/ui/components/PromptPreview.tsx`
13. `src/ui/components/LandingPage.tsx`
14. `src/ui/components/PromptsPage.tsx`

## What to analyze

### A. Candidate workspace structure models

Compare real structural models, such as:

- left-side guided workflow + right-side live preview
- center-stage workflow canvas + side preview
- step-by-step stacked workflow with persistent preview
- workspace-first shell with hidden advanced drawers
- other strong alternatives you judge better

Do not assume the current V1 shape is correct.

### B. Primary versus secondary workspace elements

Determine what should be:

- always visible
- visible during the benchmark flow
- secondary but nearby
- hidden until later

Examples to evaluate:

- workflow questions / choices
- Prompt Preview
- save action
- reuse hints
- workflow context hints
- source/context access
- continuity hints

### C. Benchmark support

Judge each structure by how well it supports the benchmark portrait workflow:

- quick understanding
- fast shaping
- visible output response
- refinement
- meaningful save

### D. Future depth support

Determine how the workspace can support later layers without showing them too early:

- transformed source/context systems
- continuity activation
- community/publication handoff
- deeper reuse

### E. Anti-failure analysis

Call out what workspace structures would make V2 fail by becoming:

- too form-like
- too tab-like
- too system-heavy
- too generic
- too visually split

## Required output structure

Write the result as a report with these sections:

1. `Executive Conclusion`
2. `Candidate Workspace Structures`
3. `Selection Criteria`
4. `Chosen V2 Workspace Structure`
5. `What Must Be Primary In The Workspace`
6. `What Must Stay Secondary Or Hidden At First`
7. `How Prompt Preview Should Relate To Authoring`
8. `How Save / Reuse Should Appear In The Workspace`
9. `How The Workspace Supports Later Depth Without Early Overload`
10. `Why The Other Workspace Models Lose`
11. `Workspace Failure Conditions`
12. `Final Judgment`

## Additional requirements

- stay structural, not implementation-level
- do not drift into page-by-page app-shell design
- keep the focus on the main workspace
- make the workspace strong enough to feel like a real V2 center
- do not let the answer become “just keep the current Builder with cleaner copy”

## Final deliverable

Save the report as:

`MORPBASE_V2_WORKSPACE_STRUCTURE_ANALYSIS.md`

Do not implement anything after writing the report.
Stop after the analysis.
```
