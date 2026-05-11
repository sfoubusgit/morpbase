# Character Identity System Creation and Edit UX

## Purpose

If MorpBase introduces a Character Identity System, the creation/edit experience must do something very carefully:

- help users define a reusable character identity

without turning the feature into:
- another full Builder
- another niche workflow tool
- another giant form for prompt writing

This document defines the strongest first UX shape for creating and editing characters.

## Core UX Goal

The creation/edit surface should help the user answer:

- who is this character across workflows?

It should not feel like:

- what exact image do I want right now?

That distinction is essential.

## Design Principles

### 1. Identity-first, not style-first
The UX should guide the user toward:
- recurring subject identity

not:
- rendering style
- image-family style
- scene construction

### 2. Structured, but not over-structured
The user should get enough structure to create a reusable character identity,
but not so much that the system feels like a trait spreadsheet.

### 3. Reusable output should be visible
The user should be able to see:
- what character phrases or summary identity the system will actually apply later

This helps trust and editability.

### 4. It should feel lighter than Builder
Builder is already a strong structured workflow system.

Character creation should feel:
- calmer
- more compact
- more identity-centered

## Recommended Screen Structure

The cleanest first screen likely has:

### Section 1: Basic identity
- name
- short summary
- archetype
- role
- age impression
- presentation
- personality tone

### Section 2: Visual anchors
- recurring appearance markers

### Section 3: Motifs
- recurring symbolic markers

### Section 4: Prompt-ready phrases
- core identity phrases
- optional support phrases

### Section 5: Preview / summary
- a compact preview of the character’s prompt-facing identity bundle

This is a strong first structure.

## Best UX Flow

### Step 1: Start with the character’s name
This gives the entity immediate identity.

Even if the name is provisional, it helps the user treat the character as:
- a reusable thing

not:
- a loose prompt fragment set

### Step 2: Fill a small basic identity block
Prompts:
- archetype
- role
- age impression
- personality tone

These should be lightweight fields, not exhaustive.

### Step 3: Add visual anchors
Instead of giant predefined forms, let the user add a handful of recurring identity markers.

Examples:
- long black-to-pink gradient hair
- solemn glowing eyes
- crescent hair ornaments
- ritual priestess silhouette

This should feel like defining:
- the recognizability of the character

### Step 4: Add recurring motifs
This supports symbolic identity without turning style into the character.

Examples:
- butterfly emblem
- prayer charm accents
- crescent motif

### Step 5: Review prompt-facing phrase bundle
The system should show:
- what the active reusable character phrasing currently looks like

The user should be able to:
- edit this
- understand it
- trust it

### Step 6: Save
The character becomes reusable.

## Best Editing Model

Editing should feel like:
- revisiting an identity profile

not:
- re-entering a whole prompt workflow

So the user should be able to:
- edit fields directly
- add/remove visual anchors
- add/remove motifs
- adjust phrase bundle
- save changes cleanly

## What The UI Should Probably Avoid

### 1. Too many required fields
This would make the feature feel bureaucratic.

### 2. Overly rigid dropdown-heavy design
That would make characters feel generic and lifeless.

### 3. Style-heavy prompts
This would collapse the distinction from Pools.

### 4. Scene / composition sections
These should stay out.

### 5. Massive advanced options from day one
This is too heavy for the first version.

## Best UX Components

### Identity text inputs
For simple fields like:
- name
- summary
- archetype
- role

### Repeater-style anchor rows
For:
- visual anchors
- motifs

These should be easy to add/remove.

### Phrase bundle editor
A small editable list of:
- core phrases
- optional phrases

### Character preview block
A compact readout of:
- name
- summary
- prompt-facing output

This helps make the character feel real.

## Best User Feel

When the user finishes creating a character, they should feel:

- "I now have a reusable character identity in MorpBase."

not:

- "I just filled out another prompt template."

That feeling is a crucial success test.

## Best MVP Creation Experience

If we reduce it to a minimal but strong experience:

### Required
- name
- 2-5 visual anchors
- 1-3 motifs
- 2-4 core identity phrases

### Optional
- summary
- role
- personality tone
- optional support phrases

That is probably enough to make the system real without making it heavy.

## Relationship To Later Workflow Use

The creation/edit UX should explicitly reinforce:

- this character can later be applied inside different Pools and workflows

That messaging matters.

Otherwise users may still misunderstand the character as:
- a one-off prompt object

## Biggest UX Risk

The biggest risk is making the feature feel like:
- another builder

If that happens, the product distinction weakens quickly.

So the creation/edit surface should remain:
- identity-centered
- compact
- reusable

## Honest Conclusion

The best creation/edit UX is:
- a dedicated character profile editor
- with small structured identity fields
- easy recurring-anchor entry
- motif entry
- and a visible prompt-ready phrase bundle

That is likely the cleanest way to make the Character Identity System feel genuinely distinct from the existing Builder and Pool systems.
