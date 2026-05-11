# MorpBase V2 After UI Fragment Layer Checkpoint Next Step Decision

Next move: realm view boundary extraction planning

Why:
- `App.tsx` is still structurally heavy because it owns:
  - `renderWorkspace`
  - `renderMemory`
  - `renderCommunity`
  - `renderContinuity`
- that is now the real remaining boundary problem
- another round of small UI fragments would bring diminishing returns

Healthiest direction:
- keep state ownership in `App.tsx` for now
- move one whole realm view at a time into dedicated view components
- start with the lightest safe realm first, not the core center

Recommended first candidate:
- `Continuity`

Why `Continuity` first:
- it is the smallest and most self-contained support realm
- it is less coupled to first-use center behavior than `Workspace`
- it is safer than starting with `Community`, which still holds more public-state branching
