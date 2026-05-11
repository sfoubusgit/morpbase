# MorpBase Full Project Understanding Prompt

This is the strongest honest version of the prompt.

It is designed to drive a deep repo audit and minimize blind spots. No prompt can guarantee literally zero hidden gaps, so this one explicitly requires the model to surface any remaining uncertainty instead of pretending certainty.

Use the prompt below as-is in this repository.

```text
You are in the MorpBase project repository. Your job is to build the deepest accurate understanding possible of this project from the actual workspace, not from assumptions.

Your goal is not to give quick impressions. Your goal is to leave this pass with:

1. a grounded understanding of what the product is today
2. a grounded understanding of how the codebase is structured
3. a grounded understanding of which ideas are implemented, partial, legacy, or only conceptual
4. a clear list of any remaining unknowns or contradictions

Non-negotiable rules:

- Do not guess.
- Do not rely on README alone.
- Treat code as the highest source of truth for implemented behavior.
- Treat current understanding docs as secondary truth for intended direction.
- Treat older concept docs as useful context, not automatically as current truth.
- If two sources conflict, explicitly say so and resolve the conflict by evidence.
- Every important claim must cite file paths.
- If you are unsure, say exactly what is still unknown and what file or runtime check would resolve it.
- Do not stop after reading one or two files. Perform a structured audit.

Evidence priority:

1. source code under `src/`
2. persistence code and DB migrations under `src/engine/` and `supabase/migrations/`
3. current operational docs like `MANUAL.md`, `BACKUP_CURRENT_UNDERSTANDING.md`, `APP_UNDERSTANDING_17_03_2026.md`, `CONTEXT_SUMMARY.md`
4. design and planning docs
5. older or future-facing concept docs

Important project framing to verify from the repo:

- This project started as a Stable Diffusion prompt generator and has evolved into MorpBase.
- Builder is likely the center of the product.
- Pools, Territories, Modes, Prompt Preview, Prompt Library, Pool Hub, Working Sets, Prompt Sets, and future identity systems may all coexist, but they do not all have the same maturity or strategic importance.
- You must determine the true current structure from evidence, not from this framing.

Audit process:

Phase 1: Establish repo shape

- Inspect the repository root.
- Read `package.json`.
- Read `README.md`.
- Check `git status --short` and note whether there are important untracked docs or generated JS companions that affect understanding.
- Build a top-level map of major folders and their responsibilities.

Phase 2: Read current product-truth docs

Read these first:

- `MANUAL.md`
- `CONTEXT_SUMMARY.md`
- `BACKUP_CURRENT_UNDERSTANDING.md`
- `APP_UNDERSTANDING_17_03_2026.md`
- `FUTURE_PROJECTS_AHEAD.md`
- `docs/user_pools_spec.md`
- `docs/prompt_roadmap_user_pools.md`

While reading them, separate:

- current product truth
- strategic direction
- legacy language
- future concepts not yet implemented

Phase 3: Read the implementation spine

Read these files closely:

- `src/main.tsx`
- `src/ui/App.tsx`
- `src/engine.ts`
- `src/data/loadAttributeDefinitions.ts`
- `src/data/loadQuestionNodes.ts`
- `src/data/categoryMap.ts`
- `src/data/builderModes.ts`
- `src/data/promptFragments.ts`
- `src/types/index.ts`
- `src/types/entities.ts`
- `src/types/pools.ts`
- `src/types/territories.ts`
- `src/types/prompts.ts`
- `src/types/builderModes.ts`
- `src/types/workingSets.ts`
- `src/types/workingSetHub.ts`
- `src/types/poolHub.ts`

From these files, determine:

- the core runtime flow
- how prompt generation works
- how Builder navigation is modeled
- which entities are first-class in the data model
- which concepts are only represented in docs versus code

Phase 4: Read store and persistence layers

Read these files closely:

- `src/engine/poolStore.ts`
- `src/engine/territoryStore.ts`
- `src/engine/workingSetStore.ts`
- `src/engine/promptStore.ts`
- `src/engine/promptSetStore.ts`
- `src/engine/authStore.ts`
- `src/engine/analyticsStore.ts`
- `src/engine/profileStore.ts`
- `src/engine/adminStore.ts`
- `src/engine/adminAnalyticsStore.ts`
- `src/engine/poolHubStore.ts`
- `src/engine/workingSetHubStore.ts`
- `src/engine/creatorSummary.ts`
- `src/engine/creatorStatsStore.ts`
- `src/engine/supabaseClient.ts`

Then read all SQL migrations under `supabase/migrations/`.

Determine:

- what is persisted in localStorage
- what is persisted in Supabase
- what is still mock or seeded
- which features are schema-sensitive
- whether the app code appears ahead of the live schema in any area

Phase 5: Read seed and mock data

Read these files:

- `src/data/defaultUserPools.ts`
- `src/data/poolHubMock.ts`
- `src/data/COMPLETE_INVENTORY.md`
- `src/data/builtinPresets.ts`
- `src/data/workingSetHubMock.ts`

Also inspect relevant JSON data in `src/data/` and `src/data/questions/`.

Determine:

- what the builder categories actually are
- how attribute/question content is organized
- which official pools or test assets are important to current product thinking
- whether pools now behave more like structured source systems than flat lists

Phase 6: Read the key UI surfaces

Read these components:

- `src/ui/components/CategorySidebar.tsx`
- `src/ui/components/QuestionCard.tsx`
- `src/ui/components/PromptPreview.tsx`
- `src/ui/components/PromptLibrary.tsx`
- `src/ui/components/UserPoolsPage.tsx`
- `src/ui/components/PoolHubPage.tsx`
- `src/ui/components/WorkingSetsPage.tsx`
- `src/ui/components/PromptsPage.tsx`
- `src/ui/components/PublicCreatorPage.tsx`
- `src/ui/components/MyProfilePage.tsx`
- `src/ui/components/AdminPage.tsx`
- `src/ui/components/RandomPromptGenerator.tsx`
- `src/ui/components/LandingPage.tsx`
- `src/ui/components/FloatingPromptFragments.tsx`

Determine:

- the major user journeys
- which features are central versus peripheral
- which features are still present but strategically legacy
- how Builder, Pools, Territories, and saved prompts connect in the UI

Phase 7: Search the repo for key concepts so you do not miss newer docs

Search for these terms across the repo and inspect the most relevant hits:

- `Territory`
- `Working Set`
- `Builder Workflow Mode`
- `IDP`
- `initiative phrase`
- `Prompt Set`
- `Quick Save`
- `Character Identity`
- `Reusable Identity`
- `Pool Hub`
- `creator profile`
- `public profile`

Use this search phase to catch important recent docs, untracked docs, and implementation surfaces that are easy to miss.

Phase 8: Build a final evidence-backed understanding

Produce a final report with these exact sections:

1. Project Identity
- What this app is in one paragraph.
- What it was originally.
- What it is becoming.

2. Current Product Truth
- The current central user workflow.
- The major first-class systems.
- The systems that are legacy but still active.

3. System Boundary Map
- Builder
- Pools
- Territories
- Modes
- Prompt Preview
- Prompt Library
- Pool Hub
- Working Sets
- Prompt Sets
- Character Identity or related identity concepts

For each one, state:
- what it is
- where it lives in code
- whether it is implemented, partial, legacy, or conceptual
- what it should not be confused with

4. Architecture Map
- UI entry points
- state owners
- prompt-generation pipeline
- persistence layers
- seeded data and mock data
- external dependencies

5. Data Model Summary
- core types and entities
- important relationships between entities
- any DB-backed entities and migration dependencies

6. Feature Maturity Table
- implemented
- implemented but fragile
- partial
- legacy
- concept-only

7. Contradictions And Drift
- places where docs and code disagree
- older terminology still present in the repo
- areas where naming or structure may mislead a new contributor

8. Remaining Unknowns
- every unresolved question
- why it is unresolved
- the exact file, runtime test, or user answer needed to resolve it

9. Working Memory Summary
- a concise high-signal summary you could reuse in future coding sessions

Output constraints:

- Be concrete.
- Cite file paths throughout.
- Prefer evidence over interpretation.
- Distinguish sharply between shipped behavior, local mock behavior, and future product direction.
- If you conclude that some understanding gap still exists, say it plainly.
- Do not claim "full understanding" unless you can justify it. It is acceptable and preferred to say "this is the best current understanding and these are the remaining gaps."

Success condition:

At the end, I should be able to hand your report to a new engineer and they should understand:

- what MorpBase is
- how the app currently works
- where the important code lives
- what the current strategic direction is
- what should and should not be changed casually
```
