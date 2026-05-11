# Working Sets Deprecation Plan

## Purpose

This document defines a clean way to retire `Working Sets` from MorpBase without creating a half-broken or half-legacy product.

The goal is not:

- random deletion

The goal is:

- remove `Working Sets` from the main product story first
- reduce their runtime visibility second
- remove the code only after their role is intentionally closed

## Short Conclusion

Yes, `Working Sets` are a good cleanup candidate.

But they are still deeply wired through the current app:

- navigation
- page state
- dedicated UI
- store layer
- hub/discovery support
- types
- landing-page copy

That means they should be deprecated in phases, not hacked out casually.

## Why This Matters

From the current project direction, `Working Sets` are strategically legacy relative to:

- `Builder`
- `User Pools`
- `Territories`

But the runtime still treats them as a real product surface.

That creates two problems:

### 1. Product confusion

Users still see `Working Sets` in places where the product should be teaching a clearer future-facing model.

### 2. Maintenance drag

The codebase still has to carry:

- state management
- CRUD logic
- UI surfaces
- hub flows
- copy

for a concept that no longer appears to be the strongest direction.

## Current Working Sets Footprint

### Main runtime app

`Working Sets` still affect the main shell in [App.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx):

- page state includes `'working-sets'`
- local persistence restores that page
- working-set state is loaded in the app shell
- a `Legacy Sets` navigation button is still visible
- `WorkingSetsPage` is still rendered as a full page

### Dedicated product surface

There is still a full Working Sets experience in [WorkingSetsPage.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/WorkingSetsPage.tsx), including:

- creation
- renaming
- deleting
- activation
- category-level editing
- publishing support

### Store and type layer

Working Sets still have dedicated types and storage:

- [workingSets.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/workingSets.ts)
- [workingSetStore.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/workingSetStore.ts)
- [workingSetHub.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/workingSetHub.ts)
- [workingSetHubStore.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/workingSetHubStore.ts)

### Hub / discovery layer

`Pool Hub` still includes a `working-sets` mode in [PoolHubPage.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/PoolHubPage.tsx), including:

- working-set entries
- upload flow
- import/export
- comments
- ratings
- moderation/flagging

### Landing / product story

The landing page still teaches Working Sets as part of the visible product story in [LandingPage.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/LandingPage.tsx).

That is especially costly because it competes with the product’s more modern direction.

## Recommendation

I recommend:

- **deprecate now**
- **hide from the main product story soon**
- **remove code only after one explicit cutoff decision**

## Deprecation Strategy

### Phase 1. Remove Working Sets from the main story

This is the safest and highest-leverage first move.

#### Goals

- stop teaching Working Sets as a core concept
- reduce first-use confusion
- strengthen the Territory/Pools/Builder story

#### Changes

1. Remove `Working Sets` from the landing-page pipeline in [LandingPage.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/LandingPage.tsx)
2. Remove landing-page wording that frames Pool Hub around pools plus working sets
3. Remove or soften any help copy that treats Working Sets as a recommended path
4. In docs, mark Working Sets as legacy where appropriate instead of describing them as peer systems

#### Result

Even before deleting code, the product stops advertising the old lane.

### Phase 2. Demote Working Sets in runtime navigation

This is the next best step if you want to keep temporary backward compatibility.

#### Goals

- reduce visibility
- preserve access for legacy users if needed
- stop letting Working Sets compete with the main experience

#### Changes

1. Remove the `Legacy Sets` button from the main navigation in [App.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)
2. Keep Working Sets accessible only through:
   - direct route/hash if you still want support
   - a hidden legacy section
   - or an internal/admin-only entry
3. Remove Working Sets references from first-use and onboarding surfaces

#### Result

Working Sets become a supported legacy feature instead of a visible product pillar.

### Phase 3. Close the feature operationally

Only do this once you are sure the product is no longer relying on Working Sets conceptually.

#### Goals

- stop future investment
- freeze the feature
- prepare for actual code removal

#### Changes

1. Stop adding new Working Set UX features
2. Stop featuring Working Sets in Hub/discovery surfaces
3. Decide whether to:
   - keep read-only support temporarily
   - or allow full deletion from user accounts
4. Add one clear internal note that Working Sets are deprecated in favor of Territories

#### Result

The feature becomes intentionally legacy rather than accidentally lingering.

### Phase 4. Remove Working Sets from Pool Hub

This is likely the biggest conceptual cleanup after navigation cleanup.

#### Why it matters

`Pool Hub` currently still behaves like a dual system:

- pools
- working sets

That weakens the clarity of `Pools -> Territories -> Builder`.

#### Changes

1. Remove `working-sets` hub mode from [PoolHubPage.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/PoolHubPage.tsx)
2. Remove working-set upload/import/export UI there
3. Remove working-set ratings/comments/moderation flow there
4. Remove unused helper logic that only exists for working-set hub support

#### Result

Pool Hub becomes much easier to understand and much more aligned with the current direction.

### Phase 5. Remove the page and shell integration

Once Working Sets are no longer part of the product experience:

#### Changes

1. Remove `working-sets` from `activePage` state in [App.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)
2. Remove `WorkingSetsPage` imports and render paths from [App.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/App.tsx)
3. Remove shell-level working-set refresh/load logic
4. Remove active-working-set app state if nothing else uses it

#### Result

The app shell stops carrying legacy runtime weight.

### Phase 6. Remove store/types/code

This should be the final step.

#### Candidate removals

- [WorkingSetsPage.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/WorkingSetsPage.tsx)
- [WorkingSetsPage.css](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/WorkingSetsPage.css)
- [WorkingSetBuilder.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/WorkingSetBuilder.tsx)
- [WorkingSetBuilder.css](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/WorkingSetBuilder.css)
- [workingSetStore.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/workingSetStore.ts)
- [workingSetHubStore.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/workingSetHubStore.ts)
- [workingSets.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/workingSets.ts)
- [workingSetHub.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/workingSetHub.ts)
- related exports in [index.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/index.ts)
- any mock data and tests tied only to working-set hub behavior

#### Important caution

Do not do this before shell and hub usage are removed.

## Best First Cleanup

If you want the highest value with the lowest risk, do this first:

1. remove Working Sets from landing-page copy
2. remove the `Legacy Sets` nav button
3. stop showing Working Sets as part of the product’s main future-facing story

That gives clarity benefits quickly without forcing full deletion immediately.

## Should You Delete Working Sets Entirely?

My recommendation is:

- **probably yes eventually**

if the product is truly moving toward:

- `Builder`
- `Pools`
- `Territories`
- `Prompt Preview`
- `Prompt Sets`
- future identity systems

In that world, Working Sets mostly act as:

- conceptual competition
- maintenance burden
- narrative clutter

## What Not To Do

### 1. Do not leave them half-removed

That usually creates the worst state:

- confusing UI
- broken references
- lingering code paths

### 2. Do not remove store code before UI/hub references are gone

The current wiring is too broad for that.

### 3. Do not keep advertising them if you already think they are legacy

That undermines the product story.

## One-Line Conclusion

Yes, clean them out, but do it as a phased deprecation:

- remove them from the story first
- remove them from navigation second
- remove them from runtime and code only after the product has clearly moved on

