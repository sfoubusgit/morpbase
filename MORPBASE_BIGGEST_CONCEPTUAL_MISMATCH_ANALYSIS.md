# MorpBase Biggest Conceptual Mismatch Analysis

## Purpose

This document answers the next structural question:

- given the concept hierarchy already established, what is the biggest conceptual mismatch in the current product?

This is not yet a fix plan.

It is a diagnosis.

## Short Answer

The biggest conceptual mismatch is:

- **the product still teaches MorpBase as a multi-center prompt-parts system, while the real system is Builder-centered workflow authoring shaped by supporting context layers**

More simply:

- the current product presentation does not match the actual center of use

## What The Concept Structure Says

From the recent concept decisions:

- MorpBase main identity = `Prompt Workflow Authoring System`
- primary user-facing center = `Builder workspace + Prompt Preview loop`
- Territories = recommended workflow context layer
- Pools = backstage source-library layer
- Prompt Library / Prompt Sets = downstream capture layer

If this structure were reflected clearly, the user should feel:

- I mainly work inside Builder
- other systems help shape or preserve that workflow

But that is not the main impression the current product gives.

## The Real Mismatch

The current product still often presents MorpBase as if it were:

- a prompt builder plus several adjacent systems
- or a system of reusable prompt pieces
- or a collection of parallel feature areas

That creates a center-of-gravity problem.

Instead of clearly teaching:

- one central workspace
- shaped by supporting systems

the current product often suggests:

- multiple equal centers competing for meaning

## Where This Shows Up

## 1. Landing Page Teaches The Wrong Core

`LandingPage.tsx` still leads with:

- `Build prompts from reusable pieces.`

This is the single clearest conceptual mismatch.

Why it is a problem:

- it frames MorpBase first as a prompt-parts tool
- it invites comparison to wildcards / dynamic prompts / prompt builders
- it understates the workflow-session and workspace nature of the product

The landing pipeline also currently places:

- `User Pools -> Territories -> Builder -> Prompt Library`

This is structurally understandable, but conceptually misleading.

Why:

- it teaches the support systems before the main workspace
- it implies Builder is one stage in a pipeline rather than the primary center of use

So the landing page currently teaches a system architecture sequence more than a user reality.

## 2. App Navigation Still Makes Several Secondary Systems Feel Like Equal Centers

In `App.tsx`, the main navigation exposes:

- Builder
- Prompts
- User Pools
- My Profile
- Pool Hub

This gives the app a strong multi-center feeling.

The user does not naturally see:

- one main workspace and several subordinate systems

Instead, the product shell says:

- these are parallel product areas of similar importance

That is not aligned with the concept structure already established.

## 3. The Clearest Conceptual Explanation Lives Too Deep In User Pools

`UserPoolsPage.tsx` contains some of the best and most correct language in the whole product:

- `Pool = reusable source material`
- `Territory = focused workflow space built from selected pool sections`

This is exactly the kind of distinction the product needs.

But it appears deep inside:

- the User Pools area

That means the clearest conceptual truth is currently buried inside a supporting system instead of helping define the overall product.

## 4. Prompt Preview Still Flattens Supporting Systems Into Workflow Chips

`PromptPreview.tsx` shows:

- Mode
- Pools
- Territory
- Focus

This is useful operationally, but conceptually it still tends to flatten several different system roles into a single chip row.

That makes it harder to feel the hierarchy:

- Territory as workflow context
- Pools as backstage source libraries

Instead they can read as sibling active things of similar type.

This is not the deepest mismatch, but it contributes to the broader blur.

## 5. Builder Is Central In Practice, But Not Central Enough In Product Meaning

`App.tsx` already makes Builder the actual runtime center.

The active session lives there.
The question flow lives there.
Territory biasing lives there.
Prompt Preview attaches there.

So the practical structure is already closer to the correct concept than the explanatory structure is.

This means the mismatch is not mainly:

- architecture

It is more:

- conceptual emphasis
- product meaning
- center-of-gravity teaching

## The Deepest Form Of The Mismatch

The deepest mismatch can be phrased like this:

- **MorpBase behaves like a Builder-centered workflow authoring system, but still introduces itself like a reusable prompt-parts product with several parallel systems around it**

That is why users can still look at it and think:

- "another prompt builder"
- "another dynamic prompts / wildcard-like tool"
- "a system with too many separate nouns"

## Why This Matters More Than Other Mismatches

There are other conceptual mismatches too:

- Territories are still somewhat cognitively heavy
- Pools and Territories are still too close conceptually in some places
- saved prompt systems are not perfectly positioned

But those are not the biggest mismatch.

The biggest mismatch comes earlier:

- the product still does not teach the right center

If the center is wrong, even the better distinctions later have less power.

## Final Diagnosis

The biggest conceptual mismatch is not:

- just Territory wording
- just Pool wording
- just Builder wording

It is:

- **a mismatch between the true center of the product and the center the product currently teaches**

The true center is:

- Builder-centered workflow authoring

The taught center is still too often:

- reusable pieces
- parallel systems
- prompt-building mechanics

## One-Line Verdict

The biggest conceptual mismatch in MorpBase right now is:

- **the product is Builder-centered in reality, but not Builder-centered enough in meaning**
