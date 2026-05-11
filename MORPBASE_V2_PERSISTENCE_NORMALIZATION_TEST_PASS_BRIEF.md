# MorpBase V2 Persistence And Normalization Test Pass Brief

Goal:
- extend the safety net to the fallback / normalization layer

Targets:
- `morpbaseModel.ts`
- `morpbasePersistence.ts`

Best first checks:
- fallback state is structurally complete
- malformed persisted values normalize safely
- invalid selected ids collapse to safe defaults
- unsupported realm / lens states resolve safely

Why this is the right next move:
- it protects the app from bad local state
- it keeps the test scope light and high-value
- it still avoids premature UI testing
