# MorpBase V2 Workspace View Boundary Extraction Prompt

Goal:
- extract the remaining inline `Workspace` surface into its own view

What to do:
- create `src/views/WorkspaceView.tsx`
- move the current `renderWorkspace()` surface into that view
- keep app-level state, effects, persistence, and cross-realm handlers in `App.tsx`
- wire `App.tsx` to render `WorkspaceView` through explicit props

Guardrails:
- do not change product behavior
- do not redistribute core app logic
- keep `Workspace` as the conceptual center even while moving its render surface out of the shell file

Success condition:
- all four realm surfaces now sit behind explicit view boundaries
- `App.tsx` reads more clearly as the shell/controller layer
- the center still feels unmistakably like the center
