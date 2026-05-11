# MorpBase V2 Persistence And Normalization Test Pass Prompt

Goal:
- extend the first test layer to the fallback and normalization behavior

What to add:
- tests for `morpbaseModel.ts`
- tests for `morpbasePersistence.ts`

What to protect:
- safe draft normalization
- safe origin normalization
- safe public object normalization
- persisted-state fallback behavior
- invalid selected ids collapsing to safe defaults
- unsupported realm / lens states resolving safely

Guardrails:
- stay in the pure-module zone
- avoid UI testing in this step
- protect bad local-state handling first

Success condition:
- fallback / normalization behavior is covered by real tests
- the small safety-net layer becomes meaningfully stronger
