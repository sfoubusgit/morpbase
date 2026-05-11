# MorpBase V2 Project Bootstrap Decision

## Decision

`Start Now`

## Why

There is no major product-truth gap left that justifies more waiting.

At this point, delay would mostly create more theory, not a better foundation. The core V2 reading is already strong enough:

- `Workspace` is the center
- `Memory` is the second home
- the first real loop is:
  - `Workspace -> Keep -> Memory -> return`

That is enough to start the new codebase in a disciplined way.

## Chosen Bootstrap Shape

Start a fresh `React + TypeScript + Vite` project in a new folder inside this repository.

Reason:

- it is already proven in the current repo
- it is simple
- it is enough for Slice 1
- it does not force premature architecture decisions

## Include Now

- new V2 folder
- clean app shell with the frozen top-level naming:
  - `Workspace`
  - `Memory`
  - `Community`
  - `Continuity`
  - `Profile`
- only `Workspace` and `Memory` active in Slice 1
- `Prompt Preview` as part of the `Workspace` center
- a basic `Keep` handoff
- `Memory Home`
- one `Saved Work` focus / reopen path
- one believable return path into `Workspace`
- room for proof images, without making images the center

## Exclude Now

- Community behavior
- Continuity behavior
- publishing or import
- collaboration
- reward systems
- challenges
- storylines
- advanced reusable-assets systems
- heavy persistence complexity
- overbuilt architecture for future realms

## First Checkpoint Question

`Does the first working V2 loop already feel like real MorpBase, or still like a generic app scaffold?`
