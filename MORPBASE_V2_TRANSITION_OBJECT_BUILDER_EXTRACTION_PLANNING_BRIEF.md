# MorpBase V2 Transition Object-Builder Extraction Planning Brief

Goal:
- extract the pure object-construction layer out of the action handlers

Candidate target:
- `src/morpbaseTransitions.ts`

Builders to move:
- create kept work from current draft
- create reusable asset from kept work
- create public reusable asset from reusable asset
- create public workflow result from kept work
- create inward kept work from public workflow result and mode

Keep in `App.tsx`:
- action ordering
- setter calls
- selected-item updates
- handoff and bridge messaging
- realm switching

Why this is the right next move:
- it removes dense inline construction blocks
- it keeps controller behavior readable
- it is safer than extracting whole action families too early
