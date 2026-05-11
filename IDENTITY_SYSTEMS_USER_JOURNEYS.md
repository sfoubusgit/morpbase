# Identity Systems User Journeys

## 1. Executive Conclusion

The cleanest user-journey model for `Identity Systems` is:

- identities are **created, edited, organized, related, and retired** in a dedicated identity realm
- identities are **activated, inspected, switched, and removed** from live workflows through Builder-adjacent workflow surfaces
- Builder only carries the **active applied identity state**, not the full authoring home of the entity
- Prompt Preview is the strongest place to make identity application legible

The most important journey truth is:

> the user should feel that an identity exists above the workflow, then intentionally brings it into the workflow

That means the lifecycle should not be modeled as:

- create identity inside Builder
- store identity as another prompt source row
- edit identity inline as if it were ordinary workflow content

It should be modeled as:

- define reusable continuity in the Identity Systems realm
- activate it into a Builder session when needed
- let Pool, Territory, IDP baseline, and Builder decisions specialize it locally
- preserve the identity outside those local workflow decisions

The archive-lineage grounding constraint also matters here:

- Identity Systems should not float as pure theory
- repeated workflow use and saved-output lineage should help justify, refine, and validate identity entities over time

So the healthiest user model is:

- **realm-owned identity**
- **workflow-applied usage**
- **archive-grounded refinement**

---

## 2. Identity Entity Lifecycle

The strongest lifecycle for an identity entity is:

### Stage 1: Recognition

The user realizes that a recurring thing should exist above one workflow.

Typical user realization:

- "this character keeps returning across workflows"
- "this outfit should stay reusable across multiple contexts"
- "this artifact should remain the same object again and again"

This stage may begin from:

- an idea before any workflow exists
- repeated Builder use
- repeated saved prompts / archive evidence

But recognition alone does not yet create the entity.

### Stage 2: Creation

The user creates the identity entity in the Identity Systems realm.

At creation time, the user defines:

- the entity name or anchor
- continuity-defining traits
- recurring visual or symbolic anchors
- a prompt-facing summary layer
- optional notes about what must remain stable

The user is **not** yet defining:

- final scene
- final composition
- host Pool logic
- Territory behavior
- full prompt workflow structure

Creation should answer:

- "what is this recurring entity?"

not:

- "what exact image am I making right now?"

### Stage 3: Save As Reusable Entity

The entity becomes a persistent reusable object in the realm.

At this point it should be:

- browsable
- revisitable
- editable
- applicable across workflows

This is the moment where the user should feel:

- "this now exists in MorpBase"

### Stage 4: Organize

The user organizes the entity inside the realm.

Organization may include:

- grouping by entity class
- tagging
- status markers such as active / draft / retired
- notes
- later, relationship links to other entities

This organization belongs to the realm, not to Builder.

### Stage 5: Activate Into A Workflow

The user enters Builder and intentionally applies the entity into a live session.

This is the key transition:

- realm state -> session state

At this point the identity becomes:

- active in the current workflow
- visible in Prompt Preview
- part of the live influence stack

But it still remains owned by the Identity Systems realm.

### Stage 6: Specialize Locally

Once active, the entity is locally specialized by:

- the current Pool host
- the active Territory
- IDP baseline logic
- Builder choices
- prompt-layer decisions

This stage must never be confused with editing the entity itself.

What changes here is:

- local realization

not:

- the core reusable identity object

### Stage 7: Switch / Remove / Replace

While working, the user may:

- switch the active identity
- deactivate it
- replace it with another one

This should affect:

- the live Builder session

It should not silently rewrite:

- the underlying identity entity

### Stage 8: Reuse Across Workflows

The same entity is later applied into:

- different Pools
- different Territories
- different Builder sessions

This is the real proof of the system.

If this stage does not feel clearly valuable, the realm is too abstract.

### Stage 9: Refine Through Repeated Use

After repeated use, the user may discover that the entity needs adjustment.

The healthy refinement loop is:

- use in workflows
- observe repeated results
- inspect saved outputs / archive lineage
- return to the realm
- edit the entity

This is why archive lineage is an important grounding constraint.

### Stage 10: Relate To Other Entities

As the realm matures, the user may connect entities.

Examples:

- Character uses Outfit
- Character carries Artifact
- Group contains Characters

These relationships should be authored in the realm, not improvised ad hoc inside Builder.

### Stage 11: Archive / Retire

An identity entity may later be:

- retired
- archived
- superseded

Retirement should preserve history without pretending the entity is still actively recommended.

This also belongs to the realm, not to Builder.

---

## 3. Primary User Journeys

### Journey A: Create First, Apply Later

This is the cleanest foundational journey.

1. User enters the Identity Systems realm.
2. User creates a new identity entity.
3. User defines its continuity anchors.
4. User saves it as a reusable entity.
5. Later, user opens Builder.
6. User chooses a Pool / Territory context as usual.
7. User applies the saved identity into the active workflow.
8. Prompt Preview shows the identity as an explicit active layer.
9. User builds and iterates while preserving continuity.

Why this journey matters:

- it teaches that identity exists before the workflow
- it preserves the entity boundary clearly

### Journey B: Workflow Use Of An Existing Identity

This is likely the most common steady-state journey.

1. User opens Builder for a new or existing workflow session.
2. User reaches Prompt Preview or a dedicated workflow control surface.
3. User applies an existing identity.
4. Builder session updates its active identity reference.
5. User continues working with Pool, Territory, and Builder decisions shaping local realization.
6. User saves outputs.
7. Later, user reuses the same identity again elsewhere.

Why this journey matters:

- it makes identity practical
- it avoids forcing the realm to become the center of use

### Journey C: Switch Identity Mid-Workflow

This journey matters because live workflows are iterative.

1. User is already working in Builder.
2. An identity is active.
3. User decides to compare another identity or remove the current one.
4. Prompt Preview becomes the decision surface:
   - switch
   - remove
   - inspect
5. Builder session updates active identity state.
6. Workflow output changes, but the entity library remains untouched.

Why this journey matters:

- it keeps identity flexible in use
- it proves Builder should host activation, not authoring

### Journey D: Lineage-Grounded Refinement

This is the most important grounding journey.

1. User has used an identity across several workflows.
2. Saved prompts and outputs show recurring continuity and recurring weaknesses.
3. User recognizes that the identity itself needs refinement.
4. User leaves the workflow context and returns to the Identity Systems realm.
5. User edits the reusable entity.
6. Future workflows inherit the stronger continuity.

Why this journey matters:

- it prevents identity from staying abstract
- it ties the realm back to repeated real use

### Journey E: Relationship Formation

This journey becomes important once the realm grows beyond one entity lane.

1. User already has reusable entities.
2. User wants one entity to recur alongside another.
3. User creates or edits that relationship in the realm.
4. Later, Builder can apply one entity with awareness of the other relationship.
5. Prompt Preview reveals the active entity layer or layers clearly.

Why this journey matters:

- it preserves the realm as entity-centered, not just a flat library

### Journey F: Archive / Retire Without Deleting History

1. User no longer wants an entity in active circulation.
2. User retires or archives it in the Identity Systems realm.
3. Old prompts and outputs may still show that the entity once existed.
4. The entity stops being an actively recommended reusable choice.

Why this journey matters:

- it lets the realm mature without turning into clutter

---

## 4. Activation / Deactivation Logic

The cleanest activation logic is:

### Activation must be explicit

Identity should not activate itself silently because:

- a Pool was chosen
- a Territory was chosen
- a saved prompt was opened

The user should intentionally apply the entity.

### Activation is session-level, not authorship-level

Builder may store:

- which identity is active
- whether one is active at all
- possibly which entity lane is active

Builder should not store:

- the full identity definition as if it were Builder-owned content

### Deactivation must be reversible

Removing an active identity from the live workflow should:

- deactivate the session link

It should not:

- delete the entity
- damage the entity
- silently rewrite the entity

### Switching should be first-class

Because identity is a live workflow influence, switching should be treated as normal behavior, not an edge case.

The user should be able to:

- inspect the current identity
- replace it with another
- remove it entirely

### Local changes should not quietly become entity edits

If a workflow-local prompt tweak is made during Builder use, that does not automatically mean:

- the underlying entity has changed

Any transition from workflow-local experimentation to entity revision should be explicit and realm-directed.

### First-wave simplicity rule

For the first proving lane, the cleanest conceptual rule is:

- one active entity per relevant identity lane in a Builder session

For example:

- zero or one active Character Identity

This keeps the proving lane legible before multi-entity or relationship complexity grows.

---

## 5. Relationship To Builder Sessions

The relationship should be narrow and disciplined.

### What Builder sessions should own

- active identity reference
- activation / deactivation state
- workflow-local realization of that identity
- the fact that the current session is using the identity

### What Builder sessions should not own

- master entity definition
- entity library management
- relationship authoring
- retirement state
- taxonomy ownership

### How Builder should experience identity

Builder should experience identity as:

- an applied continuity layer affecting the active workflow

not as:

- another category tree
- another source library
- another Territory structure

### How Prompt Preview should experience identity

Prompt Preview should be the clearest live-use surface for:

- showing whether an identity is active
- showing what kind of continuity entity it is
- letting the user apply, inspect, switch, or remove it

### How local workflow specialization should behave

When an identity is active in Builder:

- Pool, Territory, IDP baseline, and Builder choices shape local realization
- those local decisions should not automatically become changes to the reusable entity

This keeps the session / realm boundary intact.

---

## 6. What Must Happen Outside Builder

These activities belong in the Identity Systems realm, not in Builder.

### 1. Entity creation

The reusable entity itself should be created outside Builder.

### 2. Entity editing

Editing the persistent definition of the entity belongs outside Builder.

### 3. Entity organization

Tags, grouping, statuses, and library management belong outside Builder.

### 4. Relationship management

Entity-to-entity relationships belong outside Builder.

### 5. Archive / retire decisions

Lifecycle management of the entity library belongs outside Builder.

### 6. Cross-workflow continuity policy

What must remain stable across workflows should belong to the realm.

### 7. Any future publishing / sharing logic

If identities later become shareable, that should still belong to the realm or ecosystem layer, not Builder.

### What should never happen inside Builder directly

- full identity authoring
- treating an identity as a Pool subtype
- editing the entity library inline as ordinary workflow content
- creating entity relationships ad hoc as part of prompt assembly
- retiring or reorganizing the identity library from the live workflow surface

Builder can request these actions.
Builder should not become their true home.

---

## 7. Where Confusion Is Most Likely

### 1. Identity vs Pool

Users may think:

- "is this just another library item like a Pool?"

The correction is:

- Pool = source / realization host
- Identity = recurring entity continuity

### 2. Identity vs Territory

Users may think:

- "if Territory already shapes the workflow, why do I need identity too?"

The correction is:

- Territory = workflow-space context
- Identity = recurring who/what carried into that context

### 3. Identity vs prompt text

Users may think:

- "is this just a saved prompt bundle?"

The correction is:

- prompt output is one projection of identity
- it is not the full entity

### 4. Identity application vs identity editing

This is probably the single biggest journey-level confusion risk.

If the user changes a live workflow and sees a different result, they may assume:

- the entity itself changed

That must not be the default mental model.

### 5. Character over-centering

Because the current prototype and docs are strongest around Character, users may assume:

- Identity Systems = Characters only

That is acceptable for a first proving lane, but not as the final realm definition.

### 6. Realm visibility vs workflow visibility

Because the realm is currently conceptual and latent, users may not understand:

- where identities truly live
- where they are merely being applied

This is exactly why the lifecycle split must stay explicit.

---

## 8. Journey Gaps That Still Need Answers

### 1. How direct should archive-to-identity capture become?

The archive-lineage grounding rule is strong, but it is not yet settled whether MorpBase should later support:

- "promote this recurring output pattern into an identity"

If so, that flow must still end in realm-owned creation, not Builder-owned creation.

### 2. How visible should relationship logic be in first-wave product use?

Relationships are conceptually important, but they may be too heavy for the first proving lane.

### 3. When does a workflow-local variation deserve entity revision?

There is still no exact threshold for when:

- "this local change belongs only to this workflow"

becomes:

- "the reusable identity itself should change"

### 4. Should the first visible realm exposure be lane-first or realm-first?

The journeys work either way conceptually, but product exposure is still open:

- `Characters` first
- or later `Identity Systems` realm visibility

### 5. How much multi-entity behavior should exist in the first proving lane?

The cleanest first-wave rule is still:

- one active entity in the proving lane

But later entity relationships may pressure that simplicity.

### 6. What should happen to the current Character prototype?

The current runtime already demonstrates:

- apply
- switch
- remove

But it is still unclear whether that code should be treated as:

- disposable prototype scaffolding
- or useful pressure-test behavior to preserve conceptually

### 7. How should saved prompts reflect identity use?

It is likely valuable for archive lineage to remember:

- which identity was active

But the exact depth of that relationship is still not settled.

## Final Lock

The healthiest journey model is:

- **Identity realm owns entity life**
- **Builder owns live activation**
- **Prompt Preview owns the clearest live-use controls**
- **Archive lineage grounds refinement**

That is the lifecycle model most consistent with the selected direction:

- `Identity Systems` as a real future continuity realm
- not just a Character widget
- not just a prompt overlay
- and not just another source-management surface
