# Context Summary (2026-03-05)

## Project Identity
- Repository: `prompt_generator_v3.2_final`
- App: Stable Diffusion Prompt Generator (v3.2)
- Goal: Pro-grade prompt tooling for frequent IMG/VIDEO prompt creators.
- Core concepts: Working Sets, Builder workflow, User Pools, Prompt Library, Random Prompt Generator.
- Target users: power users who build prompts often (not casual users).

## App Overview (from codebase review)
- Web-based prompt generator that builds structured positive + negative prompts.
- Users pick attributes across categories, can apply weights, and preview prompts.
- Working Sets: reusable, category-bucketed prompt element collections used in the Builder.
- User Pools: reusable prompt element pools with import/export.
- Prompt Library: save/list/import/export prompts.
- Random Prompt Generator: quickly generate structured prompts.
- Auth + persistence via Supabase.
- Hub features currently stored in localStorage with mock data.

## Discord Reply (Final Version)
Hey hygy!

Thanks for the offer. You’re right — I’m looking for people to test my new app. This is more of a pro tool, not for occasional users, but for people who work with IMG/VIDEO generation prompts often. It provides a UI where users can create “Working Sets” of prompt elements, which are then integrated into the “Builder” workflow for assembling prompts. The goal is to build a universal library of Working Sets across the internet — a shared experience. Central to the project are also “User Pools,” which are pools of prompt elements users can create in any theme they can imagine.

If you’re interested in testing, I want to be honest and respectful of your time: it’s not “just another prompt generator,” but a tool to organize and create valuable prompts. I’m looking for thoughtful testers who can spend time with it and provide detailed feedback so the app can be refined properly. If you want to hop on, I’ll share the feedback schema.

## Optimized Short Line
- “I’m looking for thoughtful testers who can spend time with it and provide detailed feedback so the app can be refined properly.”

## Feedback Schema (v1)
**1) Tester Context**
- Name / handle:
- Experience level (Beginner / Intermediate / Advanced):
- Primary use case (IMG / VIDEO / Both):
- Tools/models used (e.g., SDXL, ComfyUI, A1111, Runway, etc.):
- Device + OS + Browser:

**2) Session Overview**
- Date:
- Time spent:
- Goals for this session:

**3) What Worked Well**
- Feature(s) used:
- What felt smooth or valuable:
- Any standout moments:

**4) Issues / Bugs**
- Summary (short title):
- Steps to reproduce:
- Expected result:
- Actual result:
- Severity (Low / Medium / High / Blocker):
- Frequency (Once / Sometimes / Always):
- Screenshots / clips (if available):

**5) Usability / UX Feedback**
- Confusing flows or labels:
- Friction points:
- Missing guidance or clarity:

**6) Prompt Quality**
- Did outputs match intent? (Yes / Partially / No)
- Where it fell short:
- Any notable improvements when using Working Sets / User Pools:

**7) Feature-Specific Feedback**
- Working Sets:
- Builder:
- User Pools:
- Random Prompt Generator:
- Prompt Library (save/import/export):

**8) Suggestions / Requests**
- Top 3 improvements you want:
1.
2.
3.

**9) Overall**
- Satisfaction (1–10):
- Would you continue using it? (Yes / Maybe / No)
- Would you recommend it? (Yes / Maybe / No)
- Any final notes:
