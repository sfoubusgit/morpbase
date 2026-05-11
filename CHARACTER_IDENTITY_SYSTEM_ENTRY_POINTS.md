# Character Identity System Entry Points

## Purpose

If MorpBase introduces a Character Identity System, one of the most important product questions is:

- where does the user first encounter it?
- where do they create a character?
- where do they apply a character into a workflow?

This matters because the idea can feel:
- elegant and natural
or
- like another bolted-on system

depending on where it enters the experience.

## Core Principle

Character identity should feel like:
- a reusable subject layer

not:
- another random tool panel
- another mode
- another niche pool editor

So the entry point has to support that mental model.

## The User Needs Two Different Moments

There are really two separate product moments:

### 1. Character creation / management
The user needs a place where they can:
- create
- edit
- store
- revisit
characters

### 2. Character application
The user needs a place where they can:
- apply one saved character into the current workflow

These moments should probably not be collapsed into one screen.

## Candidate Entry Point A: A Dedicated Character Library Page

The user sees a top-level area such as:
- `Characters`

There they can:
- create characters
- browse saved characters
- edit existing ones

### Pros
- clear
- durable
- gives the system real identity
- easy to understand as a reusable entity library

### Cons
- adds another top-level area to an already layered product
- could feel heavy if the feature is still early

### Honest take
Strong long-term home.
Possibly too much as the very first user-facing footprint unless the system is already clearly real.

## Candidate Entry Point B: Character creation inside User Pools

The user encounters character creation inside `User Pools`.

### Pros
- uses an existing source-management area
- avoids adding another top-level section immediately

### Cons
- conceptually wrong
- implies characters are just another kind of pool
- weakens the distinction we worked hard to define

### Honest take
Bad fit.
Should be avoided unless there is no other short-term path.

## Candidate Entry Point C: Character selection in Builder / Prompt Preview

The user sees something like:
- `Active Character`

inside Prompt Preview or another workflow-facing surface.

### Pros
- highly relevant during actual use
- immediate and practical
- good place to apply an existing character

### Cons
- poor place to define the concept from scratch
- if used as the first encounter, may feel too sudden or unclear

### Honest take
Very strong as an application surface.
Weak as the first place where the idea is introduced.

## Candidate Entry Point D: Character selection in Territory / workflow setup

The user chooses a character as part of setting up a workflow context.

### Pros
- orderly
- fits the idea of configuring a creative session

### Cons
- probably too buried
- character identity is broader than territory
- risks making character feel like a territory subfeature

### Honest take
Not ideal as the first or main entry point.

## Candidate Entry Point E: Character quick-create from Builder

The user is working and gets an action like:
- `Create Character From This`

### Pros
- potentially powerful later
- could support iterative capture of recurring characters

### Cons
- too advanced for MVP
- depends on the user already understanding the system

### Honest take
Interesting future feature, not a good first entry point.

## Strongest Split Model

The healthiest model is probably:

### Creation / management home
- dedicated character library area

### Application home
- Prompt Preview / active workflow surface

This split is strong because:
- it respects the entity nature of characters
- it also supports practical workflow use

## Best First Encounter For The User

If the feature is new, the first clean introduction should probably be:

- a `Characters` page or library

because that says:
- this is a reusable thing in MorpBase
- not a hidden helper inside another system

The first use inside workflow should then happen through:

- a clear application control in Builder / Prompt Preview

That gives both:
- conceptual clarity
- practical usefulness

## Best Place To Apply The Character

The strongest application surface is likely:

### Prompt Preview / Active Workflow area

Why:
- user is already thinking about the current prompt state
- user is already judging active influences
- a character can be shown as one active workflow layer

This fits especially well if Prompt Preview already shows:
- Mode
- Pools
- IDP Set
- Territory

Then adding:
- `Character`

would feel coherent.

## Why Prompt Preview Is Strong For Application

Prompt Preview is already becoming:
- a workflow-control summary area
- a place where the user understands active prompt influence

A character belongs there more naturally than in:
- User Pools
- Territory editor
- category sidebar

because the character is:
- not a source-space map
- not a mode
- not a category

It is an active identity layer.

## Recommended MVP Entry Model

### Creation / management
Use:
- a dedicated `Characters` area

### Workflow application
Use:
- Prompt Preview / Active Workflow surface

### Not recommended for MVP
- putting characters inside pools
- making Territories own characters
- hiding the system inside Builder categories

## If A Dedicated Page Feels Too Heavy

If MorpBase is not ready yet for a full `Characters` top-level area, then a softer interim path could be:

- a compact `Characters` library modal
- accessible from Prompt Preview or the top nav

This would preserve conceptual separation better than placing it inside `User Pools`.

That could be a very good MVP compromise.

## Best UX Story

The user story should be:

1. I create/save a character in a dedicated character space.
2. Later, while building a prompt, I choose that character from the workflow control surface.
3. The current pool and territory specialize that character into the active image family.

That is a clean and believable product story.

## Honest Conclusion

The best first encounter is probably:
- a dedicated character library area

The best place to apply a character is probably:
- Prompt Preview / Active Workflow

That split gives the feature:
- conceptual clarity
- practical workflow relevance

and avoids the biggest risk:
- making character identity feel like just another subtype of pool or territory.
