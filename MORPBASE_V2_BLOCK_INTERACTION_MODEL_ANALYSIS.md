# MorpBase V2 Block Interaction Model Analysis

## 1. Executive Conclusion

The strongest interaction model for MorpBase V2 workflow blocks is:

- **a guided-choice hybrid with optional free steering and live Preview response**

More plainly:

- each block should begin with a clear creative prompt
- offer a small number of curated choices first
- allow a light custom steering layer second
- update Preview live as the block takes shape
- end in a compact block summary the user can revisit later

This is the best result because it avoids the two biggest V2 dangers:

- becoming a polished form
- becoming an over-clever interactive system that is harder to use than the problem it solves

The key judgment is:

- `blocks should feel like guided creative moves`
- `not like data entry`
- `not like chatting with an assistant`

## 2. Candidate Interaction Models

### 1. Form-control-heavy model

Shape:

- labels
- fields
- dropdowns
- sliders
- text inputs

Strengths:

- easy to specify
- familiar
- direct

Weaknesses:

- too close to configuration UI
- high risk of V1 drift
- too easy to become category management
- weak emotional momentum

### 2. Visually curated card/chip model

Shape:

- starter cards
- choice chips
- quick visual options

Strengths:

- approachable
- fast to scan
- strong first-use friendliness

Weaknesses:

- can become shallow if there is no custom steering layer
- risks feeling constrained for returning or advanced users
- can become too decorative if not disciplined

### 3. Conversational block model

Shape:

- each block asks natural-language questions
- the user replies in text or guided dialogue

Strengths:

- can feel personal
- flexible

Weaknesses:

- too chat-like
- too dependent on interpretation
- weak for fast targeted revisits
- too easy to blur the product into assistant behavior instead of workflow authoring

### 4. Hybrid guided-choice + optional free-steering model

Shape:

- one plain-language creative prompt
- curated starter choices
- optional custom steering layer
- live Preview response
- compact resulting summary

Strengths:

- fast for first use
- flexible for repeat use
- keeps structure without becoming rigid
- works naturally with the Preview loop

Weaknesses:

- requires discipline so the custom layer stays light
- requires strong information hierarchy inside each block

## 3. Selection Criteria

The interaction model should win on:

### 1. First-use friendliness

Can a user understand how to use a block quickly?

### 2. Returning-user speed

Can a user reopen a saved result and change one block without friction?

### 3. Creative feel

Does the block feel like shaping an image, not configuring a system?

### 4. Preview integration

Does the effect of a block feel visible and trustworthy immediately?

### 5. Anti-V1 drift

Does the model stay clearly away from form-density and category-thinking?

### 6. Future extensibility

Can later source/context and continuity systems support the blocks without becoming the blocks?

## 4. Real-Life Usage Drafts

### Draft 1. First-time portrait creator

Goal:

- make one strong result without needing MorpBase vocabulary first

What works best:

- the block asks one clear creative question
- the user sees a few meaningful starter options
- they choose one or two
- Preview updates visibly
- they optionally add one custom steer if needed

Why form-heavy loses:

- it makes the process feel administrative too early

Why conversation-heavy loses:

- it is slower than the benchmark should be

### Draft 2. Returning user reopening a saved result

Goal:

- adjust only mood and framing

What works best:

- the user sees compact summaries for completed blocks
- opens `Mood And Light`
- swaps one or two choices
- maybe edits a short custom note
- closes the block and sees Preview respond

Why the hybrid model wins:

- it supports local targeted change without replaying a whole flow

### Draft 3. Speed-focused user

Goal:

- reach a good result as fast as possible

What works best:

- each required block works with just a few curated picks
- the custom steer layer stays skippable
- Preview provides immediate trust

Why this matters:

- V2 should reward short use, not punish it

### Draft 4. Later advanced user with deeper systems

Goal:

- later receive context help inside a block without the whole flow being redesigned

What works best:

- the block keeps its same grammar
- a side suggestion layer offers:
  - source-based inspiration
  - continuity-aware steering
  - later reusable memory support

Why this wins:

- later systems enrich the block instead of replacing it

## 5. Chosen Interaction Model

The chosen model is:

- **guided-choice hybrid with optional free steering**

This means every block should be built around the same base movement:

1. understand the creative job
2. choose a direction quickly
3. optionally steer it more specifically
4. see the result respond
5. leave the block with a compact summary

This is the strongest V2 interaction foundation because it is:

- legible
- flexible
- fast
- and distinct from both V1 and simpler prompt tools

## 6. Shared Block Grammar

Every workflow block should share one common grammar:

### 1. Block prompt

A short plain-language prompt such as:

- who is this image really about?
- what should this look like?
- how should this feel?

This creates immediate orientation.

### 2. Curated starter choices

A small set of strong choices:

- cards
- chips
- visual option pills
- short semantic scales

These should help the user move quickly.

### 3. Optional custom steering

A light custom layer for:

- one short note
- one free refinement
- one stronger nudge

This should not become a large text editor.

### 4. Live Preview response

Prompt Preview should reflect the block's effect immediately.

No explicit `Apply` step should be required for the benchmark flow.

### 5. Compact block summary

When the block is collapsed again, it should show:

- the current chosen direction in one short readable summary

That supports targeted revisits later.

## 7. Default Choice Density

The strongest default density is:

- **3 to 6 meaningful starter choices per decision area**

Not:

- dozens of options
- empty text boxes only
- giant dropdowns

Each block should expose:

- one main interaction surface
- at most one light secondary refinement surface
- one optional custom steering area

This is enough to feel rich without becoming heavy.

## 8. Curated Choices vs Free Steering

### Curated choices should own:

- the fastest good starting direction
- common high-value patterns
- semantic choices the user can understand at a glance

### Free steering should own:

- specificity
- unusual nuance
- personal variation
- exceptions to the curated defaults

The key rule is:

- users should be able to succeed without free typing
- but not feel trapped without it

## 9. Per-Block Interaction Guidance

### Subject Core

Best interaction:

- starter archetype or subject cards
- quick role/focus chips
- short custom note for specificity

This block should feel like choosing the subject lane, not filling identity fields.

### Presence And Signature

Best interaction:

- trait chips
- expression / energy picks
- one short signature-note area

This block should make the subject feel particular without becoming a dump zone.

### Visual Direction

Best interaction:

- strong visual-direction cards
- finish / texture chips
- optional custom steer for edge-case style nudging

This block should feel like aesthetic steering, not style taxonomy management.

### Mood And Light

Best interaction:

- mood chips
- light-character cards
- semantic intensity choices such as:
  - soft
  - dramatic
  - stark

This is better than numeric sliders because it stays creative and legible.

### Scene Pressure

Best interaction:

- lightweight scene-level cards such as:
  - minimal
  - suggestive
  - situated
- optional environment nudge chips

This block should stay light, because it is optional in the benchmark flow.

### Framing And Focus

Best interaction:

- framing cards
- focus/emphasis chips
- maybe one optional presentation note

This block should feel highly visual and immediate.

### Tighten The Result

Best interaction:

- review cues
- refinement toggles
- "make it cleaner / stronger / calmer / sharper" style options
- one optional final nudge note

This block should not restart the workflow.
It should help the user make the result feel intentional.

## 10. Preview Response Model

Prompt Preview should respond:

- **live**
- **incrementally**
- **without requiring explicit apply buttons**

The right behavior is:

- change something in the block
- Preview reflects the effect quickly
- the user trusts the shaping loop

The only place where a stronger explicit confirmation belongs is:

- the keep / save handoff

That keeps the workspace responsive while reserving real commitment for the result moment.

## 11. Completion And Revisit Logic

Blocks should support three lightweight states:

- untouched
- shaped
- refined

The user should never feel forced to "complete" a block in a bureaucratic sense.
But the workspace should still communicate:

- which blocks already have a meaningful direction
- which ones are still blank or light

Returning users should be able to:

- reopen any block
- see the current summary immediately
- make one small change
- close it again without losing orientation

## 12. How Later Systems Attach Without Hijacking The Core

### 1. Reusable sources / workflow memory

Later attachment:

- offer smart suggestions inside:
  - Visual Direction
  - Scene Pressure

### 2. Continuity systems

Later attachment:

- enrich:
  - Subject Core
  - Presence And Signature

### 3. Archive depth

Later attachment:

- enrich the keep handoff and post-save path

### 4. Community / publication

Later attachment:

- after the keep moment
- not inside block interaction itself

This preserves one important rule:

- later layers may support the workflow blocks
- they do not become the primary interaction grammar

## 13. Why The Other Models Lose

### Form-control-heavy loses

Because it is too close to configuration UI and too likely to recreate V1 density.

### Pure visual card/chip model loses

Because it becomes too shallow if the user cannot steer beyond the presets.

### Conversational block model loses

Because it slows revisits, weakens precision, and makes MorpBase feel more like an assistant shell than a workflow authoring product.

The hybrid wins because it combines:

- quick entry
- real steering
- live trust
- and revisit speed

better than the other options.

## 14. Failure Conditions

The interaction model would fail if:

### 1. Blocks become mini forms

Then V2 is just cleaner V1.

### 2. Curated choices become giant option walls

Then speed and clarity collapse.

### 3. Free steering becomes long prompt editing

Then the product recenters on text-entry instead of workflow shaping.

### 4. Preview becomes delayed or secondary

Then the workspace loop weakens immediately.

### 5. Every block gets a different interaction language

Then the workspace loses coherence.

### 6. Later systems force new primary interaction grammar

Then the V2 core was not stable enough.

## 15. Final Judgment

The strongest block interaction model for MorpBase V2 is:

- **a shared guided-choice hybrid: curated starter selections first, optional free steering second, live Preview response throughout, and compact summaries for revisiting**

The cleanest final sentence is:

- `MorpBase V2 should make each workflow block feel like one guided creative move: choose a direction quickly, steer it if needed, watch the result respond, and carry forward a clear summary.`

That is the strongest current interaction foundation for the V2 workflow blocks.
