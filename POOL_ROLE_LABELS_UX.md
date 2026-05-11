# Pool Role Labels UX

## Purpose

This document defines how Pool role labels should appear in the UI.

The immediate need is to distinguish:

- `Primary Pool`
- `Secondary Pool`

This matters because these roles are now becoming structurally meaningful in MorpBase.

Without clear labeling, a user may misunderstand a secondary pool as an incomplete or weak pool when it is actually meant to play a different role.

## Core Principle

Pool role labels should improve clarity without overpowering the rest of the pool presentation.

They should feel:

- informative
- lightweight
- discoverable
- consistent

They should not feel:

- like warnings
- like rigid bureaucracy
- louder than the pool title itself

## Where The Label Should Appear

### 1. Pool Hub card / overview

A pool role label should appear in the overview/card view as a small badge.

This gives the user an immediate sense of what kind of pool they are browsing.

Recommended treatment:

- a compact badge near title/meta
- visually distinct but subtle
- readable at a glance

Examples:

- `Primary Pool`
- `Secondary Pool`

### 2. Pool Hub detail view

A pool role label should also appear in the detail view in a more explicit way.

This is where the user evaluates the pool more deeply, so the role should be unmistakable there.

Recommended treatment:

- one role badge near the main title area
- optional short explanatory line or helper copy

Example helper copy:

- `Primary Pool`: Designed to act as a main workflow identity host.
- `Secondary Pool`: Designed to extend a stronger host workflow with modular variation.

This extra explanation should be brief.

### 3. User Pools view

This can come later.

For now, the strongest need is in Pool Hub, where users are deciding what a pool is and how to use it.

## Visual Intensity

### Card view

Use a light badge.

It should:

- not dominate the card
- not compete with the hero image
- not overshadow tags

### Detail view

Use a slightly stronger badge and optional helper text.

It should be:

- clearly visible
- but still secondary to title and summary

## Copy Recommendation

Use explicit labels:

- `Primary Pool`
- `Secondary Pool`

Avoid weaker or more ambiguous labels like:

- `Main`
- `Support`
- `Host`
- `Extension`

Those are either too vague or too context-dependent.

`Primary Pool` and `Secondary Pool` are clearer.

## Behavior Rule

The label is descriptive, not interactive.

It should not behave like:

- a button
- a filter by itself
- a warning state

It is there to communicate pool role.

## Future-Proofing

The implementation should assume pool role may later expand.

So even though the immediate visible labels are:

- `Primary Pool`
- `Secondary Pool`

it is better if the data model can later support more roles if needed.

For now, though, keep the visible system simple.

## Best Immediate Implementation

### Pool Hub card

Add a small role badge near:

- title
- creator/meta band
- or the top summary strip

### Pool Hub detail

Add:

- role badge near title area
- short helper sentence below the summary or near the detail rail

That should be enough.

## Final Summary

Pool role labels should be introduced in Pool Hub as lightweight but clear badges.

The best immediate pattern is:

- card view: small role badge
- detail view: stronger role badge plus one short helper line

This will make the difference between primary and secondary pools much easier to understand without overcomplicating the UI.
