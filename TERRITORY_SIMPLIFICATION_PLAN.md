## Territory Simplification Plan

### Purpose

This plan translates the findings of `CURRENT_STATE_TERRITORY_CONFUSION_ANALYSIS.md` into a small, practical simplification path.

The goal is not to rebuild Territories.
The goal is to make them:

- easier to understand
- easier to trust
- easier to use

without removing their real value.

## Core Principle

Territories should feel like:

- **focused workflow spaces built from Pools**

not like:

- mysterious advanced behavior bundles

That sentence should guide all simplification decisions.

## Main Simplification Goals

1. explain Territory more clearly
2. reduce conceptual overlap with Pools
3. make active Territory effects more obvious
4. reduce the feeling of hidden behavior
5. keep the creation flow advanced but more understandable

## Recommended Changes

### 1. Give Territory a short plain-language definition wherever it matters

Current problem:

- users may not have a stable mental model for what a Territory is

Recommended change:

- add one short definition in the main Territory surfaces

Example:

- `A Territory is a focused workflow space built from Pools.`

Best locations:

- Territory editor area
- active Territory area in Builder
- possibly the first empty-state Territory prompt

### 2. Explain the difference from Pools more directly

Current problem:

- users can easily ask why Territory exists if Pools already exist

Recommended change:

- explicitly differentiate them in one short line

Example:

- `Pools provide reusable source material. Territories turn chosen Pool material into a focused workflow space.`

This should not become a long help article.
It should be compact and visible where needed.

### 3. Make active Territory effect more explicit in Builder

Current problem:

- active Territory changes Builder behavior, but this can still feel partially hidden

Recommended change:

- strengthen the active Territory signal
- show more clearly:
  - Territory name
  - that Builder focus is being shaped
  - what mode is active

This should feel like:

- “you are inside this focused workflow space now”

not:

- “some invisible rule set is affecting the Builder”

### 4. Reword or support `Territory-biased`

Current problem:

- the term is structurally valid but still a little internal-feeling

Recommended change:

- either refine the label later
- or keep it but support it with better immediate explanation

For example:

- `Territory-biased`
- helper text:
  - `Builder stays focused on Territory-relevant areas.`

This may be enough without renaming yet.

### 5. Reframe Territory creation around payoff first

Current problem:

- the creation flow currently feels more mechanical than rewarding

Recommended change:

- in the compose/create area, remind the user what the result does

Example:

- `Build a reusable focused workflow space from selected Pool sections.`

That helps the user understand the “why” before the “how”.

### 6. Keep Territory as optional, but confidently optional

Current problem:

- users may feel they are “supposed” to use Territories even when just using Pools

Recommended change:

- signal more clearly that Territories are optional workflow focus tools

Example:

- `Optional: use a Territory when you want a tighter workflow space.`

This reduces pressure and confusion.

## Best Order Of Implementation

### Phase 1: wording and framing

- short Territory definition
- Pool vs Territory distinction
- payoff-first creation copy
- helper text for Territory-biased

This is likely the highest value per effort.

### Phase 2: stronger active-state clarity

- improve active Territory presentation in Builder
- make Territory influence more legible

### Phase 3: creation-flow refinement if still needed

- only after the simpler clarity fixes are tested

## What Not To Do Yet

### 1. Do not rebuild Territories

The current concept may still be right.
The immediate problem is clarity, not necessarily structure.

### 2. Do not add major new Territory mechanics

That would likely worsen mental load before clarity is repaired.

### 3. Do not merge Territory back into Pools

That would solve one confusion by destroying a useful distinction.

## Expected Result

If these changes work, users should be able to understand:

- what a Territory is
- why it exists separately from Pools
- what changes when it is active
- when it is worth using

without needing a deep conceptual explanation.

## One-Line Conclusion

Territory simplification should focus first on clearer framing, clearer active-state visibility, and more payoff-first language rather than on structural redesign.
