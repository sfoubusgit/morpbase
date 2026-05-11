## MorpBase V2 Whole-Product Integration Prompt

Use the following prompt in a fresh analysis session. This is for V2 whole-product integration only. It is not for implementation yet.

```md
You are analyzing MorpBase in order to define the correct `whole-product integration model` for `MorpBase V2`.

Your task is not to think only about the core workflow.
Your task is not to think only about onboarding.
Your task is not to think only about one feature lane at a time.

Your task is to determine how the full MorpBase product should hold together as one coherent V2 system, including:

- core workflow
- downstream archive / reuse
- reusable source/context layers
- community / creator / discovery layers
- continuity / identity layers
- future planned project directions

The goal is to prevent V2 from repeating one of V1’s biggest problems:

- adding strong local systems without one governing big picture

## Critical framing

Assume:

- V2 must preserve the heart of MorpBase
- V2 should become more integrated, not more fragmented
- advanced or later systems should still belong to one coherent product logic
- community should not feel bolted on
- identity should not feel bolted on
- archive/reuse should not feel bolted on

Also assume:

- not everything belongs in first-wave V2
- but everything from `FUTURE_PROJECTS_AHEAD.md` should be accounted for in the V2 big picture
- “later” must not mean “detached”

## Main objective

Produce a whole-product integration analysis that answers:

1. What is the full V2 product shape?
2. How should core, archive, community, identity, and future layers relate to each other?
3. How can V2 feel like one integrated product instead of several adjacent systems?
4. Which future-project directions are first-wave, second-wave, ecosystem, or long-range horizon?
5. What big-picture guardrails are needed so V2 does not repeat V1’s feature-accumulation mistake?

## Priority of truth sources

Use this order when reasoning:

1. `MORPBASE_V2_FOUNDATION_ANALYSIS.md`
2. `MORPBASE_V2_KEEP_TRANSFORM_DROP_MATRIX.md`
3. `MORPBASE_V2_FIRST_USE_MODEL_ANALYSIS.md`
4. `FUTURE_PROJECTS_AHEAD.md`
5. Ontology / system-relationship / simplification docs
6. Current runtime and backup log

If current product structure conflicts with the better V2 whole-product reading:

- call it out explicitly
- do not preserve it automatically

## Read in this order

1. `MORPBASE_V2_FOUNDATION_ANALYSIS.md`
2. `MORPBASE_V2_KEEP_TRANSFORM_DROP_MATRIX.md`
3. `MORPBASE_V2_FIRST_USE_MODEL_ANALYSIS.md`
4. `FUTURE_PROJECTS_AHEAD.md`
5. `MORPBASE_ONTOLOGY_REASSESSMENT.md`
6. `MORPBASE_SUPPORTING_SYSTEM_RELATIONSHIP_DECISION.md`
7. `MORPBASE_SIMPLIFICATION_STRATEGY.md`
8. `IDENTITY_SYSTEMS_REALM_ANALYSIS.md`
9. `PROMPT_TOOLS_COMPETITOR_MATRIX.md`
10. `BACKUP_LOG_20_03_2026.md`

Then inspect these runtime surfaces:

11. `src/ui/App.tsx`
12. `src/ui/components/LandingPage.tsx`
13. `src/ui/components/PromptsPage.tsx`
14. `src/ui/components/UserPoolsPage.tsx`
15. `src/ui/components/PoolHubPage.tsx`
16. `src/ui/components/IdentitySystemsPage.tsx`
17. `src/ui/components/MyProfilePage.tsx`
18. `src/ui/components/PublicCreatorPage.tsx`

## What to analyze

### A. The full V2 product shape

Determine the best big-picture reading of V2 as a whole product.

Do not answer only with “core app plus extras.”
Answer in a way that explains how the whole system should feel integrated.

### B. Core versus surrounding layers

Determine the relationship between:

- live workflow center
- archive / reuse
- source/context systems
- identity / continuity systems
- community / discovery / creator layers

For each, explain:

- what role it plays
- how close it is to the center
- whether it is first-wave, second-wave, ecosystem, or horizon

### C. Future-project integration

Account for all major directions in `FUTURE_PROJECTS_AHEAD.md`, including:

- Prompt Sets
- Quick Save
- secondary pool growth
- prompt-library growth
- Character Identity
- Reusable Identity Framework
- Shared Storylines
- iteration systems
- challenge/reward systems
- community/profile/hub improvements

Do not treat them as isolated features.
Place them inside one V2 product map.

### D. Product integration logic

Determine how V2 can make these areas feel like parts of one product instead of separate tabs or islands.

Examples to examine:

- shared objects
- shared workflow meaning
- shared save/reuse logic
- shared continuity logic
- shared discovery/publication logic

### E. Community integration

Determine how community should fit into V2 so it feels integrated instead of bolted on.

Questions:

- what should community revolve around?
- how should creator/public surfaces relate to core workflow objects?
- how should discovery connect back into the user’s own workflow and archive?

### F. Identity and continuity integration

Determine how continuity systems should belong to the same product whole without hijacking the core.

### G. Anti-fragmentation guardrails

Define rules that stop V2 from repeating the V1 pattern of feature accumulation without a clear big picture.

### H. Layered rollout map

Produce a V2 layered map such as:

- first-wave core
- second-wave expansion
- ecosystem/community layer
- long-range horizon

The goal is not roadmap dates.
The goal is integrated product logic.

## Required output structure

Write the result as a report with these sections:

1. `Executive Conclusion`
2. `The Whole-Product Shape V2 Should Have`
3. `The Core V2 Product Center`
4. `How Archive, Reuse, Community, And Identity Should Integrate`
5. `How Future Projects Ahead Fit Into One V2 Product Map`
6. `First-Wave Core`
7. `Second-Wave Expansion`
8. `Ecosystem / Community Layer`
9. `Long-Range Horizon`
10. `Anti-Fragmentation Guardrails`
11. `Biggest Integration Risks`
12. `Final Judgment`

## Additional output requirements

- be big-picture, not feature-local
- do not let “later” mean “unrelated”
- make clear how MorpBase can feel like one integrated product
- be honest if some planned ideas should remain only horizon, not active V2 scope
- protect V2 from becoming either:
  - a fragmented system-of-systems
  - or a narrow core that abandons MorpBase’s larger ambition

## Final deliverable

Save the report as:

`MORPBASE_V2_WHOLE_PRODUCT_INTEGRATION_ANALYSIS.md`

Do not implement anything after writing the report.
Stop after the analysis.
```

