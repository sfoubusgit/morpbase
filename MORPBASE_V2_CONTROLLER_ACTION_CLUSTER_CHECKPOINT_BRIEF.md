# MorpBase V2 Controller Action-Cluster Checkpoint Brief

Goal:
- assess the remaining action-handler layer inside `App.tsx`

Questions:
- are the handlers now understandable enough in one place
- do they form clear action families
- is there one safe extraction that would help without weakening the app shell

Likely families to inspect:
- workspace/memory return actions
- reusable-asset actions
- community publish/return actions
- continuity activation actions

Guardrails:
- prefer one clear next move over many small extractions
- protect behavior first
- do not split the controller layer just to satisfy symmetry
