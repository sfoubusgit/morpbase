# Identity Entities Separate From Builder Concept

## Core Decision

If MorpBase ever implements Identity Systems, they should not be treated as normal Builder or Territory content.

They should exist as separate reusable entities that can be applied to a workflow and added to the prompt as their own distinct layer.

## What This Means

Identity entities should **not** simply appear as:

- another `Subject`
- another `Prop`
- another `Style`
- another normal Builder category item

They should also **not** be treated as ordinary Territory material.

Instead, they should behave as:

- separate reusable prompt entities
- applied into the workflow from outside the normal Builder category structure

## Why This Matters

The entire value of an Identity System depends on the user feeling:

- this is the same character again
- this is the same outfit again
- this is a reusable identity object, not just another prompt fragment

If identity content is flattened into Builder categories, it loses:

- entity status
- reuse clarity
- cross-workflow continuity
- conceptual dignity

And it starts to feel like:

- just more category content
- just more prompt ingredients

That would undermine the system.

## Structural Difference

Builder and Territory are primarily about:

- workflow construction
- source-space navigation
- guided selection
- local prompt composition

Identity entities would be about:

- persistent reusable subject-level or outfit-level identity
- cross-workflow continuity
- applying a prepared identity object into a workflow

That is a different job.

## Better Future Model

A cleaner future workflow model would look more like:

- `Territory`
  - focused workflow space

- `Pool / IDP`
  - workflow identity shaping

- `Identity Entity`
  - reusable character / outfit / similar identity object

- `Builder selections`
  - local refinement and additional prompt construction

This keeps identity entities distinct from normal workflow ingredients.

## Product Consequence

If Identity Systems are ever implemented, the user should likely:

- create/manage identity entities outside Builder
- apply them into an active workflow explicitly
- see them as a visible prompt influence layer

Not:

- browse them as ordinary category entries
- discover them mixed into Territory mappings
- treat them as simple insertions into `Subjects` or `Props`

## Honest Conclusion

Identity Systems only really make sense if they preserve entity-ness.

So the locked-in concept is:

- identity systems should remain separate from normal Builder / Territory category content
- they should be applied as distinct reusable prompt entities

That is a strong boundary and should be preserved in future concept and implementation work.
