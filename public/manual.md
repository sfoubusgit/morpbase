# Morpbase Prompt Generator v3.2 - User Manual (2026-03-05)

This manual describes every user-facing feature in the current app build. It is based on the code in `prompt_generator_v3.2_final`.

**Terminology**
- Builder: The main prompt-building workflow with questions, categories, and selections.
- Attribute: A selectable prompt element (text fragment) that can be added to the prompt.
- Selection: An attribute that you have chosen in the Builder.
- Modifier (Weight): A numeric weight applied to a selection (0.0 to 2.0).
- Working Set: A curated, category-bucketed library of prompt elements used inside the Builder.
- User Pool: A reusable pool of prompt elements that you can add to prompts.
- Prompt Library: Saved prompts with metadata and import/export.
- Pool Hub: Community hub for Pools and Working Sets (browse, rate, comment, upload).
- Custom additions: Prompt fragments added from User Pools or Prompt Library.

<a id="quick-start"></a>
**Quick Start**
1. Open the app and go to `Builder`.
2. Select attributes in each category to build a prompt.
3. Adjust weights or edit output text when needed.
4. Use the Prompt Preview to copy the prompt.
5. Optional: create User Pools or Working Sets to speed up future work.

<a id="navigation"></a>
**Top Navigation and Global State**
- Top right / top bar shows login state and navigation tabs.
- Tabs: `Builder`, `Working Sets`, `User Pools`, `Pool Hub`.
- The last active page is saved and restored automatically.
- Dev Mode banner appears when enabled and unlocks all gated features.
- Log in / Register is available from the top bar.

<a id="account"></a>
**Account and Authentication**
- Log In and Register are available from the top bar.
- Registration requires name, email, and password.
- Account modal (when logged in):
  - Edit display name.
  - View email (read-only).
  - Change password (current + new password).
  - Delete account (current password + type `DELETE` to confirm).
- Some features are gated behind Pro access (see below).
- Note: The UI labels login as "demo only" in this build.

<a id="pro"></a>
**Pro Gated Features**
These features require login and Pro access:
- User Pools (create/manage pools and items).
- Working Sets (create/manage/activate).
- Prompt Library actions (save, import/export, copy).
- Pool Hub participation (upload, rate, comment, add to active).

<a id="dev-mode"></a>
**Dev Mode**
- When `VITE_DEV_MODE=1`, the app runs in Dev Mode and unlocks Pro features.
- The Dev Mode banner can be toggled on/off and is stored in local storage.

---

<a id="builder"></a>
**Builder (Main Prompt Workflow)**
The Builder guides you through categories and subcategories to build a prompt.

<a id="builder-navigation"></a>
**Category Flow and Navigation**
- Categories are shown in the left sidebar.
- Each category has subcategories (for example Subject -> People, Animals, Characters).
- You can navigate in two ways:
  - `Next` button: moves through all subcategories in a fixed sequence.
  - Sidebar jump: click any category or subcategory to jump directly.
- `Back` goes to the previous step in the history.
- `Skip` is present, but it only moves forward when the current node has a `nextNodeId`.
- Completion state appears only after you explicitly click `Next` at the end and have at least one selection.

<a id="category-sidebar"></a>
**Category Sidebar**
- Shows categories and expandable subcategories.
- Indicators:
  - A dot appears when any selection exists under a category/subcategory.
  - The current category is highlighted.
- Buttons under the last category:
  - `Random` opens the Random Prompt Generator.
  - `Tutorial` opens the Builder tutorial modal.

<a id="selecting-attributes"></a>
**Selecting Attributes**
- Click an attribute to select it.
- Selected attributes are highlighted.
- You can select multiple attributes per question.
- Deselecting removes the selection and its weight.

<a id="custom-extensions"></a>
**Custom Extensions**
- Some attributes allow a custom extension input.
- If available, a text field appears for the selected attribute.
- The extension is appended to the base attribute text in the prompt.

<a id="output-overrides"></a>
**Output Overrides (Add + Edit)**
- For any selected attribute, click `Add + Edit` to open the Output editor.
- This lets you override the exact text used in the prompt.
- Actions:
  - `Save` stores the override.
  - `Cancel` closes without changes.
  - `Reset` removes the override and restores the default text.

<a id="weights"></a>
**Weights**
- Global toggle: a `Weights` checkbox at the top of the question card.
- Per-attribute control:
  - Click `Add Weight` on a selected attribute.
  - Use `+` and `-` to adjust in 0.1 steps.
  - Range is clamped to 0.0 - 2.0.
- Weights apply only when the global toggle is enabled.
- Weights are not applied to negative attributes.

<a id="prompt-preview"></a>
**Prompt Preview (Builder Sidebar)**
- Shows the generated prompt in sections when available.
- Sections include: Scene, Characters, Actions, Style, Lighting, Camera, Effects, Quality, Post-Processing.
- Displays token count with a hard limit of 77.
- Shows the default negative prompt when no negative selections are present.
- Copy button behavior:
  - If Freeform Prompt is empty, copy uses the structured or flat output with negative prompt included.
  - If Freeform Prompt has text, copy outputs only the merged positive prompt and does not include negative prompt.
- `Clear` removes selections, weights, custom additions, output overrides, and freeform text.
- `Undo` restores the last cleared state (single-step undo).

<a id="freeform-prompt"></a>
**Freeform Prompt (Builder Sidebar)**
- Any text you enter is prepended to the generated prompt in preview and copy.
- When freeform text is present, negative prompt is not shown or copied.

<a id="prompt-library"></a>
**Prompt Library (Builder Sidebar)**
- Save the current prompt with name, tags, and optional note.
- Import/Export all prompts as JSON.
- Download prompts JSON to disk.
- Copy a saved prompt or add it to the current prompt.
- Behavior:
  - `Add to Prompt` appends the prompt positive text to Custom additions.
  - Import merges new prompts and skips duplicates by name.

---

<a id="random-prompt-generator"></a>
**Random Prompt Generator (Builder Modal)**
- Open via the sidebar `Random` button.
- Choose categories and subcategories to include.
- Controls:
  - Default attributes per category.
  - Per-category count override.
  - Per-subcategory count override.
  - `Check everything` to enable all categories and subcategories.
- Actions:
  - `Generate Random Prompt` creates random selections.
  - `Re-roll` generates a new selection with the same settings.
  - `Clear Random Selections` removes random selections.
- Notes:
  - Randomization replaces current selections.
  - The current question does not automatically change; navigate as needed.

---

<a id="working-sets"></a>
**Working Sets**
Working Sets are curated libraries of prompt elements grouped by category.

<a id="working-sets-page"></a>
**Working Sets Page**
- Create a new working set by name.
- Select a working set from the left list.
- Rename or delete the selected set.
- Activate a set to use it inside the Builder.
- Deactivate to return to the Base Set.

<a id="working-sets-add-items"></a>
**Adding Items to Working Sets**
- Working Set items are sourced from User Pools.
- Steps:
  1. Select a Pool.
  2. Select a Category (Subject, Style, Lighting, etc.).
  3. Filter items by search (optional).
  4. Click `Add` on an item to add it to the working set category bucket.
- You can remove items or clear an entire category bucket.

<a id="working-sets-builder"></a>
**Using a Working Set in the Builder**
- The Builder shows an active Working Set banner at the top.
- Switch active set using the dropdown.
- When active:
  - Only elements from the Working Set are shown in the Builder.
  - The category sequence remains the same.

<a id="working-sets-publish"></a>
**Publish Working Set to Hub**
- Click `Publish to Hub`.
- Fill in metadata: title, summary, description, category, tags, language, license.
- Optional hero image URL or image upload (stored as data URL).
- Confirm rights and privacy checkboxes to publish.

---

<a id="user-pools"></a>
**User Pools**
User Pools are reusable prompt element libraries with tags and notes.

<a id="user-pools-list"></a>
**Pools List**
- Create a pool with a name.
- Rename or delete pools.
- Each pool shows item count and last updated date.

<a id="user-pools-items"></a>
**Pool Items**
- Add a single item with text, tags, and optional note.
- Search items by text.
- Filter items by tag.
- Edit an item (text, tags, note) or delete it.

<a id="user-pools-bulk-add"></a>
**Bulk Add**
- Add multiple items, one per line.
- Optional tags after a `|` separator.
- Example:
  - `big tree | nature, forest`

<a id="user-pools-import-export"></a>
**Import / Export Pool JSON**
- Export the active pool to JSON.
- Import JSON to replace the active pool.
- Download the pool JSON file to disk.

<a id="user-pools-add-append"></a>
**Add to Prompt and Append**
- `Add to Prompt` adds the item to Custom additions.
- `Append` adds the item text to an existing addition.
- Append target can be `Last addition` or a specific existing addition.
- `Add + Edit` lets you edit the text before adding or appending.

<a id="user-pools-randomize"></a>
**Randomize From User Pools**
- Open `Randomize` from the pools header.
- Choose which pools to include.
- Choose items per pool.
- Optional per-pool count overrides.
- Tag filter modes:
  - `Any` tags (no filtering)
  - `Only` tagged
  - `Prefer` tagged (uses tagged items first, then fallback)
- `Allow duplicates` toggles whether items can repeat across pools.
- Apply mode:
  - `Replace current items`
  - `Append to current items`
- Actions:
  - `Generate Random Prompt` (same as Re-roll)
  - `Clear Random Selections`

---

<a id="pool-hub"></a>
**Pool Hub (Community Marketplace)**
Pool Hub is a local, community-style marketplace for Pools and Working Sets.

<a id="pool-hub-modes"></a>
**Modes**
- Pools mode
- Working Sets mode

<a id="pool-hub-browse"></a>
**Browsing and Filtering**
- Search by name, summary, description, or tags.
- Filter by tag, category, language, minimum rating.
- Sort by Trending, Newest, Top Rated, or Most Downloads.
- Toggle `My uploads` to see only your own uploads.

<a id="pool-hub-details"></a>
**Entry Details**
- View metadata, description, license, languages, and creator stats.
- Show items with `Show all` or `Show less`.
- Working Sets are grouped by category in the item list.

<a id="pool-hub-add-active"></a>
**Add to Active**
- Pools: merges into your User Pools by name.
- Working Sets: merges into your Working Sets by name and activates the imported set.

<a id="pool-hub-download"></a>
**Download JSON**
- Download the selected Pool or Working Set as JSON.

<a id="pool-hub-upload"></a>
**Upload to Hub**
- Upload a Pool or Working Set with full metadata.
- Provide JSON by pasting or uploading a `.json` file.
- Import directly from your User Pools or Working Sets.
- Optional hero image URL or image upload.

<a id="pool-hub-ratings-comments"></a>
**Ratings and Comments**
- Star rating (1-5).
- Post comments with optional author name.
- Edit or delete your own comments.

<a id="pool-hub-report"></a>
**Report**
- Flag a pool or working set with an optional reason.

<a id="pool-hub-admin"></a>
**Hub Data Tools (Admin)**
- Export the full hub JSON data.
- Import hub JSON data.
- Reset the hub to default content.

---

<a id="data-formats"></a>
**Data Formats (User-Facing JSON)**

**Pool JSON (single pool export/import)**
```json
{
  "version": 1,
  "pool": {
    "id": "...",
    "name": "Pool name",
    "createdAt": 0,
    "updatedAt": 0,
    "items": [
      { "id": "...", "text": "...", "tags": ["..."], "note": "..." }
    ]
  }
}
```

**Working Set JSON (export/import via Hub)**
```json
{
  "version": 2,
  "workingSet": {
    "id": "...",
    "name": "Working set name",
    "createdAt": 0,
    "updatedAt": 0,
    "categoryBuckets": {
      "subject": [
        { "id": "...", "poolId": "...", "poolItemId": "...", "text": "...", "addedAt": 0 }
      ]
    }
  }
}
```

**Prompt Library JSON (all prompts)**
```json
{
  "version": 1,
  "prompts": [
    {
      "id": "...",
      "name": "...",
      "positive": "...",
      "negative": "...",
      "tags": ["..."],
      "note": "...",
      "createdAt": 0,
      "updatedAt": 0
    }
  ]
}
```

---

<a id="edge-cases"></a>
**Important Behaviors and Edge Cases**
- Completion state appears only after clicking `Next` at the end.
- Weights are stored per selection and cleared when deselected.
- Global `Weights` toggle disables all weights without removing them.
- Freeform prompt hides negative prompt in preview and copy.
- Random Prompt Generator replaces current selections.
- User Pools import uses `replace` mode in the UI.
- Pool Hub actions are disabled unless logged in and Pro.
- Hub data is currently stored locally (not synced server-side in this build).

---

<a id="category-list"></a>
**Current Category List**
Categories and subcategories shown in the Builder sidebar:
- Subject: People, Animals, Characters, Creatures, Objects, Count, Anatomy Issues, NSFW
- Style: Illustration, Realistic, Painting, Digital, Cinematic, Genre, Minimalist
- Lighting: Intensity, Quality, Direction, Style, Time-Based, Cinematic, Artifacts
- Camera: Lens, Depth of Field, Stability, Exposure and Motion, Specialty, Artifacts
- Environment: Location, Setting, Biome, Space Density, Background, Artifacts
- Quality: Quality Level, Resolution, Detail, Focus, Noise, Cleanliness, Artifacts
- Effects: Atmospheric, Weather, Particles, Fire and Energy, Water, Light and Optical, Artifacts
- Post-Processing: Color and Tone, Contrast, Sharpness, Atmospheric, Texture, Optical, Artifacts
- Actions: Actions
- Anatomy Details: Breasts, Hips and Waist, Buttocks, Thighs and Legs, Penis, Vagina and Labia, Anal, Overall Body Type, Skin and Surface Details, Pubic Hair

---

<a id="troubleshooting"></a>
**Troubleshooting**
- If you cannot access pools or working sets, ensure you are logged in and Pro is enabled.
- If no pools appear in Working Sets, create pools in User Pools first and refresh.
- If prompt preview shows empty output, ensure you have made selections.
- If random generator yields no output, enable at least one category or subcategory.
- If you only used Freeform Prompt, the negative prompt will not be copied.

---

<a id="support-notes"></a>
**Support Notes**
- This manual reflects the current build and UI. If you want a shorter tester manual or a public-facing guide, specify the target audience and I can generate a slimmed version.
