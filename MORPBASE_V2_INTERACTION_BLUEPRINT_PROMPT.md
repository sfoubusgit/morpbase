# MorpBase V2 Interaction Blueprint Prompt

You are analyzing **MorpBase V2** as a **completely new rebuilt product in a new project folder**, not as a refinement of V1.

Your task is to create the **Interaction Blueprint** for V2 first-wave.

This phase comes **after** the foundation freeze and the product blueprint.

It is no longer the time to define broad product structure.
It is now the time to define **how the blueprinted product actually behaves**.

## Core Context

The governing documents now are:

- `MORPBASE_V2_FOUNDATION_FREEZE.md`
- `MORPBASE_V2_PRODUCT_BLUEPRINT.md`

You must treat those as constraints.

The blueprint is already strong enough on:

- major screen families
- cross-product object flow
- top-level vs contextual access
- primary realm transitions

Your task now is to define:

- how the user interacts with the product
- how major transitions behave
- how screen families hand off to each other
- how first-use guidance behaves
- and how the product stays coherent through interaction, not just structure

## What The Interaction Blueprint Must Cover

At minimum, it must cover:

### 1. Workspace behavior

- first-use guided layer behavior
- workflow progression behavior
- Prompt Preview behavior
- keep/save behavior
- contextual support entry behavior

### 2. Memory behavior

- keep/branch/reopen/use behavior
- capture inbox behavior
- publish-from-memory behavior
- imported-object behavior

### 3. Continuity behavior

- continuity entity browsing/selecting behavior
- activation into Workspace
- viewing continuity through work/appearances

### 4. Community behavior

- discover scanning/opening behavior
- creator exploration behavior
- publishing behavior
- import behavior

### 5. Shell behavior

- active-state emphasis
- realm switching behavior
- primary vs secondary transition feel
- how the shell stays calm while supporting product depth

## Critical Constraints

- Treat V2 as a **fresh rebuild**
- Obey the foundation freeze and product blueprint
- Do **not** reopen major structure questions unless they clearly fail under interaction pressure
- Do **not** drift into implementation details
- Do **not** reduce interaction design to “click this then that”
- Do **not** jump into visual design language yet
- Do **not** let interaction behavior reintroduce equal-center drift

## Method

### 1. Start with real-life interaction journeys first

Write at least 5 realistic behavior-level journeys such as:

- new user starts the first workspace flow and reaches a keep-worthy result
- returning user branches saved work into a new live session
- user imports a public reusable asset into Memory and then uses it in Workspace
- continuity-aware user activates a recurring entity into live work
- creator publishes from Memory and sees how Community behavior completes the loop

For each journey, explain what interaction rules and behaviors it demands.

### 2. Re-state the product blueprint in interaction terms

Summarize the blueprint as a behavior problem.

### 3. Define interaction behavior by major screen family

For each major screen family, define:

- user intention
- dominant actions
- state transitions
- contextual reveals
- key feedback loops

### 4. Define cross-product transition behavior

Explain how the strongest transitions should feel and behave, especially:

- Workspace -> Memory
- Memory -> Workspace
- Memory -> Community
- Community -> Memory
- Continuity -> Workspace

### 5. Define interaction guardrails

Look for risks such as:

- too much friction
- hidden product movement
- over-management
- mode confusion
- support systems interrupting the center

### 6. End with a readiness judgment

State whether the interaction blueprint is strong enough to move into:

- terminology/micro-language freeze
- design-universe preparation
- or experience prototyping

## Output Requirements

Write the result as:

`MORPBASE_V2_INTERACTION_BLUEPRINT.md`

Structure it with:

1. Executive Conclusion
2. Real-Life Interaction Journeys
3. Product Blueprint Restated As Interaction Problem
4. Interaction Behavior By Screen Family
5. Cross-Product Transition Behavior
6. Interaction Guardrails
7. Remaining Interaction Risks
8. Readiness For Next Phase
9. Final Judgment

The result should be decisive, interaction-structural, and strong enough to guide later UX/design work without drifting into code.
