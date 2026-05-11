# Character Identity Projection Plan

## 1. Executive Conclusion

The Character Identity controlled proof should **not** project directly from:

- active session reference

to:

- raw `PromptAdditionEntry[]`

as its governing planning model.

That direct path is useful as a runtime prototype.
It is too small and too architecture-shaping to be the planning truth.

The strongest controlled-proof planning recommendation is:

- introduce a **lane projection step**
- let Character Identity resolve into a small Character-specific projection model first
- then derive `PromptAdditionEntry[]` from that projection model for Builder / Prompt Preview consumption

The cleanest conceptual chain is:

- Character lane entity
- session activation reference
- Character lane projection
- prompt-facing additions and Prompt Preview visibility

That preserves the most important distinction:

- the character entity is not the same thing as its prompt projection

This workstream is mainly about protecting that distinction.

---

## 2. Controlled-Proof Projection Standard

The Character projection plan must satisfy these rules.

### Rule 1: Projection is downstream of the entity

The Character entity remains:

- the reusable continuity object

The projection remains:

- one workflow-facing interpretation of that object

### Rule 2: Projection must stay lane-specific

This plan should define:

- Character lane projection

It should not pretend to define the full future multi-lane projection architecture.

### Rule 3: Projection must support Prompt Preview clarity

The projection must be good enough that Prompt Preview can show:

- what identity is active
- what is being contributed
- that Character is a distinct layer

### Rule 4: Projection must not collapse into prompt source typing as the first truth

`sourceType: 'character'` may remain a useful output detail.
It should not be the starting conceptual contract.

### Rule 5: Projection should be minimal, not overengineered

The first controlled proof does not need:

- full weighted phrase trees
- dynamic conditions
- giant lane-specific rule engines

It only needs enough structure to stay honest and legible.

---

## 3. What Projection Is Actually For

The Character projection layer exists to solve a very specific problem.

### 1. Translate reusable identity into live workflow contribution

The Character entity itself is too broad to be used raw in Builder composition.

### 2. Preserve the entity / workflow distinction

Without a projection step, the system too easily teaches:

- Character = prompt fragments

That is the main conceptual danger.

### 3. Provide a stable handoff to Builder and Prompt Preview

The projection layer should be the contract that:

- Builder composition consumes
- Prompt Preview can explain

### 4. Keep future projection growth possible without overbuilding now

The first proof only needs:

- a simple Character lane projection

But the planning should not trap MorpBase into believing that direct phrase insertion is the only possible future projection pattern.

---

## 4. Recommended Projection Shape

The strongest controlled-proof shape is:

```ts
type CharacterIdentityProjection = {
  lane: 'character';
  characterId: string;
  displayName: string;
  summary?: string | null;
  corePhrases: string[];
  optionalPhrases?: string[];
};
```

This is intentionally small.

### Why this shape is strong

- it is clearly downstream of the entity
- it keeps lane identity visible
- it gives Prompt Preview enough context
- it gives Builder composition enough prompt-facing material

### Why this shape is restrained

It does not add:

- weighting logic
- conditional logic
- deep phrase metadata
- multi-entity orchestration

That would be too much for the first controlled proof.

### What this shape is not

It is not:

- the entity model
- the session state
- the final future realm projection architecture

It is only:

- the Character lane’s minimal workflow-facing projection contract

---

## 5. Recommended Projection Flow

The cleanest flow is:

### Step 1: Resolve active Character entity

Builder session holds:

- `characterId`

The lane catalog resolves that reference into the full `CharacterIdentity`.

### Step 2: Build Character projection

Convert the entity into:

- `CharacterIdentityProjection`

This is where the lane-specific projection rule lives.

### Step 3: Derive Builder additions from projection

Only now derive:

- `PromptAdditionEntry[]`

for final workflow composition

### Step 4: Feed Prompt Preview from projection-aware state

Prompt Preview should not read only:

- final flattened additions

It should also receive:

- lane-aware projection information

so it can remain a real identity-application surface instead of a text-only mirror.

---

## 6. What The First Projection Should Include

For the first controlled proof, Character projection should include only a small set of things.

### 1. Identity lane marker

- `lane: 'character'`

This preserves lane visibility.

### 2. Active entity reference

- `characterId`

This keeps the projection traceable back to the lane entity.

### 3. Prompt Preview display information

- display name
- optional summary

This is needed so Prompt Preview can reveal identity clearly.

### 4. Prompt-facing phrases

- `corePhrases`
- optional `optionalPhrases`

For the first proof, it is safest to plan around:

- `corePhrases` only by default

Optional phrases may stay latent or planning-only until needed.

---

## 7. What The First Projection Must Not Include

To stay controlled, the projection layer must avoid these.

### 1. Full entity data duplication

Do not copy the whole Character entity into projection state.

### 2. Session-independent realm metadata

Do not project:

- tags
- notes
- favorites
- retirement policy

unless Prompt Preview or Builder truly needs them

### 3. Relationship-domain payloads

Do not project:

- linked outfits
- linked artifacts
- future relation graphs

### 4. Style / Territory logic

Do not let Character projection absorb:

- Pool realization rules
- Territory-specific shaping rules

Those remain outside the Character projection layer.

### 5. Overly smart phrase orchestration

Do not introduce:

- condition systems
- weighted trees
- complex lane micro-engines

for the first proof

---

## 8. Relationship To `PromptAdditionEntry`

The controlled-proof planning position should be:

- `PromptAdditionEntry` is a downstream builder-facing output format

not:

- the Character lane projection contract itself

### What can stay

It is fine if Character-derived workflow contribution eventually becomes:

- `PromptAdditionEntry[]`

for the current Builder composition path.

### What must change conceptually

The planning chain should become:

- Character entity
- Character projection
- `PromptAdditionEntry[]`

not:

- Character entity
- `PromptAdditionEntry[]`

This is the smallest change that preserves conceptual integrity without demanding a giant refactor.

### What this means for `'character'` source typing

`sourceType: 'character'` may survive as:

- a Builder-facing output annotation

It should not be treated as:

- the core identity integration contract

That makes it:

- acceptable as a downstream format detail
- unacceptable as the architectural root

---

## 9. Prompt Preview Requirements

Prompt Preview needs more than flattened additions.

The controlled-proof plan should assume Prompt Preview should know:

### 1. Whether a Character projection is active

### 2. Which Character it represents

### 3. What lane it belongs to

### 4. What compact prompt-facing material it is contributing

### 5. What actions are available

- apply
- change
- remove

This is why Prompt Preview should conceptually read:

- session activation state
- lane projection state

not only:

- flattened prompt additions

That preserves Prompt Preview’s role as an identity application surface.

---

## 10. Recommended Contribution Order

The first proving lane should preserve a conceptual contribution order roughly like:

1. Character continuity contribution
2. Pool / IDP host realization layers
3. Territory context
4. local Builder selections and refinements
5. fragments / other additions

The exact final string assembly order may remain implementation-specific.

But the planning truth should be:

- Character contributes continuity early enough to matter
- Character does not replace host realization or Territory logic

### Why this order matters

It teaches:

- Character = who
- Pool / IDP = host realization
- Territory = workflow-space context

That is one of the most important conceptual distinctions in the whole system.

---

## 11. Treatment Of The Current Direct Injection Prototype

The current direct injection path in [App.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx) should be treated as:

- behaviorally useful
- conceptually incomplete

### Preserve conceptually

- core phrases contribute to live workflow output
- character contribution is visible in Builder composition

### Replace in planning

- direct derivation from `activeCharacter` to `PromptAdditionEntry[]`

with:

- derivation through `CharacterIdentityProjection`

### Do not trust

- `'character'` source typing as the planning contract
- the current flattening as the whole future projection model

This is the core prototype-containment move for projection planning.

---

## 12. Minimal First-Wave Projection Rules

The first proof should keep projection simple.

### Rule 1

Project only one active Character Identity at a time.

### Rule 2

Use `phraseBundle.core` as the default projected contribution.

### Rule 3

Keep `phraseBundle.optional` latent or explicitly secondary until there is clear need.

### Rule 4

Keep projection deterministic and inspectable.

### Rule 5

Do not let local workflow text edits mutate the Character projection source automatically.

That last rule preserves the session / entity distinction.

---

## 13. Projection Risks

### 1. Flattening back into prompt-additions too early

This would destroy the point of the projection step.

### 2. Overengineering projection

This would create infrastructure before proof.

### 3. Letting Character projection absorb host logic

That would blur Character with Pool / IDP or Territory roles.

### 4. Hiding projection from Prompt Preview

That would reduce Character back to invisible text injection.

### 5. Treating current prototype output format as final truth

That would let the prototype win again.

---

## 14. Final Recommendation

The Character controlled-proof implementation plan should use:

- a dedicated `CharacterIdentityProjection`
- built from the lane entity after session resolution
- then translated into `PromptAdditionEntry[]` for Builder composition
- while also feeding Prompt Preview enough lane-aware visibility data

## Final Lock

Character projection should be treated as:

- **the workflow-facing interpretation of the Character lane**

not:

- **the Character lane itself**

That is the smallest but most important architectural correction this workstream needs to make.
