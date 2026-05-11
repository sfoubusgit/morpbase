# Character Identity Controlled Proof Implementation Spec

## 1. Purpose

This document defines the **first actual implementation spec** for `Character Identity` as a controlled proof inside the larger future `Identity Systems` realm.

It is authorized by:

- [IDENTITY_SYSTEMS_IMPLEMENTATION_READINESS_GATE.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/IDENTITY_SYSTEMS_IMPLEMENTATION_READINESS_GATE.md)
- [IDENTITY_SYSTEMS_REASSESSMENT_AND_CORRECTIONS.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/IDENTITY_SYSTEMS_REASSESSMENT_AND_CORRECTIONS.md)
- [CHARACTER_IDENTITY_CONTROLLED_PROOF_SYNTHESIS.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/CHARACTER_IDENTITY_CONTROLLED_PROOF_SYNTHESIS.md)

Its job is to turn the planning stack into one implementable first-proof feature boundary without:

- collapsing Character into the full Identity Systems realm
- allowing the current prototype to define architecture by inertia
- overbuilding generic realm infrastructure

---

## 2. Executive Decision

The first implementation should ship:

- one reusable `Character Identity` lane
- one active Character per workflow
- Prompt Preview application controls
- a modal-first `Characters` lane surface for management
- a minimal saved-prompt Character lineage hook

The first implementation should **not** ship:

- a full `Identity Systems` realm surface
- multi-lane identity support
- relationship-domain behavior
- a full lineage system
- top-level `Identity Systems` navigation

The most important narrowing decisions in this spec are:

### 1. Keep the Character entity core small

For the first implementation, the Character type should stay close to the current strong prototype core and should **not** add optional lane scaffolding unless needed later.

### 2. Keep session state narrow and flat for the first proof

For the first implementation, keep:

- `activeCharacterId`

as the session reference field, but explicitly treat it as:

- first-proof lane state

not:

- future realm session architecture

### 3. Preserve a projection boundary without over-hardening it

The implementation should use a small internal Character projection step, but it does **not** need to publish or canonize a heavy projection architecture.

### 4. Ground the lane through saved prompts

Saved prompts created while a Character is active should remember:

- the Character reference
- the Character name snapshot

### 5. Keep the management surface modal-first

The first proof should continue to deliver the Character lane surface as:

- a dedicated modal-first `Characters` surface

not:

- a full page
- a top-level realm

---

## 3. User-Facing Feature Outcome

The first controlled proof should make this user story possible:

1. The user creates a reusable Character in the `Characters` surface.
2. The user returns to Builder.
3. In Prompt Preview, the user applies that Character to the current workflow.
4. The workflow composition now reflects Character continuity explicitly.
5. The user saves a prompt.
6. The saved prompt remembers which Character was active when it was saved.
7. Later, the user can still understand that saved prompt as Character-linked output.

If this story works cleanly, the first proof succeeds at the product level.

---

## 4. Exact First-Proof Data Contract

## 4.1 Character entity

For the first implementation, the Character lane should use this exact data shape:

```ts
type CharacterIdentity = {
  id: string;
  name: string;
  summary?: string;
  identity: CharacterIdentityFields;
  phraseBundle: CharacterPhraseBundle;
  createdAt: number;
  updatedAt: number;
};
```

With:

```ts
type CharacterIdentityFields = {
  archetype?: string;
  role?: string;
  ageImpression?: string;
  presentation?: string;
  personalityTone?: string;
  visualAnchors: CharacterVisualAnchor[];
  motifs: CharacterMotif[];
};
```

```ts
type CharacterPhraseBundle = {
  core: string[];
  optional?: string[];
};
```

### Why this is the chosen first-proof contract

This keeps the strongest core:

- reusable identity entity
- structured continuity anchors
- prompt-facing phrase bundle

while deliberately deferring:

- `lane`
- `status`
- `meta`

Those may still arrive later.
They are not required for the first implementation proof.

### Validation rules

The first implementation should enforce:

- `name` required
- at least one `visualAnchor`
- at least one core phrase in `phraseBundle.core`

It should not yet require:

- tags
- status
- lifecycle metadata

---

## 4.2 Session contract

For the first implementation, Builder session state should keep:

```ts
activeCharacterId: string | null;
```

### Why this is the chosen first-proof contract

The reassessment correctly softened the exact session shape.

For the first implementation, keeping `activeCharacterId` is the narrowest honest choice because it:

- preserves working prototype behavior
- avoids premature multi-lane session scaffolding
- keeps the first proof simpler

### Important constraint

This field must be documented as:

- a first-proof lane reference only

not:

- the future Identity Systems session architecture

### Session behavior

The first implementation must support:

- apply Character
- switch Character
- remove Character
- restore Character from persisted session
- clear invalid Character references safely

### Clear behavior

Normal `Clear Prompt` should preserve `activeCharacterId`.

---

## 4.3 Projection contract

The first implementation should introduce a **small internal projection boundary** between:

- active Character entity

and:

- final prompt additions

The minimal first-proof projection shape should be treated as an internal implementation object like:

```ts
type CharacterProjection = {
  characterId: string;
  displayName: string;
  summary?: string;
  corePhrases: string[];
};
```

### Why this is the chosen first-proof contract

This preserves the essential distinction:

- Character entity != prompt contribution

while avoiding over-hardening a large public projection architecture too early.

### What the first implementation should do

1. resolve `activeCharacterId`
2. derive a Character projection object
3. translate that projection into `PromptAdditionEntry[]`
4. feed Prompt Preview from the Character projection context

### What it should not do

It should not keep using:

- raw Character entity -> prompt additions

as the conceptual model.

---

## 4.4 Saved-prompt lineage contract

The first implementation should extend saved prompts with a narrow Character lineage hook.

The feature-level contract should be:

```ts
type SavedPromptCharacterLineage = {
  characterId: string;
  nameSnapshot: string;
};
```

and saved prompts should conceptually gain:

```ts
characterLineage?: SavedPromptCharacterLineage;
```

### Why this is the chosen first-proof contract

This is the smallest honest grounding hook because it preserves:

- durable Character reference
- human-readable archive meaning

without requiring:

- full lineage infrastructure

### What the first implementation must do

When a prompt is saved while a Character is active:

- store the Character id
- store the Character name snapshot

When no Character is active:

- store no Character lineage

### What the first implementation does not need

- phrase snapshots
- history events
- Character summary snapshots
- lineage dashboards

### Storage note

The exact storage decision is now locked in:

- [CHARACTER_IDENTITY_LINEAGE_STORAGE_DECISION.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/CHARACTER_IDENTITY_LINEAGE_STORAGE_DECISION.md)

That means the first proof should use:

- `characterLineage` in the app/type layer
- embedded `characterLineage` for local saved prompts
- `character_id` + `character_name_snapshot` in cloud persistence

The feature contract remains:

- saved prompts explicitly remember Character linkage

---

## 5. Exact First-Proof Surface Model

## 5.1 Live application surface

`PromptPreview` remains the live Character application surface.

It should show:

- active Character name when present
- optional summary when present
- `Choose Character` when none is active
- `Change` and `Remove` when one is active

### Prompt Preview responsibilities

- show whether a Character is active
- open the `Characters` lane surface
- remove the current Character
- reflect Character as a distinct workflow layer

It should not become:

- the Character editor
- the Character library home

---

## 5.2 Management surface

The first implementation should keep:

- a modal-first `Characters` lane surface

This surface should support:

- list Characters
- create Character
- edit Character
- delete Character
- choose Character for current workflow

### Why modal-first remains correct

Because it preserves:

- lane dignity
- separation from ordinary Builder content
- product restraint

without prematurely implying:

- full `Identity Systems` realm exposure

### What the first implementation should not add

- full `Characters` page
- top-level `Identity Systems` nav
- advanced library analytics
- relationship management
- full archive lineage panels

---

## 6. Exact Prototype Reuse Strategy

## Preserve with modification

### [PromptPreview.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/PromptPreview.tsx)

Preserve:

- active Character visibility
- choose / change / remove pattern

Modify:

- feed it from projection-aware Character state rather than only raw prompt additions
- keep wording lane-specific, not realm-overclaiming

### [CharacterLibraryModal.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/CharacterLibraryModal.tsx)

Preserve:

- library / editor split
- create / edit / delete / choose basics

Modify:

- keep it explicitly lane-scoped
- refine copy and structure as needed

### [characters.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/characters.ts)

Preserve:

- the core entity shape

Modify:

- only as needed to match the chosen first-proof contract

## Preserve as prototype scaffolding

### [characterStore.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/characterStore.ts)

Preserve:

- local-first proving convenience

Treat as:

- first-proof scaffolding, not future realm persistence truth

## Replace conceptually

### [App.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)

Replace:

- direct Character phrase injection as the conceptual integration model

With:

- Character resolution -> Character projection -> prompt additions

### [promptAdditions.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/promptAdditions.ts)

Keep:

- `'character'` only as downstream annotation if still useful

Do not treat it as:

- the Character lane architecture contract

---

## 7. In Scope

The first implementation is in scope for:

- Character CRUD
- one active Character per workflow
- Prompt Preview application controls
- Character contribution to workflow composition
- persisted active Character reference in Builder session
- saved-prompt Character lineage hook
- modal-first Character lane surface

---

## 8. Out Of Scope

The first implementation is out of scope for:

- top-level `Identity Systems` realm navigation
- multi-lane identity support
- Outfit / Prop / Creature / Group lanes
- Character relationships
- retire/archive lifecycle beyond basic delete behavior
- public sharing / discovery
- rich archive lineage UI
- full continuity history infrastructure

---

## 9. Acceptance Criteria

The first proof should count as successful if all of these are true.

### 1. Reusable Character lane

Users can create a Character once and apply it in multiple workflows.

### 2. Clear live application

Users can apply, switch, and remove Characters through Prompt Preview clearly.

### 3. Builder/session boundary preserved

Builder stores only an active Character reference, not Character truth.

### 4. Projection boundary preserved

Character contribution is no longer modeled as direct entity flattening.

### 5. Archive grounding preserved

Saved prompts can explicitly remember Character use.

### 6. Product restraint preserved

The feature does not imply the full Identity Systems realm is already live.

---

## 10. Final Recommendation

Implementation work should begin from this spec, not from the older prototype shape and not from the earlier Character MVP docs alone.

## Final Lock

The first Character implementation should be:

- **small enough to stay controlled**
- **real enough to prove continuity value**
- **grounded enough to leave archive evidence**
- **restrained enough not to impersonate the whole Identity Systems realm**
