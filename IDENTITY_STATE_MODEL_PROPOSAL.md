# Identity State Model Proposal

Date: 2026-03-20

## Purpose

This document proposes the cleanest MVP state model for `Character Identity` against the current MorpBase runtime, especially `src/ui/App.tsx`.

The goal is not to design the full feature.
The goal is to answer one practical question:

- how should Character Identity live in app state without collapsing into Pools, Territories, or normal Builder content?

## Executive Recommendation

The best MVP state model is:

- keep `Character Identity` as its own reusable entity system
- store only `activeCharacterId` in the Builder session
- resolve the active character from a separate character store
- derive character prompt entries at prompt-assembly time
- do **not** store character phrases inside `poolPromptItems`

Short version:

- Character should be session-applied
- not pool-shaped
- not territory-shaped
- not just another prompt-addition bucket

## Why This Fits The Current App

`src/ui/App.tsx` already acts as the active workflow state owner for:

- selections
- modifiers
- Builder mode
- prompt additions from Pools / Territories / defaults / IDP sets
- edited output
- active Territory
- active IDP set
- Builder session persistence

This means Character Identity should integrate into `App.tsx`.
But it should integrate as:

- a separate workflow influence layer

not as:

- one more kind of `poolPromptItem`

That distinction matters because the current concept docs consistently say Character Identity must remain:

- reusable
- cross-workflow
- separate from Pools
- separate from Territories

Relevant concept files:

- `CHARACTER_IDENTITY_SYSTEM_MVP.md`
- `IMPLEMENTATION_PLAN_CHARACTER_IDENTITY_SYSTEM.md`
- `IDENTITY_ENTITIES_SEPARATE_FROM_BUILDER_CONCEPT.md`

## Current App Reality

The most relevant current facts in `src/ui/App.tsx` are:

### 1. Builder session already persists core workflow state

`BuilderSessionSnapshot` currently stores:

- selections
- modifiers
- weights enabled
- `poolPromptItems`
- prompt output overrides
- selected prompt fragments
- edited output
- navigation state
- `activeIdpSetId`

This is already the natural place to store:

- `activeCharacterId`

### 2. Prompt additions are already layered

The app already derives `promptAdditionEntries` from:

- pool / territory additions
- pool defaults
- IDP sets
- selected global fragments

This is good news because Character can be integrated as:

- another explicit derived prompt layer

without changing the engine model radically.

### 3. `PromptAdditionEntry` already anticipates character

`src/types/promptAdditions.ts` already includes:

- `sourceType?: 'pool' | 'territory' | 'fragment' | 'pool-default' | 'idp-set' | 'character'`

So the shared prompt-preview/additions layer already has a conceptual slot for Character.

### 4. `App.tsx` local prompt-item state does not yet support Character

`App.tsx` currently defines local prompt-item types around:

- `pool`
- `territory`
- `pool-default`
- `idp-set`

That is one reason Character should stay separate.
If we force Character into that structure, we blur the line between:

- workflow source additions

and:

- reusable identity entity application

## Core Design Principles

### 1. Character is applied to a workflow, not authored inside it

The user should:

- create/manage characters outside normal Builder category flow
- apply one saved character into the current workflow

The workflow should not own the character definition.

### 2. One active character per workflow for MVP

The MVP should support:

- zero or one active character

This keeps the model small and avoids composition problems too early.

### 3. Session should store a reference, not a copy

The Builder session should store:

- `activeCharacterId`

not:

- a full embedded character object
- frozen prompt phrases duplicated into session storage

Reason:

- the source of truth should remain the character store
- the Builder session only needs to know which reusable entity is active

### 4. Character prompt influence should be derived, not manually maintained

The app should derive character prompt entries from the active character at render/composition time.

It should not require:

- manually inserting/removing character phrases into `poolPromptItems`

That would create brittle syncing logic.

### 5. Character should survive normal prompt clearing

`Clear Prompt` should preserve the active character in the same spirit that it currently preserves:

- `pool-default`
- `idp-set`

Reason:

- Character is part of the active workflow identity baseline
- not just disposable local prompt clutter

## Proposed State Model

### Persistent Character Entity Store

Add a separate store:

- `src/engine/characterStore.ts`

The store owns reusable character entities.

Recommended MVP functions:

- `listCharacters()`
- `createCharacter()`
- `updateCharacter()`
- `deleteCharacter()`

Recommended persistence sequence:

- local-first MVP
- Supabase later only if validated

### App-Level Runtime State

In `src/ui/App.tsx`, add separate character state near other workflow-level state:

```ts
const [characters, setCharacters] = useState<CharacterIdentity[]>([]);
const [charactersLoading, setCharactersLoading] = useState(false);
const [activeCharacterId, setActiveCharacterId] = useState<string | null>(
  initialBuilderSession?.activeCharacterId ?? null
);
```

Then derive:

```ts
const activeCharacter = useMemo(
  () => characters.find(character => character.id === activeCharacterId) ?? null,
  [characters, activeCharacterId]
);
```

Optional small UI state:

```ts
const [isCharacterPickerOpen, setIsCharacterPickerOpen] = useState(false);
```

## Proposed Session Snapshot Change

Extend `BuilderSessionSnapshot`:

```ts
type BuilderSessionSnapshot = {
  ...
  activeIdpSetId: string | null;
  activeCharacterId: string | null;
};
```

And extend `loadBuilderSessionSnapshot()` accordingly.

### Recommendation

Store only:

- `activeCharacterId`

Do not store:

- full character fields
- phrase bundle copies
- character editor draft data

### Why

This keeps the workflow snapshot lean and avoids drift when:

- the character is edited later
- the store becomes cloud-backed later

## Proposed Prompt-Layer Integration

### Character should not live in `poolPromptItems`

This is the main recommendation.

Do **not** do this:

- push character phrases into `poolPromptItems`

Because that would make Character behave like:

- a pool-derived addition
- an editable weighted pool row
- a section-sourced source item

That would contradict the concept.

### Instead: derive character prompt entries separately

Add derived entries before the current `poolEntries` and `fragmentEntries`:

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

const promptAdditionEntries = [
  ...characterEntries,
  ...poolEntries,
  ...fragmentEntries,
];
```

### Why this is the cleanest fit

- Character stays separate from pool-source editing
- Prompt Preview can still show Character as a first-class source chip
- prompt assembly stays simple
- clear/undo logic stays easier

## Recommended Prompt Ordering

The current best MVP order remains:

1. character identity layer
2. pool / IDP baseline
3. global phrases
4. builder selections
5. end-position pool / territory additions

Given the current `composePromptWithAdditions()` behavior, the easiest practical MVP is:

- `characterEntries` first
- then `pool-default` / `idp-set` / other `poolEntries`
- then selected fragment entries

This gets the character in early enough to matter while keeping the existing assembly model mostly intact.

## Clear Prompt And Undo Behavior

### Recommendation

`Clear Prompt` should:

- clear selections
- clear modifiers
- clear user-added pool/territory additions
- clear selected prompt fragments
- preserve active character
- preserve active pool-default and IDP baseline entries

### Why preserve character

Character is closer to:

- active workflow identity

than to:

- temporary local experimentation

If the user has explicitly applied a character, `Clear Prompt` should not silently remove it.

### Undo state recommendation

Even if Character is preserved by `Clear Prompt`, the undo snapshot should still include:

- `activeCharacterId`

Reason:

- undo state should represent the whole workflow session cleanly
- future behavior changes become safer if the snapshot is complete

Recommended extension:

```ts
const [clearUndoState, setClearUndoState] = useState<{
  ...
  activeCharacterId: string | null;
} | null>(null);
```

## Interaction With Territory And IDP State

### Territory changes should not auto-change Character

Activating or switching Territory should:

- keep the current active character

unless:

- the active character no longer exists in storage

Character is broader than Territory.
Territory must not become the owner of character state.

### IDP set changes should not auto-change Character

Changing the active IDP set should:

- update the workflow baseline
- not replace or mutate the active character

This preserves the clean split:

- Character = who
- IDP = workflow baseline identity

### Character changes should not mutate Territory or IDP

Choosing, changing, or removing a character should:

- affect only the character layer

It should not:

- set a Territory
- clear a Territory
- switch IDP sets
- rewrite pool additions

## Editing And Output Override Behavior

For MVP, Character should **not** participate in:

- per-entry output override editing
- per-entry weight control
- pool-section mapping

Reason:

- those tools are currently tied to pool/territory-style source items
- giving them to Character too early would make it feel like another source bucket

So for MVP:

- Character contributes a clean phrase bundle
- visible in Prompt Preview
- removable as one unit
- not phrase-by-phrase tuned in Builder

If later needed, Character can gain its own editing surface in the character editor, not through pool-style override controls.

## UI Surface Implications

### Prompt Preview should become the application surface

Add small props to `PromptPreview` such as:

```ts
activeCharacterName?: string | null;
activeCharacterSummary?: string | null;
onChooseCharacter?: () => void;
onRemoveCharacter?: () => void;
```

The UI block should behave like:

- `Character: None` -> `Choose Character`
- `Character: [name]` -> `Change` / `Remove`

This fits the existing `Workflow Context` role of `PromptPreview.tsx`.

### Character management surface

For state-model purposes, the smallest practical first surface is:

- a `Characters` modal or picker launched from Prompt Preview

Why this first:

- it avoids immediate nav expansion
- it keeps application and active-state understanding close together

Later, if the feature proves real, MorpBase can still add:

- a dedicated `Characters` page

## Recommended Implementation Sequence

### Phase 1

- add `CharacterIdentity` types
- add `characterStore`
- add `activeCharacterId` to `BuilderSessionSnapshot`
- load character library state in `App.tsx`
- derive `activeCharacter`

### Phase 2

- derive `characterEntries` into `promptAdditionEntries`
- preserve active character through clear/undo
- ensure missing-character recovery clears invalid session reference safely

### Phase 3

- add Prompt Preview character block
- add character picker modal
- implement explicit choose / change / remove

### Phase 4

- only later consider a dedicated `Characters` page
- only later consider Supabase persistence

## Risks To Avoid

### 1. Flattening Character into pool prompt items

This is the biggest conceptual mistake.

### 2. Letting Territory own Character

That would make Character feel narrower than intended.

### 3. Storing full character blobs in Builder session

That creates duplication and stale-state risk.

### 4. Giving Character too many pool-like editing controls in MVP

That would weaken its identity as a reusable entity.

## Final Recommendation

The best MVP state model is:

- `activeCharacterId` stored in `BuilderSessionSnapshot`
- reusable characters loaded from a dedicated `characterStore`
- `activeCharacter` derived in `App.tsx`
- character prompt phrases derived into `promptAdditionEntries`
- Character preserved through normal prompt clearing
- Character controlled from Prompt Preview, not from pool-style item lists

## One-Sentence Conclusion

Character Identity should enter MorpBase as a separate session-applied entity reference in `App.tsx`, not as another variant of `poolPromptItems`.
