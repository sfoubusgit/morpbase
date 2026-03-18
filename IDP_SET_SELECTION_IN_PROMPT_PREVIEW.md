# IDP Set Selection In Prompt Preview

## Purpose

This document defines the behavior model for letting the user choose among available IDP sets from Prompt Preview.

The goal is to expose IDP-set selection in the most usable place without breaking the underlying architectural roles.

## Core Principle

Prompt Preview may allow the user to **select** the active IDP set.

Prompt Preview does **not**:

- create IDP sets
- edit IDP sets
- own IDP sets
- redefine the workflow family

It only exposes a selection control for the active workflow baseline.

## Ownership Model

The architecture should remain:

- `Pools` define the available IDP sets
- `Territories` may later remember or choose the active set
- `Prompt Preview` exposes the currently active set and allows switching between the available ones
- `Builder` applies the selected set to the current workflow session

This is important because it keeps Prompt Preview as a control surface, not as the source of truth.

## Why Prompt Preview Is A Good Surface

Prompt Preview is where the user is already judging:

- whether the current image family feels right
- whether the baseline identity should shift
- whether the current run is leaning too shrine-like, too idol-like, too occult, etc.

That makes it a strong place for:

- active IDP-set selection
- quick comparison between baseline identities
- iterative workflow steering

It is a better surface for this than a hidden setup-only control.

## Recommended MVP Behavior

### 1. The selector appears only when the active workflow has IDP sets

If the active Pool / workflow family has no IDP sets, Prompt Preview should show nothing.

If IDP sets are available, Prompt Preview should show a block such as:

- `Active IDP Set`
- current set name
- a selector listing the available set names

Example:

- `Celestial Shrine`
- `Magical Idol`
- `Occult Pastel`

### 2. Selection means choosing among existing sets only

The user can:

- choose Set 1
- choose Set 2
- choose Set 3

The user cannot from Prompt Preview:

- rename a set
- edit set phrases
- create a new set
- delete a set

That keeps the meaning clean.

### 3. Switching sets changes the active baseline phrases

When the user selects a different IDP set:

- the current active IDP-set-derived baseline should update
- the selected set becomes the session’s active identity baseline
- Prompt additions tied to the active IDP set should change visibly

Important UX rule:

- this must never feel like hidden text mutation

The user should be able to see which active baseline phrases are in effect.

### 4. The sets should be previewable before selection

The user should be able to inspect the phrases of each available set.

This can happen through:

- a small expandable phrase preview under the selector
- or a compact summary panel showing the selected set’s phrases

This helps the user understand what they are choosing.

### 5. Set switching should be reversible and low-risk

The user should feel:

- safe trying Set A
- safe switching to Set B
- safe switching back

So the UI should communicate:

- this is the active baseline identity for the current workflow
- it can be changed

## Session Behavior

### Recommended first behavior

The active IDP set should be session-level state.

Meaning:

- the user selects a set during the current workflow session
- Builder uses it for the current prompt-building state
- Prompt Preview reflects the active set

This is enough for the first implementation.

### Later possible behavior

A Territory may later remember the selected active set.

But that should be a later extension, not required for the first usable version.

## How It Should Affect Prompt Additions

The cleanest behavior is:

- the active IDP set corresponds to a visible group of prompt additions
- switching sets swaps that visible group to the newly selected set

This is better than silently merging sets into unrelated additions.

In practice, the app should preserve a distinction between:

- normal prompt additions
- Pool default initiative phrases
- active IDP-set-derived phrases

That makes the system understandable.

## Prompt Editing Interaction Rule

This is the biggest risk area.

If the user manually edits the final prompt heavily, switching IDP sets can become confusing unless the app has a clear model.

Recommended rule for v1:

- IDP-set switching updates the structured active baseline additions
- it does not try to parse and rewrite arbitrary freeform user edits

That keeps the behavior honest.

In other words:

- switch the active structured baseline
- do not pretend to fully refactor custom freeform output text

## Good UX Copy

The UI should say something like:

- `Active IDP Set`
- `Choose the current identity baseline for this workflow family.`

This is better than wording like:

- `Style preset`
- `Prompt mode`
- `Theme switch`

because those labels would blur the meaning.

## What This Feature Is Not

This is not:

- a Mode selector
- a Territory editor
- a style-preset system for the whole app
- direct editing of Pool data

It is:

- selection among already-defined identity baselines
- inside the current workflow context

## Best MVP Shape

The strongest MVP shape is:

1. only show the selector when the active workflow exposes IDP sets
2. show the current active set name
3. allow choosing from available set names
4. show the selected set’s phrases
5. update the active IDP-set-derived prompt additions visibly
6. keep set definitions read-only from this surface

## Recommended Product Boundary

The cleanest product boundary is:

- `User Pools` / `Pool Hub` = where you inspect what sets exist
- `Prompt Preview` = where you choose which one is active right now

That is a very healthy division.

## Final Conclusion

Prompt Preview is a strong first-class surface for **selecting among available IDP sets**, as long as the app preserves these rules:

- Pools still own the set definitions
- Prompt Preview only chooses the active set
- switching sets updates visible structured baseline additions
- the behavior stays reversible and transparent

That makes the feature both usable and architecturally honest.
