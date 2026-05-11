# MorpBase V2 Persistence And Bootstrap Extraction Prompt

Extract the persistence and bootstrap layer out of the main app file.

This step should move:

- fallback bootstrap state
- persisted-state recovery
- local-storage read logic
- local-storage write logic

Do not change product behavior.

Do not add product features.

Do not redesign anything.

The point is to make the current V2 baseline easier to protect and easier to extend carefully.
