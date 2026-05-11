# MorpBase V2 Realm View Boundary Extraction Planning Brief

Goal:
- begin the next hardening phase by extracting whole realm views instead of more tiny fragments

Guardrails:
- keep product behavior unchanged
- keep state ownership in `App.tsx` for now
- pass data and handlers into extracted realm views through explicit props
- avoid turning this into an architecture rewrite

Recommended order:
1. `Continuity` view
2. `Memory` or `Community` after re-check
3. `Workspace` last

Why this order:
- the support realms are safer to split first
- `Workspace` remains the strongest center and the most sensitive surface
- extracting the center too early would carry more risk than value

Success condition for the first extraction:
- `App.tsx` loses one full realm render block
- the extracted view remains readable
- behavior, styling, and product meaning stay the same
