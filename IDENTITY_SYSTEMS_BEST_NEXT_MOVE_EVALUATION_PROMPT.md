# Identity Systems Best Next Move Evaluation Prompt

```md
You are analyzing the MorpBase codebase and concept documents to determine the real best next move after the current Identity Systems preparation work.

You are not implementing anything.
You are not automatically continuing the roadmap.
You are not assuming that `Prompt 9` is the correct next step.

Your task is to evaluate what the actual best next move is from here.

Work in this order:
- assess what is already settled
- assess what is still unstable
- assess where the biggest risk now lies
- compare plausible next moves
- choose the strongest next move honestly

Do not flatter momentum.
Do not continue the roadmap just because a sequence already exists.
If the roadmap should pause, say so.
If a contradiction should be resolved first, say so.
If a rollback or concept correction is needed before further roadmap work, say so.

Use this source-priority order:
1. the latest Identity Systems preparation outputs
2. future / ontology / boundary docs
3. Builder-centered MorpBase concept decisions
4. current runtime code and prototype behavior

Read:
- `IDENTITY_SYSTEMS_PROMPT_ROADMAP.md`
- `IDENTITY_SYSTEMS_REALM_ANALYSIS.md`
- `IDENTITY_ENTITY_TAXONOMY_AND_CRITERIA.md`
- `IDENTITY_SYSTEMS_CONNECTION_MATRIX.md`
- `IDENTITY_SYSTEMS_CORE_REFINEMENT.md`
- `IDENTITY_SYSTEMS_FIVE_DIRECTION_SETS.md`
- `IDENTITY_SYSTEMS_DIRECTION_SELECTION.md`
- `IDENTITY_SYSTEMS_REALM_PLACEMENT.md`
- `IDENTITY_SYSTEMS_USER_JOURNEYS.md`
- `IDENTITY_SYSTEMS_ARCHITECTURE_PREPARATION.md`
- `IDENTITY_SYSTEMS_RUNTIME_DRIFT_AND_READINESS_AUDIT.md`
- `FUTURE_PROJECTS_AHEAD.md`
- `SHOULD_CHARACTER_IDENTITY_BE_NEXT.md`
- `REUSABLE_IDENTITY_FRAMEWORK_CONCEPT.md`
- `IDENTITY_ENTITIES_SEPARATE_FROM_BUILDER_CONCEPT.md`
- `src/ui/App.tsx`
- `src/ui/components/PromptPreview.tsx`
- `src/ui/components/CharacterLibraryModal.tsx`
- `src/engine/characterStore.ts`
- `src/types/characters.ts`
- `src/types/promptAdditions.ts`

You must evaluate at least these candidate next moves:

1. Continue directly to `Prompt 9` (`first-wave proving decision`)
2. Pause the roadmap and create a stricter `Identity Systems implementation-readiness gate`
3. Pause and resolve the current Character prototype question first
4. Pause and define a sharper realm-vs-lane translation model first
5. Pause and define archive-lineage grounding more clearly before proving-lane choice
6. Pause and create a dedicated product-exposure / navigation timing decision before continuing
7. Some other next move, if it is stronger than all of the above

For each candidate next move, analyze:
- why it is attractive
- what it risks skipping
- whether it resolves the biggest current uncertainty
- whether it protects the larger realm from collapsing too early
- whether it is the most honest next move or just the most convenient one

You must explicitly answer:

1. What is genuinely settled now?
2. What is still too unstable to treat as settled?
3. What is the single biggest unresolved pressure point now?
4. What would be the most dangerous premature next move?
5. What next move best protects the concept while still moving it forward?

Required sections:

1. `Executive Conclusion`
2. `What Is Actually Settled Now`
3. `What Is Still Unstable`
4. `Biggest Current Pressure Point`
5. `Evaluation Of Candidate Next Moves`
6. `Most Dangerous Premature Move`
7. `Recommended Real Best Next Move`
8. `Why This Is Better Than Continuing By Momentum`
9. `What Should Happen Immediately After That Move`
10. `Open Questions`

Save the result as:
`IDENTITY_SYSTEMS_REAL_BEST_NEXT_MOVE_EVALUATION.md`
```
