# MorpBase Visual Design Unification — Master Plan

## The Problem

Every CSS file in the project hardcodes colors, spacing, and radii independently.
`tokens.css` exists with the right variables, but only `Modal.css` uses them consistently.
The result: ~30 files each define their own idea of what "a card surface", "muted text",
or "a subtle border" looks like — and they never agree.

This plan fixes the root cause rather than just the symptoms. It defines the token
vocabulary once, then migrates each file to use it. No visible changes beyond intended
consistency cleanup.

---

## Step 1 — Expand the Token Layer (`src/ui/styles/tokens.css`)

First, make the token file the single source of truth for every value that repeats.
Add the missing tokens below to the existing `tokens.css`.

### 1a. Surface tokens (dark card backgrounds)

```css
/* Base surfaces */
--surface-0: #0a0b12;              /* page/app background (matches App.css gradient base) */
--surface-1: #111217;              /* deepest card, inputs */
--surface-2: #1a1a1f;              /* standard card — ALREADY EXISTS as --background-surface */
--surface-3: #25252a;              /* elevated card, modal sidebar — ALREADY EXISTS as --background-surface-2 */
--surface-overlay: rgba(14, 15, 20, 0.82);  /* semi-transparent card overlaid on gradient bg */
```

### 1b. Text tokens

```css
--text-primary: #ffffff;           /* ALREADY EXISTS */
--text-secondary: #b0b0c3;         /* ALREADY EXISTS — muted labels, descriptions */
--text-tertiary: #9ca3af;          /* dimmer — section labels, meta info */
--text-accent: #dbe2ff;            /* bright-lavender — eyebrows, kickers, field labels */
--text-on-accent: #ffffff;         /* text on filled accent buttons */
```

### 1c. Border tokens

```css
--border-hairline: rgba(255, 255, 255, 0.04);   /* ALREADY EXISTS as --border-subtle */
--border-subtle: rgba(255, 255, 255, 0.07);      /* standard card border */
--border-medium: rgba(255, 255, 255, 0.12);      /* inputs, stronger separators */
--border-accent: rgba(110, 86, 249, 0.35);       /* accent-tinted border (active states) */
--border-accent-strong: rgba(110, 86, 249, 0.6); /* primary button border */
```

### 1d. Accent color tokens (these already exist but codify the system)

```css
--accent-primary: #6e56f9;                         /* ALREADY EXISTS — purple */
--accent-primary-bg: rgba(110, 86, 249, 0.12);     /* accent card tint */
--accent-primary-bg-strong: rgba(110, 86, 249, 0.22); /* hover/active card tint */
--accent-green: rgba(16, 185, 129, 1);             /* territory / environment tint */
--accent-green-bg: rgba(16, 185, 129, 0.12);       /* green card tint */
```

### 1e. Radius tokens (codify the current vocabulary)

```css
--radius-xs: 6px;    /* tiny elements: badges, small chips */
--radius-sm: 10px;   /* inputs, small controls — REPLACES bare 8px and 10px */
--radius-md: 14px;   /* standard cards (already --radius-md = 12px — bump to 14 for better card distinction) */
--radius-lg: 18px;   /* section cards, large panels */
--radius-xl: 22px;   /* page hero sections, large modals */
--radius-pill: 999px; /* pills and chips */
```

> **Note**: `--radius-md` is currently `12px` in tokens.css. Unifying to `14px` will make
> cards look slightly more rounded everywhere. Alternatively keep `12px` and adjust the
> migration. Choose before execution.

### 1f. Shared layout tokens

```css
--page-padding-x: 32px;
--page-padding-y: 24px;
--section-gap: 24px;
--card-padding: 18px;
--card-gap: 14px;
```

---

## Step 2 — Identify and standardize the four problem patterns

These four patterns account for ~80% of the inconsistency:

### Pattern A — Muted text colors (currently 5 different values)
| Current value | Where | Unify to |
|---|---|---|
| `#b0b0c3` | CategorySidebar, QuestionCard | `var(--text-secondary)` |
| `#b9bfd0` | CharacterLibraryModal, IdentitySystemsPage | `var(--text-secondary)` |
| `#cbd5f5` | LandingPage, PoolHubPage, PromptLibrary | `var(--text-secondary)` |
| `#9ca3af` | PromptLibrary, PromptsPage | `var(--text-tertiary)` |
| `#9fa0b8` | PoolHubPage | `var(--text-tertiary)` |

### Pattern B — Card surface backgrounds (currently 6+ values)
| Current value | Unify to |
|---|---|
| `#1a1a1f` | `var(--surface-2)` |
| `#14141a` | `var(--surface-1)` |
| `rgba(14, 15, 20, 0.82)` | `var(--surface-overlay)` |
| `rgba(15, 18, 28, 0.86)` | `var(--surface-overlay)` |
| `rgba(12, 12, 16, 0.85)` | `var(--surface-1)` with opacity |
| `rgba(18, 21, 32, 0.96)` | `var(--surface-overlay)` |

### Pattern C — Subtle card borders (currently 3–4 values)
| Current value | Unify to |
|---|---|
| `rgba(255, 255, 255, 0.04)` | `var(--border-hairline)` |
| `rgba(255, 255, 255, 0.06)` | `var(--border-subtle)` |
| `rgba(255, 255, 255, 0.07)` | `var(--border-subtle)` |
| `rgba(255, 255, 255, 0.08)` | `var(--border-subtle)` |

### Pattern D — Unit system divergence
`MyProfilePage.css` and `PublicCreatorPage.css` use `rem` throughout;
all other files use `px`. During migration, convert rem to their px equivalents
so the system uses one unit system: **px for fixed sizing, rem only for font-size if desired**.

---

## Step 3 — File migration order (by blast radius, lowest first)

Execute in this order. Each batch can be done independently without breaking other files.

### Batch 1 — Foundation (tokens.css only, no visual changes)
1. `src/ui/styles/tokens.css` — add all new tokens from Step 1

### Batch 2 — Already mostly using tokens (small effort, safe)
2. `Modal.css` — already uses tokens, verify coverage, add missing var() references
3. `QuestionCard.css` — partially uses tokens (`--spacing-*`, `--border-*`), convert remaining hardcoded values

### Batch 3 — Identity system files (recently worked on, highest familiarity)
4. `IdentitySystemsPage.css` — convert all colors and radii
5. `CharacterLibraryModal.css` — convert all colors and radii
6. `EnvironmentLibrarySurface.css` — convert all colors and radii (new file, clean baseline)

### Batch 4 — Core workspace files
7. `CategorySidebar.css` — convert colors; keep purple accent hardcoded only where tokens don't cover
8. `AttributeSelector.css` — convert colors
9. `SelectionSummary.css` — convert colors
10. `ModifierControls.css` — convert colors
11. `NavigationButtons.css` — convert colors
12. `CompletionState.css` — convert colors
13. `ErrorDisplay.css` — convert colors

### Batch 5 — Prompt Preview / Builder panel
14. `PromptPreview.css` — convert colors; the unified identity panel CSS added in the prior session already uses hardcoded values and should be converted too

### Batch 6 — Page-level files
15. `LandingPage.css` — convert colors; note it uses `#0d0d12` for background which is close to `--surface-0`
16. `PromptsPage.css` — convert colors
17. `PromptLibrary.css` — convert colors; note `#14141a` inconsistency (should be `--surface-1`)
18. `PoolHubPage.css` — large file, most effort; convert in sections
19. `MyProfilePage.css` — convert colors AND fix rem→px unit conversion
20. `PublicCreatorPage.css` — convert colors AND fix rem→px unit conversion

### Batch 7 — Secondary pages
21. `WorkingSetBuilder.css`
22. `WorkingSetsPage.css`
23. `UserPoolsPage.css`
24. `FloatingPromptFragments.css`
25. `PromptFragmentsPanel.css`
26. `AuthModal.css`
27. `AccountModal.css`
28. `AdminPage.css`
29. `RandomPromptGenerator.css`

---

## Step 4 — Per-file migration checklist

For each file, perform these operations:

**Surfaces**
- [ ] `#1a1a1f` → `var(--surface-2)`
- [ ] `#14141a` → `var(--surface-1)`
- [ ] `rgba(14, 15, 20, 0.82)` and similar semi-transparent darks → `var(--surface-overlay)`
- [ ] `rgba(255, 255, 255, 0.03)` and `rgba(255, 255, 255, 0.04)` nested backgrounds → keep as-is (these are relative depth steps, not surfaces)

**Text**
- [ ] `#b0b0c3`, `#b9bfd0`, `#cbd5f5` → `var(--text-secondary)`
- [ ] `#9ca3af`, `#9fa0b8`, `#9f9ab8` → `var(--text-tertiary)`
- [ ] `#dbe2ff`, `#eef2ff`, `#f3f2ff` (kicker / label text) → `var(--text-accent)`

**Borders**
- [ ] `rgba(255, 255, 255, 0.04)` → `var(--border-hairline)`
- [ ] `rgba(255, 255, 255, 0.06)`, `rgba(255, 255, 255, 0.07)`, `rgba(255, 255, 255, 0.08)` → `var(--border-subtle)`
- [ ] `rgba(255, 255, 255, 0.12)` → `var(--border-medium)`

**Accent**
- [ ] `#6e56f9` / `rgba(110, 86, 249, ...)` — verify usage; convert background tints to `var(--accent-primary-bg)` and `var(--accent-primary-bg-strong)`

**Radii**
- [ ] `6px` → `var(--radius-xs)`
- [ ] `8px`, `10px` → `var(--radius-sm)`
- [ ] `12px`, `14px` → `var(--radius-md)`
- [ ] `16px`, `18px` → `var(--radius-lg)`
- [ ] `20px`, `22px`, `24px` → `var(--radius-xl)`
- [ ] `999px` → `var(--radius-pill)`

**Units (MyProfilePage, PublicCreatorPage only)**
- [ ] Convert `rem` values to `px` equivalents (1rem = 16px) for all non-font-size properties
- [ ] `font-size` values may stay in rem or convert to px — pick one and be consistent

---

## Step 5 — Additions (new shared classes, not per-file)

These are patterns that repeat across 5+ files and deserve a shared home.

### 5a — Add to App.css (global shared primitives)

```css
/* ── Shared badge ── */
.morpbase-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Shared eyebrow label ── */
.morpbase-eyebrow {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-accent);
}

/* ── Shared input ── */
.morpbase-input {
  background: var(--surface-1);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  padding: 8px 10px;
  font-size: 13px;
}
.morpbase-input:focus {
  outline: none;
  border-color: var(--border-accent);
  box-shadow: 0 0 0 2px rgba(110, 86, 249, 0.12);
}
```

Then gradually migrate individual component input/badge/eyebrow styles to extend these.

### 5b — Scrollbar standard (add to App.css as global)

```css
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(110, 86, 249, 0.3) rgba(255, 255, 255, 0.02);
}
*::-webkit-scrollbar { width: 6px; height: 6px; }
*::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
*::-webkit-scrollbar-thumb { background: rgba(110, 86, 249, 0.3); border-radius: 3px; }
*::-webkit-scrollbar-thumb:hover { background: rgba(110, 86, 249, 0.5); }
```

This removes the 8+ per-file scrollbar definitions.

---

## Step 6 — Verification checklist (run after each batch)

- [ ] No new TypeScript errors (changes are CSS-only, but check if any JS/TSX references classes by name that were changed)
- [ ] App loads without layout regressions
- [ ] Dark backgrounds look consistent across pages — no jarring light/dark jumps
- [ ] Purple accent color still reads correctly in: CategorySidebar active item, CharacterLibraryModal active card, IdentitySystemsPage live lane, PromptPreview identity slot
- [ ] Territory/Environment green still distinguishable from purple
- [ ] Modal still renders correctly (it uses tokens already — confirm they still resolve)
- [ ] MyProfilePage and PublicCreatorPage layout unchanged after rem→px

---

## What this plan does NOT touch

- Component layout (grid columns, widths, flex direction) — layout is correct
- Animation / transition durations — consistent enough already
- Font family (all use Inter) — already unified
- The actual color palette — purple/green/dark is the identity; this plan only
  makes the *same* colors reference the *same* variables
- Feature-level changes — this is purely cosmetic consistency work

---

## Estimated scope

| Batch | Files | Effort |
|---|---|---|
| 1 (tokens.css) | 1 | 30 min |
| 2 (Modal, QuestionCard) | 2 | 30 min |
| 3 (Identity system) | 3 | 45 min |
| 4 (Workspace components) | 7 | 60 min |
| 5 (PromptPreview) | 1 | 30 min |
| 6 (Pages) | 6 | 90 min |
| 7 (Secondary pages) | 9 | 60 min |
| + shared additions | — | 30 min |
| **Total** | **~30 files** | **~6 hours** |

Can be broken into 2–3 sessions by stopping at any batch boundary.
Each batch is safe to execute independently.
