# MorpBase V2 Behavior Safety-Net Planning

Result:
- the first safety-net layer should be intentionally small

What should be protected first:
- transition builders
- reading / derivation helpers
- persistence behavior at a light level

Why these come first:
- they are already the clearest logic modules
- they hold important product meaning
- they can be tested without dragging the whole UI into the first safety-net phase

What should not come first:
- full UI interaction testing
- large browser automation
- broad snapshot coverage

Those can come later, but they are not the healthiest first move.

Best first tooling move:
- add a lightweight unit-test tool
- use it first on pure modules before touching app-level smoke coverage

Strongest first test scope:
- `morpbaseTransitions.ts`
- `morpbaseReadings.ts`
- selected pure normalization / fallback behavior from `morpbaseModel.ts` and `morpbasePersistence.ts`

Suggested first sequence:
1. add a lightweight test runner
2. write pure tests for transitions
3. write pure tests for readings
4. add one very small persistence check
5. only then decide whether a UI smoke layer is needed

Planning conclusion:
- the next healthiest move is not “more refactoring”
- it is `lightweight test-tool adoption for pure module coverage`
