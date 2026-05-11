# MorpBase V2 App-Level Smoke Boundary Checkpoint Brief

Goal:
- judge whether the current app-level smoke layer is already sufficient for the current V2 baseline

Current protected app paths:
- `Workspace -> Keep -> Memory`
- `Workspace -> Keep -> Memory -> Continue this line -> Workspace`

What this checkpoint should decide:
- whether the smoke layer should freeze here for now
- whether one more narrow path would materially improve protection
- whether broader UI test growth would now be more risk than value

Guardrails:
- protect real product behavior
- avoid coverage growth for its own sake
- keep the test layer proportional to the current codebase and product phase
