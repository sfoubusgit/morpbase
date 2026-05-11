# MorpBase V2 Slice 1 Build-Sequencing Prompt

Use this prompt after the Slice 1 build brief, screen map, interaction map, object model, and design translation are complete.

Your job is to decide the smartest order to build Slice 1 of the new V2 project.

## Core Goal

Define a build order that:

- proves the Slice 1 core loop early
- keeps risk low
- avoids generic or scaffold-like outcomes
- and prevents the first V2 slice from drifting into V1-style complexity

## Required Inputs

Read these first:

- `MORPBASE_V2_SLICE_1_BUILD_BRIEF.md`
- `MORPBASE_V2_SLICE_1_SCREEN_MAP.md`
- `MORPBASE_V2_SLICE_1_INTERACTION_MAP.md`
- `MORPBASE_V2_SLICE_1_OBJECT_MODEL_PLANNING.md`
- `MORPBASE_V2_SLICE_1_DESIGN_TRANSLATION_BRIEF.md`
- `MORPBASE_V2_IMPLEMENTATION_PLANNING_PREPARATION.md`

## Main Questions

Answer these directly:

1. What should be built first, second, third, and so on inside Slice 1?
2. What is the earliest point where the slice begins to feel real?
3. What should be delayed until later in the sequence even if it is important?
4. What are the biggest sequencing mistakes to avoid?

## Required Output

Write one concise build-sequencing document that includes:

- executive conclusion
- ordered build phases
- what each phase proves
- what should be delayed
- sequencing risks
- final next-step recommendation

Save the result as:

- `MORPBASE_V2_SLICE_1_BUILD_SEQUENCING_PLAN.md`

## Important Rules

- Keep the build order centered on the core return loop.
- Do not lead with broad polish or late-stage systems.
- Do not let shell presence overshadow the product center.
- Keep the plan practical enough to guide the next implementation-planning artifact.
