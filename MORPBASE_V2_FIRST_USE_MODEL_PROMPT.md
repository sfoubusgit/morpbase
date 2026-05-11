## MorpBase V2 First-Use Model Prompt

Use the following prompt in a fresh analysis session. This is for V2 first-use and onboarding structure only. It is not for implementation yet.

```md
You are analyzing MorpBase in order to define the correct `first-use model` for `MorpBase V2`.

Your task is not to preserve the V1 onboarding path.
Your task is not to design polished UI screens yet.
Your task is not to jump into routes, components, or technical implementation.

Your task is to determine:

- what a new V2 user should see first
- what they should understand in the first 30 seconds
- what they should do in the first 5 minutes
- how V2 should reveal depth without overwhelming them
- how V2 should prove MorpBase’s value faster than V1 and faster than simpler competing tools

## Critical framing

Assume:

- V2 must be a stronger successor, not a lighter side product
- V2 should preserve MorpBase’s heart while radically improving clarity and usability
- V2 must not collapse into “just another prompt builder”
- V2 must not explain itself through internal nouns first
- V2 must make its differentiated value emotionally obvious fast

Also assume:

- V2 already has a foundation analysis
- V2 already has a keep / transform / drop matrix
- the first-use model must now express that foundation in user terms

## Main objective

Produce a first-use model analysis that answers:

1. What should a new user understand first?
2. What should they do first?
3. What should the first successful MorpBase V2 experience be?
4. What should remain hidden or secondary during first contact?
5. How can V2 feel more compelling than simpler competitors within minutes?

## Priority of truth sources

Use this order when reasoning:

1. `MORPBASE_V2_FOUNDATION_ANALYSIS.md`
2. `MORPBASE_V2_KEEP_TRANSFORM_DROP_MATRIX.md`
3. Ontology / main identity / primary-center decisions
4. Simplification and competitor docs
5. Current V1 runtime surfaces

If V1’s current first-use flow conflicts with V2 truth:

- call it out explicitly
- do not preserve it automatically

## Read in this order

1. `MORPBASE_V2_FOUNDATION_ANALYSIS.md`
2. `MORPBASE_V2_KEEP_TRANSFORM_DROP_MATRIX.md`
3. `MORPBASE_ONTOLOGY_REASSESSMENT.md`
4. `MORPBASE_MAIN_IDENTITY_DECISION.md`
5. `MORPBASE_PRIMARY_USER_FACING_CENTER_DECISION.md`
6. `MORPBASE_SUPPORTING_SYSTEM_RELATIONSHIP_DECISION.md`
7. `MORPBASE_SIMPLIFICATION_STRATEGY.md`
8. `PROMPT_TOOLS_COMPETITOR_MATRIX.md`
9. `MORPBASE_PROJECT_UNDERSTANDING_REPORT.md`

Then inspect these runtime surfaces:

10. `src/ui/components/LandingPage.tsx`
11. `src/ui/App.tsx`
12. `src/ui/components/CategorySidebar.tsx`
13. `src/ui/components/PromptPreview.tsx`
14. `src/ui/components/PromptsPage.tsx`
15. `src/ui/components/UserPoolsPage.tsx`
16. `src/ui/components/IdentitySystemsPage.tsx`

## What to analyze

### A. The first 30 seconds

Determine:

- what V2 must communicate immediately
- what the user should feel they are entering
- what should not be explained yet

Answer in product-perception terms, not architecture terms.

### B. The first meaningful action

Determine:

- what the user should do first
- what the first concrete success should be
- what action best proves MorpBase’s value quickly

### C. The first 5 minutes

Design the conceptual sequence of what should happen in the first five minutes.

Examples to consider:

- open workspace
- shape something
- see output update
- save something worth keeping
- discover deeper reuse or context

### D. Layering and progressive disclosure

Determine what should be:

- front-stage immediately
- introduced only after early value is felt
- advanced or later

Use the V2 keep/transform/drop matrix as a constraint.

### E. Relationship to competitors

Determine how the first-use flow should prevent MorpBase from being mistaken for:

- wildcards / Dynamic Prompts
- a prompt editor
- a prompt history tool
- a generic category-based prompt builder

### F. Support-system timing

Determine when the user should encounter:

- reusable context
- reusable source material
- archive / reuse
- identity / continuity concepts

Do not assume everything appears in the first contact.

### G. Anti-patterns

Identify first-use mistakes that would weaken V2, such as:

- explaining through nouns first
- exposing too many systems too early
- making the user set up context before they feel value
- letting V2 feel like a lighter but less impressive V1

## Required output structure

Write the result as a report with these sections:

1. `Executive Conclusion`
2. `Why First-Use Matters So Much For V2`
3. `What The User Must Understand In The First 30 Seconds`
4. `What The User Should Do First`
5. `The First 5 Minutes Of MorpBase V2`
6. `What Must Stay Hidden Or Secondary At First`
7. `How V2 Should Reveal Depth`
8. `How The First-Use Model Must Compete Against Simpler Tools`
9. `First-Use Anti-Patterns`
10. `Recommended V2 First-Use Model`
11. `Open Questions`
12. `Final Judgment`

## Additional output requirements

- be concrete
- do not fall back into internal terminology too early
- distinguish between:
  - product truth
  - first-use expression
  - later advanced depth
- protect V2 from becoming either:
  - too abstract
  - or too shallow

## Final deliverable

Save the report as:

`MORPBASE_V2_FIRST_USE_MODEL_ANALYSIS.md`

Do not implement anything after writing the report.
Stop after the analysis.
```

