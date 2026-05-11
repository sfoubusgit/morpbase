# Identity Entity Taxonomy And Criteria

## 1. Executive Conclusion

An `identity entity` inside MorpBase should be defined narrowly and rigorously.

It is not enough that something is:

- reusable
- saveable
- often repeated
- helpful in prompt construction

To qualify as an identity entity, it must be:

- a persistent continuity object
- recognizable across multiple workflows
- meaningful above any one Pool or Territory
- applied into workflows as one coherent reusable entity

Using that stricter test, the strongest current taxonomy is:

- `Character Identity` = first-wave valid
- `Outfit / Clothing Identity` = later-wave valid
- `Prop / Artifact Identity` = later-wave valid
- `Creature Identity` = later-wave valid
- `Group Identity` = later-wave valid, but structurally heavier
- `Location Identity` = conceptually weak for now
- `Symbol / Emblem Identity` = reject as a standalone first-class system

So the realm should not be thought of as:

- "anything reusable"
- "anything with identity vibes"
- or "all persistent creative material"

It should be thought of as:

- **the MorpBase domain of cross-workflow continuity entities**

---

## 2. What Qualifies As An Identity Entity

The strict definition should be:

> An identity entity is a persistent reusable continuity object whose recognizable sameness should survive across multiple Builder sessions, Pools, and Territories, and which is applied into workflows as its own distinct entity layer rather than flattened into ordinary workflow content.

That definition has five important parts:

### 1. Persistent

The entity must outlive one prompt or one local session.

### 2. Reusable

The entity must be usable across more than one workflow instance.

### 3. Continuity-bearing

Its value must come from "this is the same thing again," not merely from convenience.

### 4. Cross-workflow

It must remain meaningful across different Pools, Territories, or workflow contexts.

### 5. Entity-like

It must feel like a coherent reusable object, not just a loose bundle of prompt parts.

The strongest general litmus test is:

> If you move it into a different workflow family, does it still make sense to say "this is the same thing again"?

If yes, it is a strong identity candidate.
If no, it probably belongs to style, workflow context, or prompt construction instead.

---

## 3. What Does Not Qualify

Something should not qualify as an identity entity if it is mainly:

- workflow-space definition
- style-family realization
- source-library content
- prompt polish
- archive structure
- local scene composition
- temporary emotional or atmospheric state
- a mechanical prompt assembly aid

More concretely, these do **not** qualify:

### Pool material

Pool items are reusable, but they are source-library content, not continuity entities.

### Territory definitions

Territories are reusable, but they are workflow-space contexts, not continuity entities.

### IDP sets

IDP sets are reusable, but they remain Pool-bound baseline logic rather than cross-workflow entity continuity.

### Prompt Sets

Prompt Sets organize outputs.
They do not define recurring identity.

### Builder categories or selections

Builder selections are local workflow construction.
They are not independent reusable entities.

### Prompt additions / fragments

Prompt additions may help express an identity, but they are not the identity entity itself.

This distinction matters because MorpBase already contains many reusable systems.
If `identity entity` simply means "reusable thing," the realm loses all conceptual sharpness.

---

## 4. Qualification Criteria

An entity should qualify only if it meets most of these criteria.

### Qualification criteria

1. `Cross-workflow continuity`
It should still be the same thing across multiple Pools or Territories.

2. `Recognizable sameness`
A user should plausibly feel: "this is still the same character / outfit / object / creature."

3. `Independence from one host workflow`
It should not depend on one specific style family or workflow lane to remain meaningful.

4. `Entity coherence`
It should behave like one reusable object, not just a list of ingredients.

5. `Application model`
It should make sense to apply it into a workflow rather than author it only inside that workflow.

6. `Separation from workflow realization`
It should own continuity, not the stylistic or compositional realization of that continuity.

7. `Repeat-use value`
Its value should increase through repeated use across workflows, not vanish after one image.

8. `Boundary stability`
It should have a stable enough ownership boundary that it does not constantly collapse into Pools, Territories, or Builder categories.

### Practical pressure tests

Ask these questions:

1. Would this still be recognizably the same thing in a very different Pool?
2. Would it still make sense outside one Territory?
3. Does it have continuity value beyond one saved prompt?
4. Would flattening it into Builder categories obviously weaken it?
5. Does it feel like an entity, not just a recipe?

If most answers are "no," it does not qualify.

---

## 5. Candidate Entity Taxonomy

The strongest candidate taxonomy currently looks like this:

### A. Subject identity entities

These are recurring subjects whose sameness matters across workflows.

Includes:

- Character Identity
- Creature Identity
- Group Identity

### B. Wearable appearance entities

These are reusable wearable or silhouette-shaping identity layers.

Includes:

- Outfit / Clothing Identity

### C. Object continuity entities

These are recurring object-like things that can remain recognizably the same across workflows.

Includes:

- Prop / Artifact Identity

### D. Space / environment continuity entities

These are recurring places or environments that may preserve sameness across workflows.

Includes:

- Location Identity

This category is currently the weakest because it overlaps heavily with workflow-space and environment logic.

### E. Symbolic micro-entities

These are recurring symbolic forms that may appear identity-like but are often too small or too dependent on a host entity.

Includes:

- Symbol / Emblem Identity

This category is currently too weak to justify standalone first-class treatment.

---

## 6. Judgment On Each Candidate

### Character Identity

Judgment:

- `first-wave valid`

Why:

- strongest conceptual maturity in current docs
- clearest cross-workflow continuity value
- clearest ownership boundary
- clearest gap in MorpBase today

Why it qualifies:

- a character can survive across different Pools and Territories
- a character can remain the same while style and workflow context change
- the value clearly comes from continuity, not just reuse

Risks:

- overloading it with style, scene composition, or Territory logic
- mistaking it for a second Builder

### Outfit / Clothing Identity

Judgment:

- `later-wave valid`

Why:

- `REUSABLE_IDENTITY_FRAMEWORK_CONCEPT.md` makes a strong case that outfit continuity is parallel to character continuity
- reusable outfits can persist across characters, workflows, and Territories

Why it qualifies:

- can remain meaningfully the same across workflows
- can be applied modularly rather than owned by one Territory
- has continuity value beyond a one-off prompt

Why not first-wave:

- introduces a second identity dimension too early
- is strongest after Character proves the realm

### Prop / Artifact Identity

Judgment:

- `later-wave valid`

Why:

- recurring props or artifacts can be continuity-bearing objects
- especially strong for iconic weapons, relics, staffs, masks, or sacred items

Why it qualifies:

- a named or recognizable artifact can persist across workflows
- it can stay coherent above a single style host

Main caution:

- many props are only scene ingredients
- generic prompt props should not be promoted into identity entities

### Creature Identity

Judgment:

- `later-wave valid`

Why:

- recurring creatures clearly satisfy "same thing again" across workflows
- conceptually adjacent to Character without being identical

Why it qualifies:

- can preserve recurring anatomy, silhouette, motifs, and subject identity across workflows

Main caution:

- may eventually need its own distinction from humanoid character identity

### Location Identity

Judgment:

- `conceptually weak`

Why:

- some places can be recurring and continuity-bearing
- but locations overlap too much with environment, workflow-space, and Territory logic

Why it is weak right now:

- risks collapsing into Territory
- risks becoming environmental source logic rather than entity continuity
- has a much less stable ownership boundary in the current MorpBase model

Possible future:

- only worth revisiting if MorpBase later proves stronger continuity systems above Territories

### Group Identity

Judgment:

- `later-wave valid`

Why:

- recurring duos, teams, families, or factions can plausibly carry continuity across workflows

Why it qualifies:

- "the same group again" is a meaningful continuity pattern

Why it is not first-wave:

- it depends heavily on first solving Character-level identity well
- introduces relational complexity early

### Symbol / Emblem Identity

Judgment:

- `reject`

Why:

- too small and too dependent on host entities in most cases
- usually works better as a motif, sub-entity attribute, or recurring artifact detail

Why it fails the stricter test:

- often does not justify standalone entity status
- often behaves more like a detail attached to Character, Outfit, Prop, or faction-level design

Exception:

- if the symbol is really an artifact-like recurring object, it should probably be modeled under Prop / Artifact identity instead

---

## 7. Boundary Comparison Against Other MorpBase Systems

### Identity Entity vs Pool

Pool:

- reusable source library
- often style- or workflow-shaped
- feeds workflows with material

Identity entity:

- reusable continuity object
- should remain meaningful across multiple Pools
- is applied into workflows rather than acting as the source library itself

Key distinction:

- Pool answers `what reusable material shapes this workflow?`
- Identity entity answers `what recurring thing persists across workflows?`

### Identity Entity vs Territory

Territory:

- focused workflow space
- source composition and Builder focus layer

Identity entity:

- recurring continuity object carried into workflows

Key distinction:

- Territory answers `what workflow space am I in?`
- Identity entity answers `who or what is recurring here?`

### Identity Entity vs IDP Set

IDP set:

- Pool-owned identity baseline inside a host workflow

Identity entity:

- cross-workflow reusable continuity object

Key distinction:

- IDP set is still tied to a host Pool
- identity entity should survive movement across hosts

### Identity Entity vs Prompt Set

Prompt Set:

- grouping structure for saved outputs

Identity entity:

- reusable continuity object used before and during output creation

Key distinction:

- Prompt Set organizes results
- identity entity shapes continuity

### Identity Entity vs Builder Category

Builder category:

- local workflow-construction lane
- a place where prompt decisions are made during the active session

Identity entity:

- reusable applied object outside the normal category structure

Key distinction:

- Builder category is workflow construction
- identity entity is applied continuity

### Identity Entity vs Prompt Addition

Prompt addition:

- text or structured prompt influence
- one layer of prompt output assembly

Identity entity:

- the reusable continuity object itself

Key distinction:

- prompt addition is one expression of an identity
- it is not the identity entity in full

This distinction is especially important because current runtime code already risks flattening Character toward prompt-addition behavior.

---

## 8. Best First-Wave Candidates

### Best first-wave candidate

- `Character Identity`

Why:

- strongest conceptual proof
- clearest user value
- clearest gap relative to current systems
- best-prepared documentation base

### Best second-wave candidate

- `Outfit / Clothing Identity`

Why:

- strongest parallel layer after Character
- preserves modularity without collapsing into Character

### Best longer-wave support candidates

- `Prop / Artifact Identity`
- `Creature Identity`
- `Group Identity`

These are all plausible, but they should follow only after the realm's first proving lane is clear.

---

## 9. Rejected Or Weak Candidates

### Weak: Location Identity

Why weak:

- boundary too unstable right now
- too much overlap with Territory and environment logic
- higher risk of conceptual confusion than immediate leverage

### Reject: Symbol / Emblem Identity as a standalone first-class system

Why reject:

- usually too small to deserve entity-system treatment
- better modeled as motif, artifact detail, or sub-entity attribute

### General rejection rule

Reject any candidate that is mainly:

- a style host
- a workflow-space definition
- a local scene setup
- a symbolic detail without enough entity coherence
- a convenience bundle with no real continuity value

---

## 10. Open Questions

1. Should `Group Identity` remain a real future candidate, or should it wait until Character proves multi-entity relationships cleanly?

2. Is there any strong future case for `Location Identity`, or should recurring places be handled by a later continuity/storyline system instead?

3. Should `Faction Identity` eventually be treated as:
- a group-like identity entity
- a profile/meta-entity
- or something above the Identity Systems realm?

4. How should MorpBase distinguish:
- an iconic recurring outfit that deserves entity status
- from recurring clothing markers that still belong inside Character Identity?

5. Should current runtime `Character` code be treated as:
- disposable prototype scaffolding
- or useful early pressure-test material for the first-wave proving lane?

## Final Lock

The cleanest current taxonomy is:

- first-wave valid: `Character Identity`
- later-wave valid: `Outfit / Clothing Identity`, `Prop / Artifact Identity`, `Creature Identity`, `Group Identity`
- conceptually weak: `Location Identity`
- reject: `Symbol / Emblem Identity` as a standalone realm-class entity

That is strict enough to preserve the integrity of Identity Systems without making the realm shapeless or overgrown.
