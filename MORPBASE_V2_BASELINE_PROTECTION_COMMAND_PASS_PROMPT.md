# MorpBase V2 Baseline Protection Command Pass Prompt

Goal:
- create one simple command that runs the current protected baseline checks together

Target:
- project scripts in `package.json`

What the command should cover:
- tests
- build

Why this matters:
- the safety net is now real enough that it should become easy to run as one habit
- the command should protect the current V2 baseline without adding heavy tooling

Guardrails:
- keep it simple
- do not add CI or workflow complexity in this step
- reuse the checks that already exist and already pass

Success condition:
- one command can run the current baseline protection layer end-to-end
