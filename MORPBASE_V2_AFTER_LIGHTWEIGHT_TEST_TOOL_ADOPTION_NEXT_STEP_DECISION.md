# MorpBase V2 After Lightweight Test-Tool Adoption Next Step Decision

Next move:
- `persistence and normalization test pass`

Why:
- the first pure-engine tests now exist
- the next strongest low-risk protection target is the fallback / normalization layer
- this still stays in the pure-module zone before any UI smoke coverage

What should be tested next:
- persisted-state fallback shape
- normalization helpers in `morpbaseModel.ts`
- selective `readPersistedState()` behavior

What should wait:
- UI interaction tests
- browser automation
- broad smoke coverage
