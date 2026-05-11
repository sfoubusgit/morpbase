# Identity Systems Architecture Preparation

## 1. Executive Conclusion

The cleanest architecture preparation for `Identity Systems` is:

- treat it as a **separate realm domain**
- keep its **persistent entity state outside Builder**
- let Builder hold only **narrow activation state**
- project active identities into the live workflow through a dedicated **identity-to-workflow projection layer**
- keep archive lineage as a **supporting downstream trace**, not the primary home of identity

Architecturally, the strongest model is not:

- a Pool extension
- a Territory extension
- a new Builder category family
- or a direct prompt-addition subtype as the defining architecture

It is:

> a reusable continuity-entity domain with a session-activation bridge into Builder and a visible application surface in Prompt Preview

That means the architecture should be prepared around four core concerns:

1. **realm-owned identity entities**
2. **session-owned active identity references**
3. **projection of active identity into workflow composition**
4. **later lineage and relationship support**

The current Character prototype proves that live activation hooks are possible, but it is too narrow to serve as the architecture root.

---

## 2. Recommended Architecture Shape

The strongest architecture shape is a layered model.

### Layer A: Identity Realm Domain

This layer owns:

- identity entities
- entity type classification
- continuity fields
- entity statuses
- organization metadata
- later entity relationships

This is the true home of the reusable objects.

### Layer B: Realm Application Bridge

This layer translates a realm entity into something Builder can activate.

It should own concepts like:

- activation references
- allowed identity lanes
- application eligibility
- local session attachment

This is the bridge between:

- realm state
- live workflow state

### Layer C: Workflow Projection Layer

This layer turns an active identity into workflow-facing effects.

It should conceptually handle:

- prompt-facing phrase contribution
- influence ordering relative to Pools / IDP / Builder selections
- visibility in Prompt Preview
- future explanation of what identity is contributing right now

This layer is downstream of the entity itself.

It should not be mistaken for the entity model.

### Layer D: Builder Session Layer

This layer stores only what the live session needs.

It should know:

- whether an identity is active
- what identity reference is active
- possibly which lane it belongs to
- perhaps lightweight session-local application choices

It should not own full entity authoring data.

### Layer E: Archive / Lineage Trace Layer

This is a later but important support layer.

It should eventually support:

- remembering which identity was active in saved outputs
- tracing repeated use of an entity
- grounding refinement in real history

This layer should observe identity use.
It should not replace the realm.

### Layer F: Future Ecosystem Layer

This is explicitly later.

If identities are ever published, shared, or browsed publicly, that would be a separate ecosystem concern parallel to existing Pool / profile surfaces.

That layer is not required for first-wave architecture preparation, but the architecture should leave room for it.

---

## 3. Major Data Domains

The architecture likely needs these major data domains.

### 1. Identity Entity Catalog

This is the core domain.

It would store:

- entity id
- entity lane / class
- name / anchor
- continuity-defining fields
- prompt-facing summary or phrase bundle
- lifecycle status such as draft / active / retired
- ownership / timestamps / notes

This is the architectural successor to the current Character-only storage idea, but generalized to the realm.

### 2. Identity Lane Definitions

The system needs a concept of lane or class.

Examples:

- Character Identity
- Outfit Identity
- Prop / Artifact Identity

Even if only one lane is proven first, the architecture should not pretend the realm has no class structure at all.

This domain may remain lightweight at first, but it should exist conceptually.

### 3. Identity Relationship Domain

This is likely later-wave, but it should be anticipated now.

It would model:

- entity-to-entity relationships
- linked identities
- supportive or dependent continuity relationships

Examples:

- Character wears Outfit
- Character carries Artifact
- Group contains Characters

This domain should remain outside Builder.

### 4. Identity Activation Domain

This is the session bridge.

It would store:

- active identity reference
- active lane
- activation timestamps or application state if needed
- future rules for switching or removal

This domain belongs close to Builder session state, but should still be conceptually separate from the entity catalog.

### 5. Identity Projection Domain

This domain expresses:

- how the active entity becomes workflow-visible
- what prompt-facing contribution is derived
- how Prompt Preview should represent it

This is especially important because the current runtime already flattens Character toward `promptAdditions`.

Architecturally, projection should be one downstream interpretation of identity, not the entity's only truth.

### 6. Identity Lineage Domain

This is the future evidence layer.

It would support:

- usage traces across sessions
- linkage to saved prompts
- repeated reuse evidence
- later refinement context

This domain is what keeps the archive-lineage grounding rule alive architecturally.

### 7. Identity Presentation Domain

Even without final UI design, the architecture should acknowledge two distinct presentation surfaces:

- realm-side entity management
- workflow-side live application

Those surfaces use the same underlying identity domain differently.

---

## 4. Session State vs Realm State

This is the most important architecture boundary.

### Realm State should own

- full entity definitions
- lane / class
- continuity fields
- phrase bundle or prompt-facing summary layer
- organization metadata
- lifecycle status
- relationship data
- later publishability or sharing state

This is persistent reusable state.

### Builder Session State should own

- active identity id
- active identity lane
- whether identity is active at all
- possibly minimal workflow-local application choices

This is live-use state only.

### Builder Session State should not own

- the identity library
- entity authoring fields
- relationship graph
- retirement status
- catalog organization

### Prompt Preview should read from both directions

Prompt Preview likely needs:

- session state to know what is active now
- realm state to know what that active thing is
- projection state to know how it contributes to the workflow

This is why Prompt Preview is best understood as a read / control surface, not the architecture root.

### Best preparation judgment

If MorpBase later implements Identity Systems correctly, the session should persist:

- references

not:

- full entity payloads by default

That keeps Builder narrow and prevents identity from becoming a Builder-owned subsystem.

---

## 5. Persistence-Level Thinking

The persistence architecture should likely separate three concerns.

### 1. Persistent Identity Catalog Storage

The realm needs its own persistence layer for reusable entities.

Initially, this could be:

- local-first storage

Later, likely:

- dedicated Supabase persistence

The important point is not the exact technology.
The important point is:

- identity persistence should not piggyback on Pool storage as if identities were special Pools

### 2. Builder Session Persistence

Builder already persists workflow session state.

That persistence may later include:

- active identity reference

But that should remain a narrow bridge field, not the primary identity store.

### 3. Saved Prompt / Archive Metadata Persistence

If archive-lineage support matures, saved outputs should eventually be able to remember:

- which identity was active
- perhaps which version or continuity snapshot shaped the output

This is not necessary for the earliest architecture proof, but it is architecturally important for long-term grounding.

### Persistence separation rule

The system should not collapse these three layers into one:

- identity catalog storage
- session activation persistence
- saved-output lineage persistence

They support different jobs and should remain distinct.

### Public / ecosystem persistence

If identities ever become shareable, there may later be:

- published identity records
- profile-linked identity publication

That belongs to a later ecosystem persistence layer, not the initial realm architecture.

---

## 6. Projection Into Builder / Prompt Preview

This is the most important architectural integration area.

### Identity must project, not flatten

The architecture needs a projection concept:

- the entity remains in the realm
- the session activates a reference
- the workflow receives a derived contribution

This is stronger than treating identity as:

- one more raw prompt snippet source

### Projection probably needs its own interpretation step

Instead of assuming:

- entity -> direct promptAdditions row

the architecture should conceptually allow:

- entity -> projection model -> workflow contribution

That projection model may later include:

- core phrases
- optional phrases
- lane-specific rules
- visibility metadata for Prompt Preview

### Prompt Preview needs a first-class identity view

Prompt Preview should likely display:

- what identity is active
- which lane it belongs to
- what role it is playing in the current workflow
- controls for switch / remove / inspect

That means the architecture should support identity-specific visibility, not only prompt-text assembly.

### Influence ordering matters

The architecture should preserve a conceptual order roughly like:

- identity continuity contribution
- host Pool / IDP baseline realization
- Territory context
- Builder selections and local refinements

The exact final composition order is still open, but identity should enter as a distinct layer with a clearly different job from Pool or IDP logic.

### First-wave simplification

For the first proving lane, the projection layer should probably assume:

- zero or one active entity in that lane

This keeps prompt-layer logic and Prompt Preview visibility manageable.

---

## 7. Separation Rules

These rules should govern architecture preparation.

### Rule 1: Identity catalog is not Pool storage

Even if both are reusable, their persistence and ownership boundaries should stay separate.

### Rule 2: Identity authoring is not Builder authoring

Builder should activate and use identity, not fundamentally own it.

### Rule 3: Territory remains workflow-space context

Identity architecture must not treat Territory as the authoring home of recurring entities.

### Rule 4: IDP remains host-specific baseline logic

Identity architecture must not absorb IDP sets into the identity realm.

### Rule 5: Prompt projection is not entity truth

The prompt-facing representation is one output of identity, not the whole entity model.

### Rule 6: Archive lineage is supporting evidence, not realm ownership

Prompt Archive may later remember identity usage, but it does not become the identity home.

### Rule 7: Character-specific prototype shapes must not define the realm

Current runtime fields like `activeCharacterId` and the `'character'` prompt source type may inform future integration points, but they should not hard-code the whole architecture conceptually.

---

## 8. Architecture Risks

### 1. Character prototype hardening too early

The biggest risk is letting the current runtime shape:

- activeCharacterId
- character store
- character prompt-addition type

become the architecture by accident.

That would narrow the realm too early.

### 2. Pool overlap

If identity entities start storing:

- style logic
- workflow-family logic
- host realization logic

they will duplicate Pools badly.

### 3. Territory overlap

If identity is expressed through Territory composition or Territory ownership, the realm boundary will collapse.

### 4. Projection overload

MorpBase already has several prompt influence layers.

If identity enters without a clearly explained projection model, it will become just one more confusing influence.

### 5. Realm inflation before evidence

If the architecture over-prepares for a giant multi-entity universe immediately, it may overfit a future that is not yet validated.

### 6. Weak lineage integration

If no downstream trace ever connects identity use to saved outputs, the system may stay elegant in theory but weak in practical refinement value.

### 7. Mixing session-local variation with entity revision

If workflow experimentation starts mutating reusable entity truth too easily, the architecture will blur session state and realm state.

---

## 9. What Is Still Unknown

### 1. Final first-wave lane shape

Architecture can be prepared generically, but the precise proving lane still matters:

- Character only
- Character with explicit realm preservation
- or slightly broader first-wave identity support

### 2. Exact projection granularity

It is not yet settled whether projection should expose:

- only a compact phrase bundle
- richer lane-specific contribution structure
- optional toggles per contribution piece

### 3. How far lineage should go in early architecture

It is clear that archive grounding matters.
It is not yet clear whether early identity architecture should include:

- minimal active-identity metadata only
- or richer usage history from the start

### 4. Relationship-domain timing

Relationships are clearly part of the larger realm, but it is still open whether architecture should include explicit relationship support from the first proving lane or keep it latent initially.

### 5. Realm visibility timing

The architecture now supports a latent major realm.
It is still unresolved when that realm becomes visibly product-level rather than merely conceptual.

### 6. What to preserve from the current Character runtime

Prompt 8 will need to judge more directly whether the existing Character code is:

- disposable scaffolding
- useful prototype behavior
- or mixed

That answer affects how much of the current integration shape should be treated as a future architecture hint.

## Final Lock

The strongest architecture preparation is:

- **realm-owned identity catalog**
- **narrow Builder activation state**
- **dedicated identity projection into workflow use**
- **later archive-lineage support**

That gives MorpBase a path toward implementing Identity Systems without collapsing the realm into:

- a Character-only widget
- a Pool variant
- a Territory variant
- or just another prompt-addition type
