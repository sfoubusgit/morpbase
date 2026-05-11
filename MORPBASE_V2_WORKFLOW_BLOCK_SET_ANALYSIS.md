# MorpBase V2 Workflow Block Set Analysis

## 1. Executive Conclusion

The strongest workflow block system for MorpBase V2 is:

- **a balanced 7-block authoring model, plus a Preview-side keep handoff**

More plainly:

- the authoring column should contain **7 focused workflow blocks**
- those blocks should be distributed across the 4 chosen phases
- the final `keep / save` action should sit beside Prompt Preview, not inside the authoring column as just another block

This is the best result because it keeps V2:

- guided, but not wizard-like
- rich, but not V1-dense
- creative, but not vague
- structurally integrated with Prompt Preview
- ready for later depth without depending on later depth

The key judgment is:

- `the block system should carry the shaping work`
- `Prompt Preview should carry the trust-and-keep handoff`

That creates a cleaner V2 center than treating save as one more block in the left column.

## 2. Candidate Block-Set Models

### 1. Sparse 5-block model

Example shape:

- Subject Core
- Look Direction
- Mood / Light
- Stage The Image
- Refine

Strengths:

- very easy to explain
- fast to move through
- low visual density

Weaknesses:

- too broad
- weak targeted re-entry for returning users
- too easy to become "a better prompt form"
- does not give enough structure to justify the phase model fully

### 2. Balanced 7-block model

Example shape:

- Subject Core
- Presence And Signature
- Visual Direction
- Mood And Light
- Scene Pressure
- Framing And Focus
- Tighten The Result

Strengths:

- enough structure to feel like real workflow authoring
- still compact enough for first-wave use
- good targeted re-entry for returning users
- works naturally with Preview as the keep endpoint

Weaknesses:

- requires discipline so blocks stay creative and do not turn into category buckets

### 3. Dense 10-block model

Example shape:

- Subject Type
- Role / Archetype
- Signature Traits
- Style
- Palette
- Lighting
- Setting
- Pose
- Composition
- Polish / Save

Strengths:

- detailed
- expressive
- easier to attach many controls directly

Weaknesses:

- too close to V1 density
- too likely to become a mini-form system
- too many micro-decisions before value is felt
- higher risk of visual clutter and maintenance drift

### 4. Hybrid uneven model

Example shape:

- strong 2-block subject phase
- strong 2-block look phase
- flexible 2-block staging phase
- light 1-block refine phase
- save handoff in Preview

Strengths:

- respects the actual rhythm of the benchmark workflow
- lets the final phase be lighter and more trust-oriented
- keeps save structurally near the result

Weaknesses:

- slightly less symmetrical
- requires a deliberate explanation of why the keep handoff is not a left-column block

## 3. Selection Criteria

The block system should win on:

### 1. Creative legibility

Each block should feel like a meaningful creative move, not a taxonomy section.

### 2. Benchmark fit

The system should support portrait-oriented workflow shaping naturally.

### 3. Speed to value

A first-time user should reach a strong result quickly.

### 4. Returning-user precision

A saved workflow should be easy to reopen and adjust locally.

### 5. Preview integration

The relationship between shaping work and visible output must stay obvious.

### 6. Anti-V1 drift

The block system must not quietly become a renamed version of the old Builder categories.

### 7. Future extensibility

Later reusable sources, continuity layers, and community/publication should be able to connect later without redefining the core.

## 4. Real-Life Usage Drafts

### Draft 1. First-time portrait creator

Goal:

- build one strong portrait workflow quickly and feel that MorpBase is helping

What works best:

- a user can move through:
  - Subject Core
  - Presence And Signature
  - Visual Direction
  - Mood And Light
  - Framing And Focus
  - Tighten The Result
- and optionally use Scene Pressure if the background matters

Why sparse loses:

- broad blocks like `Stage The Image` are too vague for a first strong result

Why dense loses:

- too many early micro-decisions make the flow feel bureaucratic

### Draft 2. Returning user refining a saved base

Goal:

- reopen a saved portrait base and quickly shift style, mood, and framing

What works best:

- the user jumps straight into:
  - Visual Direction
  - Mood And Light
  - Framing And Focus

Why the balanced model wins:

- these blocks are distinct enough for precise re-entry
- but not so tiny that the user has to touch ten separate cards

### Draft 3. Speed-oriented user

Goal:

- get one good result as quickly as possible

What works best:

- required core blocks:
  - Subject Core
  - Visual Direction
  - Mood And Light
  - Framing And Focus
- optional support blocks can be skipped

Why this matters:

- the workflow should still feel useful even when a user does not fill every possible shaping area

### Draft 4. Later advanced user with deeper systems

Goal:

- later apply reusable context or continuity without the workspace collapsing into several systems

What works best:

- deeper systems attach into existing blocks:
  - continuity into subject-related blocks
  - reusable source/context help into look or scene blocks
  - archive/community only after the keep moment

Why the hybrid balanced model wins:

- it provides stable attachment points without making those systems part of the benchmark flow

## 5. Chosen Block-Set Model

The chosen model is:

- **7 authoring blocks in the workflow column**
- **1 keep handoff beside Prompt Preview**

That means:

- the left column owns the creative shaping work
- the right column owns the trust / review / keep decision

This is stronger than an 8-block left column because:

- save is not really another shaping move
- save belongs where the user confirms the result
- Prompt Preview stays structurally essential

So the chosen model is best described as:

- `7 shaping blocks + Preview-side keep`

## 6. Per-Phase Block Definition

## Phase 1. Define The Subject

### Block 1. Subject Core

Status:

- **required**

Owns:

- who or what the image is fundamentally about
- the basic subject archetype or role
- the central portrait focus

Does not own:

- style language
- lighting mood
- environment/staging logic

### Block 2. Presence And Signature

Status:

- **recommended**

Owns:

- defining personal or visual cues
- expression, posture, attitude, or energy
- the feature or presence that makes the subject feel particular

Does not own:

- full aesthetic direction
- scene placement
- final polish or cleanup

## Phase 2. Shape The Look

### Block 3. Visual Direction

Status:

- **required**

Owns:

- the image's aesthetic direction
- style family
- finish / texture pressure
- broad visual language

Does not own:

- who the subject is
- scene layout
- final output cleanup

### Block 4. Mood And Light

Status:

- **required**

Owns:

- emotional tone
- lighting character
- atmospheric pressure
- how the image should feel

Does not own:

- full composition
- archive/save behavior
- subject identity by itself

## Phase 3. Stage The Image

### Block 5. Scene Pressure

Status:

- **optional**

Owns:

- how much setting or background support the image should have
- environment mood
- backdrop intensity
- whether the portrait lives in a blank, soft, or more situated world

Does not own:

- core subject definition
- full composition by itself
- final output review

### Block 6. Framing And Focus

Status:

- **required**

Owns:

- crop / shot emphasis
- composition focus
- how the subject is visually presented
- what the viewer is meant to notice first

Does not own:

- whole-scene worldbuilding
- full style language
- save/reuse behavior

## Phase 4. Refine And Keep

### Block 7. Tighten The Result

Status:

- **recommended**

Owns:

- last useful refinements
- cleanup of weak or noisy elements
- making the result feel intentional and coherent
- optional constraints or quality pressure

Does not own:

- deep archive structure
- publication/community actions
- large new workflow moves that belong earlier

### Keep Handoff. Preview-Side Action

Status:

- **required for the benchmark endpoint**

Owns:

- confidence check
- "this is worth keeping" confirmation
- save as reusable result

Does not own:

- the shaping work itself
- archive taxonomy
- community publishing complexity

This is intentionally **not** a left-column workflow block.

## 7. Mandatory / Recommended / Optional Mapping

### Required core blocks

- Subject Core
- Visual Direction
- Mood And Light
- Framing And Focus
- Preview-side Keep Handoff

### Recommended support blocks

- Presence And Signature
- Tighten The Result

### Optional context block

- Scene Pressure

This creates a very important V2 property:

- the workflow is complete with 4 required shaping decisions plus keep
- but it becomes noticeably better with 2-3 more focused refinements

That is a strong balance between speed and richness.

## 8. Block Granularity Rules

The blocks should be:

- compact
- high-impact
- plainly named
- visually scannable

Each block should:

- own one shaping job
- contain only a small cluster of related controls
- create a visible effect in Prompt Preview
- feel meaningful even when revisited alone

Each block should **not**:

- turn into a long mini-form
- expose every underlying prompt dimension separately
- duplicate the job of another block
- require understanding MorpBase jargon first

The default benchmark flow should keep the visible shaping system at:

- **7 blocks maximum**

That is enough to feel rich, but still meaningfully tighter than V1.

## 9. Prompt Preview / Keep Handoff Judgment

The strongest judgment here is:

- **Keep / Save should not be a normal authoring block**

Why:

- saving is not the same kind of action as shaping
- it belongs beside the visible result
- it strengthens Prompt Preview's role as the trust surface
- it keeps the left column focused on creative construction

So Phase 4 should be understood as a shared phase:

- left side: `Tighten The Result`
- right side: `Keep This Result`

That is cleaner than collapsing both into one left-column card.

## 10. How Later Systems Attach Without Hijacking The Core

### 1. Reusable source/context systems

Later attachment:

- help shape `Visual Direction`
- help shape `Scene Pressure`

Why this works:

- source memory enriches shaping work without becoming the center

### 2. Continuity systems

Later attachment:

- project into `Subject Core`
- enrich `Presence And Signature`

Why this works:

- continuity supports the subject layer directly, where it naturally belongs

### 3. Archive depth

Later attachment:

- deepen the keep handoff after the user already trusts the workflow

Why this works:

- memory grows from the result, not from the beginning of the flow

### 4. Community/publication

Later attachment:

- after the keep moment, not during the shaping loop

Why this works:

- community becomes an integrated downstream layer, not a competing workspace center

## 11. Why The Other Models Lose

### Sparse 5-block model loses

Because it is too broad and too easily collapses into a polished prompt form.

### Dense 10-block model loses

Because it recreates V1's over-segmentation and invites feature drift back into the core.

### All-save-in-the-left-column model loses

Because it weakens Prompt Preview and treats keeping the result like just another field cluster.

The chosen hybrid balanced model wins because it best preserves:

- momentum
- clarity
- re-entry
- Preview importance
- and future extensibility

## 12. Failure Conditions

The block set would fail if:

### 1. Blocks become renamed categories

Then V2 is not truly new.

### 2. `Presence And Signature` becomes a feature dump

Then subject definition becomes messy and heavy.

### 3. `Visual Direction` and `Mood And Light` collapse into one vague style block

Then the workflow loses useful precision.

### 4. `Scene Pressure` becomes mandatory worldbuilding

Then the portrait benchmark becomes slower and heavier than it should be.

### 5. `Tighten The Result` becomes a second full authoring pass

Then phase 4 loses its intended lightness.

### 6. Keep/save migrates back into a generic left-column card

Then Prompt Preview weakens as a trust surface.

### 7. Later systems demand new core blocks too early

Then V2 will repeat the V1 pattern of local growth without whole-picture discipline.

## 13. Final Judgment

The strongest block system for MorpBase V2 is:

- **7 focused authoring blocks distributed across the 4 phases, with keep/save handled beside Prompt Preview**

The final block set is:

1. Subject Core
2. Presence And Signature
3. Visual Direction
4. Mood And Light
5. Scene Pressure
6. Framing And Focus
7. Tighten The Result

plus:

- **Keep This Result** as the Preview-side endpoint

The cleanest final sentence is:

- `MorpBase V2 should structure its benchmark workflow around seven focused shaping blocks, while letting Prompt Preview own the final trust-and-keep moment.`

That is the strongest current block foundation for a true V2 rebuild.
