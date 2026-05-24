# Images in MorpBase — Concept Notes

A living collection of ideas for how images should work in MorpBase. Guiding
question: **how do images add value without turning a prompt tool into an image
gallery?**

---

## 1. Guiding principle
**The image is the receipt, not the product.** MorpBase's value is the
prompt/world craft. Images exist to *prove a recipe works* and to *help users
choose* — never to become the hero or a popularity contest. Every layout keeps
the prompt/recipe primary; the image rides along as supporting evidence.

Corollary brand line: *"coherence is the proof."* In-app the image proves the
prompt; on CivitAI we share the prompt and the coherence proves the tool. Same
philosophy both directions.

---

## 2. Two kinds of images
- **Output images** — renders users (or we) made *from* a prompt. Role: proof,
  examples, visual browsing.
- **Input / reference images** — images brought *in* to shape a prompt. Role:
  moodboard, style/character reference, "describe this → prompt," consistency
  anchor.

Keeping these mentally separate clarifies every feature decision.

---

## 3. Where images could live (surfaces)
- **On a saved Prompt / Prompt Set** — a small "result" thumbnail proving the
  recipe. Card still leads with the prompt text.
- **On lane items (the big one for the library):**
  - **Style cards** — a tiny example render per style so users browse looks
    *visually* instead of reading descriptions. Hugely valuable for a large
    Style Lab.
  - **Character cards** — reference art of the character (avatar already exists).
  - **Environment / Object / Wardrobe cards** — one example each.
- **On Universe entries** — a few representative renders (a cover + a strip) that
  signal the world's look at a glance.
- **Captured Sets** — attach the render that came from the captured combo.
- **Workspace** — an optional **reference/moodboard slot** beside the assembled
  prompt.
- **Profile "Currently working on" slot** — a single, current, ephemeral image on
  the user's profile (see §5b). The profile-level expression of "image as
  receipt": shows aliveness without a gallery.

---

## 4. Roles images play
1. **Proof** — "this prompt produced this."
2. **Visual browsing** — pick a style/character/world by example, not by text.
3. **Consistency anchor** — attach reference art to a character so future
   prompts (or img2img) stay on-model.
4. **Onboarding / seeding** — ship official example renders so the library isn't
   a wall of text on first run.
5. **Inspiration input** — drop an image to start a prompt (needs vision; future).
6. **Identity art** — covers for universes and characters.

---

## 5. Presentation rules (so images stay subordinate)
- **Uniform, modest size** (contact-sheet feel) — no single image dominates.
- **Never an orphan image** — always shown with its prompt adjacent/expandable.
- **Click to enlarge**, but small by default.
- **Language:** "results / renders / proofs," not "art / gallery."
- **No full-bleed gallery as a front door** — the builder/library stays home.

---

## 5b. The "Currently working on" slot (profile status image)
A single, current, **ephemeral** image on a user's profile — like a "now
showing / studio" status rather than a portfolio. Possibly the cleanest way to
let users show work *without* a gallery.

Why it fits the philosophy:
- **Singular by design** — one slot literally cannot become a feed; the
  constraint is the feature.
- **Ephemeral** — "currently" rotates and expires, so no pressure to curate a
  perfect archive. Low stakes, one image, minimal storage + moderation.
- **Recipe-anchored** — pair it with what they're building ("Currently working
  on *Dust Run × Comic*") so attention still flows to the world/style, with a
  link straight into that recipe.
- **Signals aliveness**, not popularity — no likes, no counts, just "here's what
  I'm in right now."

Design forks:
- **Manual vs auto:** auto-populate from the active Workspace/builder session
  (effortless, always honest) **with a manual override** is likely the sweet spot.
- **WIP framing** ("work in progress / studio") over "finished piece" keeps it
  casual and anti-gallery.
- Optional: a tiny "studio" line — current universe + style + the WIP render.

## 6. Engagement model (if any social layer ever)
- **Signal = usefulness, not aesthetics.** Track "copied," "cloned/forked,"
  "added to a universe" — NOT likes/hearts/followers on images.
- That keeps attention on reusable craft and structurally prevents a
  vanity-metric feed.
- Attribution flows to the **recipe** (world + style + prompt), not just the
  pretty picture.

---

## 7. Reverse direction: image → prompt
- **Attach a reference image to a character/style** as a consistency anchor.
- **"Describe this image → draft prompt"** (image interrogation) — powerful, but
  needs a vision model. Fits the AI roadmap, later phase.
- **img2img handoff** — export prompt + reference together for tools that take
  both.

---

## 8. Technical / practical considerations
- **Storage:** current stores are localStorage — base64 images bloat it fast and
  hit quota. Options: store only **small thumbnails** locally; move blobs to
  **IndexedDB**; or **link-out** (paste an image URL) instead of hosting.
- **Hosting at scale = burden:** storage cost + **moderation/NSFW** + privacy.
  Strong argument to stay link-light and *not* become an image host.
- **Privacy default:** local-only unless the user explicitly shares.
- **Performance:** lazy-load thumbnails; cap dimensions.

---

## 9. Anti-patterns to avoid
- Gallery feed as the landing page.
- Likes / follower counts on images.
- Big glossy hero cards that pull the eye off the recipe.
- Becoming a CivitAI-style image host / social app.

---

## 10. Rough phasing
- **P1 — Local proof layer:** optional "result" thumbnail on Prompt Sets +
  lane items. Local attach only, no hosting, no metrics. Validates the feel.
- **P2 — Seeded examples:** ship official example renders for library items so
  styles/characters/worlds are browsable visually out of the box.
- **P3 — Reference/consistency:** attach reference images to characters/styles;
  optional "describe image → prompt" (vision-assisted).
- **P4 (only if wanted) — Opt-in sharing:** usefulness-signals (copied/cloned),
  careful storage + moderation, still recipe-first.

---

## 11. Open questions
- Local-only, or eventually shared between users?
- Host images, or link-out / thumbnail-only?
- Storage backend: IndexedDB vs Supabase storage?
- Which surface first — Prompt Sets, or Style/Character cards (visual browsing)?
- Do we seed official example renders for the built-in library? (Big onboarding
  win, but a lot of images to make.)

---

## 12. Priorities (value vs effort)

**Build first — high value, low effort, low risk:**
1. **"Currently working on" profile slot** (§5b) — one local image, optionally
   auto from the active session, recipe-anchored. Tiny storage, no moderation,
   structurally anti-gallery. The best first proof of the whole philosophy.
2. **Result thumbnail on Prompt Sets / Captured Sets** — optional local image
   attach on existing cards. Establishes the "image = receipt" pattern. Pure UI
   + small local storage.

**Next — high value, more *content* effort than code:**
3. **Style Lab swatch images** — one example render per style for visual
   browsing. Big onboarding win; the effort is producing/seeding the example
   images (+ the storage decision), not much code.
4. **Per-character reference / look book** — attach reference art to characters
   (the `avatar` field already exists); let users mark one render as canonical.

**Later — needs infra or AI:**
5. **Image → prompt** (vision interrogation, consistency anchors) — depends on a
   vision/AI step.
6. **Opt-in sharing with usefulness-signals** — needs hosting/IndexedDB +
   moderation; only if a light social layer is wanted.

**Gating decision (settle before #3+):** storage approach —
thumbnails-only vs IndexedDB vs link-out. Unblocks anything storing more than
one image.

**Recommended first build:** the "Currently working on" slot — smallest, most
on-philosophy, and a satisfying visible win.

## 13. Parking lot / raw ideas
- A "contact sheet" export: a Set's prompts + their result thumbnails as one
  shareable sheet ("made in MorpBase").
- Style Lab "swatch" view: every style as a tiny example chip.
- Per-character "look book": all renders attached to one character, on its page.
- Mark a render as the character's **canonical reference** (the one to match).
