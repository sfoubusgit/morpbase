# MorpBase Button Design System

## Purpose

This document defines a compact button language for MorpBase so actions stop feeling visually inconsistent or section-specific.

The goal is not to create a giant design system, but to create enough consistency that the interface feels intentional.

## Current Problem

The current button set works functionally, but the design language is too mixed.

Different buttons currently feel like they come from slightly different UI traditions:

- pill-like utility controls
- block-like major actions
- legacy darker buttons
- destructive buttons with different emphasis levels

This creates friction even when the layout is working.

## Core Principle

Buttons should communicate two things clearly:

1. what kind of action this is
2. how important it is right now

That means MorpBase should use a small number of button roles consistently.

## Recommended Roles

### 1. Primary

Use for the main forward or payoff action in a local context.

Examples:

- `Copy Prompt`
- possibly `Save to Cloud` in some flows

Visual direction:

- strongest accent treatment
- clearly clickable
- visually dominant in a local button group

### 2. Secondary

Use for an important but not dominant action.

Examples:

- `Save Prompt`
- `Apply Edits`
- `Save Locally`

Visual direction:

- quieter filled or outlined treatment
- still clearly strong
- should not compete directly with Primary

### 3. Utility

Use for support or archive actions.

Examples:

- `Open Saved Prompts`
- `Undo`
- `Edit Output`
- `Manage Territories`
- `Learn more`

Visual direction:

- lower visual weight
- often outlined / subtle / dark-surface treatment
- should feel helpful, not commanding

### 4. Danger

Use for destructive or high-reset actions.

Examples:

- `Clear`
- `Delete`
- `Turn Off Territory`

Visual direction:

- restrained red-tinted styling
- clearly distinct from normal actions
- avoid overusing red across non-destructive actions

## Shape Recommendation

### General shape

The system should not mix too many silhouettes.

Recommendation:

- use softly rounded rectangles as the main default
- reserve full-pill buttons only for truly small tag-like controls

Why:

- better matches MorpBase’s serious-but-creative tone
- feels more deliberate than too many pills
- fits both compact and larger actions well

## Size Recommendation

Use two standard sizes:

### Normal

For most actionable buttons in Prompt Preview, drawers, modals, and management panels.

### Compact

For small utility controls and secondary action clusters.

Avoid a third or fourth size unless truly necessary.

## Visual Hierarchy Recommendation

### In the prompt console

Suggested hierarchy:

- `Copy Prompt` = Primary
- `Save Prompt` = Secondary
- `Open Saved Prompts` = Utility
- `Edit Output` = Utility
- `Undo` = Utility
- `Clear` = Danger

This gives a much cleaner hierarchy than treating all actions similarly.

## Surface Recommendation

Buttons should feel like they belong to the same world as the interface:

- dark, atmospheric surfaces
- restrained accent color
- clear borders
- subtle lift on hover

Avoid:

- too many unrelated fills
- overly glossy or toy-like buttons
- overly flat anonymous buttons

## Motion Recommendation

Keep motion restrained:

- slight translateY on hover for stronger buttons
- subtle shadow increase
- no exaggerated bounce or glow

## What Should Change In The Current UI

### Prompt Preview area

Needs the most immediate normalization.

Especially:

- `Save Prompt`
- `Open Saved Prompts`
- `Copy Prompt`
- `Edit Output`
- `Undo`
- `Clear`

These should feel like one coherent action family with clear role distinctions.

### Territory area

Buttons here should also align more closely with the same role system.

### Drawer / Prompt Library area

Archive and management buttons should read more clearly as utility and secondary actions.

## Final Recommendation

MorpBase does not need a huge button system.
It needs a disciplined small one.

The strongest immediate move is:

1. define these 4 button roles
2. normalize the Prompt Preview action cluster first
3. then apply the same visual language outward to adjacent areas
