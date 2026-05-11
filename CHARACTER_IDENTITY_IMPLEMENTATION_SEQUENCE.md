# Character Identity Implementation Sequence

## 1. Purpose

This document turns the Character controlled-proof spec into a concrete build order.

It is not another concept note.
Its job is to answer:

- what should be implemented first
- what should wait until earlier dependencies exist
- which files are involved at each step
- what should **not** be touched too early

It is governed by:

- [CHARACTER_IDENTITY_CONTROLLED_PROOF_IMPLEMENTATION_SPEC.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/CHARACTER_IDENTITY_CONTROLLED_PROOF_IMPLEMENTATION_SPEC.md)
- [CHARACTER_IDENTITY_CONTROLLED_PROOF_PRE_CODE_GATE.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/CHARACTER_IDENTITY_CONTROLLED_PROOF_PRE_CODE_GATE.md)
- [CHARACTER_IDENTITY_LINEAGE_STORAGE_DECISION.md](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/CHARACTER_IDENTITY_LINEAGE_STORAGE_DECISION.md)

---

## 2. Executive Sequence

The safest implementation order is:

1. saved-prompt lineage types and persistence
2. save-flow wiring
3. Character projection boundary inside Builder
4. Prompt Preview integration cleanup
5. Character lane surface cleanup
6. focused verification and cleanup

### Why this order is strongest

It resolves the two highest-risk issues first:

- archive grounding
- prototype drift in direct prompt injection

before UI polish starts driving architecture.

---

## 3. Phase 1: Saved-Prompt Lineage Foundation

### Goal

Make saved prompts capable of remembering Character use in both local and cloud paths.

### Why first

Because archive grounding is the strongest remaining technical dependency.
If this is delayed, the implementation can easily “finish” Character behavior without actually proving the lane in the archive.

### Files

- [prompts.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/prompts.ts)
- [promptStore.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/promptStore.ts)
- new migration:
  - `supabase/migrations/0016_add_saved_prompt_character_lineage.sql`

### Changes

#### [prompts.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/prompts.ts)

Add:

- `SavedPromptCharacterLineage`
- `characterLineage?: SavedPromptCharacterLineage` on `SavedPrompt`

#### [promptStore.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/promptStore.ts)

Update:

- `toSavedPrompt`
- `createPrompt` input type
- insert payload
- import/export handling

So cloud persistence understands:

- `character_id`
- `character_name_snapshot`

and maps them to:

- `characterLineage`

#### `0016_add_saved_prompt_character_lineage.sql`

Add nullable columns to `saved_prompts`:

- `character_id text`
- `character_name_snapshot text`

Do **not** add:

- foreign key
- sidecar table
- JSONB lineage field

### Completion check

After this phase, the type and persistence layers should be able to represent Character lineage even before the save UI is wired to provide it.

---

## 4. Phase 2: Save-Flow Wiring

### Goal

Thread active Character lineage into every save path that needs it.

### Why second

Once the persistence layer can store lineage, the next step is to make the save flow actually provide it.
Doing this before projection work keeps archive grounding from becoming optional later.

### Files

- [PromptLibrary.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/PromptLibrary.tsx)
- [PromptsPage.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/PromptsPage.tsx)
- [App.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)

### Changes

#### [PromptLibrary.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/PromptLibrary.tsx)

Add props like:

- `activeCharacterId?: string | null`
- `activeCharacterName?: string | null`

Then:

- include Character lineage when saving locally
- include Character lineage when saving to cloud
- preserve Character lineage when saving local prompts to cloud

#### [PromptsPage.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/PromptsPage.tsx)

Thread Character lineage props through to `PromptLibrary`.

#### [App.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)

Pass current Character info into all `PromptLibrary` mounts:

- main hidden save mount
- saved-prompts drawer mount
- `PromptsPage` route

### Important rule

This phase should not yet change the Character projection model.
It should only make saving aware of the already-active Character.

### Completion check

After this phase, saving a prompt while a Character is active should store Character lineage in both local and cloud paths.

---

## 5. Phase 3: Character Projection Boundary

### Goal

Replace direct Character phrase injection with a small internal projection boundary.

### Why third

This is the main architecture correction in the live workflow path.
It should happen only after archive grounding is in place.

### Files

- [App.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)
- optional small internal helper location:
  - either inside [App.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)
  - or a new internal helper file if that feels cleaner
- [promptAdditions.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/promptAdditions.ts) only if downstream typing truly needs adjustment

### Changes

#### [App.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)

Replace the current flow:

- `activeCharacter` -> direct `PromptAdditionEntry[]`

with:

- `activeCharacter`
- internal Character projection object
- `PromptAdditionEntry[]`

Also clean up:

- `clearUndoState` handling so Character remains preserved cleanly through `Clear Prompt`

### What not to do

- do not build a large projection framework
- do not redesign all prompt-addition architecture
- do not touch Pool / Territory logic beyond what is needed for Character separation

### Completion check

After this phase, Character contribution should still work visibly, but no longer be modeled as raw entity flattening.

---

## 6. Phase 4: Prompt Preview Integration Cleanup

### Goal

Keep the existing strong Prompt Preview behavior while feeding it from the cleaned Character integration path.

### Why fourth

Prompt Preview behavior is already good.
It should be preserved and cleaned up only after the projection boundary exists.

### Files

- [PromptPreview.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/PromptPreview.tsx)
- maybe [PromptPreview.css](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/PromptPreview.css) if small copy/layout refinements are needed

### Changes

Preserve:

- active Character visibility
- choose / change / remove actions

Refine:

- wording so it stays clearly lane-specific
- any props needed to reflect Character projection-aware state cleanly

### What not to do

- do not redesign Prompt Preview broadly
- do not add full Identity Systems language

### Completion check

After this phase, Prompt Preview should still feel familiar, but more conceptually aligned with the Character controlled proof.

---

## 7. Phase 5: Character Lane Surface Cleanup

### Goal

Keep the existing `Characters` modal-first surface, but align it with the first-proof contract and remove prototype drift where needed.

### Why fifth

The modal is behaviorally good already.
It should be cleaned after the deeper storage/session/projection decisions are implemented.

### Files

- [CharacterLibraryModal.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/CharacterLibraryModal.tsx)
- [CharacterLibraryModal.css](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/CharacterLibraryModal.css)
- [characters.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/characters.ts) if small validation-related adjustments are still needed
- [characterStore.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/characterStore.ts) if validation logic needs to match the final first-proof contract more closely

### Changes

Keep:

- library / editor split
- create / edit / delete / choose basics

Adjust only if necessary:

- field validation
- wording
- lane explanation
- editor flow clarity

### What not to do

- do not promote to full `Characters` page
- do not add relationship management
- do not add heavy organization systems

### Completion check

After this phase, the Character lane surface should match the first-proof spec more closely without overgrowing.

---

## 8. Phase 6: Focused Verification And Cleanup

### Goal

Verify the Character proof through focused checks instead of pretending the entire repo is clean.

### Why last

The repo still has known global verification noise.
So verification should be scoped to the feature slice.

### Files / Surfaces To Check

- [App.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)
- [PromptPreview.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/PromptPreview.tsx)
- [PromptLibrary.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/PromptLibrary.tsx)
- [promptStore.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/promptStore.ts)
- new saved-prompt migration

### Focused checks

1. Create Character
2. Edit Character
3. Delete Character
4. Apply Character
5. Switch Character
6. Remove Character
7. `Clear Prompt` preserves Character
8. Save local prompt with Character lineage
9. Save cloud prompt with Character lineage
10. Save local-to-cloud preserves Character lineage
11. Missing Character on restore clears safely

### Verification note

If repo-wide automated checks remain noisy, that does not invalidate the Character feature work by itself.
Feature-specific validation should still be documented clearly.

### Optional final check

This repo contains some co-located compiled `.js` files next to `.ts` sources in a few areas.
Before closing the implementation pass, verify whether touched `.ts` files require:

- regenerated `.js` artifacts
- or no manual sync because they are build-generated elsewhere

---

## 9. What Must Not Be Pulled Forward

To keep the implementation disciplined, these things should **not** be pulled into the first pass:

### 1. Full Identity Systems realm UI

### 2. Character relationship logic

### 3. Rich archive lineage UI

### 4. Cross-device Character sync

### 5. Multi-lane abstractions

### 6. Large prompt-addition refactors unrelated to Character

### 7. Territory / Pool redesigns

If any of these start appearing, the implementation is drifting.

---

## 10. Recommended First Coding Commit Shape

The strongest first implementation slice is:

### Commit 1

- saved-prompt lineage types
- prompt persistence updates
- migration

### Commit 2

- save-flow wiring through `PromptLibrary`, `PromptsPage`, and `App`

### Commit 3

- Character projection boundary in `App`
- Prompt Preview alignment

### Commit 4

- Character modal / validation cleanup
- focused verification pass

This sequence is optional, but it is a healthy shape if work is split into clean reviewable chunks.

---

## Final Recommendation

Implementation should begin with:

- lineage foundation first
- projection correction second
- surface cleanup third

## Final Lock

The safest way to build the Character controlled proof is:

- **ground it in saved prompts first**
- **correct the integration model second**
- **polish the lane surfaces last**

That order gives MorpBase the best chance of proving the lane without letting the prototype or UI convenience take over.
