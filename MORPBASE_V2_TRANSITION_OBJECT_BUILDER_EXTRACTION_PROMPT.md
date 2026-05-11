# MorpBase V2 Transition Object-Builder Extraction Prompt

Goal:
- move the dense object-construction blocks out of the controller handlers

What to move:
- draft -> kept-work builder
- kept-work -> reusable-asset builder
- reusable-asset -> public reusable-asset builder
- public reusable-asset -> inward reusable-asset builder
- kept-work -> public workflow-result builder
- public result -> inward kept-work builder

Target:
- `src/morpbaseTransitions.ts`

Guardrails:
- do not move action flow
- do not move realm switching
- do not move handoff / bridge messaging
- keep `App.tsx` as the visible controller layer

Success condition:
- the heavy construction blocks disappear from handlers
- the action flow stays easy to read
- behavior stays the same
