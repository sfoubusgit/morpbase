# MorpBase V2 Return-Loop Smoke Pass Prompt

Goal:
- extend the first app-level smoke layer to cover the core return path back into `Workspace`

Target path:
- `Workspace -> Keep -> Memory -> Continue this line -> Workspace`

What to prove:
- a kept line can be reopened from `Memory`
- the app returns to the real `Workspace` surface
- the return path carries the right arrival reading
- the carried line remains recognizable when it comes back inward

Guardrails:
- keep this to one narrow extension of the first smoke path
- avoid broad multi-realm smoke coverage
- avoid browser automation
- avoid visual-detail assertions

Success condition:
- the core MorpBase loop is now protected both outward and inward
- the smoke layer is still small enough to stay disciplined
