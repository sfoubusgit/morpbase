## MorpBase V2 Foundation Prompt

Use the following prompt in a fresh analysis session. This is for V2 foundation work only. It is not for implementation yet.

```md
You are analyzing the MorpBase codebase, concept decisions, and competitor context in order to define the correct foundation for a future `MorpBase V2`.

Your task is not to preserve V1 terminology by default.
Your task is not to defend current structures just because they already exist.
Your task is not to jump into screens, components, routes, or implementation details.

Your task is to determine:

- what the true heart of MorpBase is
- what V2 must preserve from that heart
- what V2 must be better at than V1
- what V2 must be better at than competing prompt tools
- what can change radically without betraying MorpBase

This is a top-down product-foundation analysis for a true V2 reshaping, not a feature plan.

## Critical framing

Treat V2 as:

- a true successor to V1
- not a lighter side product
- not a stripped-down compromise
- not a cosmetic cleanup

Assume the following:

- the heart of MorpBase should stay the same
- terminology is negotiable
- major systems may be renamed, merged, hidden, split, or rebuilt
- user experience, clarity, and competitiveness matter as much as internal system richness

Also assume:

- if a current V1 system does not earn its place in V2, it may need to be transformed or removed
- if a V1 concept is strategically right but presented badly, the concept may survive while the expression changes completely

## Main objective

Produce a V2 foundation analysis that answers:

1. What is the non-negotiable heart of MorpBase?
2. What about V1 is structurally valuable versus merely inherited?
3. What must V2 be meaningfully better at than V1?
4. What must V2 be meaningfully better at than wildcard / prompt-management / dynamic-prompt alternatives?
5. What kinds of radical change are acceptable if the heart is preserved?
6. What should the V2 foundation be before any new build begins?

## Priority of truth sources

Use this reasoning order:

1. Ontology / main identity / primary-center decisions
2. Product-meaning and conceptual mismatch docs
3. Competitor / differentiation analysis
4. Current live runtime structure
5. Current terminology and visible V1 surface language

If current runtime or terminology conflicts with deeper product truth:

- call it out explicitly
- do not silently preserve it

## Read in this order

Read these documents first:

1. `MORPBASE_ONTOLOGY_REASSESSMENT.md`
2. `MORPBASE_MAIN_IDENTITY_DECISION.md`
3. `MORPBASE_PRIMARY_USER_FACING_CENTER_DECISION.md`
4. `MORPBASE_SUPPORTING_SYSTEM_RELATIONSHIP_DECISION.md`
5. `MORPBASE_BIGGEST_CONCEPTUAL_MISMATCH_ANALYSIS.md`
6. `MORPBASE_BUILDER_CENTERED_MEANING_ANALYSIS.md`
7. `MORPBASE_SIMPLIFICATION_STRATEGY.md`
8. `MORPBASE_PROJECT_UNDERSTANDING_REPORT.md`
9. `PROMPT_TOOLS_VS_MORPBASE_ANALYSIS.md`
10. `PROMPT_TOOLS_COMPETITOR_MATRIX.md`
11. `FUTURE_PROJECTS_AHEAD.md`
12. `IDENTITY_SYSTEMS_REALM_ANALYSIS.md`
13. `BACKUP_LOG_20_03_2026.md`

Then inspect these runtime surfaces:

14. `src/ui/App.tsx`
15. `src/ui/components/LandingPage.tsx`
16. `src/ui/components/CategorySidebar.tsx`
17. `src/ui/components/PromptPreview.tsx`
18. `src/ui/components/PromptsPage.tsx`
19. `src/ui/components/UserPoolsPage.tsx`
20. `src/ui/components/PoolHubPage.tsx`
21. `src/ui/components/IdentitySystemsPage.tsx`

You may inspect other directly relevant files if needed, but stay focused on foundation, not implementation.

## What to analyze

### A. The true heart of MorpBase

Determine the deepest non-negotiable truth of MorpBase.

Be precise.

Do not answer with current terminology first.
Answer in product-meaning terms.

Questions to answer:

- What must survive for MorpBase to still be MorpBase?
- What is the real value beneath V1’s labels?
- What problem does MorpBase solve that is still worth solving in V2?
- What kind of experience is MorpBase fundamentally trying to create?

### B. What in V1 is essential versus inherited

Critically separate:

- essential structure
- useful but transformable structure
- inherited noise
- conceptual drift

Evaluate major V1 systems such as:

- Builder
- Prompt Preview
- Pools
- Territories
- Prompt Archive / Prompt Sets
- Identity Systems
- Pool Hub

For each one, determine whether it should be:

- preserved
- radically transformed
- merged with something else
- hidden as advanced
- demoted
- or removed

### C. What V2 must be better at than V1

Do not give generic improvement goals.

Be specific about where V1 is currently weaker than it should be.

Examples to examine:

- first-use clarity
- conceptual legibility
- system hierarchy
- workflow guidance
- terminology burden
- emotional confidence
- speed to value
- visible power without visible chaos
- product elegance

### D. What V2 must be better at than competing tools

Compare V2 against the main alternative classes:

- wildcards / Dynamic Prompts
- prompt box enhancement tools
- prompt history / prompt-management tools
- visual prompt builders

Determine exactly where MorpBase V2 must win.

Important:

- do not say MorpBase must win at everything
- choose the specific dimensions where it must clearly feel stronger

For each dimension, explain:

- why it matters
- why current V1 does or does not already achieve it
- what the V2 standard should be

### E. Radical change boundaries

Define what can change radically without betraying MorpBase.

Examples:

- naming
- system boundaries
- navigation
- first-use flow
- how workflows are structured
- how support systems appear
- whether current concepts stay visible at all

Also define what should not be compromised even during radical change.

### F. V2 product posture

Determine what MorpBase V2 should feel like as a product.

Choose the intended posture more precisely.

Examples to examine:

- more powerful without more complexity
- more elegant without becoming shallow
- more user-friendly without losing depth
- more competitive without collapsing into simpler existing tool categories

This section should make clear what kind of product V2 is trying to become.

### G. Anti-patterns for V2

Identify what would make V2 fail even if it looks cleaner.

Examples:

- making V2 a weaker “lite” MorpBase
- preserving terminology that hurts understanding
- flattening MorpBase into just another prompt builder
- overreacting to V1 confusion by removing the real differentiators
- rebuilding around architecture instead of around product meaning
- trying to beat wildcard tools on wildcard depth

### H. The foundation V2 needs before any rebuild

Determine what must be locked before actual V2 implementation starts.

Examples:

- non-negotiable heart
- competitive advantage requirements
- system keep / transform / drop matrix
- new first-use model
- product hierarchy
- realm / support-system boundaries

Do not write a technical implementation plan.
Stay at the foundation level.

## Required output structure

Write the result as a report with these sections:

1. `Executive Conclusion`
2. `The Non-Negotiable Heart Of MorpBase`
3. `What V1 Got Right`
4. `What V1 Is Carrying That V2 Should Not Preserve By Default`
5. `What V2 Must Be Better At Than V1`
6. `What V2 Must Be Better At Than Competing Tools`
7. `What Can Change Radically Without Betraying MorpBase`
8. `What Must Not Be Compromised`
9. `V2 Anti-Patterns`
10. `V2 Foundation Requirements`
11. `Open Tensions / Unresolved Questions`
12. `Final Judgment`

## Additional output requirements

- Be critical, not sentimental.
- Do not preserve V1 labels automatically.
- Distinguish clearly between:
  - MorpBase’s heart
  - V1’s current expression of that heart
  - V2’s better possible expression
- Be honest if some beloved V1 structures are harming usability or competitiveness.
- Do not confuse “simpler” with “weaker.”
- Explicitly protect V2 from becoming a sidekick or reduced version of V1.

## Final deliverable

Save the report as:

`MORPBASE_V2_FOUNDATION_ANALYSIS.md`

Do not implement anything after writing the report.
Stop after the analysis.
```

