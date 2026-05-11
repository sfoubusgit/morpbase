# Elasticity Test: 32x32 Pixel Art Portrait

## Date

18 March 2026

## Purpose

This is the first concrete application of the `Mode Elasticity Test`.

The goal is to determine whether the current MorpBase system can already support a focused `32x32 pixel art portrait` workflow through:

- existing Builder Workflow Modes
- Pools
- Territories
- current Builder guidance

without needing a new Mode.

## Candidate Workflow

Test target:

- `32x32 pixel art portrait`

This is intentionally narrow.

It is not:

- all pixel art
- all retro sprite work
- all game-art workflows

It is specifically:

- small-scale pixel portrait iteration
- centered around readable character portrait output

## Why This Is A Good First Test

This workflow is useful because it pressures the system in a realistic way.

It tests:

- a medium-specific style constraint
- a portrait-oriented workflow
- section usefulness
- Territory usefulness
- whether friction comes from a missing Mode or from some other system layer

## Current Test Assets

The test now has a real asset base:

### Pool

- official `32x32 Pixel Art Portrait`

### Pool characteristics

- hero image
- 10 items in each core section
- initiative phrases
- first initiative phrase auto-applies on activation

### Current sections

- `Subjects`
- `Style`
- `Lighting`
- `Mood`
- `Composition`
- `Effects`

## Main Question

Can the current MorpBase system support repeated `32x32 pixel art portrait` iteration well enough that no new Mode is needed?

## Modes To Test

### Primary modes

- `Character-First`
- `Balanced`

### Optional comparison mode

- `Scene-First`

### Not primary for this first pass

- `Environment-First`

Reason:

This workflow is portrait-centered, not environment-centered.

## Territory Setup Recommendation

Create a Territory using the `32x32 Pixel Art Portrait` pool with these source sections:

- `Subjects`
- `Style`
- `Lighting`
- `Mood`
- `Composition`

Optional:

- `Effects`

Reason:

This creates a portrait-focused Territory without muddying the result too early.

## Test Cases

Run the workflow through several variations, not just one.

Recommended set:

1. hero portrait
2. moody portrait
3. playful portrait
4. fantasy portrait
5. sci-fi portrait

The goal is to check whether the workflow supports iteration, not a single successful outcome.

## Test Procedure

### Phase 1: Baseline without Territory

Test the pool with:

- `Character-First`
- `Balanced`

Questions:

- does the workflow already feel natural?
- does auto-applied default phrasing help?
- does the pool provide enough structure by itself?

### Phase 2: Territory-enabled

Activate the Territory and test:

- `Territory-biased`
- `Full Builder`

Questions:

- does the Territory improve focus?
- does Territory-biased navigation help or over-constrain?
- do the Territory sections map cleanly into the Builder?

### Phase 3: Compare workflow feel

Compare:

- `Character-First`
- `Balanced`
- optional `Scene-First`

Questions:

- which one feels most natural?
- does one mode clearly outperform the others?
- does the workflow feel blocked by the current modes or by something else?

## What To Observe

Track observations under these categories.

### 1. Mode Fit

Questions:

- does `Character-First` already support this well?
- does `Balanced` feel good enough?
- does `Scene-First` add anything meaningful?
- does the workflow expose a real missing orientation?

### 2. Pool Quality

Questions:

- are the sections strong enough?
- are the items specific enough?
- are the initiative phrases actually useful?
- does the pool feel like a coherent source system?

### 3. Territory Quality

Questions:

- does the Territory improve iteration?
- does it focus the Builder in a useful way?
- do the selected sections feel like the right subset?

### 4. Builder Guidance Quality

Questions:

- does the current Builder sequence feel natural for this workflow?
- do suggestions help?
- does `Next` help or fight the workflow?

### 5. Medium-Specific Friction

Questions:

- is the problem really about orientation?
- or is the friction actually about pixel-art-specific representation?
- would the issue be better solved through better pool structure or medium-aware additions rather than a new Mode?

## Interpretation Rules

This is important.

Do not conclude `new mode needed` just because the workflow feels awkward once.

Use these distinctions:

### If it works well

Conclusion:

- no new Mode needed

### If it works, but awkwardly

Conclusion:

- probably improve Pools, Territory composition, or Builder guidance first

### If it fails structurally even under strong setup

Conclusion:

- a deeper workflow gap may exist
- only then discuss whether a new Mode is justified

## Most Likely Current Hypothesis

My current expectation is:

- this workflow is more likely to reveal medium-specific or pool-structure friction than a true missing Mode

That is exactly why this is a good test.

## Provisional Success Standard

This test should count as a success for the current system if:

- `Character-First` or `Balanced` can support multiple useful variations
- the Territory improves focus without breaking coherence
- the pool initiative/default behavior helps establish a useful baseline
- no repeated structural failure points toward a missing orientation

## Provisional Failure Standard

This test should count as a genuine warning sign only if:

- the workflow repeatedly fights current mode logic
- Territory + Pool support are strong but still insufficient
- the failure appears to be orientation-level rather than content-level

## Recommended Next Step After Running This Test

After running it, document the result in one of three ways:

1. `Current system sufficient`
2. `Current system sufficient but needs refinement`
3. `Current system reveals a real expansion case`

That result should then guide whether Modes are left alone, refined, or reconsidered.
