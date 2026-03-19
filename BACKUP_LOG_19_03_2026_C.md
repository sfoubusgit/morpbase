# Backup Log 19 03 2026 C

## Purpose

This backup log captures the next handoff point after the gothic pool launch, the follow-up bug-fix pass, and the first serious conceptual framing of `Prompt Sets`.

It is meant to let a new agent resume without having to reconstruct:

- the post-gothic stability fixes
- the current prompt-save UX behavior
- the Territory baseline bug and its resolution
- the current status of the right panel
- the newly clarified `Prompt Sets + Quick Save` direction

## High-Level State

MorpBase is still in a live-workflow refinement phase.

The product state is currently stronger than in the previous log because several unstable edges were cleaned up after the gothic pool landed.

Current broad reality:

- right panel is stable enough for now
- gothic pool is live
- save/archive behavior is healthier
- Territory still matters and still causes some conceptual friction
- Character / Identity Systems remain concept-only
- a lighter near-future prompt-library expansion is now emerging:
  - `Prompt Sets + Quick Save`

## Most Important Recently Pushed Changes Since Backup Log B

### 1. Save modal remount bug fixed

Pushed commit:

- `de5bce4` `Fix save modal reopening on builder return`

Bug:

- switching from `Builder` to `Prompts` and back to `Builder` reopened the `Save Prompt` modal every time

Cause:

- the hidden save-capable `PromptLibrary` instance was replaying the last nonzero `externalOpenSaveSignal` on remount

Fix:

- the component now tracks the last handled open signal
- it only opens on a real increment, not on remount

Relevant file:

- `src/ui/components/PromptLibrary.tsx`

### 2. Territory IDP baseline switching bug fixed

Pushed commit:

- `e44a83c` `Fix territory IDP baseline switching`

Bug:

- activating a new Territory could leave the previous Territory’s IDP baseline active
- `Clear` would preserve that stale baseline
- selecting IDPs from the new Territory would still act against the old baseline state

Cause:

- Territory activation only seeded a new identity baseline if no active IDP pool already existed
- so stale active baseline state could survive across Territory changes

Fix:

- Territory activation now explicitly replaces stale identity baseline state when needed
- old `pool-default` and `idp-set` baseline entries are removed before the new Territory baseline is seeded
- if the new Territory has no valid identity-capable source, the old baseline is cleared instead of being preserved incorrectly

Relevant file:

- `src/ui/App.tsx`

### 3. Runtime crash fixed and save toast added

Pushed commit:

- `b125440` `Add save toast and fix runtime crash`

Two things happened here:

#### Crash

Production error:

- `ReferenceError: Cannot access ... before initialization`

Cause:

- a Territory baseline `useEffect` referenced `replaceIdentityBaselineForPool` before the helper was initialized
- this created a temporal-dead-zone runtime failure

Fix:

- the helper and effect order were corrected

#### Save toast

New behavior:

- saving a prompt now shows a small top-page toast
- messages:
  - `Prompt saved to the cloud.`
  - `Prompt saved locally.`

Important detail:

- the toast works for both save paths:
  - hidden save modal flow
  - saved-prompts drawer flow

Relevant files:

- `src/ui/App.tsx`
- `src/ui/App.css`
- `src/ui/components/PromptLibrary.tsx`

## Current Right Panel State

The right panel remains stable enough and is not the main active pain point.

Current model:

- Prompt Preview is the active console
- saved prompt archive is separated into a drawer
- save flow is separate from archive flow
- copy is a utility action
- save feedback now has a visible page-level toast

Current recommendation:

- do not reopen a major right-panel redesign unless a new real friction point emerges

## Current Gothic Pool State

`Gothic Character Portrait` is live as an official primary pool.

Current status:

- default pool entry exists
- Pool Hub entry exists
- hero image is wired
- 3 IDP sets exist:
  - `Mourning Lace`
  - `Crimson Noble`
  - `Ashen Industrial`

This remains the next strong elasticity test candidate.

The product question is still:

- does this pool behave like a real primary workflow host in practice?

That test has not yet been fully carried out.

## Current Territory State

Territory remains one of the most important conceptual pressure points in the live product.

However:

- some thinking is considered acceptable
- the target is not “zero thinking”
- the target is “clear thinking”

That means current Territory work should continue to focus on:

- clearer framing
- better behavioral truth
- less overlap with Pools

not:

- flattening everything into a casual-product metaphor

## Character / Identity State

Character / Identity Systems remain concept-only and intentionally unbuilt.

One important new boundary was locked in locally:

- identity entities should remain separate from normal Builder / Territory category content
- they should not simply appear as more `Subjects`, `Props`, or similar category items
- they should be applied as distinct reusable prompt entities

Important local-only concept note:

- `IDENTITY_ENTITIES_SEPARATE_FROM_BUILDER_CONCEPT.md`

Current recommendation remains:

- do not build Identity Systems next

## New Emerging Prompt-Library Direction

This is the biggest conceptual change in this log.

### Prompt Sets

The user raised the idea of:

- folders for prompts

After discussion, the stronger framing became:

- `Prompt Sets`

Why this is better:

- not generic file-organization logic
- more like curated related prompt families
- better suited to MorpBase’s iterative workflow character

Prompt Sets are now understood as:

- saved-prompt collections that preserve relationship, context, and continuity

Examples:

- one workflow lane
- one experiment series
- one project
- one character-related saved-prompt family
- one external iteration branch

### Prompt Sets + Quick Save

This idea became stronger because it paired naturally with the earlier `Quick Save` concept.

Important insight:

- `Quick Save` is much more useful if a pasted external prompt can be assigned directly to a Prompt Set

That transforms Quick Save from:

- simple external prompt capture

into:

- contextual prompt capture

This makes the idea feel much more MorpBase-native.

Important local-only concept doc:

- `PROMPT_SETS_AND_QUICK_SAVE_CONCEPT.md`

Current recommendation:

- this is a serious near-future feature direction
- lighter and safer than Identity Systems
- worth defining carefully before implementation

## Prompt Management State

Current save-related behavior that should now be considered correct:

- builder session survives reload
- save-form draft survives reload when `Keep fields after saving` is enabled
- `Save Prompt` opens only the save flow
- `Open Saved Prompts` opens only the archive drawer
- save modal does not reopen when returning from `Prompts` to `Builder`
- successful saves now produce a page-level fading toast

## Best Resume Point

If a new agent resumes from here, the strongest realistic next directions are:

### Option 1. Continue with the gothic elasticity test

Why:

- the pool is live now
- the system is stable enough again
- this gives real product feedback instead of more concept layering

### Option 2. Formalize `Prompt Sets MVP`

Why:

- the idea is now coherent
- it is lighter than Identity Systems
- it connects naturally to `Quick Save`
- it improves saved-prompt workflow without requiring a giant system

Current recommendation:

- either run the `Gothic Character Portrait` elasticity test
- or define `Prompt Sets MVP`

Both are strong next moves.

## Files Most Relevant To Resume

- `src/ui/App.tsx`
- `src/ui/App.css`
- `src/ui/components/PromptLibrary.tsx`
- `src/data/defaultUserPools.ts`
- `src/data/poolHubMock.ts`
- `BACKUP_LOG_19_03_2026_B.md`
- `BACKUP_LOG_19_03_2026_C.md`

## Latest Pushed Commit At Time Of This Log

- `b125440` `Add save toast and fix runtime crash`
