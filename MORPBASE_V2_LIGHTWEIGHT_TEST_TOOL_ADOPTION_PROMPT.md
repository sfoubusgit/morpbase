# MorpBase V2 Lightweight Test-Tool Adoption Prompt

Goal:
- add the first real automated test layer to the V2 project

What to do:
- wire a lightweight test runner into the project
- keep the setup small
- start with pure-module coverage instead of UI testing

First targets:
- `morpbaseTransitions.ts`
- `morpbaseReadings.ts`

Guardrails:
- do not add a heavy browser stack yet
- do not try to test the whole app at once
- protect the core engine first

Success condition:
- the project can run tests locally
- the first meaningful pure-module tests pass
- the test layer becomes part of the active baseline
