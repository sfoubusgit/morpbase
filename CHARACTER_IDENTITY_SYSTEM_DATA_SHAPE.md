# Character Identity System Data Shape

## Purpose

If Character Identity becomes a real MorpBase system, the data model needs to do one thing well:

- store reusable character identity cleanly

It should not try to store:
- whole workflow logic
- full style systems
- territory mapping
- scene construction

So the data shape should stay:
- identity-centered
- reusable
- restrained

## Core Rule

The data model should answer:

- who is this character across workflows?

It should not answer:

- what exact image should I make right now?

That is the key boundary.

## Recommended MVP Shape

### Character

Core top-level entity:

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

This keeps the model simple:
- a reusable entity
- a structured identity section
- a prompt-facing phrase section

## Identity Fields

The structured identity section should be broad but limited.

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

This is enough to hold:
- recurring identity
- recurring visual anchors
- recurring motifs

without becoming a giant schema.

## Visual Anchors

Visual anchors are where recurring recognizable character traits live.

```ts
type CharacterVisualAnchor = {
  id: string;
  label: string;
  text: string;
  kind?: 'hair' | 'face' | 'eyes' | 'silhouette' | 'clothing' | 'accessory' | 'other';
};
```

Examples:
- `long black-to-pink gradient hair`
- `large solemn eyes`
- `crescent hair ornaments`
- `ritual priestess silhouette`

This allows characters to keep recurring appearance anchors without requiring huge rigid form logic.

## Motifs

Motifs are symbolic markers that belong to the character when they recur across workflows.

```ts
type CharacterMotif = {
  id: string;
  label: string;
  text: string;
};
```

Examples:
- `butterfly emblem`
- `crescent moon motif`
- `prayer charm accents`

This stays lightweight and flexible.

## Phrase Bundle

The prompt-facing layer should be explicit and compact.

```ts
type CharacterPhraseBundle = {
  core: string[];
  optional?: string[];
};
```

### `core`
These are the recurring phrases that define the character identity strongly.

### `optional`
These can be supporting details or secondary descriptors.

This is probably enough for MVP.

It avoids:
- overly smart phrase orchestration
- weighted sub-layers
- condition systems

## Why A Phrase Bundle Matters

The structured identity fields are useful for:
- editing
- reasoning
- future expansion

But the workflow still needs:
- prompt-facing material

The phrase bundle is the bridge between:
- identity structure
and
- prompt application

That is likely the right MVP compromise.

## What Should Not Be Stored Here

The data model should avoid:

### 1. Style family fields
No:
- pixel art style
- realism style
- painterly style
- sprite rendering language

That belongs to Pools.

### 2. Territory data
No:
- section maps
- territory source references
- territory behavior

That belongs to Territories.

### 3. Full scene composition fields
No:
- camera framing
- environment composition
- shot type

Those are image decisions, not stable character identity.

### 4. Rich prompt-engine semantics
No:
- weighted phrase trees
- conditional branches
- dynamic behavior by mode

Too heavy for MVP.

## Optional Metadata

Later, the model could also support:

```ts
type CharacterIdentityMeta = {
  notes?: string | null;
  tags?: string[];
  favorite?: boolean;
};
```

But this should stay secondary.

The core concept is not metadata.
The core concept is reusable identity.

## Best Workflow-State Shape

For active workflow use, the session likely only needs:

```ts
type ActiveCharacterState = {
  characterId: string;
};
```

Potentially later:

```ts
type ActiveCharacterState = {
  characterId: string;
  appliedCorePhraseIds?: string[];
  appliedOptionalPhraseIds?: string[];
};
```

But MVP should probably keep it simpler.

The fewer moving parts here, the better.

## Best Prompt Contribution Model

The active character should probably contribute:
- the `core` phrase bundle by default

That gives:
- recognizability
- simplicity

Optional phrases could come later as:
- opt-in additions
- or character refinements

## Strong Data-Model Advantages

This shape has some good properties:

1. clearly not a pool
2. clearly not a territory
3. structured enough to be meaningful
4. simple enough for MVP
5. expandable later without lying about what it is

## Main Data-Model Risks

### 1. Too much structure too early
If we over-model character traits, the feature becomes heavy fast.

### 2. Too little structure
If we only store one big prompt text blob, the feature becomes too weak and too close to saved prompts.

### 3. Leakage from Pools
If style/workflow fields enter this model, the distinction from Pools starts collapsing.

## Best MVP Data Interpretation

The healthiest MVP interpretation is:

- `CharacterIdentity` = reusable entity
- `identity` = structured recurring subject definition
- `phraseBundle` = prompt-facing representation

That is enough to validate the idea without overcommitting.

## Honest Conclusion

The best MVP data shape is:
- one character entity
- a small structured identity section
- a compact prompt-facing phrase bundle

This is strong because it is:
- more than a saved prompt
- less than a giant trait engine
- and cleanly separate from Pools and Territories.
