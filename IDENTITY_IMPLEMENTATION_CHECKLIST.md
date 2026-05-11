# Identity Implementation Checklist

Date: 2026-03-20

## Purpose

This checklist turns the current Character Identity planning docs into a practical implementation sequence.

It is based on:

- `IDENTITY_READINESS_REPORT.md`
- `IDENTITY_STATE_MODEL_PROPOSAL.md`
- `IDENTITY_ENTRY_POINTS_DECISION.md`
- `IDENTITY_MVP_SPEC.md`

The goal is to provide the safest build order for implementing the MVP without collapsing Character into Pools, Territories, or Builder categories.

## MVP Target

Ship a first Character Identity MVP with:

- local-first character persistence
- one active character per workflow
- Prompt Preview application flow
- character library modal
- visible character prompt-layer contribution
- no top-level `Characters` page yet

## Phase 1: Type Foundation

### Create new types

Add:

- `src/types/characters.ts`

Define:

- `CharacterIdentity`
- `CharacterIdentityFields`
- `CharacterVisualAnchor`
- `CharacterMotif`
- `CharacterPhraseBundle`

### Export new types

Update:

- `src/types/index.ts`

Export the new character types so `App.tsx` and UI components can import them through the shared type surface.

### Checkpoint

At the end of this phase:

- character types exist
- types are kept separate from `pools.ts`
- no UI behavior changes yet

## Phase 2: Local Character Store

### Create a dedicated store

Add:

- `src/engine/characterStore.ts`

Implement MVP local-storage functions:

- `listCharacters()`
- `createCharacter()`
- `updateCharacter()`
- `deleteCharacter()`

### Storage rules

Use:

- localStorage only for MVP

Do not add:

- Supabase integration
- migrations
- cloud sync

### Checkpoint

At the end of this phase:

- characters can be stored and retrieved locally
- store API is clean enough for `App.tsx` to consume
- no Builder state is wired yet

## Phase 3: App State Wiring

### Update `App.tsx` types and state

Update:

- `src/ui/App.tsx`

Add app-level state:

- `characters`
- `charactersLoading`
- `activeCharacterId`
- `isCharacterLibraryOpen`

Add derived state:

- `activeCharacter`

### Extend Builder session snapshot

Update `BuilderSessionSnapshot` to include:

- `activeCharacterId: string | null`

Update:

- session load logic
- session save logic

### Missing-character recovery

Add a safety rule:

- if the stored `activeCharacterId` no longer exists in the local character store, clear it safely

### Checkpoint

At the end of this phase:

- `App.tsx` knows about characters
- session persistence survives reload
- no prompt contribution exists yet

## Phase 4: Character Prompt-Layer Integration

### Derive character entries separately

Update:

- `src/ui/App.tsx`

Do:

- derive `characterEntries` from `activeCharacter.phraseBundle.core`
- merge them into `promptAdditionEntries`

Do not:

- push character phrases into `poolPromptItems`

### Prompt-entry rules

Use:

- `sourceType: 'character'`
- `position: 'start'`

### Preserve concept boundaries

Character must remain:

- separate from pool item editing
- separate from territory source composition
- separate from IDP selection logic

### Checkpoint

At the end of this phase:

- active characters affect prompt output
- Prompt Preview can recognize Character as a prompt source
- no Character UI block exists yet

## Phase 5: Clear / Undo Behavior

### Update clear behavior

Update:

- `src/ui/App.tsx`

Make `Clear Prompt`:

- preserve `activeCharacterId`
- preserve current character layer
- continue preserving `pool-default` and `idp-set` behavior

### Update undo snapshot

Extend clear undo state to include:

- `activeCharacterId`

### Checkpoint

At the end of this phase:

- `Clear Prompt` does not silently drop Character
- undo restores consistent workflow state

## Phase 6: Prompt Preview Character Block

### Extend Prompt Preview props

Update:

- `src/ui/components/PromptPreview.tsx`

Add props such as:

- `activeCharacterName`
- `activeCharacterSummary`
- `onChooseCharacter`
- `onRemoveCharacter`

Optional:

- `hasCharacterLibrary`

### Add the Character UI block

Place it near:

- `Workflow Context`
- `Active IDP Set`

Support two states:

- `Character: None` with `Choose Character`
- `Character: [name]` with `Change` and `Remove`

### Checkpoint

At the end of this phase:

- users can see active Character state
- Character is visible as a workflow influence
- Character still cannot be selected yet because the modal does not exist

## Phase 7: Character Library Modal

### Add the library modal

Add:

- `src/ui/components/CharacterLibraryModal.tsx`
- `src/ui/components/CharacterLibraryModal.css`

Optional if needed:

- `src/ui/components/CharacterEditor.tsx`
- `src/ui/components/CharacterEditor.css`

### Library modal requirements

It must support:

- listing saved characters
- selecting one as active
- creating a character
- editing a character
- deleting a character

### UX constraint

The modal should feel like:

- a reusable identity library

not:

- another Builder
- another Pool editor

### App wiring

Update:

- `src/ui/App.tsx`

Wire:

- open/close state
- choose character
- remove character
- refresh character list after create/update/delete

### Checkpoint

At the end of this phase:

- users can fully create/manage/select characters
- Prompt Preview actions work end-to-end

## Phase 8: Prompt Preview And Visual Polish

### Improve visibility

Update:

- `src/ui/components/PromptPreview.css`

Make the Character block:

- visually aligned with workflow context
- clearly separate from IDP controls
- easy to scan

### Prompt source visibility

Confirm that when Character is active:

- `Prompt Sources` can show `Character`
- source highlighting behaves sensibly

### Checkpoint

At the end of this phase:

- Character reads as an intentional workflow layer
- not as a hidden behind-the-scenes state change

## Phase 9: Validation And Safety Pass

### Manual test scenarios

Run these flows:

1. create a character and apply it in one workflow
2. reload the app and confirm active character persists
3. switch pools and reapply the same character
4. remove character without affecting Territory or IDP
5. use `Clear Prompt` and confirm Character remains active
6. delete the currently active character and confirm the app recovers safely
7. edit a character and confirm prompt contribution updates correctly

### Concept integrity checks

Verify that:

- Character does not appear inside User Pools
- Character does not become Territory-owned state
- Character is not a Mode
- Character is not stored inside `poolPromptItems`

## File Checklist

### New files

- `src/types/characters.ts`
- `src/engine/characterStore.ts`
- `src/ui/components/CharacterLibraryModal.tsx`
- `src/ui/components/CharacterLibraryModal.css`

Optional:

- `src/ui/components/CharacterEditor.tsx`
- `src/ui/components/CharacterEditor.css`

### Existing files to update

- `src/types/index.ts`
- `src/ui/App.tsx`
- `src/ui/components/PromptPreview.tsx`
- `src/ui/components/PromptPreview.css`

Potential light touch:

- `src/types/promptAdditions.ts`

## Acceptance Checklist

The MVP implementation is done when all of the following are true:

- character entities can be created, updated, deleted, and listed locally
- one active character can be chosen for the current workflow
- active character persists through Builder session reload
- prompt output changes when a character is active
- Character appears as a visible prompt source
- removing Character only removes the Character layer
- `Clear Prompt` preserves Character
- deleting a missing/active character does not break the session
- Character is still clearly distinct from Pools and Territories

## Do Not Do In MVP

Do not add:

- a top-level `Characters` tab in `App.tsx`
- Supabase tables or migrations
- multi-character composition
- outfit identity
- Territory auto-binding to characters
- character-specific Builder categories
- pool-style editing controls for character phrases

## Recommended Build Order Summary

Build in this order:

1. types
2. store
3. `App.tsx` state
4. prompt-layer integration
5. clear/undo behavior
6. Prompt Preview character block
7. character library modal
8. visual polish
9. validation pass

## One-Sentence Conclusion

The safest path is to wire Character into `App.tsx` as a separate workflow entity first, then expose it through Prompt Preview and a dedicated modal, without expanding MorpBase into a full new top-level surface yet.
