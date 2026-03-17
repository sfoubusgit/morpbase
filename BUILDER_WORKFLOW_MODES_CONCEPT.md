# Builder Workflow Modes Concept

## Status

Revised concept draft after a system-wide integrity check against the current MorpBase architecture.

This document replaces the broader earlier framing of Modes as a potentially universal MorpBase layer.

The current best version is narrower, more disciplined, and more truthful to the actual product state.

## Concept Name

Builder Workflow Modes

This is intentionally tighter than the earlier label `Guided Workflow Modes`.

Why:

- it makes the current scope explicit
- it avoids implying system-wide universality too early
- it reflects where the concept is actually strongest today

## Core Definition

Builder Workflow Modes are a MorpBase Builder feature that lets the user choose a workflow orientation for how they want to build an image.

A Mode does not define:

- what the image is
- what Pools are
- what Territories are
- what saved prompts permanently become

A Mode does define:

- what Builder emphasizes first
- how categories are prioritized
- what the user is guided toward next
- what kind of prompt-building path feels primary

So the working definition is:

- a reversible Builder-level orientation layer that changes workflow emphasis without changing the underlying MorpBase system

## Why Modes Exist

Many users do not begin by thinking in categories.

They begin by thinking in intent, for example:

- I want to build around the character
- I want the environment to carry the image
- I want this to feel like a full cinematic scene
- I want the central thing to be the visual anchor

That means MorpBase can become more intuitive if Builder responds to build orientation instead of only presenting one fixed generalized path.

## What A Mode Is Not

A Mode is not:

- a genre
- a theme
- a style label
- a prompt type taxonomy
- a hard compatibility system
- a restriction layer
- a universal semantic truth for all of MorpBase

Modes should therefore not initially be things like:

- fantasy mode
- anime mode
- horror mode
- portrait painting mode
- cinematic mode

Those are better handled elsewhere through:

- Pools
- Territories
- Prompt Fragments
- recommendations
- filters

## Revised Scope

Modes are not currently a universal MorpBase system.

They are:

- Builder-first
- workflow-first
- guidance-first
- reversible
- intentionally limited in scope

This means the concept should not currently claim that Modes are:

- a cross-product taxonomy
- a permanent identity layer for prompts
- a defining property of Pools
- a defining property of Territories

## Final Launch Mode Set

### Launch Set

- `Balanced`
- `Character-First`
- `Environment-First`
- `Scene-First`

### Deferred

- `Object-First`

`Object-First` remains conceptually valid, but it is not part of the first honest implementation because the current Builder architecture is less naturally object-specialized.

## Mode Definitions

### Balanced

- neutral Builder mode
- no strong orientation bias
- preserves the shared generalized Builder logic
- useful for hybrid prompts or users who do not want orientation guidance

### Character-First

- the figure is the anchor
- prioritizes subject definition, anatomy/form, pose/action, then supporting style and scene

### Environment-First

- the world is the anchor
- prioritizes place, atmosphere, lighting, framing, then supporting anchors

### Scene-First

- the event or total moment is the anchor
- prioritizes subject plus environment plus action interplay, then staging and intensity

## What Makes A Valid Mode

A candidate should count as a real Mode only if it has:

1. a distinct primary anchor
2. a meaningfully different early workflow
3. a distinct idea of success
4. a distinct failure mode
5. a clear one-sentence explanation
6. enough breadth to cover many images
7. irreducibility to genre, style, or theme

This keeps the system from becoming diluted.

## Product Position

Modes should begin as a Builder-level orchestration layer.

This is their strongest and most justified home.

### Primary Home

- Builder

### Secondary Later Home

- session memory inside Builder

### Possible Later Home

- soft saved-prompt context

Modes should not initially live in:

- Pool identity
- Territory identity
- Hub taxonomy
- creator profile identity
- public prompt classification

## Relationship To Existing MorpBase Systems

### Builder

This is where Modes actually operate.

Modes are strongest when they shape:

- category order
- navigation order
- helper copy
- suggested next step

### Pools

Pools remain:

- source vocabularies
- themed libraries
- lightly sectioned inputs

Modes should not define what a Pool is.

### Territories

Territories remain:

- composed creative spaces
- built from `Pool + Section` inputs
- activated inside Builder

The healthiest split is:

- Territories shape what source material is foregrounded
- Modes shape how the user is guided through Builder

They are compatible, but distinct.

### Prompt Output

Prompt output remains output-focused, not mode-defined.

Modes should not initially govern the prompt engine or output structure.

## Important Semantic Boundary

Builder categories and Pool/Territory sections are not yet one perfectly unified semantic system.

Builder categories currently include:

- `subject`
- `style`
- `lighting`
- `camera`
- `environment`
- `quality`
- `effects`
- `post-processing`
- `actions`
- `anatomy-details`

Pools and Territories currently use a different shared section vocabulary:

- `Subjects`
- `Objects`
- `Environment`
- `Props`
- `Lighting`
- `Mood`
- `Materials`
- `Style`
- `Composition`
- `Effects`

Therefore, Modes should not be presented as a universal semantic bridge across all MorpBase layers.

Instead:

- Modes interpret the Builder category system
- Territories map section-based source material into Builder
- the existing translation layer remains separate

## Concrete Builder Interpretation

Modes should appear inside Builder as:

- a visible selector
- a one-line explanation
- a different category priority order
- a lightweight Suggested next signal

They should be:

- easy to switch
- non-destructive
- always reversible

The user should feel:

- this helps me build

not:

- this locks me into a path

## Sidebar And Builder Logic

### Balanced

Top helper copy:

- Build freely across the core image layers. Start wherever your idea feels strongest.

Groups:

- Define: `subject`, `environment`, `style`
- Refine: `lighting`, `camera`, `actions`, `anatomy-details`
- Finish: `effects`, `quality`, `post-processing`

### Character-First

Top helper copy:

- Define the figure first, then build the surrounding scene around them.

Groups:

- Define: `subject`, `anatomy-details`, `actions`
- Refine: `style`, `lighting`, `camera`
- Finish: `environment`, `effects`, `quality`, `post-processing`

### Environment-First

Top helper copy:

- Build the place first. Define atmosphere, space, and mood before adding anchors.

Groups:

- Define: `environment`, `lighting`, `camera`
- Refine: `style`, `effects`, `subject`
- Finish: `quality`, `actions`, `post-processing`, `anatomy-details`

### Scene-First

Top helper copy:

- Build the full moment by balancing subject, setting, and action early.

Groups:

- Define: `subject`, `environment`, `actions`
- Refine: `lighting`, `camera`, `style`
- Finish: `effects`, `quality`, `post-processing`, `anatomy-details`

## Suggested Next Logic

Shared principle:

- Suggested next should pick the highest-priority category with low or no current engagement based on the active Mode.

### Balanced

- start with `subject`
- then `environment`
- then `style`
- then `lighting`, `camera`, `actions`, `effects`

### Character-First

- start with `subject`
- then `anatomy-details`
- then `actions`
- then `style`, `lighting`, `camera`
- environment comes later as support

### Environment-First

- start with `environment`
- then `lighting`
- then `camera`
- then `style`, `effects`
- subject comes later as anchor or support

### Scene-First

- start with `subject`
- then `environment`
- then `actions`
- then `lighting`, `camera`, `style`
- then `effects`

## Non-Negotiable Integrity Rule

A Mode must not only change the sidebar visually.

It must change the actual Builder workflow path.

That means:

- `Next`
- suggested navigation
- category emphasis

must all align.

Otherwise the concept is false.

So the strict rule is:

- a Mode is only real if Builder navigation behavior reflects it, not just Builder presentation

## MVP Scope

The strongest MVP is:

- Builder-only
- `Balanced`, `Character-First`, `Environment-First`, `Scene-First`
- visible mode selector
- one-line mode guidance
- mode-aware category priority
- mode-aware navigation order
- Suggested next
- live switching without reset

The MVP should not include:

- prompt engine changes
- Pool compatibility rules
- Territory mode ownership
- saved prompt schema changes
- Hub or discovery integration
- too many modes

## Biggest Risks

Main risks:

- Modes feel cosmetic
- Modes feel too controlling
- users feel anxious choosing one
- `Scene-First` becomes the everything mode
- `Balanced` becomes the only mode users trust
- the Builder becomes visually heavier
- the distinction between modes is too weak to matter
- users misread Modes as genre or content taxonomy
- the UI suggests mode difference while navigation still behaves the old way

The most important clarified risk is:

- false coherence

Meaning:

- the interface says Modes matter
- but the real system beneath it still behaves the same

## Most Important Design Rule

Modes should guide emphasis, not define truth.

That means:

- they shape the Builder path
- they do not classify the image permanently
- they do not invalidate combinations
- they do not replace the shared MorpBase system

## Final Product Recommendation

MorpBase should pursue Modes only in this tighter form:

- Builder Workflow Modes
- limited to Builder
- limited to real workflow changes
- limited to the modes the current Builder can support honestly
- explicitly non-universal across the whole product for now

This means:

- adapt Modes to MorpBase conceptually first
- adjust MorpBase only where current rigidity already weakens integrity
- keep Pools and Territories structurally independent
- avoid letting Modes become a master system ideology

## One-Sentence Summary

Builder Workflow Modes should be introduced as a reversible Builder-only workflow orientation system that changes real navigation and category emphasis, while leaving the broader MorpBase architecture independent.
