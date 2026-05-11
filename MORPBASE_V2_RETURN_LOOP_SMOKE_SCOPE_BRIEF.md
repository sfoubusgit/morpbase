# MorpBase V2 Return-Loop Smoke Scope Brief

Goal:
- define the next smallest useful app-level smoke extension after the first keep crossing

Best next path:
- `Workspace -> Keep -> Memory -> Continue this line -> Workspace`

What that smoke should prove:
- the kept line can be reopened from `Memory`
- the app returns to `Workspace`
- the return path carries the right origin reading
- the line stays recognizable when it comes back inward

Guardrails:
- keep the next smoke path narrow
- do not jump into multi-realm smoke coverage
- do not add a heavy browser stack unless the value becomes clear
