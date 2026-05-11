## MorpBase V2 Keep / Transform / Drop Prompt

Use the following prompt in a fresh analysis session. This is for V2 system selection only. It is not for implementation yet.

```md
You are analyzing MorpBase in order to decide what V1 systems should survive into `MorpBase V2`, what should be radically transformed, what should be merged or hidden, and what should be dropped from the V2 product by default.

Your task is not to preserve V1 systems out of attachment.
Your task is not to defend terminology.
Your task is not to design implementation details yet.

Your task is to create a ruthless but accurate `keep / transform / merge / hide / drop` decision matrix for the major V1 systems based on the already-established V2 foundation.

## Critical framing

Assume:

- V2 should preserve the heart of MorpBase
- V2 should not be a weaker side product
- V2 should be more user-friendly, more competitive, and more internally coherent than V1
- current V1 system names are negotiable
- some V1 systems may survive conceptually while their current expression dies completely

This is not a cleanup exercise.
It is a product-truth selection exercise.

## Main objective

Produce a decision matrix that answers:

1. Which V1 systems are truly core and should survive into V2?
2. Which systems contain real value but need major transformation?
3. Which systems should be merged into broader V2 structures?
4. Which systems should move into advanced / later layers rather than stay front-stage?
5. Which systems should be dropped from the V2 product by default?

## Priority of truth sources

Use this order when reasoning:

1. `MORPBASE_V2_FOUNDATION_ANALYSIS.md`
2. Ontology / main identity / primary-center decisions
3. Product mismatch / simplification / builder-centered meaning docs
4. Competitor analysis docs
5. Current runtime structure and backup log

If current code presence conflicts with V2 foundation truth:

- call that out explicitly
- do not preserve it automatically

## Read in this order

1. `MORPBASE_V2_FOUNDATION_ANALYSIS.md`
2. `MORPBASE_ONTOLOGY_REASSESSMENT.md`
3. `MORPBASE_MAIN_IDENTITY_DECISION.md`
4. `MORPBASE_PRIMARY_USER_FACING_CENTER_DECISION.md`
5. `MORPBASE_SUPPORTING_SYSTEM_RELATIONSHIP_DECISION.md`
6. `MORPBASE_BIGGEST_CONCEPTUAL_MISMATCH_ANALYSIS.md`
7. `MORPBASE_BUILDER_CENTERED_MEANING_ANALYSIS.md`
8. `MORPBASE_SIMPLIFICATION_STRATEGY.md`
9. `PROMPT_TOOLS_COMPETITOR_MATRIX.md`
10. `MORPBASE_PROJECT_UNDERSTANDING_REPORT.md`
11. `BACKUP_LOG_20_03_2026.md`

Then inspect these runtime surfaces:

12. `src/ui/App.tsx`
13. `src/ui/components/LandingPage.tsx`
14. `src/ui/components/CategorySidebar.tsx`
15. `src/ui/components/PromptPreview.tsx`
16. `src/ui/components/PromptsPage.tsx`
17. `src/ui/components/UserPoolsPage.tsx`
18. `src/ui/components/PoolHubPage.tsx`
19. `src/ui/components/IdentitySystemsPage.tsx`

## Systems to evaluate

Evaluate at least these systems:

- Builder workspace
- Prompt Preview
- Builder category model
- Builder modes
- Territories
- Pools / Workflow Sources
- initiative phrases
- IDP sets
- Prompt Archive / Prompt Library
- Prompt Sets
- Identity Systems realm
- Character Identity controlled proof
- Pool Hub
- creator/public profiles
- Working Sets
- admin / analytics layer

You may add other major systems if they clearly matter.

## Allowed decision labels

Every system must receive exactly one primary decision:

- `Keep`
- `Transform`
- `Merge`
- `Hide / Advanced`
- `Drop`

Important:

- `Keep` means keep the system as a real V2 system, even if wording changes lightly
- `Transform` means the value survives but the V1 expression is not good enough
- `Merge` means the system should not survive as a separate visible concept
- `Hide / Advanced` means the system may remain real but should not stay front-stage
- `Drop` means it should not be part of the default V2 product

## What to analyze

### A. Core-system survival

Determine which systems are indispensable to MorpBase’s heart.

### B. Valuable but badly expressed systems

Determine which systems are strategically right but currently expressed in a confusing or heavy way.

### C. Surface versus substrate

Determine which systems should stay visible to users and which should remain mostly structural or backstage.

### D. Competitive relevance

For each system, ask:

- does keeping this help MorpBase beat competing tools?
- or does it add complexity without strengthening the V2 competitive story?

### E. V2 product hierarchy fit

For each system, determine whether it strengthens:

- the live workspace center
- reusable workflow context
- downstream preservation
- future continuity

or whether it weakens the hierarchy by competing for attention.

## Required output structure

Write the result as a report with these sections:

1. `Executive Conclusion`
2. `Decision Legend`
3. `Keep / Transform / Merge / Hide / Drop Matrix`
4. `Systems That Must Survive Into V2`
5. `Systems That Should Survive Only In Transformed Form`
6. `Systems That Should Stop Being Separate Front-Stage Concepts`
7. `Systems That Should Become Advanced Or Later`
8. `Systems V2 Should Drop By Default`
9. `Most Important Structural Consequences For V2`
10. `Open Questions / Borderline Cases`
11. `Final Judgment`

## Matrix requirements

For each system, include:

- system name
- current V1 role
- primary decision label
- short rationale
- what survives, if anything
- main V2 implication

## Additional output requirements

- be decisive
- do not preserve systems sentimentally
- distinguish between keeping a system’s value and keeping its current form
- be honest if a system should stop being a first-class visible product noun
- protect V2 from becoming weaker while still allowing aggressive simplification

## Final deliverable

Save the report as:

`MORPBASE_V2_KEEP_TRANSFORM_DROP_MATRIX.md`

Do not implement anything after writing the report.
Stop after the analysis.
```

