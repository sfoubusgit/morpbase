# MorpBase V2 Controller Guard-Effects Extraction Planning Brief

Goal:
- extract the mechanical controller effect layer out of `App.tsx`

Candidate target:
- `src/morpbaseControllerEffects.ts`

Move out:
- persistence write effect helper
- selected reusable-asset maintenance effect helper
- community-lens guard helper
- selected public-asset maintenance effect helper
- selected continuity maintenance effect helper
- workspace-phase reset guard helper

Keep in `App.tsx`:
- the actual state values
- the actual setters
- action handlers
- final realm rendering and shell switching

Why this is the healthiest next move:
- it reduces scan noise in the shell/controller file
- it keeps behavior risk low
- it avoids prematurely extracting the much more sensitive action layer

Success condition:
- `App.tsx` becomes easier to scan
- behavior stays the same
- the next hardening decision can be made from a calmer shell/controller baseline
