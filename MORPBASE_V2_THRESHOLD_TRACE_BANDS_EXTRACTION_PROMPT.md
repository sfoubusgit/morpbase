# MorpBase V2 Threshold / Trace Bands Extraction Prompt

Re-assess the current UI hardening phase and judge the next safe presentational extraction inside the coded V2 app.

Focus on:
- repeated threshold-band markup
- repeated trace-band markup
- whether extracting them would remove real duplication or only shuffle code
- whether the resulting shared fragment family would stay product-faithful and low-risk

If the extraction is justified, describe:
- what should move out of `App.tsx`
- what should stay inline
- what the next likely safe extraction would be after this step

Success condition:
- `App.tsx` becomes simpler
- product behavior does not change
- the next move becomes clearer, not blurrier
