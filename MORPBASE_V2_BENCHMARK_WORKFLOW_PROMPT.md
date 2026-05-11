# MorpBase V2 Benchmark Workflow Prompt

Use the following prompt in a fresh analysis session. This is for identifying the single benchmark end-to-end workflow MorpBase V2 should optimize around first. It is not for implementation yet.

```md
You are analyzing MorpBase in order to determine the single best `benchmark workflow` for `MorpBase V2`.

This is not a feature-inventory task.
This is not a whole-product-map task.
This is not implementation planning.

Your job is to choose the one end-to-end workflow V2 should optimize around first so that the product can prove its value clearly, quickly, and competitively.

The benchmark workflow should help answer:

- what the user should do first
- what kind of result V2 should help them create first
- what exact experience should prove MorpBase is worth choosing

## Core framing

Assume:

- the V2 master product map and guardrails are already locked
- first-wave V2 must build the strongest possible center and memory loop
- V2 must not become weaker or more generic than V1
- V2 must beat simpler competitors through workflow value, clarity, and reuse
- the benchmark workflow is not the whole product, but it should be the clearest proof of the whole product's heart

Also assume:

- the benchmark workflow should be first-wave appropriate
- it should not require full continuity systems
- it should not require full community richness
- it should not depend on long-range horizon concepts

## Main objective

Determine:

1. What single end-to-end workflow V2 should optimize around first
2. Why that workflow is stronger than other candidate workflows
3. What exact user pain it solves
4. What exact moments of value it must create
5. What parts of MorpBase it proves
6. What parts of MorpBase it should intentionally not depend on yet

## Priority of truth sources

Use this order:

1. `MORPBASE_V2_MASTER_PRODUCT_MAP_AND_GUARDRAILS.md`
2. `MORPBASE_V2_FIRST_USE_MODEL_ANALYSIS.md`
3. `MORPBASE_V2_FOUNDATION_ANALYSIS.md`
4. `MORPBASE_V2_KEEP_TRANSFORM_DROP_MATRIX.md`
5. `MORPBASE_V2_WHOLE_PRODUCT_INTEGRATION_ANALYSIS.md`
6. `PROMPT_TOOLS_COMPETITOR_MATRIX.md`
7. `FUTURE_PROJECTS_AHEAD.md`
8. current runtime only as supporting evidence

If current runtime habits suggest a weaker benchmark than the stronger V2 reading:

- call that out
- do not preserve it automatically

## Read in this order

1. `MORPBASE_V2_MASTER_PRODUCT_MAP_AND_GUARDRAILS.md`
2. `MORPBASE_V2_FIRST_USE_MODEL_ANALYSIS.md`
3. `MORPBASE_V2_FOUNDATION_ANALYSIS.md`
4. `MORPBASE_V2_KEEP_TRANSFORM_DROP_MATRIX.md`
5. `MORPBASE_V2_WHOLE_PRODUCT_INTEGRATION_ANALYSIS.md`
6. `PROMPT_TOOLS_COMPETITOR_MATRIX.md`
7. `FUTURE_PROJECTS_AHEAD.md`
8. `MORPBASE_ONTOLOGY_REASSESSMENT.md`
9. `BACKUP_LOG_20_03_2026.md`

Then inspect these runtime surfaces only to cross-check what V1 currently makes easy or hard:

10. `src/ui/App.tsx`
11. `src/ui/components/LandingPage.tsx`
12. `src/ui/components/PromptPreview.tsx`
13. `src/ui/components/PromptsPage.tsx`
14. `src/ui/components/UserPoolsPage.tsx`

## What to analyze

### A. Candidate benchmark workflow types

Compare multiple candidate first benchmark workflows, such as:

- open workspace -> shape one strong prompt -> save it
- guided portrait / character workflow
- reusable style-family workflow
- territory-led focused workflow
- external quick-save-heavy workflow
- archive/reuse-heavy workflow

You do not have to use these exact candidates, but compare real alternatives.

### B. Selection criteria

Judge candidates by:

- first-use clarity
- speed to value
- competitive legibility
- emotional payoff
- proof of MorpBase's real heart
- first-wave suitability
- expandability into later layers

### C. The chosen benchmark workflow

Once you select the best benchmark, define:

- who the user is
- what they want
- what steps they go through
- what value each step proves
- what “success” looks like by the end

### D. What it proves

Explain which core V2 truths this workflow proves:

- live workflow center
- save/reuse memory
- reusable workflow design
- stronger-than-wildcards value
- layered depth potential

### E. What it should not depend on yet

Be explicit about what the benchmark should not require in order to succeed:

- full community layer
- identity realm maturity
- advanced continuity
- full source/context complexity
- long-range methodology/story systems

### F. Benchmark failure conditions

Define what would make the benchmark workflow a bad benchmark.

## Required output structure

Write the result as a report with these sections:

1. `Executive Conclusion`
2. `Candidate Benchmark Workflows`
3. `Selection Criteria`
4. `Chosen Benchmark Workflow`
5. `The User And The Pain`
6. `Step-By-Step Benchmark Flow`
7. `What This Workflow Proves About MorpBase V2`
8. `What It Must Not Depend On Yet`
9. `Why The Other Candidates Lose`
10. `Benchmark Failure Conditions`
11. `Final Judgment`

## Additional requirements

- choose one benchmark, not several co-equal ones
- keep it first-wave appropriate
- make sure it is strong enough to feel like the true beginning of a real V2
- do not let the benchmark collapse into just "type a prompt and save it"
- do not let it depend on too many later-layer systems

## Final deliverable

Save the report as:

`MORPBASE_V2_BENCHMARK_WORKFLOW_ANALYSIS.md`

Do not implement anything after writing the report.
Stop after the analysis.
```
