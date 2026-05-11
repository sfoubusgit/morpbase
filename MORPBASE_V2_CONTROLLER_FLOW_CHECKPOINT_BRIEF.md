# MorpBase V2 Controller Flow Checkpoint Brief

Goal:
- assess the remaining visible controller flow after the builder extraction

Questions:
- is the action flow now understandable enough in `App.tsx`
- do the remaining handlers still feel coherent as one app brain
- is there one safe next extraction, or should the current shell/controller baseline be frozen

What remains now:
- setter sequencing
- realm switching
- handoff and bridge messaging
- a few origin / continuation path decisions

Guardrails:
- prefer freezing a healthy baseline over over-refactoring
- only choose another extraction if it gives a real readability gain without hiding app behavior
