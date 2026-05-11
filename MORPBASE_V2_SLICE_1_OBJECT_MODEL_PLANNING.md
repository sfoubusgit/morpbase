# MorpBase V2 Slice 1 Object Model Planning

## 1. Executive Conclusion

The smallest real object model for Slice 1 is:

- **one live `Workspace Session`**
- **one durable `Kept Work` object**
- **one lightweight return relationship between them**

Everything else in Slice 1 should either be:

- derived from those objects
- or deferred until later slices

This is the strongest starting point because it supports the real MorpBase loop:

- create
- keep
- return

without inflating Slice 1 into a larger platform model too early.

## 2. Minimum Real Product Objects

Slice 1 only truly needs these first-class objects:

### 1. Workspace Session

This is:

- the live creative session inside `Workspace`

It is the active object of the slice.

### 2. Kept Work

This is:

- the durable result of a live session once the user decides it is worth keeping

It is the main Memory object of the slice.

### 3. Return Link

This is:

- the relationship that lets `Kept Work` become a live `Workspace Session` again through reopen / branch / continue

This does not need to become a heavy object type.
But it does need to exist clearly in the product model.

## 3. First-Class Vs Derived

### First-class objects

- `Workspace Session`
- `Kept Work`

### Derived states, not separate first-class objects

- `Prompt Preview`
- keep readiness
- keep handoff state
- Memory Home presentation
- Saved Work focus state
- return-to-work handoff

These matter a lot in the product experience, but they do **not** all need to become separate objects.

That distinction is important.
Otherwise Slice 1 will start feeling over-modeled immediately.

## 4. What Each Object Must Carry

These are not technical fields yet.
They are the minimum product truths each object must carry.

## 4.1 Workspace Session

`Workspace Session` must carry:

- its current shaping state
- enough structured session meaning for `Prompt Preview` to react
- its current title or working identity
- its current proof image or proof-ready preview state
- whether it is still live or has been kept
- if it came from earlier kept work, a light source reference

Plain meaning:

- the session must know what it currently is
- what it is producing
- and whether it is new or derived

## 4.2 Kept Work

`Kept Work` must carry:

- a stable title or identity
- the durable version of the session meaning
- a representative proof image
- enough summary for quick recognition in `Memory`
- created/kept time
- a light source-to-session relationship so it can be reopened, branched, or continued

Plain meaning:

- the kept object must feel like a real reusable thing
- not just saved output text

## 4.3 Return Link

The return relationship must carry:

- which kept object the new session comes from
- whether the user is reopening, branching, or continuing

Plain meaning:

- the product must know why this live session exists

That is what stops the return from feeling like a reset.

## 5. Core Relationships

Slice 1 only needs these core relationships:

### 1. `Workspace Session -> Kept Work`

Meaning:

- the live session becomes durable value

### 2. `Kept Work -> Workspace Session`

Meaning:

- the durable object becomes live work again

### 3. `Workspace Session -> Preview State`

Meaning:

- live shaping produces visible proof

This is important, but the preview can stay derived.

### 4. `Kept Work -> Memory Home`

Meaning:

- Memory displays durable objects that still have creative pull

This is a display relationship, not a separate object class.

## 6. Explicit Non-Objects For Slice 1

These should **not** become first-class objects yet:

- public workflow results
- public reusable assets
- continuity entities
- continuity appearances
- creator objects
- collaboration rooms or sessions
- challenge objects
- reward objects
- storyline objects
- prompt-set style bundle objects
- separate image/gallery objects

Also important:

- `Prompt Preview` should not become a separate heavy object
- it should stay a live derived expression of the `Workspace Session`

## 7. Why This Model Is Strongest

This model is strongest because it gives Slice 1:

- one live object
- one durable object
- one return relationship

That is enough to make the first coded slice feel real.

It is also restrained enough to avoid:

- V1 carryover complexity
- premature realm inflation
- object sprawl that exists before the product value is proven in code

## 8. Main Risks

### 1. Making too many things first-class too early

This would make Slice 1 heavy and technical before it feels alive.

### 2. Making `Kept Work` too thin

If `Kept Work` is only treated like saved text, `Memory` will feel weak immediately.

### 3. Making return relationships too weak

If the model does not preserve why a session is being reopened or branched, the return path will feel like reset behavior.

### 4. Treating images as objects instead of proof

This would push the slice toward the wrong center.

## 9. Final Next-Step Recommendation

The next artifact after this object model should be:

- **the Slice 1 design translation brief**

Why that next:

- the structure is now clear enough
- the behavior is now clear enough
- the object model is now small enough

So the next high-value move is to translate Slice 1 into a coded design direction that avoids generic app drift from the very beginning.

## 10. Final Judgment

`The strongest Slice 1 object model is a deliberately small product model built around one live `Workspace Session`, one durable `Kept Work` object, and one light return relationship between them, with preview and Memory presentation treated as derived product states rather than as new first-class object types.`
