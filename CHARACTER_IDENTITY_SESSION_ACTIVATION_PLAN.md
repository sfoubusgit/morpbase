# Character Identity Session Activation Plan

## 1. Executive Conclusion

The Character Identity controlled proof should use a **narrow lane-scoped session state** inside Builder.

The strongest planning recommendation is:

- do **not** keep Character session state as the entire identity model
- do **not** let a flat prototype field become the implied future realm contract
- store only the minimum lane activation reference needed for live workflow use

The cleanest target shape is:

```ts
type CharacterIdentitySessionState = {
  characterId: string | null;
};
```

embedded inside Builder as a lane-scoped session slice, for example:

```ts
type BuilderSessionIdentityState = {
  character: CharacterIdentitySessionState;
};
```

This is stronger than the current raw `activeCharacterId` field because it:

- keeps the state obviously lane-scoped
- avoids pretending this is already the generalized realm contract
- keeps Builder narrow

The main session principle is:

> Builder owns live Character activation, not Character truth.

---

## 2. Controlled-Proof Session Standard

The session activation plan must satisfy these rules.

### Rule 1: Builder stores activation, not identity ownership

The session may know:

- whether a Character Identity is active
- which Character Identity is active

The session may not become:

- the storage home of the character entity

### Rule 2: Session state must remain lane-specific, not realm-wide by assumption

This plan should not invent a full multi-lane identity state framework just because the future realm might need one later.

### Rule 3: Session state must be reference-level only

Store:

- identity references

Do not store:

- full entity payloads by default

### Rule 4: Activation must stay explicit

Character activation should happen because:

- the user applied a character

not because:

- a Pool was selected
- a Territory was selected
- a prompt was opened silently

### Rule 5: Character session state must remain independent from other workflow context layers

Character is:

- a sibling context layer beside Territory and IDP baseline

not:

- a subordinate behavior of either one

---

## 3. What Session State Is Actually For

The Character session slice exists for five things only.

### 1. Active lane reference

It must remember:

- which Character Identity is active now

### 2. Live workflow control

It must support:

- apply
- switch
- remove

### 3. Session persistence

It should survive:

- refresh
- app reload
- reopening the same Builder workflow state

### 4. Prompt Preview visibility

It must support Prompt Preview in showing:

- whether a Character Identity is active
- which one it is

### 5. Controlled interaction with workflow composition

It must enable projection into the live workflow without becoming the projection model itself.

That is all the session slice needs to do.

---

## 4. Recommended Session Shape

The best controlled-proof session shape is:

```ts
type CharacterIdentitySessionState = {
  characterId: string | null;
};
```

Used inside Builder as:

```ts
type BuilderSessionIdentityState = {
  character: CharacterIdentitySessionState;
};
```

And inside the larger Builder session snapshot as something like:

```ts
type BuilderSessionSnapshot = {
  ...
  identityState: {
    character: {
      characterId: string | null;
    };
  };
};
```

### Why not keep raw `activeCharacterId` as the planning target

`activeCharacterId` is a useful prototype field.
It is weaker as the planning target because it:

- reads like ad hoc lane state
- encourages direct inheritance from the prototype
- makes later lane-vs-realm separation less visible

### Why not invent a generalized multi-lane realm session contract now

That would be too broad too early.

The controlled-proof model should avoid pretending:

- the first lane already knows the whole future realm session design

### Why lane-scoped nesting is the best middle path

It makes three things explicit:

- this is Builder session state
- this is identity-related
- this is only the Character lane slice

That is the cleanest planning position.

---

## 5. Allowed Session Transitions

The Character session slice should support only a small set of valid transitions.

### 1. None -> Active

The user applies a Character Identity.

Session result:

- `characterId = selectedCharacterId`

### 2. Active -> None

The user removes the active Character Identity.

Session result:

- `characterId = null`

### 3. Active A -> Active B

The user switches from one Character Identity to another.

Session result:

- `characterId = nextCharacterId`

### 4. Missing / invalid -> None

The session points to:

- a deleted
- missing
- or no-longer-eligible character

Session result:

- clear safely to `null`
- optionally show a notice

### 5. Retired / draft handling

The cleanest first planning rule is:

- only entities eligible for active use should be selectable in the picker

If a session points to an entity that should no longer be activated normally, the safest first-wave behavior is:

- clear it on restore and notify

This keeps the first proof clean and legible.

---

## 6. Persistence And Rehydration Rules

The session slice should be persisted like other Builder session state, but narrowly.

### Persist by reference only

Persist:

- `characterId`

Do not persist:

- full character payload
- phrase bundle snapshot by default
- entity metadata by default

### Rehydrate through the lane catalog

On session restore:

1. load session reference
2. load Character lane catalog
3. resolve `characterId` against the catalog
4. if valid, restore active state
5. if invalid, clear safely

### Missing character recovery rule

If the stored `characterId` no longer exists:

- clear it
- do not crash
- do not keep a broken dangling state

### Session persistence should not imply realm ownership

The fact that Builder persists the active character reference must never be interpreted as:

- Builder owning Character Identity

It only owns:

- the live-use reference

---

## 7. Relationship To Existing Workflow State

Character session state should be a sibling, not a subordinate, to other workflow context state.

### Relation to Territory

Territory state answers:

- what workflow space am I in?

Character session state answers:

- which recurring character is active in this workflow?

Rules:

- changing Territory should not silently change Character
- removing Territory should not silently remove Character
- applying Character should not modify Territory

### Relation to IDP baseline

IDP state answers:

- what host-specific baseline identity layer is active?

Character state answers:

- what recurring character continuity entity is active?

Rules:

- changing IDP should not silently change Character
- changing Character should not silently change IDP

### Relation to Pool selection

Pool context shapes host realization.
It should not auto-bind Character activation.

Rule:

- applying a Pool is not the same as applying a Character

### Relation to `Clear Prompt`

The controlled-proof planning recommendation is:

- `Clear Prompt` should preserve active Character session state

Why:

- Character is a continuity context layer
- not merely a local prompt selection

This means the clear operation should target:

- Builder selections
- local prompt construction

not:

- active Character lane state

### Relation to undo

If `Clear Prompt` preserves Character state, then:

- Character should not need to be restored by clear-undo in normal operation

This is cleaner than the current prototype shape, where Character is included in clear undo state even though the stronger model is to leave it untouched by clear in the first place.

---

## 8. What Session State Must Not Own

The Character session slice must not own any of these:

### 1. Full Character data

### 2. Character library management

### 3. Character editing state

### 4. Lane taxonomy

### 5. Relationship graph

### 6. Retirement / archive policy

### 7. Saved-output lineage history

These belong either to:

- the lane catalog
- later lineage systems
- or broader future realm logic

---

## 9. Treatment Of The Current `activeCharacterId` Prototype

The current raw `activeCharacterId` in [App.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx) should be treated as:

- a good behavioral prototype
- a weak final planning contract

### What is worth preserving

- one active character per workflow
- persisted by reference
- safe clearing if the entity disappears

### What should change in planning

- move from a raw flat field toward a lane-scoped session slice
- remove the idea that Character state is just one extra ad hoc root field forever

### Why this matters

If the planning phase simply blesses `activeCharacterId` unchanged, the prototype will quietly win over the controlled-proof model.

That is exactly what this workstream should prevent.

---

## 10. Minimal Session Validation Rules

The session model should support these simple validation expectations.

### 1. Only one active Character Identity at a time

For the first proving lane:

- zero or one active character

### 2. Activation must reference an existing eligible entity

### 3. Removal must always be safe

### 4. Restore must recover safely from missing state

### 5. Session state must remain compatible with future lane addition without pretending to solve it now

This last rule is why lane-scoped nesting is so useful.

---

## 11. Session Risks

### 1. Flat prototype inheritance

If planning simply keeps `activeCharacterId` without re-justification, the prototype becomes the contract.

### 2. Over-generalization too early

If planning invents a full multi-lane identity session framework now, it will overbuild the first proof.

### 3. Hidden coupling to Territory or IDP

If Character starts changing because other context layers change, the lane will lose clarity.

### 4. Treating clear/reset as session identity reset

That would weaken Character’s status as a continuity layer.

### 5. Persisting too much

If Builder starts storing large identity payloads, the session / realm boundary will blur quickly.

---

## 12. Final Recommendation

The Character controlled-proof session plan should use:

- a lane-scoped `character` session slice
- storing only `characterId`
- explicit apply / remove / switch transitions
- reference-only persistence
- safe invalid-reference recovery
- preservation through normal `Clear Prompt`
- strict independence from Territory, Pool, and IDP activation

## Final Lock

Builder should remember:

- **which Character Identity is active**

and nothing more ambitious than that.

That is the narrowest session contract strong enough to prove the lane without accidentally becoming the future realm contract.
