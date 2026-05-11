# MorpBase V2 After Realm Boundary Checkpoint Next Step Decision

Next move:
- `Workspace view boundary extraction planning`

Why:
- the support realms are already out
- `Workspace` is now the only major inline realm surface left
- extracting its view layer will make `App.tsx` read more clearly as the app shell and orchestration center

What this is:
- a final safe realm-boundary pass

What this is not:
- not a change to product hierarchy
- not a redistribution of state ownership
- not a logic refactor disguised as cleanup

Rule for the next step:
- move the `Workspace` render surface out
- keep state, effects, persistence, and cross-realm handlers in `App.tsx`
