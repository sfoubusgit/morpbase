# MorpBase V2 Lightweight Test-Tool Adoption Brief

Goal:
- add the smallest useful automated test layer to the V2 project

Recommended tool shape:
- a lightweight TypeScript-friendly unit-test runner
- good fit for pure module testing
- should not force a heavy browser stack on day one

First test targets:
- `morpbaseTransitions.ts`
- `morpbaseReadings.ts`

Possible later targets:
- persistence behavior
- derivation helpers
- one minimal app smoke path

Guardrails:
- keep setup small
- do not start with broad UI testing
- prove value fast with a few meaningful tests first
