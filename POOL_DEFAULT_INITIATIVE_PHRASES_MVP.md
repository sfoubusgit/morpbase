# Pool Default Initiative Phrases MVP

## Purpose

This document defines the first honest MVP for:

`Pool Default Initiative Phrases`

The goal is to make Pools capable of carrying a small default starter baseline without overcomplicating MorpBase.

This MVP is intentionally narrow.

It exists to validate the concept safely before broader expansion is considered.

## Core MVP Definition

A Pool may define a small optional set of default initiative phrases.

These phrases can be explicitly applied into Builder as prompt additions.

Once applied, they are:

- visible
- editable
- removable

This makes them useful without making them controlling.

## Why This MVP Exists

Some Pools represent more than a loose library of fragments.

They also have a natural starting posture.

Examples:

- `32x32 Pixel Art Portrait`
- a cinematic mech showcase Pool
- a fantasy relic study Pool

For these kinds of Pools, a user may benefit from starting with:

- a small built-in baseline

rather than rebuilding the Pool's intended posture every time from scratch.

## What The MVP Includes

### 1. Pool-level initiative phrase storage

Each Pool may have:

- zero or more initiative phrases

This is an optional Pool capability.

### 2. Initiative phrase editing inside User Pools

The User Pools interface should provide a clearly labeled area for:

- viewing initiative phrases
- adding initiative phrases
- editing initiative phrases
- deleting initiative phrases

This should be distinct from normal Pool items.

### 3. Explicit apply action

The user can intentionally apply initiative phrases from a Pool into Builder.

This should be an explicit user action.

Example label:

- `Apply Defaults`

### 4. Builder integration through prompt additions

When applied, initiative phrases should enter Builder through the existing prompt-addition layer.

They should behave like visible prompt material, not hidden system state.

### 5. Full removability

After application, the user must be able to:

- delete initiative phrases
- edit initiative phrases
- ignore them completely

This is a core trust requirement.

## What The MVP Does Not Include

### 1. No automatic silent injection

Initiative phrases should not be automatically inserted just because a Pool is opened or selected.

### 2. No Territory composition logic

Territories should not automatically merge initiative phrases from source Pools in the MVP.

### 3. No Mode interaction

Builder Workflow Modes should remain completely separate from this feature.

### 4. No prompt-engine special behavior

The prompt engine should simply receive initiative phrases as normal prompt additions.

### 5. No hidden conditional logic

The MVP should not include:

- mode-aware defaults
- context-aware defaults
- auto-selection logic
- weighting rules
- smart merging

That would be too much too early.

## Correct Product Home

This MVP belongs primarily to:

- `Pools`

It may later interact with:

- `Builder`
- `Territories`

But it does not begin as:

- a Territory feature
- a Mode feature
- a prompt-engine feature

## UX Principles

If implemented, the MVP must follow these rules.

### 1. Visible

The user must always be able to see what initiative phrases were applied.

### 2. Editable

The user must be able to modify them freely after application.

### 3. Removable

The user must be able to delete them easily.

### 4. Non-deceptive

The system must never feel like it is secretly injecting prompt content.

### 5. Optional

A Pool should not be required to define initiative phrases.

## Recommended Data Shape

For MVP, initiative phrases should be stored as structured entries rather than raw strings.

Minimal suggested shape:

- `id`
- `text`

This keeps the feature consistent with the existing system while staying lightweight.

No extra structure is needed yet.

## Recommended Builder Behavior

The safest MVP behavior is:

1. user opens a Pool
2. user clicks `Apply Defaults`
3. initiative phrases are added into Builder as visible prompt additions
4. user edits/removes them if desired

This keeps the feature understandable and reversible.

## Recommended First Use Cases

The MVP should first be tested on Pools where a default baseline obviously helps.

Good candidates:

- `32x32 Pixel Art Portrait`
- cinematic portrait Pools
- object showcase Pools
- highly stylized workflow Pools

## Success Criteria

The MVP succeeds if:

1. users understand what Pool defaults are
2. applying them feels clearly useful
3. the feature speeds up workflow start
4. the user never feels trapped by the defaults
5. the feature strengthens Pools without blurring system boundaries

## Failure Criteria

The MVP is failing if:

1. users do not understand where the text came from
2. the feature feels like hidden prompt injection
3. initiative phrases are hard to remove
4. the feature starts behaving like Territory logic
5. the feature starts behaving like a Mode system

## Final Principle

Pool Default Initiative Phrases MVP should be a small, explicit, Pool-owned starter baseline system that helps users begin faster while keeping all prompt content visible, editable, and removable.
