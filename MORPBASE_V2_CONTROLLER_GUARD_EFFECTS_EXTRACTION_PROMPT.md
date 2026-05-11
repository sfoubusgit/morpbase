# MorpBase V2 Controller Guard-Effects Extraction Prompt

Goal:
- move the mechanical controller effect layer out of `App.tsx`

What to move:
- persistence write effect
- selected reusable-asset maintenance effect
- community-lens guard effect
- selected public-asset maintenance effect
- selected continuity maintenance effect
- workspace-phase reset guard effect

Target:
- `src/morpbaseControllerEffects.ts`

Guardrails:
- do not change product behavior
- do not extract action handlers in this step
- keep `App.tsx` as the controller shell while reducing scan noise

Success condition:
- `App.tsx` becomes easier to scan
- the remaining weight is mostly action logic, not repetitive effect wiring
