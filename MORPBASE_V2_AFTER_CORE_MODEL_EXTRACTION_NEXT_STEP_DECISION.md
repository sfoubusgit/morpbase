# MorpBase V2 After Core Model Extraction Next Step Decision

## Result

The first hardening split held cleanly.

## Next Move

Keep hardening through another safe extraction, not feature growth.

## Best Next Extraction

Move the pure reading and derivation helpers out of the main app file next.

That includes things like:

- prompt-building logic
- summary-building logic
- carried-reading logic
- other pure object-reading helpers

## Why This Is The Right Next Step

The app is still heavily concentrated, but the current baseline should only be split through safe, low-risk moves.

This keeps the product:

- stable
- readable
- and easier to protect
