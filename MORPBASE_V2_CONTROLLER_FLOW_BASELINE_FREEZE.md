# MorpBase V2 Controller Flow Baseline Freeze

Frozen as healthy enough:
- realm-view boundaries
- controller guard-effects layer
- transition object-builder layer
- visible controller flow in `App.tsx`

What this means:
- do not keep extracting controller code by default
- treat the current shell/controller structure as the active baseline

What future changes should prefer:
- behavior protection
- validation
- tests or lightweight safety nets

What future changes should avoid:
- splitting the controller layer further just to reduce line count
- hiding obvious app behavior behind too many helper files
