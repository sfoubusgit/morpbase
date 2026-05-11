# Character Identity Controlled Proof Implementation Plan

## 1. Executive Conclusion

This plan defines the **first implementation-planning phase** for `Character Identity` under the final gate judgment:

- `Identity Systems` is only **Conditionally Ready**
- planning is allowed only for a **controlled first proving lane**
- that lane is:
  - **Character Identity with the larger realm explicitly preserved but not built**

This document is **not** an implementation spec for the full `Identity Systems` realm.
It is a planning document for the first narrow lane only.

Its core purpose is:

- translate the finished concept work into a disciplined implementation-planning sequence
- preserve realm truth while planning one lane
- prevent the current Character prototype from quietly becoming the architecture root

The reassessment in [IDENTITY_SYSTEMS_REASSESSMENT_AND_CORRECTIONS.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/IDENTITY_SYSTEMS_REASSESSMENT_AND_CORRECTIONS.md) should be treated as a later governing correction to this plan wherever certainty levels or workstream order need tightening.

Where this plan conflicts with earlier Character planning docs, this document should be treated as the stronger source of truth.

---

## 2. Authority And Scope

### This plan is authorized to plan

- `Character Identity` as the first controlled proof
- the minimal lane-specific domain model needed for that proof
- narrow Builder activation state
- Prompt Preview live application behavior
- a lane-specific management surface
- a minimal archive-grounding strategy
- selective reuse or replacement of the current Character prototype

### This plan is not authorized to plan

- full `Identity Systems` realm implementation
- multi-lane framework implementation
- Outfit / Prop / Creature / Group implementation
- top-level `Identity Systems` product rollout
- full relationship-domain implementation
- full identity publishing or discovery systems
- full archive-lineage infrastructure

This scope boundary must remain visible in every later planning step.

---

## 3. Planning Assumptions That Are Safe

Implementation planning may safely assume:

### 1. Realm truth

`Identity Systems` is a future MorpBase realm for reusable continuity entities.

### 2. Lane choice

`Character Identity` is the best first controlled proving lane.

### 3. Builder relationship

Builder should host:

- live activation state

not:

- identity authoring ownership

### 4. Prompt Preview role

Prompt Preview is the strongest surface for:

- apply
- inspect
- switch
- remove

### 5. Prototype status

The current Character runtime is:

- behaviorally useful
- architecturally provisional
- conceptually subordinate to the realm

### 6. Out-of-scope discipline

The planning phase must preserve:

- no full realm rollout
- no multi-lane build
- no giant generic framework first

---

## 4. Planning Assumptions That Are Forbidden

Implementation planning must not assume:

### 1. Character equals the realm

### 2. The current Character runtime is already the architecture root

### 3. Current `promptAdditions` typing is already the final projection contract

### 4. Current local Character CRUD is already the final persistence architecture

### 5. One lane justifies top-level realm exposure

### 6. Full lineage infrastructure is required immediately

### 7. Future lane taxonomy is settled by the first lane

These are hard planning prohibitions, not soft suggestions.

---

## 5. How To Treat The Current Character Prototype

The existing Character runtime should be split into four buckets.

### Preserve conceptually

- Prompt Preview apply / change / remove behavior in [PromptPreview.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/PromptPreview.tsx)
- library / application split from [CharacterLibraryModal.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/CharacterLibraryModal.tsx)
- narrow session activation pattern in [App.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)
- lane-level schema idea in [characters.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/characters.ts)

### Treat as provisional

- `activeCharacterId` as the exact final session field shape
- `'character'` as the exact final projection type in [promptAdditions.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/promptAdditions.ts)
- direct phrase-bundle injection in [App.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)
- the current modal structure and form layout

### Distrust architecturally

- any implication that Builder already owns identity
- any implication that Character-specific runtime shape is the generalized identity architecture
- any implication that prompt-addition flattening is the realm’s true projection model

### Leave disposable until later planning confirms reuse

- exact UI labels
- exact local store API
- exact field-level editor layout

This disposition should be explicitly restated at the start of every implementation-planning subdocument.

---

## 6. Target Shape Of The Controlled Proof

The planning target should be a lane-specific product slice with these properties:

### 1. One reusable Character Identity lane

The user can create and manage reusable character entities.

### 2. Narrow session activation

One live workflow can carry:

- zero or one active Character Identity

### 3. Prompt Preview application

The user can:

- apply
- inspect
- switch
- remove

the active Character Identity from the workflow control surface.

### 4. Realm/lane distinction remains explicit

The product must not teach:

- `Characters = the whole Identity Systems realm`

### 5. Minimal archive-grounding path remains open

Even if lineage is not fully implemented, planning must preserve a believable future path where saved outputs can later remember identity use.

### 6. Low-to-moderate product exposure

The lane should be visible enough to prove real use, but restrained enough not to imply that the whole realm is now fully present.

---

## 7. Planning Workstreams

The cleanest planning sequence has six workstreams.

## Workstream 1: Lane Domain Model

Goal:

- define the Character Identity lane model as a lane-specific entity, not as the whole realm schema

Planning questions:

- what lane-specific fields are required vs optional?
- what part of the existing [characters.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/characters.ts) shape survives?
- what lane model should remain visibly separate from future realm-level abstractions?

Deliverable:

- `CHARACTER_IDENTITY_CONTROLLED_PROOF_DATA_PLAN.md`

## Workstream 2: Session Activation Plan

Goal:

- define the exact session-side shape for one active character without treating it as the generalized realm model

Planning questions:

- should planning keep `activeCharacterId` or use a more lane-aware shape?
- what belongs in Builder session state vs outside it?
- how should clear/reset/undo semantics behave under the controlled-proof model?

Deliverable:

- `CHARACTER_IDENTITY_SESSION_ACTIVATION_PLAN.md`

## Workstream 3: Projection And Prompt Contribution Plan

Goal:

- define how Character Identity projects into live workflow composition without letting current prompt-addition hardening dictate the answer

Planning questions:

- should there be an explicit lane projection model before `promptAdditions`?
- what is the minimum planning contract needed?
- what ordering assumptions are safe?

Deliverable:

- `CHARACTER_IDENTITY_PROJECTION_PLAN.md`

## Workstream 4: Prototype Migration / Containment Plan

Goal:

- decide exactly what current Character code is reused, replaced, wrapped, or treated as temporary

Planning questions:

- what behavior should survive?
- what file areas are likely to be rewritten?
- how do we keep the prototype from dictating broader architecture?

Deliverable:

- `CHARACTER_IDENTITY_PROTOTYPE_CONTAINMENT_PLAN.md`

## Workstream 5: Minimal Archive-Grounding Plan

Goal:

- define the least amount of archive-lineage support that planning must preserve so the lane does not become an elegant but ungrounded system

Planning questions:

- what should saved prompts eventually remember?
- what can be deferred safely?
- what planning hooks are required now even if code comes later?

Deliverable:

- `CHARACTER_IDENTITY_MINIMAL_LINEAGE_PLAN.md`

## Workstream 6: Management Surface Plan

Goal:

- define the lane-specific management surface for Character Identity as a proof surface, not as full realm UI

Planning questions:

- keep modal first, or plan a lane surface that may later grow?
- what parts of the current [CharacterLibraryModal.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/CharacterLibraryModal.tsx) are worth retaining?
- how much realm language should appear beside a lane-first `Characters` surface?

Deliverable:

- `CHARACTER_IDENTITY_MANAGEMENT_SURFACE_PLAN.md`

---

## 8. Recommended Planning Sequence

The next planning phase should happen in this order:

1. lane domain model
2. session activation plan
3. projection plan
4. prototype containment plan
5. minimal lineage plan
6. management surface plan
7. synthesis into one controlled-proof implementation spec

That order is deliberate:

- domain first
- session bridge second
- projection third
- prototype containment fourth
- grounding fifth
- management surface sixth

This prevents the plan from becoming UI-first or prototype-first and moves prototype containment and archive grounding earlier in the sequence.

---

## 9. Stop Conditions Inside Planning

Planning should pause immediately if any of these happen:

### 1. The lane starts redefining the realm

Example:

- Character planning starts making claims about all future identity classes

### 2. The current prototype becomes the hidden authority

Example:

- planning says “we already have this in code, so keep it” without re-justifying it under the controlled-proof model

### 3. Planning starts assuming broad realm exposure

Example:

- adding top-level `Identity Systems` or broader public realm commitments

### 4. The projection model collapses back into raw prompt-addition inheritance

Example:

- planning blindly treats `sourceType: 'character'` as the final answer

### 5. Archive grounding disappears from the plan

Example:

- the lane becomes purely local CRUD plus injection with no future grounding path

If any of these happen, planning is drifting and should stop.

---

## 10. Relationship To Older Character Planning Docs

Earlier docs like:

- [IMPLEMENTATION_PLAN_CHARACTER_IDENTITY_SYSTEM.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/IMPLEMENTATION_PLAN_CHARACTER_IDENTITY_SYSTEM.md)
- [IDENTITY_IMPLEMENTATION_CHECKLIST.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/IDENTITY_IMPLEMENTATION_CHECKLIST.md)

are still useful as historical planning material, especially for:

- lane-level data shapes
- local-first experimentation
- Prompt Preview application ideas

But they were written before:

- the realm-vs-lane translation decision
- the controlled-proof model
- the final readiness gate

So where they conflict with the newer preparation stack, they should be treated as:

- older lane-first planning material

not:

- current governing implementation-planning truth

---

## 11. Final Planning Recommendation

The right next planning step is not one giant implementation spec immediately.

It is:

- a disciplined controlled-proof planning pass split into the six workstreams above

That will let MorpBase plan `Character Identity` seriously without:

- collapsing the full Identity Systems realm into Character
- allowing the current Character prototype to dictate the architecture
- or losing the archive-grounding and product-restraint rules that now protect the concept

## Final Lock

`Character Identity` may now enter strict implementation planning, but only as:

- **a controlled proof inside the larger future Identity Systems realm**

That is the planning boundary this document exists to protect.
