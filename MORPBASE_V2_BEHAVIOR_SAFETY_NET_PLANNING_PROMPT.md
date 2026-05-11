# MorpBase V2 Behavior Safety-Net Planning Prompt

Goal:
- define the first practical behavior-protection layer for the current V2 baseline

What to inspect:
- which parts of the codebase are already good candidates for automated checks
- what the lightest useful testing/tooling step is
- what should be protected first before further product changes happen

Useful evidence:
- there is currently no test stack in `package.json`
- the codebase now has several pure or mostly pure modules:
  - `morpbaseTransitions.ts`
  - `morpbaseReadings.ts`
  - parts of `morpbaseModel.ts`
  - `morpbasePersistence.ts`
- the core app loop is now structurally stable enough to protect

Guardrails:
- keep the first safety-net layer light
- do not design a full QA system
- prefer protecting the core engine first

Decision output:
- what should be protected first
- what tooling should be added next
- what should wait until later
