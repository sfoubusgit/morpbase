# MorpBase V2 Minimal Core-Loop Smoke Planning Brief

Goal:
- define the smallest useful app-level smoke coverage for the current V2 baseline

Best first path:
- `Workspace -> Keep -> Memory`

What that smoke should prove:
- the app renders
- a line can be shaped enough to keep
- the keep action moves value into `Memory`
- the resulting object becomes visible as a return point

Guardrails:
- keep the first smoke layer very small
- do not jump into full interaction coverage
- do not add a heavy browser stack unless the value is clear
