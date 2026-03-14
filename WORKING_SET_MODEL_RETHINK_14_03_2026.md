# Working Set Model Rethink 14.03.2026

This document captures the full conceptual work around redesigning `Working Sets`.

It is meant to prevent future work from drifting back into the current category-heavy model.

## Current judgment

The current `Working Sets` implementation is **not** the right long-term expression of the feature.

Current problems:
- category-first creation
- too much setup friction
- feels administrative rather than creative
- overlaps weakly with `User Pools`
- duplication / maintenance are more visible than the actual payoff

This does **not** mean the feature idea is bad.
It means the current user-facing model expresses the weakest part of the concept instead of the strongest part.

## What the current model gets wrong

Current user experience feels too much like:
- duplicate `Base Set`
- edit categories
- fill buckets
- maintain a technical configuration object

But the more compelling future value is not:
- category administration

It is:
- creative framing
- reusable exploration space
- identity for iterative output

## Strongest problem diagnosis

The slowness of creating a Working Set is real, but it is not the root problem.

The deeper problem is:
- the concept currently feels unintuitive
- the setup feels like data management
- the user has to understand too much internal structure before receiving value

Performance was a symptom amplifier, not the main conceptual issue.

## Clear distinction from User Pools

This distinction is essential:

### User Pools
- reusable fragment libraries
- stored ingredients
- broad personal prompt assets

### Working Sets
- curated creative territories
- focused exploration frameworks
- eventually identity-bearing systems for resulting work

So:
- Pools store parts
- Working Sets shape a creative territory made from selected parts

## Important reframing

The strongest language discovered in the redesign process was:

`A Working Set should feel like collecting words and phrases to define a creative territory.`

Not:

`A Working Set should feel like filling out a category system.`

That distinction matters more than almost anything else in this redesign.

## Long-term vision

The best long-term vision found was:

`A Working Set is a curated creative framework that shapes prompt-building and gives identity to the resulting body of work.`

This is much stronger than:
- Builder filter
- category subset
- technical prompt kit

Why it matters:
- it gives Working Sets a reason to exist as distinct objects
- it opens social/gallery/challenge potential later
- it gives them creative meaning before and after prompt generation

## The two halves of Working Set value

### Before generation
Working Sets narrow and shape the creative input space.

They help the user say:
- this is the visual territory I want to explore
- these are the fragments that belong to this idea space

### After generation
Working Sets can give identity and continuity to outcomes.

They can become:
- gallery labels
- exploration frameworks
- challenge-like containers
- ways to say “these 20 outputs all came from this same creative territory”

This second half is what made the concept feel strategically important again.

## The gallery / game insight

A major insight from the discussion:

Working Set outcomes may have huge value if treated almost like galleries.

Example future behavior:
- a user makes many prompt iterations using one Working Set
- generates many results from that one territory
- can later show those outputs together
- can say “I explored this idea using only this Working Set”

This gives Working Sets:
- replayability
- social meaning
- identity
- a game-like exploration loop

This was one of the strongest reasons not to reduce Working Sets to a mere temporary filter.

## Decision reached about the current feature

We explicitly decided:

### Do not
- keep expanding the current category-heavy Working Sets model as if it is correct
- spend more effort polishing the wrong conceptual shape

### Do
- keep the feature strategically alive
- pause major conceptual investment in the current implementation
- revisit it later from a redesigned model

This was effectively the `Working Sets Decision Memo`.

## Best future model discovered

The most promising model was:

`Working Sets as creative territories built from phrases and fragments.`

That leads to a better definition:

`A Working Set is a named creative territory built from reusable prompt fragments.`

This was the strongest MVP direction.

## MVP hypothesis

The best MVP hypothesis identified was:

Users will understand and value Working Sets more if they are created by collecting words, phrases, and fragments into a named creative territory, rather than by manually curating categories.

That means:
- territory-first
- phrase-first
- category-secondary
- Builder-connected

## Future MVP shape

The Working Set MVP should let users:
- create a set
- name it
- optionally describe what it is for
- add fragments manually
- add fragments from User Pools
- edit/remove fragments
- activate it in Builder
- duplicate it to branch ideas

The main interaction should be:
- collect and refine fragments that define a territory

Not:
- fill category buckets

## What the MVP should not require

The future MVP should **not** require:
- duplicating `Base Set` as the main creation ritual
- full category coverage
- thinking in many Builder categories up front
- manual bucket management before first use

## Base Set conclusion

`Base Set` may still matter internally, but it should stop being the main conceptual anchor of Working Set creation.

Better mental model:
- Full Builder is the default mode
- Working Sets are creative territories layered on top

## Future user journey

The strongest future journey identified was:

1. A user has a visual idea they want to explore deeply
2. They create a Working Set as the framework for that territory
3. They activate it in Builder
4. They build multiple prompt variations inside it
5. They generate images outside MorpBase
6. They connect the results back to the Working Set
7. They refine, duplicate, or share the Working Set later

This made the feature feel like:
- a framework for a body of work

instead of:
- a configuration object

## Builder relationship

During the redesign process, there was an intermediate hypothesis that Working Sets might become Builder-native focus modes.

That was partly useful, but later reassessment concluded:
- Builder simplification is important
- but Working Sets likely deserve to remain distinct conceptually
- because of their future gallery / identity / exploration value

So the final direction was:
- tighter Builder alignment is good
- but Working Sets should not be reduced to a mere in-Builder filter concept

## Important emotional target

A Working Set should feel like:
- naming a world
- collecting its vocabulary
- exploring variations within that space

It should **not** feel like:
- maintaining a taxonomy
- configuring a side system
- completing coverage

## Immediate decision after the rethink

The immediate product decision was:

### Pause major implementation work on current Working Sets

Reason:
- the concept now needs redesign, not patchwork
- the product should learn more from `Builder` and `User Pools` first

This means:
- leave current Working Sets usable for now
- but do not keep building heavily on that model

## Recommended future sequence

1. Strengthen `Builder`
2. Strengthen `User Pools`
3. Learn from real prompt extraction and fragment reuse
4. Return to Working Sets with the territory-first model

That sequencing matters.

It was considered lower-risk than redesigning Working Sets immediately in a vacuum.

## Short final summary

If a future agent needs the shortest reliable summary:

- The current Working Sets implementation is not the long-term answer.
- Do not keep polishing the current category-heavy model.
- The strongest future concept is:
  - `Working Sets as named creative territories built from reusable fragments`
- Long-term, they may become:
  - creative frameworks
  - exploration spaces
  - anchors for galleries / iterative outputs
- Revisit later from this model, not from the current one.

