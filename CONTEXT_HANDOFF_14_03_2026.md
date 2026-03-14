# Context Handoff 14.03.2026

This document is for a future agent starting without chat context.

It captures the current product state, major decisions, recent UI work, and the recommended next directions.

## Project identity

MorpBase is a structured prompt-building app for image-generation workflows.

Best current one-line definition:
- MorpBase helps users build prompts from reusable structured fragments instead of rewriting prompts from scratch.

Current product shape:
- Core creation: `Builder`
- Output control: `Prompt Preview`, `Edit Output`, `Prompt Library`
- Reuse: `User Pools`
- Focus/advanced workflow: `Working Sets`
- Community/discovery: `Pool Hub`
- Admin/ops: `Admin`

## Current product conclusions

These are important and should not be casually undone:

1. `Builder` is the center of the product.
2. `User Pools` are useful and understandable as reusable fragment libraries.
3. `Working Sets` are strategically interesting, but the current implementation is not the right long-term model.
4. MorpBase should remain deterministic-first for now rather than pivoting into AI rewriting/finishing.
5. Direct manual output editing is better than a separate `Freeform Prompt` concept.
6. Preview / copy / save output must stay aligned.
7. Product/design work should continue iteratively, but not by piling more complexity on top of weak concepts.

## Important code surfaces

Main shell:
- `src/ui/App.tsx`

Builder/sidebar UI:
- `src/ui/components/CategorySidebar.tsx`
- `src/ui/components/CategorySidebar.css`
- `src/ui/components/QuestionCard.tsx`
- `src/ui/components/CompletionState.tsx`

Prompt output:
- `src/ui/components/PromptPreview.tsx`
- `src/ui/components/PromptLibrary.tsx`
- `src/ui/components/PromptsPage.tsx`
- `src/ui/components/UserPoolsPage.tsx`

Pools:
- `src/engine/poolStore.ts`
- `src/data/defaultUserPools.ts`
- `src/engine/poolTemplates.ts`
- `src/types/pools.ts`
- `supabase/migrations/0006_add_pool_folders.sql`

Working Sets:
- `src/engine/workingSetStore.ts`
- `src/ui/components/WorkingSetsPage.tsx`
- `src/ui/components/WorkingSetBuilder.tsx`
- `src/types/workingSets.ts`

## Recent pushed work

Latest pushed commits relevant to current state:
- `71cd28c` `Replace freeform prompt with editable output flow`
- `7de71c4` `Refine builder header and sidebar layout`
- `4cd7d8c` `Make header logo return to builder start`

## Current Builder state

Builder was recently simplified without changing the underlying data model.

Current UX direction:
- present Builder as a clearer staged flow
- reduce the feeling of a flat category wall
- make advanced areas feel more optional

Current sidebar improvements:
- `Define`
- `Refine`
- `Finish`

Current category emphasis:
- Main/core feeling:
  - `Subject`
  - `Style`
  - `Environment`
  - `Lighting`
  - `Camera`
- Secondary/refinement feeling:
  - `Actions`
  - `Quality`
  - `Effects`
- Advanced feeling:
  - `Post-Processing`
  - `Anatomy Details`

Current design notes:
- `Builder Flow` now starts at the top of the sidebar
- MorpBase logo was moved into the main header
- clicking the header logo returns the user to the Builder start
- sidebar width was increased slightly for readability

## Current output/prompt state

Important output changes already made:
- `Freeform Prompt` was removed
- `Edit Output` exists in `PromptPreview`
- edited output is what gets previewed, copied, and saved
- export modes exist:
  - `Structured`
  - `Clean`
  - `Structured + Negative`

Weights:
- weights start off by default

## Current User Pools direction

User Pools are a strong near-term investment area.

Why:
- they are understandable
- they improve Builder immediately
- they connect well to the prompt-extraction experiment
- they do not require resolving the larger Working Sets redesign first

Recommended next direction:
- continue extracting reusable fragments from real prompts
- build stronger curated pool sets in batches
- learn what kinds of fragments people actually reuse

Current useful pool families:
- `Quality Finishers`
- `Camera And Framing`
- `Lighting And Atmosphere`
- `Traditional Painterly Styles`
- `Fantasy Environments`
- `Dark Fantasy Corruption`

## Current Working Sets judgment

This is critical:

The current Working Sets implementation should **not** be treated as the long-term destination.

Current implementation problems:
- too category-heavy
- too administrative
- too much setup friction
- too close to internal Builder structure
- not intuitive enough

The feature should remain strategically alive, but its redesign should be based on the newer conceptual work, not on polishing the current model.

See the dedicated Working Sets document:
- `WORKING_SET_MODEL_RETHINK_14_03_2026.md`

## Most important product insight right now

The strongest near-term move is:
- strengthen `Builder`
- strengthen `User Pools`
- keep `Working Sets` conceptually alive
- but do not keep investing heavily in the current Working Sets implementation

## Known technical issue

`npm.cmd run type-check` currently fails because of an existing repo-wide config issue:
- `vite.config.ts` is included by `tsconfig.json`
- but is outside `rootDir` (`src`)

Error shape:
- `TS6059` involving `vite.config.ts`

This is pre-existing and not caused by the recent UI changes.

## Current worktree caveat

There may be unrelated untracked files in the repo root, for example:
- `Log_13_03_2026.md`
- `morpbaselogo.png`

Do not assume they are safe to delete unless explicitly asked.

## Recommended next moves

Best next product direction:
1. Build more high-quality `User Pools`
2. Continue real prompt extraction experiments
3. Keep testing whether Builder now feels lighter and more intuitive
4. Revisit Working Sets later from the new model, not the old one

Avoid:
- adding more complexity to the current Working Sets page
- deep Builder rewrites before more evidence
- pseudo-AI prompt finishing systems

