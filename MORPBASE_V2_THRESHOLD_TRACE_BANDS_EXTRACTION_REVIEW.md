# MorpBase V2 Threshold / Trace Bands Extraction Review

Result: Pass

What changed:
- repeated threshold-band markup now lives in a shared `ThresholdBand` fragment
- repeated trace-band markup now lives in a shared `TraceBand` fragment
- `App.tsx` no longer owns the repeated bracket / path / node / trace-tail structures inline

Why this was the right split:
- the repetition was real and stable
- the extracted pieces are still purely presentational
- product behavior and wording stayed local where they should stay local

What improved:
- the support-surface layer is easier to read
- the symbolic family now has one shared coded wrapper in the UI layer
- future shell/support refinements can touch fewer places

Guardrail:
- this was a real hardening step, not a visual redesign
- the app behavior, hierarchy, and product reading remain unchanged
