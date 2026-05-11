# MorpBase V2 After Threshold / Trace Bands Extraction Next Step Decision

Next move: compact support-card family extraction

Why:
- the next meaningful repetition is now in the small support-card layer
- `App.tsx` still repeats compact empty states and compact object-card wrappers
- this is another safe UI hardening split that should reduce noise without changing product behavior

What this likely includes:
- compact empty card
- creator-practice object card
- publishing object card shell

What it should not do:
- redesign support surfaces
- merge unlike cards just because they are both small
- move product decisions out of `App.tsx`
