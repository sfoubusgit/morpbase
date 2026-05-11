# Character Identity Controlled Proof Data Plan

## 1. Executive Conclusion

The Character Identity lane needs a **lane-specific data model** that is:

- strong enough to prove recurring cross-workflow character continuity
- narrow enough to avoid defining the whole `Identity Systems` realm
- separate from Pools, Territories, Builder categories, and saved prompts
- compatible with a future realm-level architecture without pretending to be it already

The best planning conclusion is:

- keep a dedicated `CharacterIdentity` lane type
- preserve the current structured identity + phrase bundle idea
- add a small amount of explicit lane metadata and lifecycle clarity
- avoid premature realm-level abstractions inside the lane model

So the lane data model should be treated as:

- a **valid lane schema example**

not:

- the final identity-realm schema

That distinction is the most important thing this plan protects.

---

## 2. Controlled-Proof Data Standard

Under the controlled-proof model, the lane data plan must satisfy these rules.

### Rule 1: The lane model must prove one entity class, not define the whole realm

This plan may define:

- Character-specific fields
- Character-specific continuity anchors
- Character-specific prompt-facing representation

This plan may not define:

- generalized identity-entity schemas for all future lanes

### Rule 2: The lane model must preserve entity-ness

A Character Identity must remain:

- one reusable continuity entity

not:

- a prompt template blob
- a Builder selection bundle
- a disguised Pool object

### Rule 3: The lane model must stay above workflow realization

The data model must store:

- who the recurring character is

It must not store:

- style-family realization
- Territory composition
- scene composition logic
- host-Pool behavior

### Rule 4: The lane model must support future projection without being reduced to projection

The phrase bundle is important, but it is:

- one prompt-facing representation

not:

- the whole character

### Rule 5: The lane model must stay compatible with future realm growth without prebuilding it

The data model should leave conceptual room for:

- lane classification
- lifecycle status
- future lineage

But it should not force:

- broad generic realm scaffolding

---

## 3. What This Lane Data Model Is For

The lane model must support these jobs.

### 1. Reusable character continuity

The same character must remain meaningful across:

- multiple Builder sessions
- multiple Pools
- multiple Territories

### 2. Lane-specific editing and management

The model must support:

- creation
- editing
- organization
- later retirement

within the Character lane

### 3. Prompt-facing workflow application

The model must support:

- a projected character layer in live workflows

without becoming identical to the projection itself.

### 4. Later archive-grounded refinement

The model should preserve enough identity clarity that future saved-output lineage can make sense against it.

### 5. Future realm coexistence

The model must be compatible with a future where:

- Character is one lane
- Outfit / Prop / Creature / Group remain separate lanes

---

## 4. What This Lane Data Model Must Not Do

The lane model must not try to do these jobs.

### 1. It must not define the realm-wide entity taxonomy

That belongs above the lane.

### 2. It must not absorb Pool logic

No:

- style-family fields
- workflow-family fields
- rendering-host fields

### 3. It must not absorb Territory logic

No:

- Territory section maps
- Territory source references
- Territory behavior

### 4. It must not absorb session activation state

The lane model should not itself contain:

- active / inactive in current Builder session

That belongs in session activation planning.

### 5. It must not absorb lineage infrastructure

The lane model may leave hooks for future lineage.
It should not be overloaded with full usage-history structure now.

### 6. It must not become a giant trait engine

Too much structure too early would make the lane heavy and brittle.

---

## 5. Recommended Lane Entity Shape

The best lane entity shape remains close to the current strong idea:

```ts
type CharacterIdentity = {
  id: string;
  lane: 'character';
  status: CharacterIdentityStatus;
  name: string;
  summary?: string | null;
  identity: CharacterIdentityFields;
  phraseBundle: CharacterPhraseBundle;
  meta?: CharacterIdentityMeta;
  createdAt: number;
  updatedAt: number;
};
```

This is not proposed as the full realm schema.
It is proposed as the **lane entity shape** for Character Identity.

### Why add `lane`

Even though this is a Character-only lane model, including:

- `lane: 'character'`

helps make one important point explicit:

- this is one lane inside a larger future realm

### Why add `status`

The controlled-proof lifecycle already includes:

- active use
- archive / retire thinking

So a minimal lifecycle field is worth planning now.

### Why keep `identity` + `phraseBundle`

This split remains strong:

- `identity` = structured continuity truth
- `phraseBundle` = prompt-facing representation

That protects the distinction between:

- the entity
- its workflow projection

### Why `meta` should stay small

Metadata should support management without becoming the point of the model.

---

## 6. Recommended Supporting Types

### Lifecycle status

```ts
type CharacterIdentityStatus =
  | 'draft'
  | 'active'
  | 'retired';
```

Why:

- this is enough to support lifecycle thinking
- it avoids pretending we already need a giant state machine

### Identity fields

```ts
type CharacterIdentityFields = {
  archetype?: string | null;
  role?: string | null;
  ageImpression?: string | null;
  presentation?: string | null;
  personalityTone?: string | null;
  visualAnchors: CharacterVisualAnchor[];
  motifs: CharacterMotif[];
};
```

This remains strong because it is:

- structured enough to define continuity
- light enough to avoid becoming another Builder

### Visual anchors

```ts
type CharacterVisualAnchor = {
  id: string;
  label: string;
  text: string;
  kind?: 'hair' | 'face' | 'eyes' | 'silhouette' | 'clothing' | 'accessory' | 'other';
};
```

This should remain lightweight.

### Motifs

```ts
type CharacterMotif = {
  id: string;
  label: string;
  text: string;
};
```

This remains useful as a symbolic continuity layer.

### Phrase bundle

```ts
type CharacterPhraseBundle = {
  core: string[];
  optional?: string[];
};
```

This remains the right first controlled-proof representation.

It is compact and useful without forcing rich projection logic too early.

### Minimal metadata

```ts
type CharacterIdentityMeta = {
  tags?: string[];
  notes?: string | null;
  favorite?: boolean;
};
```

This should remain optional and subordinate.

---

## 7. Required Vs Optional Fields

The lane model should distinguish between what is required to make a reusable character real and what is optional support.

### Required

- `id`
- `lane`
- `status`
- `name`
- `identity.visualAnchors`
- `identity.motifs`
- `phraseBundle.core`
- `createdAt`
- `updatedAt`

### Required with validation rules

- `phraseBundle.core`
  - should contain at least one meaningful continuity phrase

### Optional but recommended

- `summary`
- `archetype`
- `role`
- `presentation`
- `personalityTone`

### Optional

- `ageImpression`
- `meta.tags`
- `meta.notes`
- `meta.favorite`
- `phraseBundle.optional`

This keeps the lane model:

- identity-centered
- reusable
- not bureaucratic

---

## 8. What From The Current `characters.ts` Shape Should Survive

The existing [characters.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/characters.ts) shape is still useful in several ways.

### Keep conceptually

- `CharacterIdentity`
- `CharacterIdentityFields`
- `CharacterVisualAnchor`
- `CharacterMotif`
- `CharacterPhraseBundle`

### Adjust in planning

- add explicit `lane`
- add explicit `status`
- allow small `meta`
- normalize optional nullability rules more deliberately

### Treat as provisional

- exact timestamp representation
- exact optional field nullability
- exact input/store split shape

The current file is a good lane-level prototype, but not a finalized planning contract yet.

---

## 9. What Must Stay Separate From Future Realm-Level Abstractions

This lane plan must remain visibly separate from future realm abstractions.

### 1. Do not introduce a generalized `IdentityEntity` code shape yet

That would pull the plan too far upward too early.

### 2. Do not force other lanes into placeholder fields

Examples to avoid:

- generic “slot” fields for Outfit or Artifact
- relationship arrays for future lanes by default

### 3. Do not make Character carry realm-wide lifecycle rules

The lane can have a small status field.
It should not pretend to define all future lifecycle policy.

### 4. Do not build lineage directly into the lane type

The lane should stay clean enough to support future lineage, not bloated by it now.

### 5. Do not use lane data shape as proof of realm schema

This must remain one lane example only.

---

## 10. Minimal Validation Rules

The lane data model should support a few strict validation expectations.

### 1. Name should be required

The entity should feel like a reusable thing, not a fragment list.

### 2. Core phrase bundle should not be empty

Without prompt-facing continuity language, the lane loses much of its practical use.

### 3. Visual anchors should exist

At least one meaningful visual anchor should be expected for a reusable continuity object.

### 4. Empty style / workflow fields should not exist because they should not exist at all

The model should prevent leakage from Pools and Territories by omission, not just by convention.

### 5. Status should default safely

Best likely default:

- `draft`

until the entity is intentionally saved as an active reusable lane object.

---

## 11. Data Risks

### 1. Over-structuring too early

If Character gets too many fields, it becomes:

- another Builder
- another trait engine

### 2. Under-structuring too much

If Character becomes only:

- one long text blob

then it loses:

- entity clarity
- continuity trust
- future projection discipline

### 3. Hidden realm inflation

If this lane plan starts sneaking in generic abstractions, it will overclaim more than the lane is supposed to prove.

### 4. Prototype inheritance by default

If the current `characters.ts` file is accepted without this planning layer, the prototype will quietly become the contract.

---

## 12. Final Recommendation

The controlled-proof Character lane should use:

- a dedicated `CharacterIdentity` entity
- structured identity fields
- a compact phrase bundle
- minimal lifecycle status
- small optional metadata
- explicit lane tagging

This is strong enough to prove the lane and restrained enough not to define the realm.

## Final Lock

The Character Identity data plan should be treated as:

- **one lane-specific schema inside the future Identity Systems realm**

not:

- **the realm schema itself**

That is the most important protection this workstream provides.
