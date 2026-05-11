# Character Identity System MVP

## MVP Goal

Prove that MorpBase can support:

- a reusable character identity
- across multiple workflows
- without turning characters into pools
- and without creating a second full Builder system

This MVP should answer one question:

- does a lightweight reusable character layer materially improve recurring-character workflows?

## Core MVP Definition

The MVP is:

- a saved reusable character identity entity
- with a small identity-focused structure
- that can be intentionally applied into a workflow
- and contributes prompt-facing character phrases without replacing Pools or Territories

That is the smallest meaningful version.

## What The MVP Includes

### 1. Character as a saved entity
The user can create and save a character profile.

This should be:
- separate from Pools
- separate from Territories
- revisitable and editable

### 2. Identity-focused fields
The character should contain a small set of recurring identity anchors.

Likely MVP fields:
- name
- archetype / role
- visual anchors
- recurring motifs
- personality/default tone
- prompt-facing summary phrases

The exact structure should stay restrained.

### 3. One active character at a time
For MVP, a workflow can use:
- zero or one active character

This avoids unnecessary complexity.

### 4. Explicit application into workflow
The user should intentionally choose to use a character in a workflow.

This should not be:
- hidden
- auto-applied
- silently merged in the background

### 5. Prompt contribution as a character layer
When active, the character contributes:
- prompt-facing character identity phrases

This should be visible as a distinct prompt influence layer.

### 6. Reusability across multiple pools
This is non-negotiable for the MVP.

The same character must be able to be used in:
- more than one workflow family

Otherwise the concept is not proven.

## What The MVP Must Not Include

### 1. No new Builder mode
This is not a mode problem.

### 2. No character-owned style systems
Characters must not own:
- pixel art style
- rendering style
- workflow family style

### 3. No multi-character composition
Not for MVP.

### 4. No full scene logic
Characters should not become a whole prompt-engine layer for scenes.

### 5. No Territory-owned character logic
Territories may later interact with characters, but should not own the concept first.

### 6. No overly elaborate trait engine
No:
- weighted character subtraits
- procedural identity trees
- relationship networks
- multi-profile fusion

The MVP should stay simple.

## Best MVP Workflow

### Step 1
User creates a character identity.

### Step 2
Character is saved.

### Step 3
User enters a workflow like:
- `Celestial Pixel Portrait`

### Step 4
User applies the saved character.

### Step 5
The workflow continues as normal, but now with character identity material included.

### Step 6
User later opens another pool/workflow and applies the same character there.

That cross-workflow reuse is the proof.

## Best Prompt Behavior For MVP

The character should likely contribute:
- a compact character identity phrase bundle

It should not generate:
- a fully finished prompt

And it should not overwrite:
- pool identity
- IDP set
- Territory focus

So the practical order should likely be:

1. character identity layer
2. pool workflow baseline
3. global phrases
4. builder selections
5. other additions

This keeps the character early enough to matter, but not so dominant that it swallows the workflow.

## Best Data Shape For MVP

The MVP should likely store:
- character id
- name
- a few structured identity fields
- prompt-facing phrase bundle

Potentially also:
- short note / description

The system should avoid very large nested models in v1.

## Best UX Shape For MVP

The user likely needs:

### A character library area
Where characters can be:
- created
- viewed
- edited
- reused

### A character creation/edit surface
Focused on recurring identity

### A workflow application control
Somewhere the user can:
- choose one saved character for the current workflow

This should be intentional and visible.

## Strong MVP Success Criteria

The MVP succeeds if:

1. users can create a character once and reuse it
2. the character feels recognizable across multiple pools
3. users feel less pressure to stuff character identity into pools
4. the system feels distinct from Pools
5. recurring-character workflows become meaningfully easier

## MVP Failure Criteria

The MVP fails if:

1. it only works well in one narrow workflow
2. it mostly duplicates Pool behavior
3. users do not feel clear identity continuity
4. it adds complexity without repeat value
5. it becomes another prompt editor rather than a reusable identity layer

## Most Important MVP Constraint

The MVP must prove:

- character identity is broader than niche workflow pools

If it cannot prove that, the system probably should not exist as a separate product layer.

## Honest Conclusion

The best MVP is:

- one saved reusable character entity
- one active character per workflow
- explicit application into Pools / Builder sessions
- clear prompt contribution
- real cross-workflow reuse

That is the smallest version strong enough to validate the idea without letting it explode into a whole second architecture.
