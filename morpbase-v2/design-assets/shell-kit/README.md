# MorpBase V2 Shell SVG Starter Kit

This folder contains the first Illustrator-openable starter assets for the MorpBase V2 shell family.

These are not final assets.

They are:

- starter vectors
- sized to be easy to open and refine
- tied directly to the current coded shell language

## Files

- `top-frame-join-left.svg`
- `top-frame-join-right.svg`
- `brand-support-fragment.svg`
- `engine-join-left.svg`
- `engine-join-right.svg`
- `shell-knot.svg`
- `primary-realm-separator.svg`

## Meaning

### Top-frame joins

- purpose: make the outer frame feel held and singular
- current code hooks:
  - `.shell-join-fragment-left`
  - `.shell-join-fragment-right`

### Brand support fragment

- purpose: help the brand anchor feel embedded in the frame
- current code hook:
  - `.brand-asset-fragment`

### Engine joins

- purpose: make the shell-to-engine handoff feel authored
- current code hooks:
  - `.engine-join-fragment-left`
  - `.engine-join-fragment-right`

### Shell knot

- purpose: hold the join point between shell and engine
- current code hook:
  - `.shell-engine-knot`

### Primary realm separator

- purpose: give the main realm cluster quiet structural weight
- current code hook:
  - `.realm-group.primary::after`

## Use Rule

These assets should be refined in Illustrator with the same restraint already proven in code:

- structural first
- calm
- not decorative
- not heavier than the product

## Suggested Order

1. refine top-frame joins
2. refine engine joins and knot
3. refine brand support fragment
4. refine primary realm separator
