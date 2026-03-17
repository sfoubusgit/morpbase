# Mode Elasticity Test

## Purpose

The Mode Elasticity Test is a practical way to evaluate whether MorpBase needs an additional Builder Workflow Mode.

Instead of inventing new modes abstractly, this test asks a stricter question:

Can a highly specific image-making workflow already be supported by the existing system through:

- current Builder Workflow Modes
- focused Pools
- a well-composed Territory
- normal Builder iteration

If yes, a new mode is probably not needed.

If no, we examine what actually failed before deciding that a new mode is warranted.

## Core Principle

A new mode should be earned by the failure of the current system under good conditions.

That means we do not ask:

- "Can we imagine a new label for this kind of image?"

We ask:

- "When the supporting material is strong, does the current system still fail to support this workflow cleanly?"

This protects MorpBase from adding unnecessary modes for problems that are really caused by:

- weak Pools
- weak Territory composition
- poor section structure
- poor section-to-Builder mapping
- medium/style-specific friction
- ordinary Builder UX issues

## What This Test Is For

Use this test when we want to evaluate whether a very specific workflow deserves:

- a new Builder Workflow Mode
- a refinement to an existing mode
- no mode change at all

Example workflow candidates:

- pixel art portrait
- cinematic mech showcase
- top-down strategy map scene
- icon design object study
- manga dialogue close-up

## Test Structure

The test has five stages.

### 1. Choose A Specific Target Workflow

Select a narrow but realistic image-making target.

The target should be specific enough that we can judge whether the system supports it well.

Example:

- `pixel art portrait`

This is better than something broad like:

- `pixel art`

because it gives us a clearer workflow to evaluate.

### 2. Build Strong Supporting Material

Create enough support so the test is fair.

That usually means:

- at least one focused Pool
- sectioned items that reflect the workflow well
- a Territory composed from those sections

The point is to avoid false failure caused by weak setup.

We should be testing the mode system, not starving it of material.

### 3. Test With Existing Modes

Run the workflow using the current mode set.

At minimum, test:

- `Balanced`
- the most likely fitting existing mode

For example, `pixel art portrait` would probably first be tested in:

- `Character-First`
- maybe `Balanced`

If relevant, also compare against:

- `Environment-First`
- `Scene-First`

### 4. Try To Iterate Real Outputs

Do not judge based on one pass.

The test should involve actual iteration:

- initial build
- refinement passes
- multiple variations of the same target workflow
- switching between Builder areas as needed

The question is not only:

- "Can it produce one result?"

The question is:

- "Can it support repeated, coherent iteration of this workflow?"

### 5. Diagnose The Failure Correctly

If the workflow struggles, do not immediately conclude that a new mode is needed.

First ask what type of failure happened.

## Possible Outcomes

### Outcome A: Works Well

If the workflow can be iterated successfully with the existing system, then:

- no new mode is needed

The workflow is already supported by:

- existing mode orientation
- Pools
- Territory composition
- Builder structure

This is a successful elasticity result.

It means the current mode system is elastic enough to absorb this workflow.

### Outcome B: Works, But Awkwardly

If the workflow is possible but feels clumsy, then the likely issue is not a new mode yet.

Possible causes:

- existing mode guidance needs refinement
- Territory mapping needs improvement
- section design is weak
- suggestions are poor
- Builder sequencing needs tuning

This usually suggests:

- improve the current system first

not:

- create a new mode immediately

### Outcome C: Fails Structurally

If the workflow consistently fights the current system even when:

- Pools are strong
- sections are well-designed
- Territory composition is good
- the likely existing modes were tested honestly

then a new mode may be justified.

But even here, we still need to ask whether the problem is truly about orientation.

## Failure Diagnosis Categories

When the test fails, classify the failure before proposing a new mode.

### 1. Orientation Failure

The workflow needs a genuinely different build priority than the current modes provide.

This is the strongest case for a new mode.

### 2. Territory Failure

The workflow could probably work, but the Territory composition or section mapping is not strong enough.

This does not justify a new mode yet.

### 3. Pool Failure

The source material is too weak, too shallow, or too badly structured.

This does not justify a new mode.

### 4. Builder UX Failure

The mode is conceptually correct, but the Builder flow, suggestion logic, or navigation makes the workflow awkward.

This usually suggests product refinement, not a new mode.

### 5. Medium / Representation Failure

The workflow may depend on a medium-specific or format-specific logic that is not really about orientation.

Examples:

- pixel art
- icons
- UI mockups
- map design

This may suggest a future system layer, but not necessarily a new Builder Workflow Mode.

## Decision Rule

A new mode should only be proposed after all of the following are true:

1. the target workflow was specific and realistic
2. the Pools were strong enough
3. the Territory was well-composed
4. existing modes were tested honestly
5. the workflow still failed in a way that points to missing orientation logic

If those conditions are not met, the result should not be used as evidence for a new mode.

## Recommended Test Record

When running a Mode Elasticity Test, capture:

- target workflow
- Pools used
- Territory used
- modes tested
- what worked
- what felt awkward
- what failed
- likely failure category
- final conclusion

## Example

### Candidate

- `pixel art portrait`

### Setup

- create Pools for pixel-art-specific portrait support
- organize items into useful shared sections
- create a Territory from those sections

### Test

- test in `Character-First`
- compare with `Balanced`
- try several iterations of the same target style

### Interpretation

If this works well:

- `pixel art portrait` does not justify a new mode

If this works badly:

- determine whether the problem is actually:
  - missing orientation
  - weak Territory structure
  - weak source material
  - medium-specific friction

## Final Principle

The Mode Elasticity Test exists to protect MorpBase from premature mode expansion.

It ensures that new modes are introduced only when the existing system cannot honestly support a workflow even under strong conditions.

In short:

- test the elasticity of the current system first
- expand the mode system only when that elasticity genuinely breaks
