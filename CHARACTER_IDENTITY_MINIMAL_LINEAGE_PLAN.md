# Character Identity Minimal Lineage Plan

## 1. Executive Conclusion

The Character controlled proof should include **minimal saved-output lineage hooks**.

Not because the first proof needs a full continuity-history system.
But because without any lineage grounding at all, the lane risks becoming:

- elegant local CRUD
- plus prompt injection

That would be too weak for a realm that is supposed to prove:

- reusable continuity across workflows
- grounded by repeated real use

So the right conclusion is:

- the first proof does **not** need full lineage infrastructure
- but it **does** need enough saved-output memory that MorpBase can later tell:
  - a prompt was saved with a Character active
  - which Character it was
  - and still understand that link even if the live Character changes later

The cleanest summary is:

> The first Character proof needs a narrow saved-output identity link, not a full lineage system and not zero lineage at all.

---

## 2. Why Minimal Lineage Is Necessary

Archive-lineage grounding was not a decorative idea in the Identity Systems preparation work.
It became one of the main realism constraints.

That means the first proving lane cannot be judged only by:

- whether Character can be created
- whether Character can be applied
- whether Character can influence prompt output

It must also leave evidence that:

- Character was actually used in real saved workflows

Without that, the first proof would still be too close to:

- a reusable overlay
- a better prompt helper
- a nice side system with no durable archive meaning

Minimal lineage is what prevents that collapse.

---

## 3. What “Lineage” Means In The First Proof

For the controlled proof, lineage should be interpreted narrowly.

It does **not** yet mean:

- a full history graph
- version chains
- relationship-aware continuity tracking
- output clustering
- automated refinement from prior prompt use
- image-result analysis

For the first proof, lineage should mean only:

- saved outputs can remember their Character link in a durable enough way that future continuity use can be recognized later

That is a much smaller requirement.

---

## 4. What The Minimal Lineage Layer Must Prove

The first proof should prove five things through lineage hooks.

### 1. Character use survives beyond the live session

The archive should be able to remember that a saved prompt was authored with a Character active.

### 2. Character use is not just hidden in the prompt text

The system should not rely on:

- re-parsing prompt text later
- user memory
- tags or notes hacks

to know whether Character was involved.

### 3. Archive meaning remains legible if the Character changes later

If the user:

- renames a Character
- edits it
- retires it
- deletes it

the saved prompt should not become semantically empty.

### 4. Later continuity analysis stays possible

Even if the first proof does not yet implement usage analysis, the archive should preserve enough that future work can ask:

- how often was this Character used?
- what prompts were saved with it?
- which outputs actually belong to this recurring entity?

### 5. The first proof stays small

The lineage hook must remain:

- narrow
- inexpensive
- non-invasive to the first proof

Otherwise it will overgrow the lane.

---

## 5. What Minimal Lineage Must Not Try To Do Yet

To stay controlled, the first proof should explicitly avoid all of these.

### 1. Full usage history

Do not build:

- every activation event
- every switch event
- every edit history step

### 2. Image-result lineage

Do not build:

- image output tracking
- generation result tracking
- visual result comparison

### 3. Entity refinement automation

Do not build:

- auto-suggested Character edits
- archive-driven Character learning loops

### 4. Multi-lane relationship lineage

Do not build:

- Character + Outfit lineage
- Character + Prop lineage
- realm-wide continuity webs

### 5. Public / social lineage

Do not build:

- profile-linked Character lineage
- published Character usage traces

### 6. Heavy realm scaffolding

Do not build a generic continuity-history system before the first lane proves real need.

---

## 6. Current Archive Reality

The current archive stack is thin, which is useful for this planning step.

### Current saved prompt model

In [prompts.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/types/prompts.ts), `SavedPrompt` currently stores:

- `id`
- `name`
- `positive`
- `negative`
- `tags`
- `model`
- `purpose`
- `usedAt`
- `note`
- timestamps

There is currently **no identity linkage**.

### Current persistence reality

In [promptStore.ts](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/engine/promptStore.ts), the archive persists prompt data only.

In Supabase migrations:

- [0001_init.sql](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/supabase/migrations/0001_init.sql)
- [0002_add_prompt_metadata.sql](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/supabase/migrations/0002_add_prompt_metadata.sql)
- [0015_add_prompt_sets.sql](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/supabase/migrations/0015_add_prompt_sets.sql)

the saved prompt table remains prompt-centered, not identity-aware.

### Current save flow

In [PromptLibrary.tsx](/c:/Users/Sina/Desktop/PROMPTGEN/prompt_generator_v3.2_final/src/ui/components/PromptLibrary.tsx), saving currently captures:

- prompt text
- prompt metadata
- prompt set assignment

It does **not** capture:

- active Character state

### What this means

The first proof cannot honestly claim archive grounding yet.
It must at least create a hook for it.

---

## 7. Candidate Minimal Lineage Models

## Candidate A: No lineage at all

Meaning:

- Character affects the live workflow only
- saved prompts remember nothing explicit about Character

Strength:

- simplest possible first proof

Failure:

- too weak
- breaks the archive-grounding constraint
- makes Character feel too close to a session overlay

Judgment:

- reject

## Candidate B: Encode lineage only indirectly in prompt text, tags, or notes

Meaning:

- rely on prompt text or tags to reconstruct Character use later

Strength:

- easy to do

Failure:

- semantically weak
- easy to drift
- too user-dependent
- blurs identity with prompt text again

Judgment:

- reject

## Candidate C: Save a reference-only Character link on the saved prompt

Meaning:

- saved output remembers which Character was active by ID only

Strength:

- narrow
- lightweight
- future-usable

Weakness:

- if Character changes or is deleted later, archive meaning becomes fragile

Judgment:

- acceptable baseline
- not ideal alone

## Candidate D: Save a Character reference plus a compact display snapshot

Meaning:

- saved output remembers:
  - the Character reference
  - and a tiny snapshot of what that Character was called when saved

Strength:

- still minimal
- preserves archive legibility even if the live Character changes later
- supports later filtering and usage understanding

Weakness:

- slightly more structure than pure reference-only

Judgment:

- best current minimal model

## Candidate E: Full lineage side system now

Meaning:

- create a broader identity-lineage subsystem before the first proof is proven

Strength:

- conceptually rich

Failure:

- too heavy
- too early
- disproportional to the first proof

Judgment:

- reject

---

## 8. Recommended Minimal Lineage Standard

The strongest current minimum is:

- save a Character link for saved prompts
- preserve both:
  - a durable Character reference
  - a compact archive-readable snapshot

This should be treated as a **minimal lineage hook**, not full lineage infrastructure.

### What the hook must remember

At minimum, a saved prompt created while a Character is active should later be able to answer:

- was a Character active when this was saved?
- which Character was it linked to?
- what was the Character called at save time?

### What the hook may omit for now

- full identity field snapshot
- phrase bundle snapshot
- usage event history
- edit history
- relationship context
- lane-general realm metadata

That keeps the lineage hook narrow.

---

## 9. What The Archive Must Eventually Be Able To Show

Even if the first proof does not implement the full UI immediately, the lineage hook should preserve enough that the archive can later show:

### 1. A prompt was saved with Character X

This is the most basic proof of grounded continuity use.

### 2. Character X has saved prompt evidence

This supports later reality checks such as:

- has this Character actually been used?

### 3. A deleted or changed Character still leaves understandable archive traces

This is why the compact snapshot matters.

### 4. Future filtering remains plausible

For example:

- show prompts saved with this Character

That does not need to be built now.
But the first proof should not block it.

---

## 10. Where The Hook Should Conceptually Live

This is one of the places where certainty should remain disciplined.

The first proof does **not** yet need to fully lock whether lineage should be stored as:

- embedded saved-prompt fields
- a sidecar Character-to-prompt link record
- or a hybrid

What should be locked now is the conceptual requirement:

- saved outputs need an explicit Character lineage hook

### What should remain open

- exact storage strategy
- exact table or type shape
- whether the first proof starts local-first, cloud-first, or dual

### Why this should remain open

Because the reassessment already showed that exact shapes were hardening too quickly.

So the lineage truth should be:

- **what must be remembered**

before it becomes:

- **exactly where and how it is stored**

---

## 11. Minimal Saved Facts Recommendation

The strongest current minimum set of facts is:

### Required

- saved prompt id
- active Character reference at save time
- Character display name snapshot at save time

### Optional but plausible

- lane marker if needed for future multi-lane coexistence

### Explicitly not required now

- Character summary snapshot
- phrase snapshot
- visual-anchor snapshot
- usage counters
- edit lineage

This is the narrowest useful grounding layer.

---

## 12. How This Relates To The Reassessment

This plan directly answers the reassessment correction that archive-lineage had become:

- conceptually central
- but planning-sequentially late

Now the lane has a stricter grounding rule:

- no more assuming Character is sufficiently proven by live session behavior alone

The first proof must preserve at least one archive-facing trace of real Character use.

---

## 13. Risks

### 1. Too little lineage

If the first proof saves nothing explicit, Character will still feel too close to a live-only overlay.

### 2. Too much lineage

If the first proof tries to build rich history systems now, it will overgrow the lane.

### 3. Weak archive meaning under deletion or renaming

If lineage is reference-only, archive understanding may collapse when Characters change later.

### 4. Abuse of tags or notes as fake lineage

This would technically work, but conceptually weaken the lane.

### 5. Premature storage hardening

If this plan immediately locks exact persistence architecture, it will repeat the same certainty problem the reassessment just corrected.

---

## 14. Final Recommendation

The Character controlled proof should preserve:

- one narrow saved-output Character link
- plus a compact human-readable snapshot

It should not yet build:

- a full lineage system
- a history graph
- a generic realm continuity backend

## Final Lock

Character Identity will only count as properly grounded if saved prompts can remember Character use explicitly.

The right first-proof standard is:

- **a minimal Character lineage hook**

not:

- **no lineage**

and not:

- **full lineage infrastructure**
