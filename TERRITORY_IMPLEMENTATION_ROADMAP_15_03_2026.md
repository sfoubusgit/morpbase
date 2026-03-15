# Territory Implementation Roadmap 15.03.2026

This roadmap turns the current strategic direction into a concrete implementation sequence.

It assumes the following direction is already decided:

- `Pools` become sectioned source libraries
- `Territories` replace the future role of `Working Sets`
- `Builder` gradually aligns to the same shared section language
- the system, not the user, handles structural mapping

## Roadmap principle

The system should not be rebuilt in one large pass.

Implementation should happen through contained milestones that:
- preserve current usability
- keep changes reversible
- let product learning guide later phases

## Milestone 1: Sectioned Pool Foundation

### Goal
Make sectioned Pools usable enough to become the new source layer.

### Status
Partially implemented.

### Already done
- optional item-level Pool sections
- grouped Pool display when sections exist
- section-first bulk add
- lighter `Pool Items` panel

### Remaining work
- add more real sectioned Pools in the product
- test section authoring and section readability
- refine section interactions if needed:
  - collapsible sections
  - easier section reassignment
  - section counts

### Exit criteria
- at least 3 to 5 meaningful sectioned Pools exist
- sectioned Pools feel usable without explanation-heavy workflows

## Milestone 2: Freeze Legacy Working Sets

### Goal
Stop the old `Working Sets` model from continuing to shape the future product.

### Recommended actions
- stop adding major new behavior to the existing `Working Sets` system
- treat it as legacy in docs and internal planning
- consider reducing its prominence in navigation later

### Important note
This does not require immediate deletion.

### Exit criteria
- no future implementation work depends on the old Working Set model

## Milestone 3: Shared Section Language

### Goal
Establish one shared semantic vocabulary across Pools, Territories, and Builder.

### Current leading section set
- `Subjects`
- `Environment`
- `Props`
- `Lighting`
- `Mood`
- `Materials`
- `Style`
- `Composition`
- `Effects`

### Recommended actions
- keep using this section set in Pool authoring
- align helper text and product language to these sections
- avoid ad hoc naming drift in new features

### Exit criteria
- the product has one stable section language at the semantic level

## Milestone 4: Builder Presentation Simplification

### Goal
Reduce Builder’s visible taxonomy burden without rewriting the engine.

### Current state
- `Define / Refine / Finish` grouping exists
- `Finish` is now more clearly optional

### Recommended next actions
- continue deemphasizing advanced branches
- reduce visible subcategory burden where possible
- clarify Builder copy so it feels closer to shared sections

### High-priority cluster
- `Quality`
- `Effects`
- `Post-Processing`

This remains the heaviest overlap area in Builder.

### Exit criteria
- Builder feels lighter and more guided without a risky architecture rewrite

## Milestone 5: Territory MVP Inside User Pools

### Goal
Introduce the first real Territory workflow where the source material already lives.

### MVP concept
Inside `User Pools`:
- `Create Territory`
- name Territory
- select one or more `Pool + Section` inputs
- save Territory
- activate `Use in Builder`

### Key product rule
The user does not reorganize selected material manually.

### Exit criteria
- a user can compose and save a Territory from Pool sections

## Milestone 6: Territory State In Builder

### Goal
Let Builder operate in a Territory-driven mode.

### Recommended behavior
When a Territory is active:
- show active Territory name
- show source section summary
- show only relevant Builder surfaces where possible

### Exit criteria
- Territory mode is visible and meaningful inside Builder

## Milestone 7: Pool Section -> Builder Mapping Layer

### Goal
Make selected Pool sections operational in Builder without user-side structure work.

### System responsibilities
- understand section meaning
- merge selected sections
- map them into Builder
- preserve coherence automatically

### Important constraint
The user should never have to manually rebuild Builder structure after composing a Territory.

### Exit criteria
- Territory composition becomes functionally useful, not just saved metadata

## Milestone 8: Builder Convergence Toward Sections

### Goal
Gradually align Builder’s visible structure to the shared section model.

### Long-term target
Builder’s visible logic increasingly converges toward:
- `Subjects`
- `Environment`
- `Props`
- `Lighting`
- `Mood`
- `Materials`
- `Style`
- `Composition`
- `Effects`

### Important note
This is later-stage work because it touches:
- question flow
- category map
- node organization
- attribute grouping

### Exit criteria
- Pools, Territories, and Builder no longer feel like separate conceptual systems

## Milestone 9: Retire Or Absorb Old Working Sets

### Goal
Remove duplication once Territories are real.

### Possible actions
- remove `Working Sets` from primary navigation
- migrate users conceptually to Territories
- keep legacy compatibility only if needed

### Exit criteria
- the product no longer depends on the old `Working Sets` feature identity

## Milestone 10: Deep Testing And Adjustment

### Goal
Test the integrated system after the major structural changes are in place.

### Focus areas
- new-user understanding
- sectioned Pool authoring
- Territory creation
- Builder with active Territory
- overall cognitive load
- whether the app now feels more coherent

### Exit criteria
- adjustments come from real usage and tester confusion, not only internal theory

## Recommended sequence

1. finish sectioned Pool maturation
2. freeze legacy Working Sets
3. standardize section language
4. continue Builder presentation simplification
5. implement Territory MVP inside User Pools
6. add Territory state to Builder
7. implement Pool Section -> Builder mapping
8. gradually align Builder to sections
9. retire or absorb old Working Sets
10. run deeper testing and adjust

## Current recommendation

The best immediate implementation focus remains:
- sectioned Pools
- Builder simplification

The biggest future implementation jump will be:
- Territory MVP
- followed by the mapping layer

That is the safest and clearest path from current product state to the intended future system.
