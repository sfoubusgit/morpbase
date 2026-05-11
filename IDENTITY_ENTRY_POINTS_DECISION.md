# Identity Entry Points Decision

Date: 2026-03-20

## Purpose

This document decides where `Character Identity` should first appear in MorpBase.

The goal is not to design the full feature.
The goal is to answer:

- where users should create/manage characters
- where users should apply a character into a workflow
- what the smallest clean MVP footprint is in the current app

## Executive Decision

The best MVP entry model is:

- **application surface:** `Prompt Preview / Workflow Context`
- **management surface:** `Characters` library modal
- **not yet:** a top-level `Characters` page

Short version:

- apply characters in Prompt Preview
- manage characters in a dedicated modal/library
- promote to a full page later only if the feature proves real

## Why This Is The Best Fit Right Now

### 1. Prompt Preview is already the active workflow control surface

`src/ui/components/PromptPreview.tsx` already shows:

- active workflow summary
- Pools
- Territory
- focus mode
- active IDP set
- prompt source visibility

That makes it the most natural place to add:

- `Character: None`
- `Choose Character`
- `Change`
- `Remove`

This matches the existing design logic of the app better than:

- User Pools
- Territory editor
- Builder categories

### 2. A full top-level page is too heavy for the current app state

Right now `src/ui/App.tsx` already has a fairly full top-level navigation:

- Builder
- Prompts
- User Pools
- My Profile
- Pool Hub
- Admin
- plus `Legacy Sets`

Adding a new top-level `Characters` page immediately would:

- expand the product surface area
- increase nav density
- make Identity feel more committed than the product has yet earned

That may be right later.
It is probably too much for MVP.

### 3. A modal preserves conceptual separation without nav expansion

The biggest concept risk is making Character feel like:

- another kind of Pool
- another Territory control
- another Builder panel

A dedicated `Characters` modal avoids that.

It still says:

- this is its own reusable entity space

without forcing:

- another permanent top-level area on day one

### 4. User Pools is the wrong home

Placing Character management inside `User Pools` would be a conceptual mistake.

It would imply:

- characters are just another kind of pool

That directly conflicts with the repo’s identity boundary docs.

So:

- no character creation inside User Pools
- no character-as-pool framing

### 5. Territory should not become the home of identity

Territory is already one of the more cognitively expensive systems in the app.

If Character first appears in Territory setup, users are likely to read it as:

- part of Territory
- a workflow context sub-option
- another source-space control

That would weaken the intended meaning of Character as:

- reusable cross-workflow identity

## Decision Breakdown

### Decision 1: Best place to apply a character

Decision:

- `Prompt Preview / Workflow Context`

Reason:

- user is already thinking about active prompt influence there
- the current UI already shows workflow-level context
- IDP state already lives there
- Character can appear as one more visible workflow layer

Recommended MVP block:

- `Character`
- state A: `None` + `Choose Character`
- state B: active name + `Change` / `Remove`

### Decision 2: Best place to create/manage characters in MVP

Decision:

- dedicated `Characters` library modal

Reason:

- preserves conceptual separation
- smaller than adding a new app page
- easier to ship as a bounded first surface
- can be opened from the Character block in Prompt Preview

Recommended modal capabilities:

- list saved characters
- choose active character
- quick access to create new character
- open edit flow
- delete character

This modal should feel like:

- a reusable identity library

not:

- another workflow settings popup

### Decision 3: Should MorpBase add a `Characters` page now?

Decision:

- not for MVP

Reason:

- the feature is not yet proven enough to justify top-nav expansion
- the app already has multiple top-level surfaces
- a page would commit more product identity than the feature has earned yet

### Decision 4: Should Character first appear inside User Pools?

Decision:

- no

Reason:

- wrong mental model
- blurs Pool vs Character distinction
- weakens the whole point of Identity Systems

### Decision 5: Should Character first appear inside Territory setup?

Decision:

- no

Reason:

- too buried
- too easy to misread as Territory-owned state
- increases conceptual overlap with an already frictional system

## Recommended MVP UX Story

The best first user story is:

1. User is building in MorpBase.
2. In Prompt Preview, they notice a `Character` block.
3. They click `Choose Character`.
4. A `Characters` library modal opens.
5. They select an existing character or create one.
6. Prompt Preview updates to show the active character.
7. The prompt visibly reflects that character as a separate influence layer.

This story works because:

- application happens where workflow context already lives
- management happens in a dedicated identity space
- Character does not get confused with Pool or Territory

## Future Graduation Path

If Character proves valuable, MorpBase can later promote the modal/library into a full page.

That promotion should happen only if users show that they are:

- creating enough characters to need deeper browsing
- editing/revisiting them often
- treating Character as a major reusable asset class

### Good reasons to promote to a page later

- character library grows beyond modal comfort
- users want richer searching/filtering
- character editing becomes a major workflow in its own right
- Identity becomes a true long-term pillar of the product

### Not a good reason

- wanting the feature to feel "important" before it proves itself

## Suggested MVP Placement

### Primary application trigger

Inside `PromptPreview.tsx`, near the existing `Workflow Context` / `Active IDP Set` area.

### Modal launch points

Recommended:

- `Choose Character` button in Prompt Preview

Optional secondary launcher later:

- top-bar utility action

Not recommended for first launch:

- top-level nav tab
- User Pools screen
- Territory editor

## Concrete Recommendation

For the first implementation footprint:

- add a `Character` block to `Prompt Preview`
- launch a dedicated `Characters` library modal from that block
- keep the modal as the management home for MVP
- postpone any full `Characters` page until the feature is validated

## Final Conclusion

The cleanest current decision is:

- `Prompt Preview` for applying characters
- dedicated `Characters` modal for managing them
- no `Characters` page yet

This gives Character Identity a real home without prematurely expanding MorpBase’s top-level architecture.
