# MorpBase V2 Community View Boundary Extraction Prompt

Continue the realm view boundary extraction phase with the heaviest remaining support realm.

Focus on:
- moving the full `Community` realm view out of `App.tsx`
- keeping state ownership and handlers in `App.tsx`
- passing explicit props into the extracted view
- preserving product behavior, styling, wording, and branching public logic

Success condition:
- the full `Community` render block leaves `App.tsx`
- the extracted view stays readable despite its branching
- the support-realm boundary pattern remains disciplined
