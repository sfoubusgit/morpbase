# MorpBase V2 After Shell Controller Boundary Checkpoint Next Step Decision

Next move:
- `controller guard-effects extraction`

Why:
- the realm boundaries are already complete
- the remaining safe cleanup opportunity is the mechanical controller effect layer
- this gives a real readability gain without pushing product behavior into risky abstractions

What to move:
- persistence write effect
- selected-item maintenance effects
- lens / continuity / workspace-phase guard effects

What to keep in `App.tsx`:
- app-level state
- action handlers
- realm switching
- final shell rendering

Rule:
- keep this as a bounded controller support extraction
- do not turn it into a broad action-hook refactor yet
