# Floating Global Phrase Layer Concept

## Purpose

This document defines the idea of turning the Global Phrase Layer into a movable floating UI element.

The goal is to make MorpBase feel more playful and personal while also better matching what the Global Phrase Layer actually is in the workflow.

## Core Idea

The Global Phrase Layer becomes a small floating button or token that:

- can be moved by the user across the screen
- can be clicked to open its phrase panel near its current position
- keeps its content stable unless the user changes it
- behaves like a personal constant layer rather than a fixed structural panel

## Why This Makes Sense

The Global Phrase Layer is not the same kind of system as:

- Builder categories
- Territories
- Modes
- Pool identity

It is more like:

- a personal persistent modifier layer
- a user-defined constant
- an auxiliary influence that sits outside the main workflow spine

That makes a floating interaction model conceptually appropriate.

## Product Interpretation

The floating control should communicate:

- this is always available
- this belongs to you
- this is not the center of the workflow
- this can follow your preferred workspace rhythm

That is more honest than making the Global Phrase Layer look like a permanently large structural panel.


## Recommended MVP Shape

### 1. Floating trigger

The user sees a small floating `Global Phrase Layer` control.

It should:

- be draggable within safe bounds
- remember its position
- show whether the layer currently contains active phrases

### 2. Expandable local panel

When clicked, the floating trigger opens the Global Phrase Layer panel near the trigger itself.

That panel contains:

- current global phrases
- add/remove controls
- maybe a compact explanation

### 3. Persistent content

The position and the content should be treated separately.

- the user may move the control anywhere
- the content remains stable until changed

This makes the layer feel like a real personal constant.

### 4. Compact collapsed state

When closed, the floating control should stay visually small.

It should not occupy the same weight as a full Builder panel.

## UX Benefits

If implemented well, this could:

- reduce visual clutter in the main interface
- make the app feel more playful and personal
- give the Global Phrase Layer a more truthful role
- make the layer easier to keep available without dominating space
- support future growth of global phrases without permanently enlarging the main layout

## Risks

### 1. Gimmick risk

If over-animated or too cute, it could feel gimmicky.

The design should stay restrained.

### 2. Screen clutter risk

If the floating control can cover important workflow areas, it may become annoying.

It needs safe bounds and sensible default placement.

### 3. Mobile risk

Drag-based UI can be awkward on small screens.

The mobile behavior may need to be simplified or anchored differently.

### 4. Panel placement risk

If the panel opens in a bad direction or covers important UI, it will feel messy.

The open behavior should be smart but not overly complex.

## Design Rules

The floating Global Phrase Layer should be:

- small when closed
- obvious enough to rediscover
- draggable, but not chaotic
- persistent in position
- visually aligned with the rest of MorpBase
- more like a workspace tool than a toy

## What It Is Not

This should not become:

- a gamified sticker
- a mascot-like widget
- a replacement for Builder logic
- a more important control than the actual workflow systems

It is a convenience and identity feature for a specific kind of persistent prompt influence.

## Why This Helps MorpBase Specifically

MorpBase has some risk of feeling too structurally serious.
A feature like this can make the app feel:

- more human
- more creative
- more personal

without changing the actual system logic.

That can be valuable if handled carefully.

## Final Summary

The Floating Global Phrase Layer is a strong concept because it aligns the UI behavior of the Global Phrase Layer with its real product role:

- persistent
- personal
- auxiliary
- always available
- not central

If implemented well, it could make MorpBase both more usable and more playful at the same time.
