# Backup Log 19 03 2026

## Purpose

This backup log captures the current live-product state after a long small-fixes pass.
It is meant to let a new agent resume work without having to reconstruct the recent Builder, Prompt Preview, Prompt Library, and Territory changes from chat history.

## High-Level State

MorpBase is currently in a live-workflow refinement phase.

The broad direction right now is:

- do not rush another major system into implementation
- keep Character / Identity ideas documented for later
- improve the current live workflow with smaller, high-value fixes
- pay special attention to right-side structure and Territory friction

The most important current pressure point is:

- the right side still does not fully feel like a persistent working console

Even after several improvements, the user still reports that:

- the prompt is not always visible when they are in other right-side sections
- save is not always reachable without scrolling

That means the right-side structural issue is still active.

## Most Important Recently Pushed Changes

### 1. Builder session and save-form persistence fixed

Pushed commits:

- `c5ae913` `Persist builder session and save form drafts`
- `f8b0229` `Fix save prompt draft restoration`

What is now true:

- current builder prompt/session survives reload
- selected prompt fragments survive reload
- pool prompt additions survive reload
- edited output survives reload
- export mode survives reload
- save-form fields survive reload when `Keep fields after saving` is enabled

Relevant files:

- `src/ui/App.tsx`
- `src/ui/components/PromptLibrary.tsx`

Important detail:

The original draft-persistence bug was that the save-form draft was being loaded and then immediately overwritten with empty values on mount.
The final fix switched the save form to initialize directly from stored draft values instead.

### 2. Builder navigation buttons removed

Pushed commit:

- `fbbaf6e` `Remove builder navigation buttons`

What changed:

- removed Builder `Back / Skip / Next`
- removed old completion dependency on explicit `Next`
- cleaned tutorial copy that referenced those buttons

Relevant files:

- `src/ui/App.tsx`
- `src/ui/components/QuestionCard.tsx`

Reason:

The buttons were creating layout pressure and no longer felt important enough to justify their visual and structural cost.

### 3. Local prompts section compacted

Pushed commit:

- `c3e1f0f` `Compact local prompts list`

What changed:

- Local Prompts now show only the most recent `4` by default
- user can reveal older prompts with a toggle
- local prompt archive no longer permanently dominates the right side as much

Relevant files:

- `src/ui/components/PromptLibrary.tsx`
- `src/ui/components/PromptLibrary.css`

### 4. Builder card height reduced

Pushed commit:

- `c8e7f4e` `Reduce builder card height`

What changed:

- Builder card no longer stretches to full available height
- question-card content now sizes more naturally to actual content
- app main column also stopped forcing unnecessary full-height behavior

Relevant files:

- `src/ui/components/QuestionCard.css`
- `src/ui/App.css`

### 5. Earlier right-side restructuring work still matters

Already-pushed earlier commits that are still part of the current state:

- `54bc39c` `Prototype split right panel behavior`
- `7c5dbfc` `Separate workflow context from prompt preview`
- `387a87d` `Place workflow context below prompt preview`
- `6b38cd7` `Move save prompt next to copy`

These changes together mean:

- Prompt Preview is sticky on desktop
- page scroll is normal again, not trapped in a nested right-panel scroll
- Workflow Context sits below Prompt Preview
- Save Prompt is above Copy Prompt

## Territory State

Territory friction was analyzed conceptually and in the live product.

Important docs created locally:

- `TERRITORY_FRICTION_ANALYSIS_WITH_IDENTITY_SYSTEMS.md`
- `CURRENT_STATE_TERRITORY_CONFUSION_ANALYSIS.md`
- `TERRITORY_SIMPLIFICATION_PLAN.md`

Pushed wording/framing pass:

- `a2cec3a` `Clarify territory workflow wording`

What is now true in the UI:

- Territory gets a one-sentence plain-language framing
- inactive Territory state is explained as optional
- `Territory-biased` language was replaced in the visible workflow summary with `Focused Builder`
- Territory creation area explains more clearly what a Territory is and how it differs from Pools

Honest current state:

- Territories are still conceptually valuable
- but they still create friction
- the central confusion remains something like:
  - `Why do I need a Territory if I already have a Pool?`

This issue is not solved yet.

## Prompt Preview / Prompt Sources State

Important pushed commits from the recent small-gains pass:

- `7f7b0f5` `Add active workflow summary to prompt preview`
- `73f7251` `Simplify prompt sources summary`
- `6702d48` `Make prompt sources reveal prompt fragments`

What is now true:

- Prompt Preview has a compact `Active Workflow` summary
- Prompt Sources are shown as light chips instead of a large block
- clicking a Prompt Source chip reveals/highlights the corresponding prompt fragments

This was a good direction and tested well.

## Floating Global Phrase Layer State

Previously pushed work still active:

- `998f6ca` `Add floating global phrase layer`
- `da97054` `Render floating phrase layer above builder UI`
- `e89c95c` `Support custom global phrase constants`
- `1e8e2f6` `Make floating phrase trigger more visible`

What is now true:

- Global Phrase Layer is a floating movable tool
- it opens near the trigger
- it persists position locally
- custom user phrases are supported and persist locally

This system is currently in a much healthier state than before.

## Identity / Character Concept State

The deeper identity exploration remains concept-only.
It is important, but not recommended as the next immediate implementation.

Locally created concept docs include:

- `CHARACTER_IDENTITY_SYSTEM_EXPLORATION.md`
- `CHARACTER_IDENTITY_SYSTEM_MASTER_CONCEPT.md`
- `IMPLEMENTATION_PLAN_CHARACTER_IDENTITY_SYSTEM.md`
- `REUSABLE_IDENTITY_FRAMEWORK_CONCEPT.md`
- many other Character Identity docs listed in previous backup logs

Current recommendation:

- keep these ideas documented
- do not build them next
- continue improving the live workflow/product first

## Guided Intuitive Selection Insight

Locally created docs:

- `GUIDED_INTUITIVE_SELECTION_INSIGHT.md`
- `GUIDED_INTUITIVE_SELECTION_WORKFLOW_IMPLICATIONS.md`

Important insight:

Users often seem to use MorpBase as:

- a guided intuitive selection space

not only as:

- a strict deliberate decision machine

This means:

- gather-first / refine-later behavior is valid
- heavy explanatory UI is often the wrong response
- strong Pools, IDPs, and coherent source systems matter even more

This insight should influence future UX decisions.

## Current Right-Side Situation

This is the most important live-product thread right now.

### What has already been improved

- sticky Prompt Preview
- Save Prompt placed closer to prompt actions
- Workflow Context moved below Prompt Preview
- local saved prompts compacted
- builder card height reduced
- old nav buttons removed

### What still feels unresolved

User feedback after these changes indicates:

- prompt is still not always visible when working in the Saved Prompts area
- save is still not always reachable from anywhere on the right side

### Current best reading

The smaller fixes helped, but they did not fully solve the underlying structural conflict.

The real conflict seems to be:

- active prompt work
- archive / retrieval / saved prompt management

These two concerns still compete too much in the same right-side space.

### Current best structural direction

A fresh 5-draft rethink was done.
The strongest current recommendation is:

- `Prompt Console + Separate Saved Prompt Drawer`

Meaning:

- Prompt Preview and prompt actions remain the permanent active console
- saved prompts move out of the same vertical flow into a separate drawer/panel

Important status:

- this has **not** been implemented yet
- we stopped before doing the UX definition / implementation

## Exact Resume Point

If a new agent continues from here, the best next task is:

### Resume the right-side restructure thread

Specifically:

1. treat the current right-side problem as still unresolved
2. do not continue micro-tuning the same stacked-column structure too long
3. define the `Prompt Console + Separate Saved Prompt Drawer` UX shape
4. then implement and test it

This is the strongest current continuation point.

## Important Files To Leave Alone

Do not modify or include these unrelated local files unless explicitly asked:

- `Log_13_03_2026.md`
- `chat_log.txt`
- `morpbaselogo.png`

## Important Untracked Docs Still Local Only

Many concept/analysis docs remain untracked and intentionally not pushed yet.
This includes Character Identity docs, Multi IDP docs, Territory analysis docs, right-panel concept docs, and others.
Do not assume they exist on GitHub.
