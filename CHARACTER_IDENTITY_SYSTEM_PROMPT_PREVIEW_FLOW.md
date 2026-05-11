# Character Identity System Prompt Preview Flow

## Purpose

If Character Identity becomes a real MorpBase system, one of the most important UX questions is:

- how does the user apply a character into the current workflow?

The strongest candidate surface is:

- `Prompt Preview / Active Workflow`

This document defines the cleanest first flow for that interaction.

## Why Prompt Preview Is The Right Surface

Prompt Preview already shows:
- active workflow state
- current prompt influence
- IDP state
- other high-level prompt controls

That makes it a strong place to show:
- active character

Prompt Preview is not where characters should be created.
But it is a strong place where characters can be:
- selected
- changed
- removed

for the current workflow.

## Core UX Goal

The user should be able to:

1. see whether a character is active
2. apply a saved character to the current workflow
3. swap to a different character
4. remove the active character
5. understand that the character is one active prompt influence layer

This should feel:
- intentional
- visible
- reversible

## Best MVP UX Block

Prompt Preview / Active Workflow gets a new block:

- `Character`

Possible states:

### State A: No active character
Show:
- `Character: None`
- action: `Choose Character`

### State B: Active character
Show:
- character name
- maybe a small identity subtitle
- actions:
  - `Change`
  - `Remove`

This is the cleanest first shape.

## Flow: Applying A Character

### Step 1
User is already in a workflow.

Example:
- `Celestial Pixel Portrait`

### Step 2
In Prompt Preview, user sees:
- `Character: None`

### Step 3
User clicks:
- `Choose Character`

### Step 4
A character picker appears.

This could be:
- a modal
- a drawer
- or a compact selector panel

The user sees saved characters.

### Step 5
User selects one character.

### Step 6
Prompt Preview updates to show:
- the active character
- maybe a summary of its prompt-facing phrases

### Step 7
Prompt assembly updates visibly.

That is the core application flow.

## Flow: Changing Character

### Step 1
Prompt Preview already shows:
- `Character: [name]`

### Step 2
User clicks:
- `Change`

### Step 3
Picker reopens.

### Step 4
User selects another character.

### Step 5
Character layer swaps cleanly.

This should be:
- explicit
- reversible
- visible

## Flow: Removing Character

### Step 1
Prompt Preview shows an active character.

### Step 2
User clicks:
- `Remove`

### Step 3
Character layer is removed from the workflow.

### Step 4
Prompt Preview returns to:
- `Character: None`

This should not remove:
- pools
- territory
- IDP set
- global phrases

Only the character layer.

## What The User Should See

The user likely needs to see:

### In Active Workflow summary
- `Character: [name]`

### In a dedicated Character block
- name
- maybe one-line summary
- maybe the active character phrases

This mirrors the logic already used for:
- IDP sets
- workflow context

## Best Picker Behavior

The character picker should likely show:

- character name
- short summary
- maybe last used / recently used

It should not require the user to:
- fully edit the character from there

That picker is for:
- choosing

not:
- building the character

## Best Prompt Behavior After Application

After the user applies a character:
- the character prompt layer should appear visibly
- probably in the prompt influence stack

This is important for trust.

The user should not feel:
- "something hidden changed"

They should feel:
- "my active character is now shaping this workflow"

## Relationship To Pools

The UI should avoid suggesting:
- the character replaces the pool

The message should be:

- pool = workflow host
- character = subject identity

These should look like complementary active influences, not competing systems.

## Relationship To IDP Sets

Prompt Preview may eventually show:
- Pools
- IDP Set
- Character
- Territory

This is okay as long as the distinction is clear:

- character = who
- IDP set = workflow baseline

That wording matters.

## Best MVP Interaction Rules

### 1. One active character per workflow
Simple and clear.

### 2. Explicit choose / change / remove
No hidden auto-assignment.

### 3. Character selection should not create a whole new workflow
It should augment the current one.

### 4. Character must remain visible while active
If the user cannot see it, trust drops.

### 5. Character should be removable without collateral changes
This keeps the system understandable.

## Why This Flow Is Strong

This flow is strong because:
- creation and management stay elsewhere
- application happens exactly where it matters
- the active workflow remains legible
- the user can experiment without deep setup friction

It supports the character idea as:
- a reusable identity layer

not:
- a whole separate world the user has to live in

## Biggest UX Risk

If Prompt Preview becomes too crowded, the flow will feel heavy.

So the Character block should be:
- compact
- clear
- not over-detailed

This is especially important because Prompt Preview already carries:
- Active Workflow
- IDP sets
- output controls

So restraint is essential.

## Honest Conclusion

The strongest first application flow is:

- characters are created elsewhere
- Prompt Preview lets the user choose one saved character for the current workflow
- the active character is shown clearly
- the character layer can be changed or removed easily

That is probably the cleanest way to make the system feel real without letting it sprawl.
