# Character Identity System Master Concept

## Executive Summary

MorpBase may need a new reusable system that sits above niche Pools and Territories:

- a `Character Identity System`

The reason is simple:

- Pools are often style-shaped, workflow-shaped, and somewhat niche
- but characters may need to persist across multiple workflows, styles, and territories

This suggests a real product gap:

- MorpBase has strong workflow systems
- but it may still lack a reusable cross-workflow subject identity layer

The Character Identity System is the strongest current framing of that idea.

## Core Insight

A character can exist before:
- a specific style
- a specific Territory
- a specific image family
- a specific workflow

That means character identity is not naturally owned by:
- Pools
- Territories
- Modes
- the normal Builder

Instead, it likely deserves its own layer.

## What The System Is

The Character Identity System is:

- a reusable character identity layer
- broader than niche Pools
- applied into workflows intentionally
- specialized later by Pools, Territories, and Builder context

It is not:

- a new Mode
- a Territory subtype
- a special Pool
- just another prompt form

## Why This Idea Is Strong

It addresses a serious potential need:

### 1. Cross-workflow character persistence
Users may want one character to appear in:
- multiple Pools
- multiple styles
- multiple Territories

### 2. Separation of identity from style
Pools should own:
- style / workflow / image-family realization

Characters should own:
- recurring subject identity

### 3. Better recurring-character workflows
Many users do not only want one good image.
They want:
- recognizable recurring characters
- variation without identity loss

### 4. Less pressure on Pools
Without a broader character layer, users may try to force:
- general character thinking
into
- niche workflow pools

That weakens Pools.

## Why It Is Risky

This idea becomes dangerous if it:

1. duplicates Pool behavior
2. acts like another Builder
3. becomes another prompt editor
4. only works in one narrow workflow
5. adds more prompt layers without enough clarity

So the system must be tightly bounded.

## Naming Conclusion

The stronger concept name is:

- `Character Identity System`

`Character Builder` was a good intuitive starting phrase, but it is probably too misleading as the main concept name because it suggests:
- another Builder
- another workflow tool

The best naming split is:

### System / concept name
- `Character Identity System`

### Possible future UI creation label
- `Character Builder`
or
- `Create Character`

This preserves conceptual accuracy while keeping user-facing language approachable.

## Scope Boundary

The Character Identity System should own:

- recurring subject identity

It should not own:

- style family
- workflow identity
- territory focus
- scene construction
- final composition logic

### Belongs inside character identity
- archetype
- role
- age impression
- presentation
- personality tone
- recurring visual anchors
- recurring motifs
- prompt-facing identity phrases

### Stays outside
- pixel art style
- painterly style
- scene composition
- Territory mapping
- IDP set logic
- global prompt polish layers

This boundary is essential.

## Theoretical Workflow

The strongest workflow shape is:

### Phase 1: Create character identity
The user creates a reusable identity outside any one niche workflow.

### Phase 2: Save character as reusable entity
The character becomes something persistent and reusable.

### Phase 3: Apply character into a workflow
The user later enters:
- a Pool
- a Builder session
- optionally a Territory context

and applies the character there.

### Phase 4: Iterate variants without losing identity
The pool/workflow specializes the character while preserving its continuity.

The key feeling should be:

- "my character exists above the workflow"

not:

- "I filled out another prompt template"

## Architecture Fit

Architecturally, the idea can fit MorpBase if it becomes:

- a distinct reusable entity layer
- separate from Pools
- separate from Territories
- explicitly applied into workflows
- a visible prompt influence layer

### Best architectural reading
- Character = reusable identity entity
- Pool = workflow/style/image-family host
- Territory = source-space focus
- Mode = Builder orientation

That is the cleanest model.

### What it should not be
- Pool extension
- Territory extension
- Mode extension
- Builder category system

## Recommended MVP

The best MVP is:

- one saved reusable character entity
- one active character per workflow
- explicit application into Pools / Builder sessions
- clear prompt contribution
- real cross-workflow reuse

### The MVP succeeds if
1. users can create a character once and reuse it
2. the character feels recognizable across multiple workflows
3. the system reduces pressure on Pools to carry general character identity
4. it feels distinct from Pools

### The MVP fails if
1. it only works inside one niche workflow
2. it mostly duplicates Pool behavior
3. users do not feel real continuity
4. it adds complexity without repeat value

## Data Shape

The strongest MVP data model is:

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
```

Where:

### `identity`
stores:
- archetype
- role
- age impression
- presentation
- personality tone
- visual anchors
- motifs

### `phraseBundle`
stores:
- core phrases
- optional phrases

This is strong because it is:
- more than a saved prompt
- less than a giant trait engine

## Entry Points

The strongest split is:

### Creation / management
- dedicated `Characters` area

### Workflow application
- Prompt Preview / Active Workflow

This avoids:
- making characters feel like Pools
- burying them inside Territory setup
- overloading the normal Builder

## Prompt Preview Application Flow

Prompt Preview is the strongest application surface.

Best flow:

### No active character
- `Character: None`
- action: `Choose Character`

### Active character
- show character name
- show compact identity summary
- actions:
  - `Change`
  - `Remove`

This makes the character feel like:
- a real active workflow layer

not:
- a hidden system

## Creation / Edit UX

The creation/edit surface should feel like:

- a reusable character profile editor

not:

- another Builder

Strong structure:

1. Basic identity
2. Visual anchors
3. Motifs
4. Prompt-ready phrase bundle
5. Compact preview

This keeps the system:
- identity-centered
- reusable
- lighter than Builder

## Best Prompt-Layer Interpretation

The character should contribute:
- a compact character identity phrase bundle

It should not:
- replace the Pool baseline
- replace the Territory
- replace Builder selections

Likely order:

1. character identity layer
2. pool / IDP baseline
3. global phrases
4. builder selections
5. other additions

This is coherent because:
- character = who
- pool = style/workflow realization

## Relationship To Existing Systems

### Pools
Should still own:
- style
- workflow family
- image realization

### Territories
Should still own:
- focus
- source composition

### IDP Sets
Should still own:
- workflow baseline identity within a pool

### Global Phrase Layer
Should still own:
- user-level persistent generic prompt modifiers

This is why the Character Identity System can coexist without swallowing everything.

## Why This Is Not Just A Cool Extra

The idea is only worth pursuing if it proves:

- genuine cross-workflow reuse
- genuine recurring-character continuity
- genuine separation of identity from style/workflow

If it cannot prove those, it should probably not be built.

## Most Honest Current Conclusion

The Character Identity System is a serious and plausible expansion of MorpBase.

It is promising because:
- it addresses a real potential gap
- it fits the current product boundaries better than a new mode would
- it could materially improve recurring-character workflows

But it should only move forward if MorpBase is willing to treat it as:

- a distinct reusable entity system

and not:

- another Builder variant
- another kind of Pool
- another fuzzy workflow helper

## Recommended Next Step

The strongest next move would be:

1. define a first **implementation-plan-level concept**
or
2. define a **small fictional example character** and walk it through the full proposed workflow to pressure-test the model

At this point, the concept is mature enough that either path would be meaningful.
