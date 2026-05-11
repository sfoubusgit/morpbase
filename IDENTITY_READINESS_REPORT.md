# Identity Readiness Report

Date: 2026-03-20

## Executive Verdict

MorpBase is ready to think more deeply about Identity Systems.

More specifically:

- ready for a deeper `Character Identity` design / architecture pass: **yes**
- ready to make `Character Identity` the immediate next major implementation: **not yet**
- ready to build a broader `Reusable Identity Framework`: **no**

The strongest current reading is:

- `Character Identity` is now mature enough to move from pure concept exploration into a serious readiness / product-fit / architecture definition phase
- but the live product still needs enough clarity that Identity does not arrive as one more overlapping layer

## Why MorpBase Is Ready For Deeper Identity Thinking

### 1. The concept is already mature

`Character Identity` is no longer a vague future idea.

The repo already contains:

- core concept framing in `CHARACTER_IDENTITY_SYSTEM_MASTER_CONCEPT.md`
- MVP definition in `CHARACTER_IDENTITY_SYSTEM_MVP.md`
- architecture fit analysis in `CHARACTER_IDENTITY_SYSTEM_ARCHITECTURE_ANALYSIS.md`
- entry-point thinking in `CHARACTER_IDENTITY_SYSTEM_ENTRY_POINTS.md`
- Prompt Preview application flow in `CHARACTER_IDENTITY_SYSTEM_PROMPT_PREVIEW_FLOW.md`
- implementation-shape thinking in `IMPLEMENTATION_PLAN_CHARACTER_IDENTITY_SYSTEM.md`
- sequencing judgment in `SHOULD_CHARACTER_IDENTITY_BE_NEXT.md`

That means the project has already crossed the threshold from:

- "interesting idea"

to:

- "serious candidate with defined boundaries"

### 2. The current app architecture has a natural place for identity

The live app is already organized around distinct workflow layers:

- `Builder`
- `Pools`
- `Territories`
- `Modes`
- `Prompt Preview / Workflow Context`

This boundary is described clearly in:

- `APP_UNDERSTANDING_17_03_2026.md`
- `BACKUP_CURRENT_UNDERSTANDING.md`

And it matches the identity concept docs well:

- `Character Identity` = reusable subject identity
- `Pool` = workflow / style / image-family host
- `Territory` = focused workflow space
- `Mode` = Builder orientation

This is a strong sign that Identity can be added as a new layer rather than by distorting existing ones.

### 3. Prompt Preview is already a credible application surface

The identity docs repeatedly conclude that the best application surface is:

- `Prompt Preview / Active Workflow`

That fits the current runtime well because `src/ui/components/PromptPreview.tsx` already acts as:

- active workflow summary
- prompt influence display
- IDP set control surface
- export/edit state surface

This is exactly the kind of place where:

- `Character: None`
- `Choose Character`
- `Change`
- `Remove`

could live without feeling bolted on.

### 4. The prompt-layer model already hints at identity support

In the current code, `src/types/promptAdditions.ts` already includes:

- `sourceType?: 'pool' | 'territory' | 'fragment' | 'pool-default' | 'idp-set' | 'character'`

That matters because it suggests the product already conceptually accepts:

- `character` as a prompt influence layer

even though the actual runtime does not yet implement Character Identity.

This is not full implementation readiness by itself, but it is a strong architecture signal.

### 5. Nearer-term lanes have matured enough to reopen bigger thinking

The repo previously favored:

- Prompt Sets
- Quick Save
- workflow validation

over Identity Systems.

That judgment made sense.

But now:

- Prompt Sets has progressed from concept into implementation and cloud persistence
- the gothic elasticity result says the current Builder + Pool + IDP structure is holding up

Relevant files:

- `SHOULD_PROMPT_SETS_BE_NEXT.md`
- `src/engine/promptSetStore.ts`
- `supabase/migrations/0015_add_prompt_sets.sql`
- `ELASTICITY_RESULT_GOTHIC_CHARACTER_PORTRAIT.md`

This does **not** mean Identity should be built next.
It does mean the project is no longer forced to defer deeper Identity thinking just to protect near-term product focus.

## Why MorpBase Is Not Yet Ready To Build Identity Next

### 1. Territory clarity is still not strong enough

The strongest practical blocker is not code.
It is product legibility.

The repo is very explicit that Territories are still valuable but cognitively expensive in their current form.

Relevant files:

- `CURRENT_STATE_TERRITORY_CONFUSION_ANALYSIS.md`
- `TERRITORY_SIMPLIFICATION_PLAN.md`
- `TERRITORY_FRICTION_ANALYSIS_WITH_IDENTITY_SYSTEMS.md`

If Identity Systems were added before Territory became more emotionally obvious, MorpBase would risk feeling like:

- Pools
- Territories
- IDP sets
- Global phrases
- Character identity

were all competing to explain the current prompt.

That would hurt trust.

### 2. The runtime state model is not prepared yet

`src/ui/App.tsx` already carries rich workflow state, including:

- selections
- modifiers
- pool prompt items
- active Territory
- active IDP set
- edited output
- Builder session persistence

But it does **not** yet carry a true active character layer such as:

- `activeCharacterId`
- active character data
- character-specific session persistence

Also, `App.tsx` still defines its own builder-session prompt addition item types around:

- `pool`
- `territory`
- `pool-default`
- `idp-set`

So the type-level hint in `src/types/promptAdditions.ts` is ahead of the live application state.

### 3. There is no clear user-facing home yet

The app navigation in `src/ui/App.tsx` currently includes:

- Builder
- Prompts
- User Pools
- Pool Hub
- My Profile
- Working Sets
- Admin

There is no current `Characters` area.

That means the biggest unresolved product decision is still:

- where characters are created / managed first

The concept docs strongly prefer:

- dedicated `Characters` library or page for management
- `Prompt Preview` for application

But that is still a design decision, not a live product surface.

### 4. User need is still more internally reasoned than externally validated

The repo is confident that Character Identity fills a real conceptual gap.
But it is less confident that the timing is fully earned by live user behavior.

The project still wants stronger answers to questions like:

- do users repeatedly try to preserve recurring characters?
- do they feel that gap strongly in current workflows?
- is the pressure on Pools to hold character continuity actually becoming painful in practice?

That is why `SHOULD_CHARACTER_IDENTITY_BE_NEXT.md` still recommends:

- serious future candidate
- not immediate next build

## Current Architecture Fit

If MorpBase continues deeper Identity thinking now, the cleanest fit is still:

### Character Identity as a new reusable entity layer

Not:

- a Pool subtype
- a Territory subtype
- a Builder category type
- a Mode

This is reinforced by:

- `CHARACTER_IDENTITY_SYSTEM_ARCHITECTURE_ANALYSIS.md`
- `IDENTITY_ENTITIES_SEPARATE_FROM_BUILDER_CONCEPT.md`

### Best current product split

- `Character` = reusable subject identity entity
- `Pool` = workflow / style host
- `Territory` = focused workflow space
- `Mode` = Builder guidance/orientation
- `Prompt Preview` = current workflow application and visibility surface

### Strongest MVP fit

- one saved reusable character entity
- one active character per workflow
- explicit choose / change / remove controls
- visible prompt contribution layer
- local-first persistence before Supabase

That MVP shape is already documented in:

- `CHARACTER_IDENTITY_SYSTEM_MVP.md`
- `IMPLEMENTATION_PLAN_CHARACTER_IDENTITY_SYSTEM.md`

## Readiness Matrix

### Ready Now

- deepen Character Identity architecture thinking
- define exact boundary against Pools / Territories / IDP sets
- decide entry points
- define session-state shape
- define prompt-layer ordering
- define MVP persistence strategy
- define success criteria for eventual implementation

### Not Yet

- making Character Identity the immediate next major feature implementation
- building a broader Reusable Identity Framework
- merging identity into Pools or Territory authoring
- treating identity as just more Builder category content

### Later, If Identity Proves Valuable

- outfit / clothing identity
- multiple identity entity types
- richer identity composition
- larger Reusable Identity Framework

## Recommended Next Pass

The best next step is **not coding the feature yet**.

The best next step is a bounded Identity readiness / specification pass with these five outputs:

### 1. Entry-point decision

Decide between:

- dedicated `Characters` page
- lighter `Characters` library modal

And confirm:

- Prompt Preview remains the application surface

### 2. State model decision

Define exactly how Character sits beside:

- active Territory
- active IDP set
- Builder session snapshot
- prompt additions

### 3. Prompt-layer order decision

Resolve the actual intended prompt influence order.

Current best candidate from the docs:

1. character identity layer
2. pool / IDP baseline
3. global phrases
4. builder selections
5. other additions

### 4. Persistence decision

Choose:

- local-first MVP

or:

- immediate Supabase-backed MVP

The current repo logic favors:

- local-first, then Supabase later if validated

### 5. Validation criteria

Define what would count as enough evidence to implement:

- recurring-character demand
- real workflow reuse across multiple pools
- reduced pressure on Pools to carry general character identity
- clear mental model in user testing

## Final Recommendation

The healthiest current recommendation is:

- **yes, start thinking more deeply about Identity Systems now**
- **no, do not jump straight into implementation**

The project is now mature enough for a serious `Character Identity` readiness pass because:

- the concept is well developed
- the architecture has a plausible landing zone
- Prompt Preview is already a strong application surface
- the app’s other near-term priority lanes have advanced enough to create room for deeper strategic thinking

But the project should still avoid premature implementation because:

- Territory clarity is not fully settled
- the runtime state model is not prepared yet
- the user-facing home for identity is still undecided
- user-need validation is still weaker than concept maturity

## One-Sentence Conclusion

MorpBase is ready to move Character Identity from "future concept only" into "serious design-ready candidate," but not yet into "the next thing to ship."
