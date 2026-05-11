# MorpBase V2 After Behavior Safety-Net Planning Next Step Decision

Next move:
- `lightweight test-tool adoption`

Why:
- the codebase is now structured enough to test
- there is no test stack yet
- the highest-value first protection sits in the pure modules, not the UI

What should happen next:
- add a lightweight test runner
- start with:
  - `morpbaseTransitions.ts`
  - `morpbaseReadings.ts`
- keep the first test scope narrow and useful

What should wait:
- app-level interaction testing
- browser automation
- visual regression tooling
