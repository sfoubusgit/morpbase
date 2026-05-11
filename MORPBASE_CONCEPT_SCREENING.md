# MorpBase Concept Screening

## Purpose

This document compares the strongest remaining concept candidates for MorpBase.

The goal is not to pick the most interesting wording.

The goal is to identify which concept:

- matches the real product best
- is understandable fast enough
- differentiates MorpBase from wildcard / dynamic-prompt tools
- can be supported by the current app without a rebuild

## Finalists

The finalists are:

1. `Structured Prompt Workflow System`
2. `Creative Prompt Workspace`
3. `Workflow Spaces Built from Reusable Sources`

These were chosen because they survived the earlier broader filtering better than:

- `Prompt Builder`
- `Prompt Design System`
- `Territory-first` as a mandatory front-door concept

## Evaluation Criteria

Each finalist is judged against the same questions:

1. **Product truth**
Does it match what MorpBase actually is now?

2. **User pain alignment**
Does it point at a problem strong enough to matter?

3. **20-second clarity**
Could a new user understand the basic idea quickly?

4. **Differentiation**
Does it avoid collapsing into dynamic prompts, wildcard systems, prompt history tools, or prompt editors?

5. **Current-product fit**
Can the current app express this concept without a rebuild?

6. **Future headroom**
Can the concept still hold if Pools, Territories, Prompt Sets, and Identity systems expand?

## Candidate 1: Structured Prompt Workflow System

### Strengths

- It is the most truthful to the current app shape.
- It matches Builder + Prompt Preview + User Pools + Territories + Prompt Sets better than any softer alternative.
- It separates MorpBase from "prompt tricks" and points toward repeatable workflows.
- It leaves room for Territories, Prompt Sets, and Identity to grow without changing the product meaning again.

### Weaknesses

- It sounds more conceptual than friendly.
- If the wording is not softened, it can feel abstract or slightly heavy.
- Some users may still ask for a more concrete first action.

### Best reading

This is the strongest current core concept for MorpBase.

It is not the warmest wording, but it is the best match for what the product actually is becoming.

## Candidate 2: Creative Prompt Workspace

### Strengths

- It is softer and easier to like immediately.
- It fits Builder, Prompt Preview, and save/reuse reasonably well.
- It makes the product feel more approachable and less technical.

### Weaknesses

- It is too broad to be a strong differentiator.
- It does not clearly explain why MorpBase exists separately from prompt editors or prompt managers.
- It does not naturally explain the role of Pools and Territories.

### Best reading

This is a good wrapper or tone layer, but not a strong enough core concept on its own.

It helps with friendliness, but not enough with product meaning.

## Candidate 3: Workflow Spaces Built from Reusable Sources

### Strengths

- It is the most differentiated concept.
- It maps very closely to the strongest real distinction already present in the product:
  - Pools = reusable source material
  - Territories = focused workflow spaces built from that material
- It moves MorpBase furthest away from the wildcard / dynamic-prompt comparison.
- It creates strong headroom for future systems.

### Weaknesses

- The current app is not yet ready to support this as the only front-door concept.
- The user still has to understand more setup before the value fully lands.
- Without starter Territories or more guided defaults, this concept risks sounding stronger than the first-use flow actually feels.

### Best reading

This is the strongest long-term differentiated concept, but not the best immediate standalone front-door concept for the current product state.

## Comparison Summary

### Most truthful right now

- `Structured Prompt Workflow System`

### Friendliest wording

- `Creative Prompt Workspace`

### Most differentiated long-term

- `Workflow Spaces Built from Reusable Sources`

### Best fit for the current codebase and UI reality

- `Structured Prompt Workflow System`

## Main Insight

MorpBase probably should not rely on one single phrase to do all the work.

The strongest direction is a layered one:

1. **Core concept**
- MorpBase is a `structured prompt workflow system`

2. **First-use story**
- It helps you build prompts inside more organized workflow spaces instead of rebuilding prompt logic from scratch

3. **Internal system truth**
- Pools provide reusable source material
- Territories turn selected Pool material into focused workflow spaces

This keeps the product truthful without forcing the user to learn every noun immediately.

## Final Recommendation

The best current direction is:

- use `Structured Prompt Workflow System` as the underlying product concept
- support it with friendlier workflow-space language in the first-use story
- treat `Workflow Spaces Built from Reusable Sources` as the long-term strategic expression of the product

That means:

- do **not** reduce MorpBase to `Prompt Builder`
- do **not** make `Creative Prompt Workspace` the full product concept
- do **not** make custom Territory creation the required front door yet
- do move the product meaning toward workflow spaces, reuse, and focused workflows

## What This Means Practically

### Short term

- explain MorpBase more as a workflow system than as a prompt-parts tool
- de-emphasize generic "reusable pieces" language
- keep Territory optional but meaningful

### Medium term

- make workflow-space language more visible in Builder and landing surfaces
- make Territory the recommended path, not the mandatory path
- make Pools feel more like source libraries than user-facing application targets

### Longer term

- if MorpBase gets good starter Territories or official workflow-space presets, then a stronger Territory-led entry flow becomes much more realistic

## One-Line Verdict

The winning concept for the current stage of MorpBase is:

- **structured prompt workflows now**
- **workflow spaces as the stronger long-term expression**
