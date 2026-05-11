# MorpBase V2 Compact Section Shell Extraction Prompt

Re-assess the current implementation-hardening phase and judge the next safe UI-shell extraction inside the coded V2 app.

Focus on:
- repeated compact section headings
- repeated empty-or-stack support layouts
- whether those patterns repeat enough to justify extraction
- whether the result would stay presentational and low-risk

If the extraction is justified, define:
- what should move into shared UI fragments
- what should stay local in `App.tsx`
- whether the next healthy move after this step is another extraction or a checkpoint

Success condition:
- `App.tsx` becomes easier to scan
- support-surface structure is clearer in code
- product distinctions stay intact
