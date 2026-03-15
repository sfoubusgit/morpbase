# Territory Model Direction 15.03.2026

This document captures the current best conceptual direction for the feature previously discussed as `Working Sets`.

It exists to prevent future work from drifting back into the older category-heavy model.

## Current decision

The current `Working Sets` implementation should no longer be treated as the future direction.

The leading future concept is now:

`Territories`

Meaning:
- creative spaces composed from selected sections of one or more Pools
- activated inside Builder
- automatically mapped by the system rather than manually reorganized by the user

## Why the old Working Set model weakened

The old model was too tied to:
- category management
- manual curation
- technical subset logic
- setup friction
- page-level overhead that the concept did not earn

It felt too much like:
- duplicate `Base Set`
- fill buckets
- maintain a configuration object

And not enough like:
- entering a focused creative world
- shaping an exploration space
- building inside a coherent territory

## Strongest replacement insight

The strongest replacement idea found in discussion was:

`A user should be able to compose a creative territory from sections of different Pools.`

Example:
- `Subjects` from `Salvador Dali Dark Theme Park`
- `Environment` from `Arcane Library Fantasy`
- `Lighting` from `Magic Effects`
- `Mood` from `Semi-Real Portrait Mood`

That combination becomes one active Territory.

This is much stronger than:
- manual item-by-item cherry-picking
- full category-bucket Working Set authoring

## Role of Pools in the new model

Pools are no longer best understood as only flat fragment libraries.

Under the new model, Pools become:
- themed source libraries
- reusable vocabularies
- lightly organized by shared semantic sections

Pools are the source layer.

## Light section model

Current leading shared section vocabulary:
- `Subjects`
- `Environment`
- `Props`
- `Lighting`
- `Mood`
- `Materials`
- `Style`
- `Composition`
- `Effects`

Important rules:
- not every Pool needs every section
- sections stay broad and lightweight
- sections are descriptive, not heavy workflow bureaucracy

## Why sections matter

Sections are not just for readability.

They are the semantic bridge between:
- Pools
- Territories
- Builder

Without a stable shared section language, the system cannot help the user automatically.

## What the user should do

The user should only need to:
- choose Pools
- choose sections from those Pools
- name the Territory
- activate it in Builder

That is an acceptable amount of work.

## What the user should not do

The user should not have to:
- manually reclassify fragments
- manually rebuild Builder structure after selecting territory material
- perform category administration after composition

If the future model requires that, it is too friction-heavy.

## What the system must do automatically

The system must:
1. understand the shared section meanings
2. merge selected sections into one Territory
3. map those sections into Builder automatically
4. show the result in a coherent Builder surface
5. avoid forcing the user to resolve structure manually

This is one of the most important conclusions from the redesign work.

## Territory definition

A Territory is:
- a named composition of selected `Pool + Section` inputs
- a focused creative space
- an active exploration mode for Builder

This is the cleanest current definition.

## Relationship between Pools and Territories

### Pools
- source libraries
- themed reusable vocabularies
- lightly sectioned

### Territories
- saved compositions of selected pool sections
- active creative spaces
- used in Builder

This keeps a distinction without duplicating two full systems.

## Relationship to Builder

Builder should gradually move toward the same visible section language.

Long-term visible Builder section model likely converges toward:
- `Subjects`
- `Environment`
- `Props`
- `Lighting`
- `Mood`
- `Materials`
- `Style`
- `Composition`
- `Effects`

The system can keep internal logic if needed, but the user should not experience multiple conflicting taxonomies.

## UX direction

The strongest future flow currently looks like:

1. open `User Pools`
2. choose `Create Territory`
3. name the Territory
4. select one or more `Pool + Section` inputs
5. review the Territory summary
6. click `Use in Builder`

Inside Builder:
- show active Territory name
- show only active section panels
- show source pool context for each section

This is much more natural than the old Working Set flow.

## Naming conclusion

`Working Set` should now be treated as a legacy term attached to the old model.

`Territory` is the leading future name because it better captures:
- a creative space
- a constrained world of exploration
- a meaningful Builder mode

## Product surface conclusion

The future Territory feature probably should not exist as a large standalone top-level page.

Current best judgment:
- it should likely live inside or adjacent to `User Pools`
- because Pools are the source layer and Territories are composed from them

This makes the product feel more coherent and reduces feature sprawl.

## MVP definition

The smallest strong version of this concept is:

`Territory MVP = a named composition of selected pool sections, automatically mapped into Builder for focused prompt exploration.`

What the MVP should include:
- Territory naming
- section selection from Pools
- Territory summary
- activation in Builder
- automatic mapping

What it should not include yet:
- item-by-item fragment selection as the main flow
- heavy advanced editing
- gallery/social mechanics
- full Builder rewrite all at once

## Most important conclusion

The future of this part of MorpBase is no longer best thought of as:
- old Working Sets
- category subsets
- manual structure management

It is now best thought of as:

`Territories built from shared pool sections and activated inside Builder.`

That is the clearest and strongest conceptual direction reached so far.
