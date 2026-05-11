# MorpBase V2 Community View Boundary Extraction Planning Brief

Goal:
- extract the `Community` realm into its own view component next

Guardrails:
- keep state ownership in `App.tsx`
- keep handlers in `App.tsx`
- pass selected objects, derived public readings, and handler callbacks through explicit props
- do not redesign `Community`

Why `Community` next:
- it is now the remaining support realm with the most structural weight
- extracting it would leave `Workspace` as the final center realm still inline
- that keeps the hardening order healthy: support first, center last

What makes it more delicate than `Memory`:
- it has more branching public states
- it has publishing controls and public participation logic
- its prop boundary should be defined carefully before the move

Success condition:
- the full `Community` render block leaves `App.tsx`
- the extracted view remains readable
- behavior and product meaning stay unchanged
