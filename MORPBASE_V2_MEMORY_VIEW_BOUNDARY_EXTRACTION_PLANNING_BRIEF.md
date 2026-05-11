# MorpBase V2 Memory View Boundary Extraction Planning Brief

Goal:
- extract the `Memory` realm into its own view component next

Guardrails:
- keep state ownership in `App.tsx`
- keep handlers in `App.tsx`
- pass selected objects, derived readings, and handler callbacks through explicit props
- do not redesign `Memory`

Why `Memory` next:
- it is still a support realm, not the center
- it is less publicly branched than `Community`
- it removes more real UI weight from `App.tsx` while staying reasonably safe

Success condition:
- the full `Memory` render block leaves `App.tsx`
- the extracted view remains readable
- behavior and product meaning stay unchanged
