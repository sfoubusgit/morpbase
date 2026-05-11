## Identity Systems Prompt Roadmap

This document defines the staged prompt sequence for reaching:

`ultimate preparation for the implementation of Identity Systems`

It is intentionally split into multiple prompts so the work progresses in the right order:

1. define the realm
2. define the entity rules
3. map the realm against every major MorpBase system
4. improve the concept before it hardens
5. decide where the realm belongs inside MorpBase
6. model user journeys and lifecycle behavior
7. prepare architecture without coding
8. audit runtime drift and codebase readiness
9. define the realm-to-first-lane translation
10. choose the first proving lane
11. synthesize the final master pre-implementation brief
12. run a final implementation-readiness gate

The goal is not to implement Identity Systems.
The goal is to arrive at the strongest possible conceptual and architecture starting point before implementation planning begins.

---

## How To Use This Roadmap

- Run each prompt in a fresh analysis session.
- Execute them in order.
- Do not skip outputs.
- Each prompt must save the named output file before stopping.
- Each later prompt must read the reports created by earlier prompts.
- Do not implement code during this roadmap.
- If a prompt uncovers a major contradiction, stop and resolve that contradiction before continuing.

This sequence is designed to prevent three common failures:

- shrinking Identity Systems into only `Character`
- flattening identity into Builder / Territory content
- jumping into implementation details before the realm itself is conceptually sound

---

## Shared Rule Header

Prepend this shared header to every prompt below:

```md
You are analyzing the MorpBase codebase and concept documents to prepare `Identity Systems` correctly before implementation.

You are not implementing anything.
You are not writing production code.
You are not designing final UI components yet.

Work top-down in this order:
- ontology
- concept boundaries
- system relationships
- realm placement
- user journeys
- architecture preparation
- codebase readiness
- implementation readiness

Do not reduce Identity Systems to:
- only Character
- only Character creation
- only prompt injection
- only a Builder overlay
- only a small modal or library feature

Treat `Character Identity` as a possible first proving entity, not automatically as the whole realm.

When concept docs and current runtime code disagree:
- identify the contradiction explicitly
- do not silently smooth it over
- explain which should be treated as the stronger source of truth and why

Use this source-priority order:
1. future / ontology / concept-boundary docs
2. identity / realm concept docs
3. Builder-centered / system-relationship decisions
4. current runtime code and UI

Be precise, critical, and honest.
Do not flatter weak ideas.
Do not start implementing after writing the report.
Stop after saving the requested output file.
```

---

## Dependency Map

Use this file chain as the backbone of the sequence:

1. `IDENTITY_SYSTEMS_REALM_ANALYSIS.md`
2. `IDENTITY_ENTITY_TAXONOMY_AND_CRITERIA.md`
3. `IDENTITY_SYSTEMS_CONNECTION_MATRIX.md`
4. `IDENTITY_SYSTEMS_CORE_REFINEMENT.md`
5. `IDENTITY_SYSTEMS_REALM_PLACEMENT.md`
6. `IDENTITY_SYSTEMS_USER_JOURNEYS.md`
7. `IDENTITY_SYSTEMS_ARCHITECTURE_PREPARATION.md`
8. `IDENTITY_SYSTEMS_RUNTIME_DRIFT_AND_READINESS_AUDIT.md`
9. `IDENTITY_SYSTEMS_REALM_TO_FIRST_LANE_TRANSLATION_DECISION.md`
10. `IDENTITY_SYSTEMS_FIRST_WAVE_PROVING_DECISION.md`
11. `IDENTITY_SYSTEMS_MASTER_PRE_IMPLEMENTATION_BRIEF.md`
12. `IDENTITY_SYSTEMS_IMPLEMENTATION_READINESS_GATE.md`

Do not continue if an earlier file is missing.

---

## Prompt 1

### Goal

Define what `Identity Systems` fundamentally is inside MorpBase.

### Output

`IDENTITY_SYSTEMS_REALM_ANALYSIS.md`

### Prompt

Use the exact prompt in:

`MORPBASE_IDENTITY_SYSTEMS_PREPARATION_PROMPT.md`

Do not continue to Prompt 2 until `IDENTITY_SYSTEMS_REALM_ANALYSIS.md` exists.

---

## Prompt 2

### Goal

Turn the realm-level analysis into strict identity-entity qualification rules and a validated entity taxonomy.

### Output

`IDENTITY_ENTITY_TAXONOMY_AND_CRITERIA.md`

### Prompt

```md
Follow the Shared Rule Header.

Your task now is to take the realm-level conclusions and determine exactly what counts as an identity entity inside MorpBase.

Read:
- `IDENTITY_SYSTEMS_REALM_ANALYSIS.md`
- `FUTURE_PROJECTS_AHEAD.md`
- `REUSABLE_IDENTITY_FRAMEWORK_CONCEPT.md`
- `IDENTITY_ENTITIES_SEPARATE_FROM_BUILDER_CONCEPT.md`
- `CHARACTER_IDENTITY_SYSTEM_MASTER_CONCEPT.md`
- `CHARACTER_BUILDER_VS_CHARACTER_IDENTITY_SYSTEM.md`
- `CHARACTER_IDENTITY_SYSTEM_SCOPE_BOUNDARY.md`
- `src/ui/components/UserPoolsPage.tsx`
- `src/ui/App.tsx`

You must produce:

1. a strict definition of `identity entity`
2. explicit qualification criteria
3. explicit non-qualification criteria
4. a candidate taxonomy of identity entity classes
5. a judgment for each candidate:
   - first-wave valid
   - later-wave valid
   - conceptually weak
   - reject
6. comparison against nearby systems:
   - Pool
   - Territory
   - IDP set
   - Prompt Set
   - Builder category
   - prompt addition

You must evaluate at least these candidates:
- Character Identity
- Outfit / Clothing Identity
- Prop / Artifact Identity
- Creature Identity
- Location Identity
- Group Identity
- Symbol / Emblem Identity

Required sections:

1. `Executive Conclusion`
2. `What Qualifies As An Identity Entity`
3. `What Does Not Qualify`
4. `Qualification Criteria`
5. `Candidate Entity Taxonomy`
6. `Judgment On Each Candidate`
7. `Boundary Comparison Against Other MorpBase Systems`
8. `Best First-Wave Candidates`
9. `Rejected Or Weak Candidates`
10. `Open Questions`

Save the result as:
`IDENTITY_ENTITY_TAXONOMY_AND_CRITERIA.md`
```

---

## Prompt 3

### Goal

Map how Identity Systems connects to every major MorpBase system.

### Output

`IDENTITY_SYSTEMS_CONNECTION_MATRIX.md`

### Prompt

```md
Follow the Shared Rule Header.

Your task now is to create the full system-relationship map for Identity Systems inside MorpBase.

Read:
- `IDENTITY_SYSTEMS_REALM_ANALYSIS.md`
- `IDENTITY_ENTITY_TAXONOMY_AND_CRITERIA.md`
- `MORPBASE_ONTOLOGY_REASSESSMENT.md`
- `MORPBASE_MAIN_IDENTITY_DECISION.md`
- `MORPBASE_PRIMARY_USER_FACING_CENTER_DECISION.md`
- `MORPBASE_SUPPORTING_SYSTEM_RELATIONSHIP_DECISION.md`
- `MORPBASE_PROJECT_UNDERSTANDING_REPORT.md`
- `src/ui/App.tsx`
- `src/ui/components/PromptPreview.tsx`
- `src/ui/components/UserPoolsPage.tsx`
- `src/ui/components/PromptsPage.tsx`
- `src/ui/components/PoolHubPage.tsx`
- `src/ui/components/LandingPage.tsx`
- `src/types/promptAdditions.ts`

Analyze the relationship between Identity Systems and:
- Builder
- Prompt Preview
- Territories
- Pools
- initiative phrases
- IDP sets
- Prompt Archive / Prompt Library
- Prompt Sets
- Pool Hub
- creator profiles / public profiles
- Shared Storylines
- future continuity / collaboration systems

For each one, define:
- conceptual relationship
- dependency direction
- what must remain separate
- what can connect
- biggest confusion risk
- recommended boundary rule

Required sections:

1. `Executive Conclusion`
2. `System Connection Matrix`
3. `Hard Boundaries`
4. `Soft Integration Points`
5. `Greatest Confusion Risks`
6. `Most Important Boundary Rules`
7. `Where Current Runtime Code Drifts`
8. `Open Questions`

Save the result as:
`IDENTITY_SYSTEMS_CONNECTION_MATRIX.md`
```

---

## Prompt 4

### Goal

Improve the core idea itself before it hardens into the wrong shape.

### Output

`IDENTITY_SYSTEMS_CORE_REFINEMENT.md`

### Prompt

```md
Follow the Shared Rule Header.

Your task now is to improve the core concept of Identity Systems itself.

Read:
- `IDENTITY_SYSTEMS_REALM_ANALYSIS.md`
- `IDENTITY_ENTITY_TAXONOMY_AND_CRITERIA.md`
- `IDENTITY_SYSTEMS_CONNECTION_MATRIX.md`
- `FUTURE_PROJECTS_AHEAD.md`
- `REUSABLE_IDENTITY_FRAMEWORK_CONCEPT.md`
- `IDENTITY_ENTITIES_SEPARATE_FROM_BUILDER_CONCEPT.md`
- `SHOULD_CHARACTER_IDENTITY_BE_NEXT.md`
- `TERRITORY_FRICTION_ANALYSIS_WITH_IDENTITY_SYSTEMS.md`

Critically analyze:
- where the current idea is too narrow
- where it is too vague
- where it overlaps too much with Territories or Pools
- whether `Identity Systems` is the best name
- whether the concept should be framed as a realm, continuity layer, entity framework, or something else
- whether Character is being over-centered too early

You must produce concrete improvements to the idea, not just commentary.

Required sections:

1. `Executive Conclusion`
2. `Where The Current Idea Is Strong`
3. `Where The Current Idea Is Weak`
4. `Naming Evaluation`
5. `Improved Core Definition`
6. `Improved Boundary Rules`
7. `What Must Be Preserved`
8. `What Must Change`
9. `Recommended Final Framing`
10. `Open Questions`

Save the result as:
`IDENTITY_SYSTEMS_CORE_REFINEMENT.md`
```

---

## Prompt 5

### Goal

Decide where the Identity Systems realm should sit inside MorpBase at the product-structure level.

### Output

`IDENTITY_SYSTEMS_REALM_PLACEMENT.md`

### Prompt

```md
Follow the Shared Rule Header.

Your task now is to determine the correct product placement of Identity Systems inside MorpBase.

Read:
- `IDENTITY_SYSTEMS_REALM_ANALYSIS.md`
- `IDENTITY_ENTITY_TAXONOMY_AND_CRITERIA.md`
- `IDENTITY_SYSTEMS_CONNECTION_MATRIX.md`
- `IDENTITY_SYSTEMS_CORE_REFINEMENT.md`
- `MORPBASE_MAIN_IDENTITY_DECISION.md`
- `MORPBASE_PRIMARY_USER_FACING_CENTER_DECISION.md`
- `MORPBASE_SUPPORTING_SYSTEM_RELATIONSHIP_DECISION.md`
- `MORPBASE_BUILDER_CENTERED_MEANING_ANALYSIS.md`
- `src/ui/App.tsx`
- `src/ui/components/LandingPage.tsx`

Evaluate:
- whether Identity Systems deserves dedicated top-level navigation
- whether it should be visible as a major realm before implementation
- how it should sit relative to:
  - Builder
  - Workflow Sources
  - Prompt Archive
  - Pool Hub
  - Profiles
- whether it should be described as an advanced realm, a major realm, or a latent future realm

Do not design screens in detail.
Stay at realm / product-structure level.

Required sections:

1. `Executive Conclusion`
2. `Recommended Realm Placement`
3. `Navigation-Level Judgment`
4. `Relationship To Existing Top-Level Surfaces`
5. `Why This Placement Fits MorpBase`
6. `What Would Be Premature`
7. `What Must Be True Before Realm Visibility Expands`
8. `Open Questions`

Save the result as:
`IDENTITY_SYSTEMS_REALM_PLACEMENT.md`
```

---

## Prompt 6

### Goal

Define the conceptual lifecycle and user journeys of Identity Systems before architecture work starts.

### Output

`IDENTITY_SYSTEMS_USER_JOURNEYS.md`

### Prompt

```md
Follow the Shared Rule Header.

Your task now is to model how Identity Systems would behave from the user's point of view, without designing detailed UI and without implementing anything.

Read:
- `IDENTITY_SYSTEMS_REALM_ANALYSIS.md`
- `IDENTITY_ENTITY_TAXONOMY_AND_CRITERIA.md`
- `IDENTITY_SYSTEMS_CONNECTION_MATRIX.md`
- `IDENTITY_SYSTEMS_CORE_REFINEMENT.md`
- `IDENTITY_SYSTEMS_REALM_PLACEMENT.md`
- `CHARACTER_IDENTITY_SYSTEM_THEORETICAL_WORKFLOW.md`
- `CHARACTER_IDENTITY_SYSTEM_CREATION_EDIT_UX.md`
- `CHARACTER_IDENTITY_SYSTEM_ENTRY_POINTS.md`

Model the lifecycle of an identity entity:
- create
- edit
- organize
- activate
- apply into Builder
- switch while working
- deactivate
- reuse across workflows
- relate to other entities
- archive / retire

You must distinguish:
- what happens inside the Identity Systems realm
- what happens inside Builder
- what happens in Prompt Preview
- what should never happen inside Builder directly

Required sections:

1. `Executive Conclusion`
2. `Identity Entity Lifecycle`
3. `Primary User Journeys`
4. `Activation / Deactivation Logic`
5. `Relationship To Builder Sessions`
6. `What Must Happen Outside Builder`
7. `Where Confusion Is Most Likely`
8. `Journey Gaps That Still Need Answers`

Save the result as:
`IDENTITY_SYSTEMS_USER_JOURNEYS.md`
```

---

## Prompt 7

### Goal

Prepare the architecture-level foundation without writing implementation code.

### Output

`IDENTITY_SYSTEMS_ARCHITECTURE_PREPARATION.md`

### Prompt

```md
Follow the Shared Rule Header.

Your task now is to prepare the architecture for future Identity Systems implementation, but not to implement it.

Read:
- `IDENTITY_SYSTEMS_REALM_ANALYSIS.md`
- `IDENTITY_ENTITY_TAXONOMY_AND_CRITERIA.md`
- `IDENTITY_SYSTEMS_CONNECTION_MATRIX.md`
- `IDENTITY_SYSTEMS_CORE_REFINEMENT.md`
- `IDENTITY_SYSTEMS_REALM_PLACEMENT.md`
- `IDENTITY_SYSTEMS_USER_JOURNEYS.md`
- `IDENTITY_ENTITIES_SEPARATE_FROM_BUILDER_CONCEPT.md`
- `CHARACTER_IDENTITY_SYSTEM_DATA_SHAPE.md`
- `CHARACTER_IDENTITY_SYSTEM_ARCHITECTURE_ANALYSIS.md`
- `src/ui/App.tsx`
- `src/ui/components/PromptPreview.tsx`
- `src/types/promptAdditions.ts`

You must define:
- what major data domains would exist
- what state should live inside Builder vs outside Builder
- what persistence layers would likely exist
- what activation state would be needed
- what kinds of identity-to-workflow projection rules would exist conceptually
- what must remain separate from Pools / Territories / IDP sets

This is not a code plan yet.
This is architecture preparation.

Required sections:

1. `Executive Conclusion`
2. `Recommended Architecture Shape`
3. `Major Data Domains`
4. `Session State vs Realm State`
5. `Persistence-Level Thinking`
6. `Projection Into Builder / Prompt Preview`
7. `Separation Rules`
8. `Architecture Risks`
9. `What Is Still Unknown`

Save the result as:
`IDENTITY_SYSTEMS_ARCHITECTURE_PREPARATION.md`
```

---

## Prompt 8

### Goal

Audit current runtime drift, existing premature implementation shapes, and real codebase readiness.

### Output

`IDENTITY_SYSTEMS_RUNTIME_DRIFT_AND_READINESS_AUDIT.md`

### Prompt

```md
Follow the Shared Rule Header.

Your task now is to compare the conceptual Identity Systems preparation against the current MorpBase runtime and codebase state.

This prompt exists to prevent premature or conceptually wrong implementation paths.

Read:
- `IDENTITY_SYSTEMS_REALM_ANALYSIS.md`
- `IDENTITY_ENTITY_TAXONOMY_AND_CRITERIA.md`
- `IDENTITY_SYSTEMS_CONNECTION_MATRIX.md`
- `IDENTITY_SYSTEMS_CORE_REFINEMENT.md`
- `IDENTITY_SYSTEMS_REALM_PLACEMENT.md`
- `IDENTITY_SYSTEMS_USER_JOURNEYS.md`
- `IDENTITY_SYSTEMS_ARCHITECTURE_PREPARATION.md`
- `src/ui/App.tsx`
- `src/ui/components/PromptPreview.tsx`
- `src/ui/components/CharacterLibraryModal.tsx`
- `src/engine/characterStore.ts`
- `src/types/characters.ts`
- `src/types/promptAdditions.ts`

You must audit:
- where the current codebase already gestures toward Identity work
- where it still has no real support
- where existing Character-specific runtime behavior is conceptually premature
- what parts of the current runtime would mislead future Identity implementation
- what file areas are likely true future integration points
- what should probably be removed, ignored, refactored, or treated as disposable before real Identity work begins

This is a readiness and drift audit, not an implementation plan.

Required sections:

1. `Executive Conclusion`
2. `Where The Current Runtime Already Touches Identity`
3. `Where The Current Runtime Drifts From The Realm Concept`
4. `Premature Character-Specific Shapes`
5. `Likely Future Integration Points`
6. `Dangerous Assumptions To Avoid`
7. `Codebase Readiness Judgment`
8. `What Should Be Treated As Temporary Or Disposable`
9. `Open Questions`

Save the result as:
`IDENTITY_SYSTEMS_RUNTIME_DRIFT_AND_READINESS_AUDIT.md`
```

---

## Prompt 9

### Goal

Define the missing bridge from the future realm to one first proving lane without letting the realm collapse into that lane.

### Output

`IDENTITY_SYSTEMS_REALM_TO_FIRST_LANE_TRANSLATION_DECISION.md`

### Prompt

Use the exact prompt in:

`IDENTITY_SYSTEMS_REALM_TO_FIRST_LANE_TRANSLATION_PROMPT.md`

Do not continue to Prompt 10 until `IDENTITY_SYSTEMS_REALM_TO_FIRST_LANE_TRANSLATION_DECISION.md` exists.

---

## Prompt 10

### Goal

Choose the right first proving lane without collapsing the whole realm into it.

### Output

`IDENTITY_SYSTEMS_FIRST_WAVE_PROVING_DECISION.md`

### Prompt

```md
Follow the Shared Rule Header.

Your task now is to decide what the best first proving lane is for Identity Systems.

Read:
- `IDENTITY_SYSTEMS_REALM_ANALYSIS.md`
- `IDENTITY_ENTITY_TAXONOMY_AND_CRITERIA.md`
- `IDENTITY_SYSTEMS_CONNECTION_MATRIX.md`
- `IDENTITY_SYSTEMS_CORE_REFINEMENT.md`
- `IDENTITY_SYSTEMS_REALM_PLACEMENT.md`
- `IDENTITY_SYSTEMS_USER_JOURNEYS.md`
- `IDENTITY_SYSTEMS_ARCHITECTURE_PREPARATION.md`
- `IDENTITY_SYSTEMS_RUNTIME_DRIFT_AND_READINESS_AUDIT.md`
- `IDENTITY_SYSTEMS_REALM_TO_FIRST_LANE_TRANSLATION_DECISION.md`
- `FUTURE_PROJECTS_AHEAD.md`
- `REUSABLE_IDENTITY_FRAMEWORK_CONCEPT.md`
- `SHOULD_CHARACTER_IDENTITY_BE_NEXT.md`

Evaluate possible first-wave proving lanes such as:
- Character Identity only
- Character Identity + Outfit Identity
- Character Identity with future framework preserved but not built
- a narrower proving lane that is not yet a visible realm

For each candidate proving lane, analyze:
- conceptual strength
- risk of overcommitting too early
- fit with current MorpBase maturity
- future expandability
- clarity to users
- implementation danger

Required sections:

1. `Executive Conclusion`
2. `Candidate First-Wave Lanes`
3. `Evaluation Of Each Lane`
4. `Best First Proving Choice`
5. `Why The Other Options Should Wait`
6. `What Must Remain Explicitly Out Of Scope`
7. `How To Preserve The Larger Realm While Proving One Lane`
8. `Open Questions`

Save the result as:
`IDENTITY_SYSTEMS_FIRST_WAVE_PROVING_DECISION.md`
```

---

## Prompt 11

### Goal

Synthesize the full Identity Systems preparation work into the final master pre-implementation brief.

### Output

`IDENTITY_SYSTEMS_MASTER_PRE_IMPLEMENTATION_BRIEF.md`

### Prompt

```md
Follow the Shared Rule Header.

Your task now is to synthesize the full Identity Systems preparation work into the final pre-implementation brief.

Read:
- `IDENTITY_SYSTEMS_REALM_ANALYSIS.md`
- `IDENTITY_ENTITY_TAXONOMY_AND_CRITERIA.md`
- `IDENTITY_SYSTEMS_CONNECTION_MATRIX.md`
- `IDENTITY_SYSTEMS_CORE_REFINEMENT.md`
- `IDENTITY_SYSTEMS_REALM_PLACEMENT.md`
- `IDENTITY_SYSTEMS_USER_JOURNEYS.md`
- `IDENTITY_SYSTEMS_ARCHITECTURE_PREPARATION.md`
- `IDENTITY_SYSTEMS_RUNTIME_DRIFT_AND_READINESS_AUDIT.md`
- `IDENTITY_SYSTEMS_REALM_TO_FIRST_LANE_TRANSLATION_DECISION.md`
- `IDENTITY_SYSTEMS_FIRST_WAVE_PROVING_DECISION.md`
- `FUTURE_PROJECTS_AHEAD.md`
- `SHOULD_CHARACTER_IDENTITY_BE_NEXT.md`

You must produce a final brief that answers:
- what Identity Systems is
- why it matters
- what belongs inside it
- how it relates to MorpBase
- whether it deserves realm status
- what the best first proving entity or entity-group is
- what should explicitly remain out of scope
- what conceptual and architecture questions are now settled
- what still blocks implementation planning
- whether MorpBase is finally ready to begin real implementation planning after this sequence

This brief should be the final handoff before actual implementation planning begins.

Required sections:

1. `Executive Conclusion`
2. `Final Definition Of Identity Systems`
3. `Final Role Inside MorpBase`
4. `Valid Identity Entity Classes`
5. `Final Realm Placement Judgment`
6. `Best First Proving Lane`
7. `What Must Stay Out Of Scope`
8. `Architecture Preparation Summary`
9. `Runtime Readiness Summary`
10. `Implementation Planning Readiness Judgment`
11. `Remaining Blockers`
12. `Final Recommendation`

Save the result as:
`IDENTITY_SYSTEMS_MASTER_PRE_IMPLEMENTATION_BRIEF.md`
```

---

## Prompt 12

### Goal

Run a final gate that determines whether Identity Systems is truly ready to move from preparation into real implementation planning.

### Output

`IDENTITY_SYSTEMS_IMPLEMENTATION_READINESS_GATE.md`

### Prompt

Use the exact prompt in:

`IDENTITY_SYSTEMS_IMPLEMENTATION_READINESS_GATE_PROMPT.md`

This gate must be passed before any implementation planning is treated as valid.

---

## Recommended Stop Gates

Stop after Prompt 1 if:
- the realm itself is still conceptually weak

Stop after Prompt 3 if:
- the system boundaries are still too blurry

Stop after Prompt 5 if:
- the realm placement still feels unjustified

Stop after Prompt 7 if:
- the architecture preparation still depends on unresolved concept contradictions

Stop after Prompt 8 if:
- the runtime drift is large enough that implementation planning would be based on the wrong code assumptions

Stop after Prompt 9 if:
- the realm-to-lane translation is still not trustworthy

Stop after Prompt 10 if:
- the proving-lane choice still risks collapsing the realm into Character

Stop after Prompt 11 if:
- the final brief still contains major contradictions or hidden prototype drift

Only move to actual implementation planning after Prompt 12 exists and explicitly says MorpBase is ready.

---

## Final Note

This roadmap is meant to prepare Identity Systems properly as a future realm, not to accidentally shrink it into a premature Character feature.
