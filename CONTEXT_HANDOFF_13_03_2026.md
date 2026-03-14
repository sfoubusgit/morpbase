# Context Handoff 13.03.2026

This file is for the next agent who starts with no conversation context and needs to continue work on MorpBase safely.

## Project identity

MorpBase is a structured prompt-building app for image-generation workflows.

Best one-line product definition:
- MorpBase helps users build prompts from reusable pieces instead of rewriting them from scratch.

Current product ladder:
- Core: Builder, Prompt Preview, Copy Prompt
- Reuse: User Pools, Prompt Library
- Focus: Working Sets
- Community: Pool Hub, public profiles, public/cloud sharing
- Operations: Admin

## Important architecture

Main app shell:
- `src/ui/App.tsx`

Prompt engine:
- `src/engine.ts`
- `src/modules/*`

Data loading:
- `src/data/*`

Supabase-backed stores:
- `src/engine/authStore.ts`
- `src/engine/promptStore.ts`
- `src/engine/poolStore.ts`
- `src/engine/workingSetStore.ts`
- `src/engine/profileStore.ts`

Hub/community stores:
- `src/engine/poolHubStore.ts`
- `src/engine/workingSetHubStore.ts`

Admin:
- `src/engine/adminStore.ts`
- `src/ui/components/AdminPage.tsx`
- `supabase/migrations/0005_add_admin_tools.sql`

## Major product decisions made

These were intentional and should not be casually undone:

1. Builder is the first-use center of the app.
2. Working Sets are focused prompt kits.
3. Working Sets are category-based for now, not subcategory/node-based.
4. Pool Hub should show all users, not only uploaders.
5. The app should improve iteratively, with concept/planning before major changes.
6. MorpBase should stay primarily deterministic rather than pivoting into AI rewriting too early.
7. Prompt export should be improved structurally, not with fake hand-written “AI-like” rewriting.
8. `Freeform Prompt` was judged weaker than a direct output editing workflow.

## What was implemented before the latest local changes

### Builder clarity and onboarding
- clearer landing page and Builder explanation
- better product wording
- stronger Prompt Preview framing
- improved Builder guidance

### Working Set safety
- usable-node navigation under active Working Set
- explicit unavailable/empty Working Set states
- safer selection reconciliation when switching sets
- product-safe invalid-attribute handling

### Working Set positioning
- UI now honestly frames Working Sets as category-based

### Edit/weight discoverability
- Builder guidance explains editing text and adjusting weight
- question-card level hints were added

### Pool Hub visibility
- all users should be visible in Pool Hub if they have a public profile
- `authStore.ts` now ensures a default `public_profiles` row exists for authenticated users

### Admin V1
- admin tab
- admin page
- user list
- public-profile repair actions
- bulk backfill

### Working Sets redesign
- `Base Set` is shown as a read-only template
- all sets now use overview-first category editing
- normal sets can be duplicated

### User Pools folders and default pools
- default pools were added
- pool folders were added
- folders can now be collapsed
- default pools are shown in the normal list under a `Default Pools` folder/group

### Deterministic export improvements
- export modes were added:
  - `Structured`
  - `Clean`
  - `Structured + Negative`
- `Clean` mode does structural cleanup only
- `Start Over` was renamed to `Restart Builder`

## Latest pushed commit

Latest pushed commit at the time of this handoff:
- `57cda93`
- message: `Add pool folders and clean export modes`

That commit includes:
- pool folders
- default user pools
- collapsible folder groups
- deterministic export modes
- negative prompt export improvements
- `Restart Builder`

## Current local, unpushed work

There are local modifications after `57cda93` that are **not pushed yet**.

Modified files:
- `src/ui/App.tsx`
- `src/ui/components/PromptLibrary.tsx`
- `src/ui/components/PromptPreview.css`
- `src/ui/components/PromptPreview.tsx`
- `src/ui/components/PromptsPage.tsx`
- `src/ui/components/UserPoolsPage.tsx`

Untracked files:
- `Log_13_03_2026.md`
- `morpbaselogo.png`

Key local change not yet pushed:

### Edit Output replaced Freeform Prompt

The old `Freeform Prompt` flow was removed from the Builder and related pages.

New direction:
- users build first
- then optionally click `Edit Output` inside `Prompt Preview`
- they can edit positive and negative prompt directly
- they can apply edits, cancel, or reset to generated
- if the generated prompt changes later, manual edits are reset and a notice is shown

This is implemented locally in:
- `src/ui/components/PromptPreview.tsx`
- `src/ui/components/PromptPreview.css`
- `src/ui/App.tsx`
- `src/ui/components/PromptsPage.tsx`
- `src/ui/components/UserPoolsPage.tsx`

### Edited output now saves correctly

There was a bug:
- edited output changed what the user saw
- but saved prompts still used the generated default prompt

That was fixed locally by lifting edited-output state up and passing it into the save flow.

Relevant files:
- `src/ui/App.tsx`
- `src/ui/components/PromptPreview.tsx`
- `src/ui/components/PromptLibrary.tsx`
- `src/ui/components/PromptsPage.tsx`
- `src/ui/components/UserPoolsPage.tsx`

Current behavior:
- what the user sees
- what gets copied
- and what gets saved

should now all align.

### Important detail about Edit Output

The save bug fix also changed edit behavior:
- edited output now syncs upward while the user types
- `Cancel` restores the previous state
- `Apply Edits` still exits edit mode

This was done because saving while still inside edit mode previously used stale generated text.

## Current builder behavior detail

Weights now start **off** by default.

Local change:
- `weightsEnabledGlobal` initializes as `false`
- randomize also keeps weights off unless the user enables them

File:
- `src/ui/App.tsx`

This is also local and unpushed right now.

## Current prompt/output direction

Important product conclusion from tester feedback:
- do not try to build a heavy fake contextual rewriting system without AI
- do not pivot into AI finishing right now
- best near-term direction is deterministic cleanup only

So current recommended direction is:
- structured deterministic Builder
- cleaner export
- stronger negative prompt treatment
- direct manual `Edit Output`

Not:
- pseudo-natural-language auto-rewrite rules
- full AI finishing layer yet

## Tester feedback themes you should know

Recent tester feedback said:
- `Restart` is clearer than `Start Over`
- onboarding originally felt scattered
- block logic is better now
- final exported prompt still felt too raw/concatenated
- negative prompt matters a lot
- saving and export should feel closer to what the user actually refined

This strongly influenced:
- export modes
- `Restart Builder`
- `Edit Output`

## Database / migration caveats

### Admin migration
Required for admin features:
- `supabase/migrations/0005_add_admin_tools.sql`

### Pool folder migration
Required for pool folders:
- `supabase/migrations/0006_add_pool_folders.sql`

If `0006` is not applied, the app will fail with:
- `Could not find the table 'public.pool_folders' in the schema cache`

## Admin logic you must know

`0005_add_admin_tools.sql` introduced:
- `public.admin_users`
- `public.admin_can_manage()`
- `public.admin_is_current_user()`
- `public.admin_list_users()`
- `public.admin_create_missing_public_profile(uuid)`
- `public.admin_backfill_missing_public_profiles()`

Current bootstrap rule:
- if `admin_users` has rows, only those rows are admins
- if `admin_users` is empty, the first registered user is treated as admin

Recommendation:
- explicitly insert the real admin into `public.admin_users`
- do not rely on bootstrap fallback forever

## Known validation/runtime status

Local validation done:
- parser checks were run repeatedly on touched TSX files
- the latest local TSX changes parse cleanly

Still unresolved repo-wide:
- `npm.cmd run type-check` fails because of a pre-existing `tsconfig.json` / `vite.config.ts` `rootDir` mismatch

Do not misread that as proof the recent UI changes are broken.

## Recommended next steps for the next agent

Best next sequence:

1. Decide whether to push the current local `Edit Output` + save-fix + weights-default-off changes.
2. If pushing:
   - test locally one more time:
     - edit output
     - save prompt
     - copy prompt
     - change Builder selections and confirm edit reset behavior
   - then commit and push the six modified files in the working tree.
3. If deploying pool folder features:
   - confirm `0006_add_pool_folders.sql` has been applied in Supabase.
4. Consider adding a small visual cue that edited output is active across pages, not just inside Prompt Preview.
5. Later, if desired, revisit whether `PromptLibrary` should preserve the currently selected export mode when saving, or always save the edited/raw text exactly as shown.

## Current git/worktree note

At handoff time:
- pushed baseline is `57cda93`
- there are still local modifications in the working tree
- the next agent should inspect `git status` before committing anything

## Short summary

The product has moved from:
- “What is this tool?”

toward:
- “The Builder works, now make the final output and save/export flow stronger.”

The latest local work continues exactly in that direction:
- `Freeform Prompt` removed
- `Edit Output` added
- save/copy/preview aligned
- weights off by default

