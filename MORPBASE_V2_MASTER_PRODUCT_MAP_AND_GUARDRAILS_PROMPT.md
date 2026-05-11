# MorpBase V2 Master Product Map And Guardrails Prompt

Use the following prompt in a fresh analysis session. This is for locking the V2 whole-product map and the anti-drift guardrails. It is not for implementation yet.

```md
You are analyzing MorpBase in order to lock the `master product map` and `guardrails` for `MorpBase V2`.

This is not a feature-design task.
This is not a UI-design task.
This is not an implementation task.

Your job is to freeze the big-picture V2 structure strongly enough that later system, workflow, and feature decisions can be judged against it.

The purpose of this step is to stop V2 from repeating one of V1's biggest failures:

- strong local decisions without one governing whole-product picture

## Core framing

Assume all of the following are true:

- V2 must preserve the heart of MorpBase
- V2 can radically change terminology, structure, and system expression
- V2 must become more integrated, not more fragmented
- V2 must not become a weaker "lite" version of V1
- all major directions from `FUTURE_PROJECTS_AHEAD.md` must be accounted for
- "later" must still mean integrated into the same product logic

Assume the most recent whole-product reading is likely directionally correct, but should now be hardened into explicit product ownership and guardrails.

## Main objective

Produce a master V2 product map that answers:

1. What are the shared product objects of MorpBase V2?
2. What layer owns what?
3. What is the exact relationship between:
   - live workflow center
   - product memory
   - continuity
   - community / ecosystem
   - long-range horizon
4. What belongs in first-wave V2 versus later layers?
5. What rules must future decisions obey so V2 does not drift back into V1-style fragmentation?

## Priority of truth sources

Use this order:

1. `MORPBASE_V2_WHOLE_PRODUCT_INTEGRATION_ANALYSIS.md`
2. `MORPBASE_V2_FOUNDATION_ANALYSIS.md`
3. `MORPBASE_V2_KEEP_TRANSFORM_DROP_MATRIX.md`
4. `MORPBASE_V2_FIRST_USE_MODEL_ANALYSIS.md`
5. `FUTURE_PROJECTS_AHEAD.md`
6. `MORPBASE_ONTOLOGY_REASSESSMENT.md`
7. `MORPBASE_SUPPORTING_SYSTEM_RELATIONSHIP_DECISION.md`
8. `IDENTITY_SYSTEMS_REALM_ANALYSIS.md`
9. `PROMPT_TOOLS_COMPETITOR_MATRIX.md`
10. current runtime surfaces only as supporting evidence

If the current runtime structure conflicts with the stronger V2 product-map reading:

- call it out
- do not preserve the runtime automatically

## Read in this order

1. `MORPBASE_V2_WHOLE_PRODUCT_INTEGRATION_ANALYSIS.md`
2. `MORPBASE_V2_FOUNDATION_ANALYSIS.md`
3. `MORPBASE_V2_KEEP_TRANSFORM_DROP_MATRIX.md`
4. `MORPBASE_V2_FIRST_USE_MODEL_ANALYSIS.md`
5. `FUTURE_PROJECTS_AHEAD.md`
6. `MORPBASE_ONTOLOGY_REASSESSMENT.md`
7. `MORPBASE_SUPPORTING_SYSTEM_RELATIONSHIP_DECISION.md`
8. `IDENTITY_SYSTEMS_REALM_ANALYSIS.md`
9. `PROMPT_TOOLS_COMPETITOR_MATRIX.md`
10. `BACKUP_LOG_20_03_2026.md`

Then inspect these only for runtime cross-check:

11. `src/ui/App.tsx`
12. `src/ui/components/LandingPage.tsx`
13. `src/ui/components/PromptsPage.tsx`
14. `src/ui/components/UserPoolsPage.tsx`
15. `src/ui/components/PoolHubPage.tsx`
16. `src/ui/components/IdentitySystemsPage.tsx`
17. `src/ui/components/MyProfilePage.tsx`
18. `src/ui/components/PublicCreatorPage.tsx`

## What to determine

### A. Shared product objects

Determine the real shared objects that make the product integrated.

Examples to evaluate:

- active workflow session
- saved workflow outputs
- reusable workflow-shaping sources
- reusable workflow contexts
- continuity entities
- creator identity
- public published objects

Do not assume the current nouns are the final answers.

### B. Layer ownership

For each major layer, determine:

- what it owns
- what it does not own
- how it connects to the other layers

Required layers:

- live workflow center
- product memory layer
- continuity layer
- community / ecosystem layer
- long-range horizon

### C. First-wave ownership boundary

Decide what first-wave V2 is actually allowed to include.

This must be strong enough to prevent:

- overbuilding too early
- underbuilding into a weak side product

### D. Guardrails

Define explicit rules future decisions must obey.

Examples:

- when does a system earn visibility?
- when does a concept deserve a top-level realm?
- when is a future direction preserved but not active?
- what counts as fragmentation drift?
- what counts as "preserving the heart" versus preserving old structure?

### E. Integration tests

Define a small set of tests that later V2 decisions can be checked against.

Examples:

- does this strengthen the live workflow center?
- does this participate in shared product objects?
- does this improve integration or create another island?
- is this first-wave material or later-layer material?

## Required output structure

Write the result as a report with these sections:

1. `Executive Conclusion`
2. `The Shared Product Objects Of MorpBase V2`
3. `The Master Product Map`
4. `Layer Ownership`
5. `What First-Wave V2 Owns`
6. `What Later Layers Own`
7. `How Community Integrates Into The Same Product Logic`
8. `How Identity Integrates Without Hijacking The Core`
9. `The Non-Negotiable Guardrails`
10. `The Decision Tests Future V2 Work Must Pass`
11. `Biggest Drift Risks`
12. `Final Judgment`

## Additional requirements

- stay whole-product, not feature-local
- be explicit about ownership and boundaries
- do not let the report drift into UI copywriting or implementation details
- be honest if some current live surfaces are structurally misleading for V2
- make the final result usable as a governing reference for later V2 work

## Final deliverable

Save the report as:

`MORPBASE_V2_MASTER_PRODUCT_MAP_AND_GUARDRAILS.md`

Do not implement anything after writing the report.
Stop after the analysis.
```
