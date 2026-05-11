# Character Identity Lineage Storage Decision

## 1. Purpose

This document locks the exact first-proof storage strategy for Character lineage in saved prompts.

It resolves the main startup constraint left open in:

- [CHARACTER_IDENTITY_CONTROLLED_PROOF_PRE_CODE_GATE.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/CHARACTER_IDENTITY_CONTROLLED_PROOF_PRE_CODE_GATE.md)
- [CHARACTER_IDENTITY_CONTROLLED_PROOF_IMPLEMENTATION_SPEC.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/CHARACTER_IDENTITY_CONTROLLED_PROOF_IMPLEMENTATION_SPEC.md)

The question is not:

- whether saved prompts need Character grounding

That is already settled.

The question is:

- exactly how the first proof should store that grounding across local and cloud saves

---

## 2. Executive Decision

The first Character proof should use this storage strategy:

### App-level saved prompt contract

`SavedPrompt` should gain:

```ts
type SavedPromptCharacterLineage = {
  characterId: string;
  nameSnapshot: string;
};
```

```ts
type SavedPrompt = {
  ...
  characterLineage?: SavedPromptCharacterLineage;
};
```

### Local storage strategy

Local saved prompts should store:

- `characterLineage`

as an embedded nested object inside the local saved prompt JSON.

### Cloud storage strategy

Cloud saved prompts should store two nullable columns on `saved_prompts`:

- `character_id text`
- `character_name_snapshot text`

These two columns should be mapped back into:

- `characterLineage`

at the app/type layer.

### Important constraint

`character_id` should **not** be a foreign key in the first proof.

It should be:

- a lane reference string

not:

- a realm-owned cloud identity key

That is the correct first-proof decision.

---

## 3. Why This Is The Strongest First-Proof Strategy

### 1. It matches the minimal-lineage rule exactly

The first proof only needs to remember:

- which Character was active
- what that Character was called at save time

This strategy stores exactly that and nothing heavier.

### 2. It keeps local and cloud saves conceptually aligned

The app-level contract becomes:

- `characterLineage`

for both local and cloud paths.

That is cleaner than:

- one lineage model for local
- another lineage model for cloud

### 3. It respects the current local-first Character reality

The Character lane is still local-first.
So cloud lineage cannot honestly assume:

- a cloud Character catalog exists
- Character IDs are globally resolvable foreign keys

Storing:

- `character_id` as text

is the correct first-proof move because it preserves:

- reference continuity

without pretending:

- realm persistence is already solved

### 4. It keeps archive meaning readable under rename or deletion

The mandatory:

- `character_name_snapshot`

prevents saved prompts from becoming semantically empty if the live Character later:

- changes name
- is deleted
- is unavailable on another device

### 5. It avoids overbuilding

This strategy does not require:

- a sidecar lineage table
- a JSONB lineage structure
- a full usage-history system
- a cloud Character realm

That makes it the narrowest honest option.

---

## 4. Options Considered

## Option A: Embedded nested lineage object locally + flat lineage columns in cloud

Meaning:

- app contract uses `characterLineage`
- local JSON stores the nested object directly
- cloud table stores two explicit fields and maps them back to the nested object

Strengths:

- minimal
- queryable
- easy to understand
- aligns local and cloud conceptually
- avoids fake cloud realm assumptions

Weaknesses:

- app shape and SQL shape are not identical

Judgment:

- **chosen**

## Option B: JSON object locally + JSONB object in cloud

Meaning:

- store the same nested shape in both places

Strengths:

- structural symmetry

Weaknesses:

- heavier than needed
- worse fit for simple querying/filtering later
- too much storage structure for only two fields

Judgment:

- reject

## Option C: Sidecar lineage table in cloud

Meaning:

- keep `saved_prompts` table untouched
- store Character linkage in a separate table

Strengths:

- more normalized

Weaknesses:

- too heavy for the first proof
- creates extra infrastructure before the lane is even validated
- overstates lineage maturity

Judgment:

- reject

## Option D: Reference-only storage with no snapshot

Meaning:

- store only `characterId`

Strengths:

- smallest possible reference model

Weaknesses:

- archive meaning weakens under rename, delete, or cross-device gaps

Judgment:

- reject

---

## 5. Exact First-Proof Storage Shape

## 5.1 App/type layer

The first-proof app contract should be:

```ts
type SavedPromptCharacterLineage = {
  characterId: string;
  nameSnapshot: string;
};
```

```ts
type SavedPrompt = {
  id: string;
  name: string;
  positive: string;
  negative?: string;
  tags?: string[];
  model?: string;
  purpose?: string;
  usedAt?: string;
  note?: string;
  characterLineage?: SavedPromptCharacterLineage;
  createdAt: number;
  updatedAt: number;
};
```

### Why nested at the app layer

Because this makes lineage read as:

- one compact concept

instead of:

- two loose saved-prompt fields with no semantic grouping

That is the clearest first-proof app contract.

## 5.2 Local storage

In local prompt JSON storage, save:

```ts
characterLineage?: {
  characterId: string;
  nameSnapshot: string;
}
```

No flattening is needed locally.

## 5.3 Cloud storage

In `public.saved_prompts`, add:

- `character_id text`
- `character_name_snapshot text`

### Why `text`

Because the first proof should not assume:

- UUID Character IDs
- cloud Character entity ownership
- foreign-key-ready identity persistence

### Why no foreign key

Because the Character lane still uses:

- local-first entity persistence

So a foreign key would falsely imply:

- the Character catalog already lives in cloud persistence as a settled identity domain

That is not yet true.

### Why no JSONB

Because two flat fields are enough and support easier future filtering.

---

## 6. Mapping Rules

The implementation should follow these rules.

### On local save

If a Character is active:

- save `characterLineage.characterId`
- save `characterLineage.nameSnapshot`

If no Character is active:

- omit `characterLineage`

### On cloud save

If a Character is active:

- set `character_id`
- set `character_name_snapshot`

If no Character is active:

- store both as `null`

### On read from cloud

When reading a saved prompt row:

- if both fields are present and valid, map them into `characterLineage`
- if neither is present, omit `characterLineage`

### On save-local-to-cloud

If the local prompt already has `characterLineage`, preserve it into the cloud row.

### On export/import

Exported prompt payloads should preserve `characterLineage` when present.
Imported prompts should restore it when valid.

---

## 7. Accepted First-Proof Limitation

This decision intentionally accepts one limitation:

- cloud saved prompts may remember a `characterId` that does not resolve to a live Character catalog entry on another device

This is acceptable in the first proof because:

- Character persistence is still local-first
- archive grounding is the immediate goal
- `nameSnapshot` preserves human-readable meaning even when live resolution is unavailable

This limitation should be treated as:

- acceptable for the controlled proof

not:

- a sign that the storage decision is wrong

---

## 8. What This Decision Does Not Authorize

This storage decision does **not** authorize:

- cloud Character realm persistence
- foreign-key Character entities
- Character publishing
- cross-device Character sync
- full lineage infrastructure

It only authorizes:

- a narrow saved-output grounding hook

---

## 9. Implementation Consequences

This decision means the first code pass should update:

### Types

- [prompts.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/prompts.ts)

### Prompt persistence

- [promptStore.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/promptStore.ts)

### Local save flow

- [PromptLibrary.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/PromptLibrary.tsx)

### Cloud schema

- new Supabase migration extending `saved_prompts`

### Optional downstream surfaces later

- archive filtering or display can remain for later

The key point is:

- storage must be implemented now
- archive UI can remain later

---

## 10. Final Recommendation

The Character first proof should store lineage as:

- a nested `characterLineage` object in app/local types
- two explicit nullable columns in cloud persistence

## Final Lock

The exact startup storage decision is now:

- **app contract:** `characterLineage`
- **local persistence:** embedded object
- **cloud persistence:** `character_id` + `character_name_snapshot`
- **no foreign key**
- **no sidecar table**

That is the narrowest honest storage strategy for the first Character controlled proof.
