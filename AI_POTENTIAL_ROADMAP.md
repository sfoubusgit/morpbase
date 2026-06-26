# MorpBase — AI Potential Roadmap (Analysis Kickoff)

## Purpose

Decide where AI adds the most value across MorpBase — not just whether to build a
"synthesizer," but the full opportunity space. This document is the **starting
frame for that analysis**, not the conclusion. Each workstream below is a set of
questions ("prompts") to investigate, plus the signals we already have to answer
them.

Output of the analysis (what we want to end with):
- a prioritized list of AI capabilities, each scored on value vs. cost/effort/risk
- a recommended build sequence
- a clear position on the cross-cutting decisions (rules vs. LLM, where inference
  runs, who pays, how we measure "better")

## What we already know going in

- **Validated:** coherent, synthesized prompts produce noticeably better images
  than the raw concatenation the Workspace currently outputs (confirmed across
  many manual test batches). This is the single strongest AI signal we have.
- **Known gap:** identities store rich *prose*, but Illustrious-class models want
  *booru tags*. There is a translation problem sitting between our data and the
  target models.
- **Asset:** the lane stores (character, environment, style, lighting, mood,
  wardrobe, object, world/aura, negative), universes, and lane sets are a large,
  structured, reusable component library — good raw material for AI.
- **Asset:** captured sets + saved prompts are an accumulating record of what
  users actually keep. This is potential evaluation/training signal — treat it as
  precious.

## Product surface (where AI could touch)

| Area | Today | AI angle |
|------|-------|----------|
| Workspace builder | manual lane selection, roll/pin, concatenated output | assembly, coherence, conflict resolution, variation |
| Memory | saved prompts, prompt sets, captured sets | ranking, dedup, semantic search, "more like this" |
| Lexicon / Identities | hand-authored identities & phrases | authoring assist, prose↔tag, enrichment |
| Universes | hand-built (e.g. Neon Yokai) | generate a full universe from a theme |
| Auras / Pools | user-defined phrase collections | suggestion, gap-filling |
| Community | wall, profiles, discovery, DMs | tagging, recommendation, moderation |
| Onboarding | static flow | conversational "build with me" guide |

## Evaluation framework

Score every candidate capability on:

1. **User value** — does it solve a real, felt pain?
2. **Quality lift** — measurable improvement in the output (image quality, time saved)
3. **Effort** — build cost
4. **Inference cost** — per-use $ if it calls a model
5. **Latency** — does it fit the interaction (inline vs. on-demand)?
6. **Failure tolerance** — how bad is a wrong answer here?
7. **Data availability** — do we have signal to do it well / evaluate it?
8. **Differentiation** — does it make MorpBase distinct, or is it table stakes?

## Workstreams (the analysis prompts)

### WS1 — Prompt assembly & coherence (the synthesizer)
- What exactly does "coherent" mean operationally? Catalogue the transforms
  (merge duplicate subjects, one setting, one outfit per subject, pin-aware
  ordering, fold vs. drop incompatibles, section ordering).
- Which transforms are deterministic (rules) vs. require judgment (LLM)?
- Can rules get us 80%? Where do they visibly fail?
- Probe: run N real user selections through a rule pass and an LLM pass; compare.

### WS2 — Prose ↔ tag translation & model targeting
- Should identities carry both a prose form and a tag form, or translate on the fly?
- Per-target rendering: Illustrious (booru tags) vs. natural-language models — same
  identity, different output grammar.
- Probe: translate 10 existing identities to booru tags; eyeball image results.

### WS3 — Identity & universe authoring assist
- Generate a full identity (visual anchors, phrase bundle, tags) from a one-line brief.
- Generate a whole universe (cast + environments + styles + …) from a theme — automate
  what was done by hand for Neon Yokai.
- Where does the human stay in the loop (review/edit before save)?

### WS4 — Exploration & variation
- Given a built scene, propose variations (relationship beat, setting, style) — exactly
  the test batches done manually in chat.
- One-click "give me 8 variations" → becomes a capture set.

### WS5 — Curation, ranking & the quality feedback loop
- Use captured/saved sets as the signal: what do users keep?
- Can we rank or pre-filter generated prompts before the user even renders?
- What lightweight feedback (kept / discarded / rendered) should we capture to learn?

### WS6 — Discovery & semantic search
- Semantic search over the library, identities, and community (not just keyword/tag).
- "Find identities/sets like this one."

### WS7 — Onboarding & in-app guidance
- A conversational "build with me" that drives the lanes for a new user.
- How much does this lower the first-prompt barrier?

### WS8 — Community intelligence
- Auto-tagging posts, recommendations, surfacing, moderation assistance.
- Lower priority unless community is a current growth focus.

### WS9 — Vision / image-aware refinement (frontier)
- Feed the generated image back to a vision model to critique vs. the prompt and
  suggest refinements. Highest ceiling, highest cost/complexity — park as research.

## Cross-cutting decisions to settle

- **Rules vs. LLM vs. hybrid** per capability (default: rules where deterministic,
  LLM for judgment, hybrid as the norm).
- **Where inference runs** — client-side call vs. server proxy; which Claude model
  per task (Haiku for cheap/fast, Sonnet/Opus for judgment).
- **Cost model** — free baseline (rules) vs. AI features gated behind Pro?
- **Privacy** — what user data is sent to a model, and is that disclosed?
- **Measuring "better"** — define the eval before building. Captured sets + a small
  human-rated set are the obvious starting corpus.

## Suggested analysis sequence

- **Phase 0 — Instrument & gather signal.** Confirm what users actually do; treat
  captured/saved sets as the eval corpus. Cheap, unblocks everything.
- **Phase 1 — Closest to validated value:** WS1 (assembly) + WS2 (tag translation).
- **Phase 2 — Leverage the component library:** WS3 (authoring) + WS4 (variation).
- **Phase 3 — Reach & retention:** WS6 (search) + WS7 (onboarding).
- **Phase 4 — Frontier:** WS5 feedback loop maturity + WS9 vision.

## Immediate next probes (to actually start the analysis)

1. Pull a handful of real user lane-selections and run them through both a rule pass
   and an LLM pass; compare coherence and image results (answers WS1's rules-vs-LLM).
2. Translate ~10 existing identities prose→booru tags and render to confirm the WS2 lift.
3. Decide the eval method now: assemble a small judged set from captured sets so every
   later capability has something to be measured against.
4. Settle the two cross-cutting blockers that gate everything: where inference runs,
   and the cost/gating model.

## Out of scope for this AI analysis

- **Floating Global Phrase Layer** (see `FLOATING_GLOBAL_PHRASE_LAYER_CONCEPT.md`) —
  a UI/UX idea, not an AI capability. Track separately.
