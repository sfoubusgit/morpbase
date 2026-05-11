# Character Avatar MVP Spec

## 1. Purpose

This document defines the cleanest first MVP for adding small profile pictures to `Character Identity`.

It is intentionally **not** a full image system.

The goal is:

- make Characters feel more like real identity entities
- improve recognition in the Character lane
- strengthen the visual presence of the live `Identity Systems` realm

without introducing:

- galleries
- multi-image management
- cloud media infrastructure
- a full asset library

---

## 2. Executive Decision

The first version should add:

- **one optional square avatar per Character**

It should be:

- local-first
- lightweight
- visually secondary to the identity fields
- shown in the Character library, Character detail view, and live workflow context where useful

It should **not** become:

- a portrait generation system
- a multi-image reference board
- a media realm inside Identity Systems

This is a `Character avatar MVP`, not a `Character image system`.

---

## 3. Why This Is Worth Doing

### 1. Faster recognition

Characters become easier to scan in the library.

### 2. Stronger identity feeling

A visible avatar makes Character feel more like a reusable entity and less like a text-only prompt object.

### 3. Better realm presence

The new `Identity Systems` page will feel more real immediately if Characters have visible faces or silhouettes.

### 4. Better active-state legibility

It becomes easier to see which Character is active in Builder / Prompt Preview / Identity Systems.

---

## 4. MVP Scope

### In scope

- one optional avatar per Character
- upload from local file
- client-side resize/compression before storage
- small square display in Character library cards
- slightly larger display in Character detail view
- optional small display in Prompt Preview / Builder workflow context later if it fits cleanly
- local-first persistence inside the current Character store

### Out of scope

- multiple images per Character
- cropping UI beyond simple center-fit handling
- drag-and-drop reordering
- shared asset library
- cloud sync
- public publishing
- image metadata systems
- image generation inside MorpBase

---

## 5. Strongest Data Shape

The smallest honest first-proof shape is:

```ts
type CharacterAvatar = {
  dataUrl: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  width: number;
  height: number;
};
```

And Character would gain:

```ts
type CharacterIdentity = {
  ...
  avatar?: CharacterAvatar;
};
```

And input would gain:

```ts
type CharacterIdentityInput = {
  ...
  avatar?: CharacterAvatar;
};
```

### Why this shape is strongest

- small
- local-first
- no fake cloud asset model
- enough information for rendering and future migration

### What not to add yet

- `assetId`
- `storageKey`
- crop transform objects
- image history
- multiple variants

---

## 6. Storage Decision

Because Characters are currently local-first, the MVP should store the avatar directly with the Character record.

That means:

- avatar data lives inside local Character JSON
- no separate asset store yet
- no Supabase media bucket yet

### Important risk

Current Character persistence uses `localStorage`.
Raw image uploads would bloat storage very quickly.

So the MVP must **not** store original-size images.

### Required mitigation

Before save:

- resize image client-side to a small square target
- compress it aggressively
- reject files that still exceed the safe budget

---

## 7. Recommended Image Rules

### Upload input

- accept `image/png`, `image/jpeg`, `image/webp`

### Stored target

- resize to roughly `160 x 160`
- store as compressed `image/jpeg` or `image/webp`
- prefer `webp` when browser output is available
- fallback to `jpeg`

### Safe budget

Target:

- aim for roughly `15 KB - 40 KB` per avatar

Hard reject threshold:

- reject if processed avatar exceeds roughly `60 KB`

### Why this matters

This keeps the MVP realistically compatible with localStorage instead of pretending storage is unlimited.

---

## 8. UI Placement

### 1. Character library cards

Add a small avatar thumbnail to each card.

If no avatar exists:

- show a clean fallback tile with initials

### 2. Character detail view

Show a larger avatar near the active Character details.

### 3. Character editor

Add:

- upload avatar button
- remove avatar button
- preview tile

This should stay simple.

No dedicated crop studio.

### 4. Identity Systems realm page

The realm page should benefit immediately because the Character lane will feel more visually real.

### 5. Prompt Preview

Optional for MVP.

I would treat this as:

- nice if very easy
- not required for the first avatar rollout

---

## 9. Fallback Behavior

If a Character has no avatar:

- show initials tile derived from name
- use stable styling so the library still feels visually coherent

If an old Character record has no avatar:

- nothing breaks
- it simply uses the fallback tile

This is important because avatar must be optional.

---

## 10. Best Implementation Strategy

The best path is:

1. extend Character types with optional avatar
2. extend Character store sanitization to read/write avatar safely
3. add client-side image processing helper
4. add avatar upload/remove controls in `CharacterLibrarySurface`
5. add avatar rendering in list + detail view
6. add initials fallback styling
7. only then decide whether Prompt Preview should also show it

This keeps the MVP restrained and avoids touching more surfaces than necessary.

---

## 11. Biggest Risks

### Risk 1: localStorage bloat

This is the biggest technical risk.

If avatars are not resized/compressed aggressively, the Character store will become fragile fast.

### Risk 2: turning avatar into a media feature

The product temptation will be to add:

- more images
- references
- gallery behavior

That should be resisted in the MVP.

### Risk 3: making avatar feel mandatory

Avatar should improve recognition, not become a requirement for Character validity.

---

## 12. Final MVP Judgment

This is a strong addition.

But only if it is treated as:

- **optional avatar**
- **small local-first image**
- **recognition aid**

not as:

- the beginning of a full Character media system

The cleanest summary is:

> Add one optional lightweight avatar per Character so Identity Systems feels more real and Characters become easier to recognize, while deliberately avoiding a broader image-management system.
