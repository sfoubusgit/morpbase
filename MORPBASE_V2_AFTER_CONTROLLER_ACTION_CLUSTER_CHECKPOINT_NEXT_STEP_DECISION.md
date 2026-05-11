# MorpBase V2 After Controller Action-Cluster Checkpoint Next Step Decision

Next move:
- `transition object-builder extraction`

Why:
- the handlers still form understandable action families
- the main remaining weight is the inline object construction inside those handlers
- extracting the pure builders will reduce noise without hiding controller flow

What to extract:
- draft -> kept-work builder
- kept-work -> reusable-asset builder
- reusable-asset -> public reusable-asset builder
- kept-work -> public workflow-result builder
- public result -> inward kept-work builder

What to keep in `App.tsx`:
- action flow
- state setter orchestration
- realm switching
- handoff and bridge messages
