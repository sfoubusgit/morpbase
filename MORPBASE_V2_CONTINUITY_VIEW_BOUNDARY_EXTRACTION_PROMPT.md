# MorpBase V2 Continuity View Boundary Extraction Prompt

Begin the realm view boundary extraction phase with the safest support realm first.

Focus on:
- moving the full `Continuity` realm view out of `App.tsx`
- keeping state ownership and handlers in `App.tsx`
- passing explicit props into the extracted view
- preserving product behavior, styling, and wording

Success condition:
- one full realm render block leaves `App.tsx`
- the extracted view stays readable and self-contained
- this proves the realm-boundary pattern without touching the center
