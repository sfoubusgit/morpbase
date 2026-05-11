# Implementation Plan Character Identity System

## Purpose

This document translates the Character Identity System from:
- concept

into:
- a first implementation-plan-level direction

The goal is not to commit to immediate development.
The goal is to define a realistic first implementation path against the current MorpBase architecture.

## Short Recommendation

If this system is ever implemented, the strongest first version is:

- a dedicated character entity store
- a small character library / editor surface
- one active character per workflow
- character application from Prompt Preview
- explicit prompt-layer integration

That is the cleanest first landing.

## Phase 1: Data Model

Add a new character entity type.

Recommended first types:

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

### Likely files
- `src/types/characters.ts`
- `src/types/index.ts`

This should remain separate from `pools.ts`.

## Phase 2: Persistence

Characters need their own persistence path.

### MVP recommendation
Start with:
- local persistence

Then later:
- Supabase persistence

### Why
This lowers the implementation risk while the feature is still being validated conceptually.

### Likely files
- `src/engine/characterStore.ts`

Potential store functions:
- `listCharacters()`
- `createCharacter()`
- `updateCharacter()`
- `deleteCharacter()`

If the feature proves useful, a later Supabase migration can be designed.

## Phase 3: Character Library Surface

Create a dedicated character library / manager surface.

### MVP recommendation
Use either:
- a new `Characters` page
or
- a `Characters` modal/library surface

### Recommendation
If we want strong conceptual separation:
- prefer a new page

If we want smaller first footprint:
- use a library modal first

### Needed UI capabilities
- list characters
- create character
- open/edit character
- delete character

## Phase 4: Character Editor

Build a dedicated character creation/edit surface.

### MVP editor structure
1. Basic identity
2. Visual anchors
3. Motifs
4. Phrase bundle
5. Preview

### Important rule
Do not make this feel like another Builder.

### Likely files
- `src/ui/components/CharacterEditor.tsx`
- `src/ui/components/CharacterEditor.css`

## Phase 5: Active Character Session State

The Builder session should support:
- zero or one active character

### State shape

```ts
type ActiveCharacterState = {
  characterId: string | null;
};
```

Potentially more later, but this is enough for MVP.

### Likely file
- `src/ui/App.tsx`

This state should be separate from:
- active territory
- active pool
- active IDP set

## Phase 6: Prompt Preview Application Flow

Prompt Preview should gain a small character application block.

### States

#### No character
- `Character: None`
- action: `Choose Character`

#### Active character
- name
- maybe compact summary
- actions:
  - `Change`
  - `Remove`

### Picker behavior
The selector can open:
- modal
- drawer
- compact chooser

This should be for:
- selecting a saved character

not:
- editing the character

### Likely files
- `src/ui/components/PromptPreview.tsx`
- `src/ui/components/PromptPreview.css`
- maybe a new `CharacterPicker.tsx`

## Phase 7: Prompt-Layer Integration

When a character is active, its phrase bundle should contribute a visible prompt layer.

### Recommended first behavior
- apply `phraseBundle.core`

### Recommended conceptual order
1. character identity layer
2. pool / IDP baseline
3. global phrases
4. builder selections
5. other additions

### Likely files
- `src/ui/App.tsx`
- `src/types/promptAdditions.ts`

Probably add a new source type:
- `character`

This keeps the layer visible and explicit.

## Phase 8: Active Workflow Summary

Prompt Preview / Active Workflow summary should show:
- `Character: [name]`

This matters for clarity and trust.

### Likely files
- `src/ui/components/PromptPreview.tsx`
- `src/ui/components/PromptPreview.css`

## Phase 9: Keep Territory Out Of MVP

For MVP:
- do not make Territories own characters
- do not make Territories auto-select characters

Later, Territory compatibility can be explored.

That keeps the first version cleaner.

## Phase 10: Keep Pools Separate

For MVP:
- do not store characters inside pools
- do not turn characters into pool variants

The conceptual separation is one of the most important parts of the feature.

## Biggest Technical Risks

### 1. Prompt-layer complexity
MorpBase already has many prompt influence layers.

A character layer is viable, but it must be:
- clearly labeled
- clearly removable
- visibly distinct

### 2. UI crowding in Prompt Preview
Prompt Preview is already carrying more responsibility.

The character block must stay:
- compact
- readable
- not overbearing

### 3. Feature sprawl
This feature could grow too quickly into:
- relationship systems
- multiple active characters
- trait engines
- character-specific scene controls

That should be resisted.

### 4. Weak validation
If users do not actually reuse characters across workflows,
the system may not justify its cost.

## Strongest MVP Validation Test

The feature should be judged by this:

- can one character be created once and then meaningfully reused in multiple different pools without losing identity?

If yes:
- the feature is proving its reason to exist

If no:
- the feature likely needs rethinking or de-scoping

## Recommended First Build Order

1. add character types
2. add local character store
3. build character library/editor
4. add active character session state
5. add Prompt Preview choose/change/remove flow
6. add prompt-layer integration
7. add Active Workflow summary display

This is the cleanest first order.

## Honest Conclusion

The Character Identity System is implementable within MorpBase without rewriting the app,
but only if it is introduced as:

- a distinct reusable entity layer
- with explicit workflow application
- and strict separation from Pools and Territories

That makes it a serious possible future feature, not just a vague concept.
