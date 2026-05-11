# MorpBase V2 Memory View Boundary Extraction Prompt

Continue the realm view boundary extraction phase with the next safest support realm.

Focus on:
- moving the full `Memory` realm view out of `App.tsx`
- keeping state ownership and handlers in `App.tsx`
- passing explicit props into the extracted view
- preserving product behavior, styling, wording, and flow

Success condition:
- one more full realm render block leaves `App.tsx`
- the extracted view stays readable
- the support-realm extraction pattern remains disciplined
