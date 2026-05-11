# MorpBase V2 Controller Action-Cluster Checkpoint Prompt

Goal:
- re-assess the remaining action-handler layer inside `App.tsx`

What to inspect:
- whether the handlers still read clearly enough in one place
- whether the remaining density comes from control flow or from object construction inside handlers
- whether there is one safer next extraction than moving full handler families out

Guardrails:
- do not split handlers just to reduce line count
- prefer extracting pure, lower-risk logic before moving behavior-rich controller flow
- keep the app shell understandable

Decision output:
- whether the action layer currently passes
- what the next safest hardening move is
