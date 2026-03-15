# Context Handoff 15.03.2026

This document is for a future agent starting without chat context.

It captures the current product state, the most important recent implementation work, and the latest conceptual shift from `Working Sets` toward `Territories`.

## Project identity

MorpBase is a structured prompt-building app for image-generation workflows.

Best current one-line definition:
- MorpBase helps users build prompts from reusable structured fragments instead of rewriting prompts from scratch.

Current product shape:
- Core creation: `Builder`
- Output control: `Prompt Preview`, `Edit Output`, `Prompt Library`
- Reuse: `User Pools`
- Legacy advanced feature: `Working Sets`
- Community/discovery: `Pool Hub`
- Admin/ops: `Admin`

## Current product conclusions

These are important and should not be casually undone:

1. `Builder` is the center of the product.
2. `User Pools` are one of the clearest and strongest parts of the product.
3. The current `Working Sets` implementation is not the right long-term model.
4. The strongest future replacement for `Working Sets` is currently `Territories`.
5. MorpBase should remain deterministic-first for now rather than pivoting into AI rewriting/finishing.
6. Direct manual output editing is better than a separate `Freeform Prompt` concept.
7. Preview / copy / save output must stay aligned.
8. Product design should keep removing conceptual duplication rather than adding more systems.

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

Pools:
- `src/ui/components/UserPoolsPage.tsx`
- `src/ui/components/UserPoolsPage.css`
- `src/engine/poolStore.ts`
- `src/data/defaultUserPools.ts`
- `src/engine/poolTemplates.ts`
- `src/types/pools.ts`
- `supabase/migrations/0006_add_pool_folders.sql`
- `supabase/migrations/0007_add_pool_folder_sort_order.sql`

Legacy Working Sets:
- `src/engine/workingSetStore.ts`
- `src/ui/components/WorkingSetsPage.tsx`
- `src/ui/components/WorkingSetBuilder.tsx`
- `src/types/workingSets.ts`

## Recent pushed work

Recent commits relevant to current state:
- `71cd28c` `Replace freeform prompt with editable output flow`
- `7de71c4` `Refine builder header and sidebar layout`
- `4cd7d8c` `Make header logo return to builder start`
- `791772d` `Add product context and working set redesign docs`
- `a8fcdea` `Unlock pro features for all users`
- `e9d054e` `Add user pool folder reordering`

## Current implemented UX state

### Prompt output
- `Freeform Prompt` was removed.
- `Prompt Preview` now supports direct `Edit Output`.
- edited output is the source of truth for preview, copy, and save.
- export modes exist:
  - `structured`
  - `clean`
  - `structured_with_negative`

### Builder
- Builder sidebar was simplified into staged groups:
  - `Define`
  - `Refine`
  - `Finish`
- Sidebar was widened and visually cleaned up.
- `Builder Flow` now sits at the top of the sidebar.
- MorpBase logo was moved into the top-left header.
- Clicking the logo returns to the Builder start and scrolls to top.
- `Dev mode` was removed.
- `Pro` features are unlocked for everyone by default.

### User Pools
- pool folders exist
- custom folders are collapsible
- custom folders can be reordered by drag-and-drop
- folder order is persisted via `sortOrder`
- `Default Pools` is pinned first
- `Ungrouped` is pinned second
- custom folders follow in saved order

## Known validation issue

`npm.cmd run type-check` still fails due to the existing repo-wide `tsconfig.json` issue:
- `vite.config.ts` is outside `rootDir`

This is pre-existing and was not introduced by recent work.

## Strategic design shift

The most important conceptual change since the previous handoff:

`Working Sets` are no longer the leading long-term direction.

The strongest current direction is:

`Territories`

Meaning:
- composed creative spaces
- built from selected sections of one or more Pools
- activated inside Builder

## Shared model now emerging

The product is increasingly clarifying into:

### Pools
- themed source libraries
- reusable vocabularies
- likely to gain light internal sections

### Territories
- saved compositions of selected `Pool + Section` inputs
- active creative spaces
- likely successor to `Working Sets`

### Builder
- the active exploration surface
- should gradually align to the same shared section language

## Light shared section vocabulary

Current leading section model:
- `Subjects`
- `Environment`
- `Props`
- `Lighting`
- `Mood`
- `Materials`
- `Style`
- `Composition`
- `Effects`

Important constraints:
- not every pool needs every section
- the user should not manually reorganize selected material
- the system must map selected sections into Builder automatically

## Important Working Sets conclusion

The current standalone `Working Sets` page is likely too heavy for the future direction.

Current best judgment:
- do not invest heavily in the existing Working Sets model
- treat it as legacy/temporary
- future replacement should probably live inside or adjacent to `User Pools`

## Important naming conclusion

`Working Set` is now best treated as a legacy term tied to the old category-heavy model.

`Territory` is the leading future name because it better reflects:
- a creative space
- a world/constraint area
- a focused exploration mode inside Builder

## Pool-building conclusions

Pools should no longer be thought of as only flat fragment dumps.

Better direction:
- themed pools
- lightly sectioned
- usable as source material for future Territories

Strong example pools created conceptually in chat:
- `Salvador Dali Dark Theme Park`
- `Exo-Armor Engineering`
- `Arcane Library Fantasy`
- `Epic War Beasts`
- `Semi-Real Portrait Mood`
- `Cyberpunk Urban Decay`

Several of these were also reworked conceptually into light section-based versions.

## Best next strategic steps

The strongest next design direction is no longer “build more Working Sets.”

Instead, the likely next high-value conceptual steps are:
1. define how a section-based Builder should look
2. define how Territories are created inside/adjacent to `User Pools`
3. only then decide whether and how to reshape current code

## Best current product stance

If a future agent needs the shortest honest summary:

- Keep strengthening `Builder` and `User Pools`
- Do not keep expanding the current `Working Sets` model
- Treat `Territories built from pool sections` as the leading future direction
