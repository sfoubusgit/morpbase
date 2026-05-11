# MorpBase V2 Slice 1 Object Model Planning Prompt

Use this prompt after the Slice 1 build brief, screen map, and interaction map are complete.

Your job is to define the minimum real product objects needed for Slice 1 of the new V2 project.

## Core Goal

Turn the Slice 1 loop into a small, clear object model that is:

- strong enough to support the real `Workspace -> Keep -> Memory -> return` loop
- small enough to avoid early complexity
- product-real instead of technical for its own sake

## Required Inputs

Read these first:

- `MORPBASE_V2_SLICE_1_BUILD_BRIEF.md`
- `MORPBASE_V2_SLICE_1_SCREEN_MAP.md`
- `MORPBASE_V2_SLICE_1_INTERACTION_MAP.md`
- `MORPBASE_V2_PRODUCT_BLUEPRINT.md`
- `MORPBASE_V2_IMAGE_ROLE_ANALYSIS.md`

## Main Questions

Answer these directly:

1. What are the minimum real product objects needed for Slice 1?
2. Which of those are first-class objects and which are only derived states?
3. What must each object carry in plain product terms?
4. What object relationships are necessary for the Slice 1 return loop?
5. What should explicitly not become a first-class object yet?

## Required Output

Write one concise planning document that includes:

- executive conclusion
- minimum object list
- first-class vs derived distinction
- what each object must carry
- core relationships
- explicit non-objects / deferred objects
- main risks
- final next-step recommendation

Save the result as:

- `MORPBASE_V2_SLICE_1_OBJECT_MODEL_PLANNING.md`

## Important Rules

- Keep the object model as small as possible without becoming fake.
- Do not smuggle in `Community` or `Continuity` objects.
- Do not resurrect V1-style object sprawl.
- Keep images as proof attachments, not the central object.
- Make the result easy to understand in product terms, not schema jargon.
