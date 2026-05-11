# MorpBase V2 Behavior Safety-Net Planning Brief

Goal:
- define the first practical protection layer for the current V2 baseline

Context:
- the codebase is now much cleaner structurally
- but there is still no actual automated behavior safety net

Questions to answer:
- which behaviors are most important to protect first
- which modules are already good candidates for direct tests
- whether the project should add a lightweight test tool next
- what the first validation scope should be

Likely first protection targets:
- persistence read/write behavior
- transition builders
- reading/derivation helpers
- a minimal smoke path through the core loop:
  - `Workspace -> Keep -> Memory`

Guardrails:
- keep the first safety-net layer light
- do not design a huge QA system
- protect the core engine first
