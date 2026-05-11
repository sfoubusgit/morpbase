## MorpBase Identity Systems Preparation Prompt

Use the following prompt in a fresh analysis session. This is for conceptual preparation only. It is not for implementation yet.

```md
You are analyzing the MorpBase codebase and concept documents in order to define the correct starting point for a future `Identity Systems` realm.

Your task is not to implement anything.
Your task is not to jump to UI, stores, modals, or prompt injection details first.
Your task is to determine what `Identity Systems` should actually mean inside MorpBase, how it relates to every other major system, and how the core idea should be improved before implementation is even considered.

## Critical framing

Treat this as a top-down conceptual / ontology / product-architecture analysis.

Do not reduce the problem to:
- only `Character`
- only `Character creation`
- only a Builder overlay
- only a prompt-addition feature

Assume that `Character Identity` may be only one entity type inside a larger future realm.

Also assume that if current runtime code seems to implement Character in a smaller or narrower way than the concept docs intend, that may be implementation drift rather than the true intended product meaning.

When concept docs and current runtime behavior disagree:
- identify the disagreement explicitly
- do not silently choose one
- explain which layer should be treated as the better source of truth and why

## Priority of truth sources

Use this priority order when reasoning:

1. Future / ontology / concept-boundary docs
2. Main identity / Builder-centered concept decisions
3. System-relationship docs
4. Current runtime code and UI

If runtime code conflicts with higher-level intent, call that out as drift.

## Main objective

Produce a deep preparation analysis that answers:

1. What role should `Identity Systems` play inside MorpBase?
2. Is `Identity Systems` a top-level realm, a supporting subsystem, or something else?
3. How should `Identity Systems` connect to every major MorpBase system?
4. What kinds of entities actually qualify as identity entities?
5. How should the core idea be improved before any implementation starts?

## Read in this order

Read these documents first:

1. `FUTURE_PROJECTS_AHEAD.md`
2. `MORPBASE_ONTOLOGY_REASSESSMENT.md`
3. `MORPBASE_MAIN_IDENTITY_DECISION.md`
4. `MORPBASE_PRIMARY_USER_FACING_CENTER_DECISION.md`
5. `MORPBASE_SUPPORTING_SYSTEM_RELATIONSHIP_DECISION.md`
6. `MORPBASE_PROJECT_UNDERSTANDING_REPORT.md`
7. `REUSABLE_IDENTITY_FRAMEWORK_CONCEPT.md`
8. `IDENTITY_ENTITIES_SEPARATE_FROM_BUILDER_CONCEPT.md`
9. `CHARACTER_IDENTITY_SYSTEM_MASTER_CONCEPT.md`
10. `CHARACTER_IDENTITY_SYSTEM_ARCHITECTURE_ANALYSIS.md`
11. `CHARACTER_BUILDER_VS_CHARACTER_IDENTITY_SYSTEM.md`
12. `CHARACTER_IDENTITY_SYSTEM_SCOPE_BOUNDARY.md`
13. `TERRITORY_FRICTION_ANALYSIS_WITH_IDENTITY_SYSTEMS.md`
14. `SHOULD_CHARACTER_IDENTITY_BE_NEXT.md`

Then inspect these runtime surfaces:

15. `src/ui/App.tsx`
16. `src/ui/components/PromptPreview.tsx`
17. `src/ui/components/UserPoolsPage.tsx`
18. `src/ui/components/PoolHubPage.tsx`
19. `src/ui/components/PromptsPage.tsx`
20. `src/ui/components/LandingPage.tsx`
21. `src/ui/components/CategorySidebar.tsx`
22. `src/types/promptAdditions.ts`

You may inspect additional directly relevant files if needed, but stay focused.

## What to analyze

### A. Identity Systems ontology

Determine:
- what `Identity Systems` fundamentally is inside MorpBase
- whether it should be treated as a realm, layer, subsystem, or domain
- what its core purpose is
- what problem it solves that Pools, Territories, Builder, Prompt Sets, IDP sets, or saved prompts do not already solve

### B. Relationship to every major MorpBase system

Analyze the relationship between `Identity Systems` and each of the following:

- Builder
- Prompt Preview
- Territories
- Pools
- initiative phrases
- IDP sets
- Prompt Library / Prompt Archive
- Prompt Sets
- Pool Hub
- creator profiles / public profiles
- Shared Storylines
- future collaboration / continuity systems

For each one, explain:
- how it connects to Identity Systems
- what should remain separate
- what confusion risks exist
- what the correct conceptual boundary is

### C. Identity entity qualification criteria

Define what makes something a true identity entity rather than:
- a Pool
- a Territory
- a prompt fragment
- an IDP set
- a style host
- a workflow aid

Create explicit qualification criteria such as:
- continuity across workflows
- persistent recognizable sameness
- reusable identity above a specific workflow context
- independence from one Pool or Territory

Then apply the criteria to candidate entity types.

### D. Candidate identity entity types

Evaluate which entity classes belong in the future realm, such as:

- Character Identity
- Outfit / Clothing Identity
- Prop / Artifact Identity
- Creature Identity
- Location Identity
- Group Identity
- Symbol / Emblem Identity

Do not just list them.
For each one, evaluate:
- whether it truly qualifies
- why it matters or does not matter
- whether it is first-wave, later-wave, or should be excluded

### E. Core idea improvements

Critically evaluate the current idea and improve it.

Specifically analyze:
- where the current `Character Identity` framing is too narrow
- where `Identity Systems` risks becoming too abstract
- where the idea overlaps too much with Pools / Territories
- where the realm needs better conceptual boundaries
- whether `Identity Systems` is the best naming, or whether a sharper framing exists while preserving the meaning

This section should improve the core concept, not just summarize existing docs.

### F. Navigation and product placement

Without designing UI in detail, evaluate:
- whether `Identity Systems` deserves a dedicated top-level navigation realm
- whether that is conceptually justified already
- how it should sit relative to Builder, Workflow Sources, Prompt Archive, and Hub
- whether it should be visible as a major realm before implementation

Stay conceptual. Do not design screens yet.

### G. Risks and anti-patterns

Identify major risks such as:
- flattening identity into Builder categories
- treating identity as just prompt text injection
- confusing identity with Pools
- confusing identity with Territory context
- creating a realm that has no clear first proving entity
- making the realm bigger than MorpBase can justify

### H. Long-range value

Explain whether `Identity Systems` is merely a nice feature lane or whether it could become one of MorpBase’s real long-term differentiators.

Be honest.
If the concept is strong but not yet ready, say so.
If the concept is only worth doing under certain constraints, say so.

## Required output structure

Write the result as a report with these sections:

1. `Executive Conclusion`
2. `What Identity Systems Is Inside MorpBase`
3. `Why MorpBase Needs Or Does Not Yet Need It`
4. `Relationship To Every Major System`
5. `Identity Entity Qualification Criteria`
6. `Candidate Entity Types And Their Validity`
7. `Improvements To The Core Idea`
8. `Recommended Realm Position Inside MorpBase`
9. `Biggest Risks And Anti-Patterns`
10. `What Should Be Clarified Before Any Implementation`
11. `Open Questions / Contradictions`
12. `Final Judgment`

## Additional output requirements

- Be precise and critical.
- Do not flatter weak ideas.
- Do not silently smooth over contradictions.
- If Character appears too early in runtime code, explicitly say whether that is premature relative to the larger realm concept.
- Distinguish clearly between:
  - what the current code already does
  - what the concept docs intend
  - what you recommend as the better long-term conceptual model

## Final deliverable

Save the report as:

`IDENTITY_SYSTEMS_REALM_ANALYSIS.md`

Do not implement anything after writing the report.
Stop after the analysis.
```
