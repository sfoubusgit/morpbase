# MorpBase V2 After Persistence And Bootstrap Extraction Next Step Decision

## Result

The persistence split held cleanly.

## Next Move

Keep hardening through the next safe shared layer:

- derived relationship and impact reading

## Best Next Extraction

Move the dense derived-selection and impact logic out of the main app file next.

That includes things like:

- selected object relationship lookups
- impact arrays
- engine snapshot / shell compass readings
- other pure view-model derivations

## Why This Is The Right Next Step

The app is now safer than before, but the main file still carries too much derived product-reading logic.

This next move would keep hardening V2 without changing the product itself.
