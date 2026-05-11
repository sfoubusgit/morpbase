# Identity MVP Spec

Date: 2026-03-20

## Purpose

This document defines the first real `Character Identity` MVP for MorpBase.

It is based on:

- `CHARACTER_IDENTITY_SYSTEM_MVP.md`
- `IDENTITY_STATE_MODEL_PROPOSAL.md`
- `IDENTITY_ENTRY_POINTS_DECISION.md`

The goal is to define the smallest version that is:

- conceptually honest
- architecturally clean
- practical to build
- strong enough to validate whether Character Identity deserves to become a permanent MorpBase layer

## MVP One-Line Definition

The MVP is:

- one saved reusable character identity
- managed through a dedicated character library modal
- applied explicitly from Prompt Preview
- active as one visible workflow influence layer
- reusable across multiple pools/workflows

## MVP Goal

The MVP should answer one question:

- does a lightweight reusable character layer materially improve recurring-character workflows in MorpBase?

It should **not** try to prove every future identity idea.
It only needs to prove:

- reusable character identity is a real product gain

## Product Positioning

Character Identity in MVP should mean:

- reusable subject identity

It should not mean:

- a new Builder mode
- a special kind of Pool
- a Territory subtype
- another prompt editor
- a giant identity framework

The intended product split remains:

- `Character` = reusable subject identity
- `Pool` = workflow / style host
- `Territory` = focused workflow space
- `Mode` = Builder orientation

## In Scope

### 1. Saved character entities

The user can:

- create a character
- edit a character
- delete a character
- list saved characters

Characters are:

- separate from Pools
- separate from Territories
- reusable across workflows

### 2. Local-first character persistence

MVP storage should be:

- local only

Reason:

- lower implementation risk
- faster validation
- avoids blocking the MVP on schema work

### 3. Character library modal

MVP management surface should be:

- a dedicated `Characters` modal / library

This modal should support:

- browse saved characters
- choose active character
- create new character
- edit existing character
- delete character

### 4. Prompt Preview application flow

MVP application surface should be:

- `Prompt Preview / Workflow Context`

The user should be able to:

- see whether a character is active
- choose a character
- change the active character
- remove the active character

### 5. One active character per workflow

For MVP:

- zero or one active character only

No multi-character composition.

### 6. Prompt-layer contribution

When a character is active:

- it contributes a visible prompt layer

For MVP, this should come from:

- `phraseBundle.core`

Character contribution should be:

- visible
- explicit
- removable as one unit

### 7. Builder session integration

The active workflow should persist:

- `activeCharacterId`

inside the Builder session snapshot.

### 8. Clear Prompt behavior

`Clear Prompt` should:

- preserve the active character

Reason:

- Character is part of the active workflow identity baseline

## Out Of Scope

The MVP should explicitly exclude:

- a top-level `Characters` page
- Supabase persistence
- multi-character workflows
- character relationships or networks
- outfit / clothing identity systems
- generic reusable identity framework work
- Territory-owned character logic
- character auto-selection from Territory
- character auto-generation from prompt content
- per-phrase character weights in Builder
- pool-style section mapping for character phrases
- character-specific Builder categories
- character-specific Modes

## Recommended Data Model

### Character entity

```ts
type CharacterIdentity = {
  id: string;
  name: string;
  summary?: string | null;
  identity: CharacterIdentityFields;
  phraseBundle: CharacterPhraseBundle;
  createdAt: string;
  updatedAt: string;
};

type CharacterIdentityFields = {
  archetype?: string | null;
  role?: string | null;
  ageImpression?: string | null;
  presentation?: string | null;
  personalityTone?: string | null;
  visualAnchors: CharacterVisualAnchor[];
  motifs: CharacterMotif[];
};

type CharacterVisualAnchor = {
  id: string;
  label: string;
  text: string;
  kind?: 'hair' | 'face' | 'eyes' | 'silhouette' | 'clothing' | 'accessory' | 'other';
};

type CharacterMotif = {
  id: string;
  label: string;
  text: string;
};

type CharacterPhraseBundle = {
  core: string[];
  optional?: string[];
};
```

### Field restraint rule

MVP should keep the model small.

It should not become:

- a giant trait tree
- a procedural identity engine
- a general prompt schema

## Recommended Runtime State

In `App.tsx`:

```ts
const [characters, setCharacters] = useState<CharacterIdentity[]>([]);
const [charactersLoading, setCharactersLoading] = useState(false);
const [activeCharacterId, setActiveCharacterId] = useState<string | null>(
  initialBuilderSession?.activeCharacterId ?? null
);
const [isCharacterLibraryOpen, setIsCharacterLibraryOpen] = useState(false);
```

Derived state:

```ts
const activeCharacter = useMemo(
  () => characters.find(character => character.id === activeCharacterId) ?? null,
  [characters, activeCharacterId]
);
```

Builder session should store:

- `activeCharacterId`

Builder session should not store:

- the full character object
- copied phrase bundles

## Recommended Prompt Behavior

### Character prompt layer

When active, Character should add entries like:

```ts
const characterEntries: PromptAdditionEntry[] = activeCharacter
  ? activeCharacter.phraseBundle.core
      .map((text, index) => ({
        id: `character:${activeCharacter.id}:${index}`,
        text: text.trim(),
        position: 'start' as const,
        sourceType: 'character' as const,
      }))
      .filter(entry => entry.text)
  : [];
```

### Ordering

Recommended conceptual order:

1. character identity layer
2. pool / IDP baseline
3. global phrases
4. builder selections
5. other additions

### Important rule

Do **not** flatten character phrases into:

- `poolPromptItems`

Character must remain:

- its own applied identity layer

## UX Spec

### A. Prompt Preview block

Add a new block near Workflow Context / IDP controls.

#### State 1: No active character

Show:

- `Character: None`
- button: `Choose Character`

#### State 2: Active character

Show:

- character name
- optional summary
- buttons:
  - `Change`
  - `Remove`

#### Required behavior

- choosing opens the character library modal
- changing opens the same modal
- removing clears only the active character
- removing does not change Pool, Territory, or IDP state

### B. Character library modal

The modal should support two jobs:

- choose an existing character
- manage the character library

#### Main list view

Each character card/row should show:

- name
- short summary
- light metadata if useful

Actions:

- `Use`
- `Edit`
- `Delete`

#### Create/edit view

The editor should stay restrained and identity-focused.

Recommended sections:

1. Basic identity
2. Visual anchors
3. Motifs
4. Phrase bundle
5. Preview

Important rule:

- do not make this feel like another Builder

### C. Prompt source visibility

When Character is active, Prompt Preview should reflect that in:

- prompt source chips
- active workflow understanding

This is important for trust.

The user should feel:

- "my active character is shaping the prompt"

not:

- "something hidden changed"

## User Stories

### Story 1: Create and apply a recurring character

1. User opens the Character block from Prompt Preview.
2. User creates a new character.
3. User saves it.
4. User applies it to the current workflow.
5. Prompt Preview reflects the active character.
6. The prompt output updates.

### Story 2: Reuse the same character in another workflow

1. User later enters a different Pool / workflow family.
2. User opens the Character block again.
3. User selects the same saved character.
4. The prompt updates without the character needing to be rebuilt.

This is one of the most important proof points.

### Story 3: Remove character without destroying workflow context

1. User has active Pool / Territory / IDP / Character state.
2. User clicks `Remove` in the Character block.
3. Character prompt layer disappears.
4. Pool / Territory / IDP state remains intact.

## File-Level Build Scope

### New files

- `src/types/characters.ts`
- `src/engine/characterStore.ts`
- `src/ui/components/CharacterLibraryModal.tsx`
- `src/ui/components/CharacterLibraryModal.css`

Optional split if editor grows:

- `src/ui/components/CharacterEditor.tsx`
- `src/ui/components/CharacterEditor.css`

### Existing files likely to change

- `src/types/index.ts`
- `src/types/promptAdditions.ts`
- `src/ui/App.tsx`
- `src/ui/components/PromptPreview.tsx`
- `src/ui/components/PromptPreview.css`

## Acceptance Criteria

The MVP is complete when all of the following are true:

### Character storage

- user can create, edit, delete, and list characters locally

### Workflow application

- user can apply one saved character from Prompt Preview
- user can swap to another saved character
- user can remove the active character

### Reuse

- the same saved character can be used in more than one workflow family

### Prompt behavior

- active character adds a visible prompt layer
- character prompt contribution is separate from Pools and Territories
- removing character only removes the character layer

### Session behavior

- `activeCharacterId` survives reload through Builder session persistence
- missing/deleted active character references fail safely

### Clear behavior

- `Clear Prompt` preserves active character

### Concept integrity

- no character content is stored as a Pool
- no character content is authored as Territory content
- no new Builder Mode is introduced

## Failure Conditions

The MVP should be considered a miss if:

- users do not understand how Character differs from Pools
- users mostly treat Character like another prompt fragment bucket
- it works only in one niche pool family
- it creates major confusion with Territory or IDP
- the implementation requires a large nav/system expansion just to feel usable

## Post-MVP Questions

Only after MVP validation should MorpBase revisit:

- full `Characters` page
- Supabase persistence
- clothing / outfit identity
- territory-aware identity compatibility
- richer reusable identity framework ideas

## Final Recommendation

Build the MVP as:

- a local-first character library modal
- a Prompt Preview application flow
- one active character per workflow
- explicit visible prompt-layer integration

That is the smallest version that is still strong enough to validate whether Character Identity deserves to become a real MorpBase system.
