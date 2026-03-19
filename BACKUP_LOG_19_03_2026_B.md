# Backup Log 19 03 2026 B

## Purpose

This backup log captures the next major handoff point after the right-panel restructuring stabilized and the `Gothic Character Portrait` pool was built and pushed.

It is meant to let a new agent resume from the current real product state without having to reconstruct:

- the final right-panel decisions
- the saved-prompt drawer architecture
- the current Territory status
- the new gothic elasticity candidate pool
- the current recommendation for what to work on next

## High-Level State

MorpBase is still in a live-workflow refinement phase.

But compared with the previous backup log, one important thing changed:

- the right panel is now considered stable enough for the moment

The user explicitly said the right panel feels fine for now after the drawer-based restructuring and subsequent bug fixes.

That means the current product attention has shifted again toward:

- core workflow validation
- Territory clarity
- elasticity testing
- careful evolution of Pools

Not toward:

- another immediate major structural redesign
- or immediate implementation of Character / Identity systems

## Most Important Recently Pushed Changes Since The Last Backup Log

### 1. Right-side prompt/archive structure was actually solved more cleanly

Important pushed commits:

- `73630c3` `Move saved prompts into drawer`
- `48bc6b5` `Hide global phrases while drawer is open`
- `c2c5ce3` `Unify prompt preview button hierarchy`
- `806231e` `Tighten prompt action sizing`
- `93024fa` `Group prompt actions into cluster`
- `190a5f9` `Move copy action into prompt header`
- `8ad1301` `Refine prompt copy icon`
- `1d69863` `Separate save modal from prompt drawer`

What is now true:

- permanent `Saved Prompts` no longer live in the same vertical generator stack
- `Open Saved Prompts` opens a dedicated right-side drawer
- `Save Prompt` opens only the save modal
- copy is no longer treated like a dominant CTA
- copy is now a small utility control in the prompt header
- the floating Global Phrase Layer hides while the saved-prompts drawer is open

This was the first right-side pass that actually respected the difference between:

- active prompt work
- saved prompt archive / retrieval

That distinction turned out to be structurally important.

### 2. Save/archive behavior bugs were fixed

Important pushed commits:

- `606d529` `Open drawer when saving prompt`
- `1d69863` `Separate save modal from prompt drawer`

What happened conceptually:

- the first fix addressed the bug where pressing `Save Prompt` appeared to do nothing until the drawer was opened
- then a second fix re-separated the save flow and archive flow properly so saving a prompt no longer opened the saved-prompts drawer as a side effect

Final working model now:

- `Save Prompt` = save flow only
- `Open Saved Prompts` = archive/drawer only

Relevant files:

- `src/ui/App.tsx`
- `src/ui/components/PromptLibrary.tsx`

### 3. Prompt Preview actions now have a calmer hierarchy

Current visual/action logic:

- copy is a small utility action near the prompt itself
- save and archive are the main lower prompt-management actions
- action sizing is less slab-like and less visually heavy than before

This is healthier than the earlier versions where:

- `Copy Prompt` got too much attention
- actions felt too wide and too isolated from each other

### 4. Territory wording got one more clarity pass

Pushed commit:

- `516a446` `Clarify pool versus territory distinction`

What changed:

- Builder Territory UI now directly states:
  - `Pool = reusable source`
  - `Territory = focused workflow space built from selected pool sections`
- `User Pools` Compose Territory surface now presents the same distinction in a comparison block

Important state:

- this does not remove the need for the user to think
- and that is currently considered acceptable
- the current product stance is:
  - MorpBase is a tool for intermediates and pros
  - the issue is not “thinking”
  - the issue is “unclear thinking”

### 5. A new official primary pool was added: `Gothic Character Portrait`

Pushed commit:

- `c7892ef` `Add gothic character portrait pool`

What was added:

- new default pool entry
- new official Pool Hub entry
- new hero image wiring
- 3 IDP sets

Relevant files:

- `src/data/defaultUserPools.ts`
- `src/data/poolHubMock.ts`
- `public/gothic_hero_image_.png`
- `public/hero_image_sacred_emblems.png`

The new pool was built from a noisy corpus of gothic prompts provided by the user.

Important design choice:

- do not imitate those prompts literally
- extract repeated gothic core signals
- discard prompt trash like LoRA clutter, contradictory media stacking, and decorative over-noise

Core recurring signals extracted from the corpus:

- upper-body portrait focus
- pale / high-contrast face treatment
- elegant dark attire
- lace, velvet, corsets, veils, chains
- candlelight / chiaroscuro / low-key lighting
- melancholy, severity, mystery, aristocratic poise
- butterflies, moths, decaying flowers, ravens, baroque or gothic darkness

Pool structure created:

- `Subjects`
- `Style`
- `Attire`
- `Lighting`
- `Mood`
- `Composition`
- `Motifs`

IDP sets created:

- `Mourning Lace`
- `Crimson Noble`
- `Ashen Industrial`

This pool is now the next strong elasticity candidate.

### 6. Hero images now exist for both of the newer official pools

Current Pool Hub hero-image state:

- `Gothic Character Portrait` -> `/gothic_hero_image_.png`
- `Sacred Emblems and Handheld Relics` -> `/hero_image_sacred_emblems.png`

There was one short intermediate mistake where the sacred pool accidentally pointed at the gothic image path.
That was corrected before the final push.

## Right Panel State Now

This changed meaningfully since the previous backup log.

### The right panel is currently considered stable enough

The user explicitly said:

- the right panel seems fine for now

That means the earlier high-priority structural issue is no longer the main active pressure point.

Current right-side model:

- Prompt Preview stays the active console
- saved prompt archive is moved out into a drawer
- save and archive behaviors are separated
- copy is a utility action instead of a dominant button
- the prompt-management area is calmer and more truthful

Recommendation:

- do not keep redesigning the right side unless new real friction appears

## Territory State

Territory is still one of the biggest conceptual friction points in the live product.

However, current stance is more nuanced now:

- some mental model load is acceptable
- MorpBase is not required to be frictionless in a shallow casual-product sense
- Territory should still become clearer, but not necessarily “effortless”

Current best reading:

- Territories are probably the right concept
- but they still need careful, incremental simplification and framing work

The central confusion remains close to:

- `Why do I need a Territory if I already have a Pool?`

## Character / Identity Concept State

The Character / Identity exploration remains concept-only and intentionally unbuilt.

Important local-only docs still exist, including:

- `CHARACTER_IDENTITY_SYSTEM_MASTER_CONCEPT.md`
- `IMPLEMENTATION_PLAN_CHARACTER_IDENTITY_SYSTEM.md`
- `REUSABLE_IDENTITY_FRAMEWORK_CONCEPT.md`
- many supporting Character / Identity exploration docs

Further conceptual extension happened during this period:

- clothing/outfit identity was discussed as a sibling to character identity
- the better long-term framing became:
  - `Identity Pool`
  - with possible niches such as:
    - character
    - clothing

But current recommendation is still:

- do not build this next
- keep it documented
- continue strengthening the live workflow first

## Prompt Management State

Current save-related behavior that should now be considered correct:

- builder session survives reload
- edited output survives reload
- prompt state survives reload
- save-form fields survive reload if `Keep fields after saving` is enabled
- `Save Prompt` opens only save flow
- `Open Saved Prompts` opens only saved-prompt archive drawer

There is also a documented but unbuilt idea:

- `Quick Save`

Important local-only doc:

- `QUICK_SAVE_MVP.md`

Current recommendation for `Quick Save`:

- good idea
- keep documented
- do not implement immediately unless prompt-management needs reopen

## Current Best Resume Point

The strongest live-product direction right now is:

- not another large UI restructuring
- not immediate Character / Identity implementation
- not abstract system expansion first

Instead:

- continue with workflow validation and carefully chosen elasticity testing

Best immediate candidate:

- use `Gothic Character Portrait` as the next real elasticity workflow

Why:

- it is different enough from `Celestial Pixel Portrait`
- it pressure-tests darker, more shadow-heavy portrait logic
- it tests whether MorpBase still supports coherent intuitive selection in a less pastel / less decorative lane

## Honest Current Recommendation

If a new agent resumes from here, the best next move is probably:

1. actively test `Gothic Character Portrait`
2. observe whether its 3 IDP lanes feel distinct enough
3. see whether the workflow supports intuitive gathering as well as the celestial workflow did
4. only then decide whether:
   - the gothic pool needs refinement
   - another secondary pool should be made for it
   - or another Territory clarity pass is more urgent

## Files Most Relevant To Resume

- `src/data/defaultUserPools.ts`
- `src/data/poolHubMock.ts`
- `src/ui/App.tsx`
- `src/ui/App.css`
- `src/ui/components/PromptPreview.tsx`
- `src/ui/components/PromptPreview.css`
- `src/ui/components/PromptLibrary.tsx`
- `src/ui/components/UserPoolsPage.tsx`
- `src/ui/components/UserPoolsPage.css`
- `BACKUP_LOG_19_03_2026.md`

## Latest Pushed Commit At Time Of This Log

- `c7892ef` `Add gothic character portrait pool`
