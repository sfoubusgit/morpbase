# Identity Systems Connection Matrix

## 1. Executive Conclusion

Identity Systems connects to almost every major MorpBase system, but not in the same way.

The cleanest overall reading is:

- Builder = live workflow workspace
- Prompt Preview = identity application and visibility surface
- Territories = workflow-space context
- Pools = source and realization libraries
- IDP sets = host-specific baseline identity logic
- Prompt Archive / Prompt Sets = downstream output structure
- Pool Hub / profiles = ecosystem and discovery surfaces
- Shared Storylines / future continuity systems = higher-order continuity layers that could later build above Identity Systems

The most important structural fact is:

- Identity Systems should touch many systems
- but it should not collapse into any of them

Its best role is:

- a separate reusable continuity realm
- projecting into Builder sessions
- clearly visible in Prompt Preview
- remaining conceptually distinct from Pools, Territories, IDP sets, saved prompts, and creator profiles

The current runtime already contains Character-shaped hooks, but those hooks are narrower than the larger connection model implied by the concept docs.
So the concept docs remain the stronger source of truth for connection design.

---

## 2. System Connection Matrix

### Builder

Conceptual relationship:

- Identity Systems is applied into Builder sessions, but Builder does not own identity definition.

Dependency direction:

- Identity -> Builder

What must remain separate:

- identity creation
- identity management
- identity-entity data ownership

What can connect:

- active identity reference in the live session
- activation / deactivation state
- explicit workflow-use state

Biggest confusion risk:

- treating Builder as the home of identity authoring

Recommended boundary rule:

- Builder owns workflow construction only
- Identity Systems owns reusable continuity entities

### Prompt Preview

Conceptual relationship:

- Prompt Preview is the strongest application and visibility surface for active identities.

Dependency direction:

- Identity -> Prompt Preview
- Prompt Preview -> Builder session control

What must remain separate:

- identity-entity definition
- identity library ownership

What can connect:

- apply
- switch
- inspect
- remove
- visibly show identity as one influence layer

Biggest confusion risk:

- reducing identity to a small prompt widget or text-insertion control

Recommended boundary rule:

- Prompt Preview reveals and controls active identity layers
- it does not become the identity realm itself

### Territories

Conceptual relationship:

- Territories and Identity Systems are parallel context layers doing different jobs.

Dependency direction:

- Territory -> Builder focus
- Identity -> recurring continuity inside that focused workflow

What must remain separate:

- Territory composition
- Territory mapping
- identity-entity definition

What can connect:

- active Territory and active identity can coexist in one live workflow
- Prompt Preview can show both as separate layers

Biggest confusion risk:

- users assuming identity is part of Territory composition

Recommended boundary rule:

- Territory answers `what workflow space am I in?`
- Identity answers `who or what is recurring across workflows?`

### Pools

Conceptual relationship:

- Pools realize workflows and supply reusable material; Identity Systems supplies recurring continuity above those hosts.

Dependency direction:

- Pool -> workflow source / realization
- Identity -> continuity carried into those realized workflows

What must remain separate:

- Pool ownership of style / workflow / image-family realization
- identity ownership of recurring sameness

What can connect:

- Pools can host the realization of an applied identity
- future identities may be usable across multiple Pools

Biggest confusion risk:

- treating identity as a special Pool type

Recommended boundary rule:

- Pools are source libraries and realization hosts
- identities are continuity entities that survive movement across hosts

### Initiative Phrases

Conceptual relationship:

- initiative phrases are workflow-driving Pool tools that may coexist with identities but do not define them.

Dependency direction:

- Pool -> initiative phrase behavior
- Identity remains independent

What must remain separate:

- initiative phrase ownership
- identity continuity ownership

What can connect:

- the same workflow may carry initiative phrases and an active identity at once

Biggest confusion risk:

- storing identity logic inside workflow-driving phrase systems

Recommended boundary rule:

- initiative phrases shape workflow behavior
- identity entities preserve recurring sameness

### IDP Sets

Conceptual relationship:

- IDP sets are host-specific identity baselines inside Pools, while Identity Systems is cross-workflow continuity.

Dependency direction:

- Pool -> IDP baseline
- Identity -> cross-host continuity

What must remain separate:

- Pool-bound baseline logic
- reusable entity identity

What can connect:

- both can layer into one workflow if the distinction stays visible

Biggest confusion risk:

- users reading both as equivalent identity systems

Recommended boundary rule:

- IDP set = workflow baseline inside one host Pool
- identity entity = recurring continuity above host Pools

### Prompt Archive / Prompt Library

Conceptual relationship:

- Prompt Archive stores outputs produced with identity, but it does not define identity itself.

Dependency direction:

- Builder / Prompt Preview -> saved prompt
- identity may later be referenced in saved outputs

What must remain separate:

- saved output storage
- identity-entity storage

What can connect:

- metadata showing which identities were active
- retrieval of outputs created with specific identities

Biggest confusion risk:

- mistaking saved prompts for the continuity system itself

Recommended boundary rule:

- Prompt Archive stores results
- Identity Systems stores reusable continuity entities

### Prompt Sets

Conceptual relationship:

- Prompt Sets organize saved outputs and may later cluster outputs related to the same identity.

Dependency direction:

- saved prompts -> Prompt Sets
- identities may become an organizing dimension later

What must remain separate:

- grouping logic
- entity continuity logic

What can connect:

- prompts made with a specific identity could later be grouped or filtered

Biggest confusion risk:

- using Prompt Sets as a stand-in for identity continuity

Recommended boundary rule:

- Prompt Set is output organization
- Identity Systems is entity continuity

### Pool Hub

Conceptual relationship:

- Pool Hub is a discovery layer for Pools and should not be assumed to be the identity-discovery model by default.

Dependency direction:

- community Pools -> workflow source discovery
- future identities may need their own discovery / publishing path

What must remain separate:

- pool distribution
- identity distribution

What can connect:

- future ecosystem patterns might rhyme
- identity discovery could later borrow profile and publishing ideas

Biggest confusion risk:

- forcing identity publication into Pool-shaped community infrastructure

Recommended boundary rule:

- Pool Hub remains a Pool surface unless MorpBase later creates explicit identity-discovery infrastructure

### Creator Profiles / Public Profiles

Conceptual relationship:

- creator profiles describe who made content; Identity Systems describes reusable creative entities inside content.

Dependency direction:

- creator profile -> social / authorship layer
- Identity Systems -> creative continuity layer

What must remain separate:

- creator identity
- creative entity identity

What can connect:

- future published identities could be associated with creator profiles

Biggest confusion risk:

- conflating person-level profile identity with reusable creative entity identity

Recommended boundary rule:

- creator profile is authorship
- identity entity is reusable continuity inside the creative system

### Shared Storylines

Conceptual relationship:

- Shared Storylines is a future higher-order continuity layer that could coordinate multiple identities across prompts and workflows.

Dependency direction:

- Identity Systems -> reusable entities
- Shared Storylines -> larger continuity across entities, places, and outputs

What must remain separate:

- entity continuity
- storyline continuity

What can connect:

- Shared Storylines could later reference identity entities directly

Biggest confusion risk:

- making Identity Systems so broad that it starts swallowing storyline logic

Recommended boundary rule:

- Identity Systems owns continuity of entities
- Shared Storylines owns continuity of larger narrative structures

### Future Continuity / Collaboration Systems

Conceptual relationship:

- Identity Systems could become a foundational entity layer for future continuity and collaboration systems.

Dependency direction:

- Identity Systems -> future systems above it

What must remain separate:

- reusable entity continuity
- multi-user or higher-order continuity orchestration

What can connect:

- shared entities
- continuity references
- collaborative reuse

Biggest confusion risk:

- building the higher-order future model too early and overloading the Identity realm

Recommended boundary rule:

- keep Identity Systems entity-centered
- let broader collaboration systems build above it later

---

## 3. Hard Boundaries

These boundaries should be treated as non-negotiable unless the realm concept itself changes.

### 1. Identity Systems is not a Pool subtype

Pools are reusable source libraries and workflow/style hosts.
Identity entities are reusable continuity objects.

### 2. Identity Systems is not a Territory subtype

Territories are workflow-space context.
Identity is recurring continuity within or across those spaces.

### 3. Identity Systems is not a Builder category system

Identity entities must not be flattened into ordinary Builder content.

### 4. Identity Systems is not Prompt Archive structure

Saved prompts and Prompt Sets preserve outputs.
They do not own reusable continuity entities.

### 5. Identity Systems is not creator-profile identity

Authorship identity and creative-entity continuity are distinct.

### 6. Identity Systems is not just prompt text injection

Prompt output matters, but the prompt layer is only one projection of the entity, not the entity itself.

### 7. Identity Systems should not begin as a giant abstract parent framework in implementation

The concept may acknowledge a larger framework, but implementation should still prove one lane first.

---

## 4. Soft Integration Points

These are the healthiest places where Identity Systems should connect to the existing product.

### 1. Builder session activation state

Builder likely needs to know:

- what active identity is applied
- whether an identity is active at all

### 2. Prompt Preview controls

Prompt Preview is the strongest place for:

- apply
- switch
- remove
- inspect

### 3. Prompt assembly projection

Identity entities will likely need some prompt-facing projection, but without reducing the entity to prompt text.

### 4. Saved prompt metadata

Saved outputs could later remember:

- what identity was active when the prompt was created

### 5. Future publishing / profile surfaces

Creator surfaces may later expose:

- published identities
- identity-linked outputs

### 6. Future continuity systems

Shared Storylines or future collaboration features may later link multiple identity entities together.

---

## 5. Greatest Confusion Risks

### 1. Pool / IDP / Identity overlap

This is the biggest risk cluster.
All three can appear identity-shaped unless their jobs stay explicit.

### 2. Territory / Identity overlap

Users may ask:

- why do I need a Territory if I already applied an identity?

That means the workflow-space versus recurring-entity distinction must stay legible.

### 3. Prompt layer overload

If the live workflow contains:

- Territory
- source Pools
- IDP baseline
- identity entity
- fragments
- Builder selections

then users can easily lose track of what is doing what.

### 4. Character over-centering

Current runtime already frames identity almost entirely as `Character`.
That is useful as a prototype, but dangerous as the mental model for the whole realm.

### 5. Discovery-shape confusion

If MorpBase later tries to reuse Pool Hub or profile logic too literally for identities, the realm may inherit the wrong shape.

---

## 6. Most Important Boundary Rules

### Rule 1

- Builder constructs workflows.
- Identity Systems provides reusable continuity entities applied into workflows.

### Rule 2

- Territory defines workflow-space context.
- Identity defines recurring sameness carried across workflow spaces.

### Rule 3

- Pool defines reusable source and realization material.
- Identity defines reusable continuity above host Pools.

### Rule 4

- IDP sets are host-specific baseline identity logic.
- Identity Systems is host-independent continuity logic.

### Rule 5

- Prompt Archive and Prompt Sets store results.
- Identity Systems stores reusable continuity entities.

### Rule 6

- creator profile identity is authorship identity.
- identity entity is creative continuity identity.

### Rule 7

- prompt additions may express identity
- but they are not the identity entity itself

---

## 7. Where Current Runtime Code Drifts

### 1. Identity is already narrowed to Character

`src/ui/App.tsx`, `src/ui/components/PromptPreview.tsx`, `src/ui/components/CharacterLibraryModal.tsx`, `src/engine/characterStore.ts`, and `src/types/characters.ts` already implement a Character-shaped runtime path.

That is useful evidence, but it narrows the mental model too early.

### 2. Identity is currently flattened into prompt assembly too directly

`src/types/promptAdditions.ts` already has:

- `sourceType?: 'pool' | 'territory' | 'fragment' | 'pool-default' | 'idp-set' | 'character'`

and `src/ui/App.tsx` already builds `characterEntries` directly into `promptAdditionEntries`.

This makes identity look dangerously close to:

- another prompt source type
- another prompt addition lane

That is implementation drift relative to the larger realm concept.

### 3. Builder session already stores Character as if the realm shape were settled

`src/ui/App.tsx` persists:

- `activeCharacterId`

inside the Builder session snapshot.

That is not inherently wrong, but it is conceptually premature if treated as proof that Builder is the proper home of identity state.

### 4. Prompt Preview currently frames identity as a narrow workflow block

The Character block in `src/ui/components/PromptPreview.tsx` is reasonable for a prototype, but it still reads as:

- one small overlay
- one reusable subject identity only

not:

- one lane inside a larger identity realm

### 5. There is no corresponding realm-level product surface

`src/ui/App.tsx` exposes:

- Builder
- Saved Prompts
- Workflow Sources
- Community Pools
- Profile

There is no Identity realm surface in navigation, which is consistent with the concept docs but also shows that the current Character runtime is not integrated as a true realm.

### 6. No ecosystem layer exists for identity yet

Pool Hub and creator profiles are Pool- and output-oriented.
There is no identity publishing, discovery, or profile linkage model yet.

### 7. No higher-order continuity system exists yet

Shared Storylines remains conceptual only.
So Identity Systems currently has no runtime partner above it, which reinforces the need to keep its own scope disciplined.

---

## 8. Open Questions

1. Should the first visible identity connection in the product remain entirely through Prompt Preview, or should Builder eventually expose a clearer realm-entry handoff?

2. Should future saved prompts store explicit identity references, or should that wait until the identity model is stable?

3. Should identity publishing eventually live near creator profiles, or should Identity Systems gain a distinct discovery layer?

4. Should the current Character runtime be treated as:
- disposable scaffolding
- or a prototype pressure-test for the future first-wave lane?

5. How should MorpBase eventually explain the difference between:
- active Territory
- active host Pool / source Pools
- active IDP baseline
- active identity entity

without creating too much prompt-layer burden?

## Final Lock

The cleanest connection model is:

- Identity Systems should connect broadly across MorpBase
- but always as a separate continuity realm
- never by becoming a disguised Pool, Territory, Builder feature, prompt archive feature, or profile feature

That is the only connection model that preserves the strength of the idea while keeping the rest of the system legible.
