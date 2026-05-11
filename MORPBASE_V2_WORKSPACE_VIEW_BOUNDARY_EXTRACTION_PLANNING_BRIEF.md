# MorpBase V2 Workspace View Boundary Extraction Planning Brief

Goal:
- extract the `Workspace` render surface into its own view without changing behavior

Target:
- create `src/views/WorkspaceView.tsx`

Keep in `App.tsx`:
- all app-level state
- all effects and persistence wiring
- all draft mutation handlers
- all keep / return / cross-realm handlers
- shell-level realm switching

Move into `WorkspaceView`:
- the current `renderWorkspace()` surface
- the phase rail
- the four phase groups
- the preview panel
- the keep threshold panel

Boundary rule:
- `WorkspaceView` receives explicit props
- it should not own app-level state
- it should not derive cross-realm behavior on its own

Why this move is healthy:
- it completes the realm-view boundary chain
- it keeps the center conceptually dominant while making the codebase structurally clearer
- it turns `App.tsx` into the shell/controller layer instead of a mixed shell-plus-center-render file

Success condition:
- product behavior stays the same
- `Workspace` still feels like the unmistakable center
- `App.tsx` becomes easier to read after the extraction
