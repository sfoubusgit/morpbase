const states = [
  {
    id: 1,
    dockLabel: "State 1 - Continuity Home",
    title: "Recurring sameness should feel real",
    description:
      "Continuity should show one recurring entity clearly enough that the realm feels meaningful, but still lighter than the core product.",
    nextMove: "Open the featured entity",
    primaryActionLabel: "Enter Continuity",
    primaryActionTarget: 2,
    activeLens: 1,
    workspaceActive: false,
    realmKicker: "Continuity Home",
    realmTitle: "A lighter realm with one real recurring center",
    realmBadge: "Realm home",
    entityName: "Selene Vey",
    entitySummary: "A recurring oracle identity meant to stay recognizable across multiple saved works.",
    entityThumbClass: "visual-thumb-entity",
    continuityChips: [
      { label: "First live lane: Characters", current: true },
      { label: "Appearances through work" },
      { label: "Broader continuity later" }
    ],
    traceChips: [
      { label: "Real work traces", current: true },
      { label: "Not a gallery" },
      { label: "Activation later" }
    ],
    appearancesKicker: "Continuity Home",
    appearancesTitle: "One entity, a few appearances, one clear path inward",
    appearancesBadge: "Light overview",
    appearanceCards: [
      {
        visualClass: "visual-thumb-appearance-a",
        tag: "Appearance",
        title: "Moonlit oracle portrait",
        summary: "A saved work where the entity is already clearly recognizable.",
        meta: ["Saved Work", "Continuity strong", "Portrait workflow"],
        action: "Open entity",
        target: 2,
        selected: true
      },
      {
        visualClass: "visual-thumb-appearance-b",
        tag: "Appearance",
        title: "Corridor hush portrait",
        summary: "A second result showing the same entity in a different workflow mood.",
        meta: ["Saved Work", "Mood shift", "Same identity holds"],
        action: "See recurrence",
        target: 3
      }
    ],
    detailTitle: "Why this recurring entity matters",
    detailBadge: "Continuity home",
    heroTag: "Recurring entity",
    heroName: "Selene Vey",
    heroSummary:
      "The first job of Continuity is simple: make one recurring thing feel like more than a saved result.",
    heroImageClass: "hero-image-entity",
    anchors: ["Silver-white braid", "Luminous violet gaze", "Crescent forehead ornament"],
    why: [
      "Continuity needs to feel real without becoming another product center.",
      "One entity should quickly feel different from saved work and reusable assets.",
      "The next move should lead toward recurrence through actual work."
    ],
    activationHeading: "Continuity becomes valuable when it can shape work",
    activationCopy: "The realm should already suggest a future return into Workspace, even before activation begins.",
    activationActions: [
      { label: "Open entity", variant: "primary", target: 2 },
      { label: "Stay on home", variant: "ghost", target: 1 }
    ],
    workspaceHeading: "Continuity should still point back to the core",
    workspaceCopy: "Even here, the realm should read as support for creation rather than a separate creative center.",
    workspaceLine: [
      { label: "Continuity", current: true },
      { label: "Activation" },
      { label: "Workspace" }
    ],
    workspacePreviewTitle: "Future payoff",
    workspacePreviewCopy: "Bring Selene Vey into a live workflow when recurrence needs to become active creation again.",
    workspaceEffects: [
      { label: "Continuity stays lighter", current: true },
      { label: "Workspace still central" },
      { label: "Activation pending" }
    ],
    workspaceActions: [{ label: "Preview activation", variant: "secondary", target: 4 }]
  },
  {
    id: 2,
    dockLabel: "State 2 - Entity Focus",
    title: "One entity should feel more stable than any single result",
    description:
      "The entity view has to make it clear that this is a recurring thing that can survive movement across multiple workflows.",
    nextMove: "See where this entity appears",
    primaryActionLabel: "Open appearances",
    primaryActionTarget: 3,
    activeLens: 2,
    workspaceActive: false,
    realmKicker: "Entity",
    realmTitle: "Selene Vey is the continuity truth, not just one saved result",
    realmBadge: "Entity focus",
    entityName: "Selene Vey",
    entitySummary: "A ceremonial oracle identity whose look and presence should remain stable across different portrait workflows.",
    entityThumbClass: "visual-thumb-entity",
    continuityChips: [
      { label: "Stable identity", current: true },
      { label: "Recognizable across work" },
      { label: "Activatable in Workspace" }
    ],
    traceChips: [
      { label: "Identity truth", current: true },
      { label: "Seen through saved work" },
      { label: "First lane, not whole realm" }
    ],
    appearancesKicker: "Entity traces",
    appearancesTitle: "This entity is understood through where it lives in work",
    appearancesBadge: "Traceable",
    appearanceCards: [
      {
        visualClass: "visual-thumb-appearance-a",
        tag: "Appearance",
        title: "Moonlit oracle portrait",
        summary: "A ceremonial portrait where the entity reads clearly at first glance.",
        meta: ["Saved Work", "Anchor match high", "Wide ceremonial frame"],
        action: "Inspect appearance",
        target: 3,
        selected: true
      },
      {
        visualClass: "visual-thumb-appearance-c",
        tag: "Appearance",
        title: "Silver shrine close-up",
        summary: "A closer framing that still keeps the same continuity signals.",
        meta: ["Saved Work", "Close crop", "Identity still stable"],
        action: "Inspect appearance",
        target: 3
      }
    ],
    detailTitle: "This is continuity truth, not saved work",
    detailBadge: "Entity",
    heroTag: "Continuity entity",
    heroName: "Selene Vey",
    heroSummary:
      "The entity should feel like the stable thing behind multiple works, not just another object stored beside them.",
    heroImageClass: "hero-image-entity",
    anchors: ["Long silver-white braid", "Violet reflective eyes", "Ceremonial crescent ornament"],
    why: [
      "The entity must feel distinct from saved work and reusable assets.",
      "The user should understand what remains stable across workflows.",
      "The next move should naturally be recurrence through appearances."
    ],
    activationHeading: "Do not activate too early without recurrence",
    activationCopy: "Before activation pays off, the realm has to prove that sameness already exists across work.",
    activationActions: [
      { label: "Open appearances", variant: "primary", target: 3 },
      { label: "Back to home", variant: "secondary", target: 1 }
    ],
    workspaceHeading: "Activation should stay close enough to matter",
    workspaceCopy: "Even in entity view, the realm should feel one step away from live creative use.",
    workspaceLine: [
      { label: "Entity", current: true },
      { label: "Appearances" },
      { label: "Workspace" }
    ],
    workspacePreviewTitle: "Future live use",
    workspacePreviewCopy: "Once recurrence is trusted, activation should bring Selene Vey back into live workflow shaping.",
    workspaceEffects: [
      { label: "Entity stays owned by Continuity", current: true },
      { label: "Workspace use comes next" }
    ],
    workspaceActions: [{ label: "Preview activation", variant: "secondary", target: 4 }]
  },
  {
    id: 3,
    dockLabel: "State 3 - Appearances Focus",
    title: "Appearances should explain recurrence through real work",
    description:
      "The images here should act as evidence that the same entity has held together across different saved works.",
    nextMove: "Activate this entity",
    primaryActionLabel: "Move to activation",
    primaryActionTarget: 4,
    activeLens: 3,
    workspaceActive: false,
    realmKicker: "Appearances",
    realmTitle: "Recurrence becomes understandable through saved work",
    realmBadge: "Evidence",
    entityName: "Selene Vey",
    entitySummary: "This entity now feels grounded because different works still point back to the same recognizable continuity object.",
    entityThumbClass: "visual-thumb-entity",
    continuityChips: [
      { label: "Same entity" },
      { label: "Evidence through work", current: true },
      { label: "Ready to activate" }
    ],
    traceChips: [
      { label: "Appearance 1 -> 2 -> 3", current: true },
      { label: "Saved work lineage" },
      { label: "Sameness holds across variation" }
    ],
    appearancesKicker: "Appearances",
    appearancesTitle: "Images prove sameness, but they are not the point",
    appearancesBadge: "Recurrence",
    appearanceCards: [
      {
        visualClass: "visual-thumb-appearance-a",
        tag: "Saved Work",
        title: "Moonlit oracle portrait",
        summary: "Wide ceremonial portrait with all the core stability cues present.",
        meta: ["Saved Work", "Early appearance", "Signature anchors complete"],
        action: "Compare",
        target: 3,
        selected: true
      },
      {
        visualClass: "visual-thumb-appearance-b",
        tag: "Saved Work",
        title: "Corridor hush portrait",
        summary: "Different mood and lighting, but the same identity still reads clearly.",
        meta: ["Saved Work", "Later variation", "Continuity still strong"],
        action: "Compare",
        target: 3
      },
      {
        visualClass: "visual-thumb-appearance-c",
        tag: "Saved Work",
        title: "Silver shrine close-up",
        summary: "Closer crop that preserves the same facial and ornament signals.",
        meta: ["Saved Work", "Close-up test", "Identity confirmed"],
        action: "Compare",
        target: 3
      }
    ],
    detailTitle: "Images act as continuity evidence here",
    detailBadge: "Appearances",
    heroTag: "Continuity evidence",
    heroName: "Selene Vey across work",
    heroSummary:
      "This view should make recurrence understandable without turning Continuity into a gallery system.",
    heroImageClass: "hero-image-appearance",
    anchors: ["Facial identity holds", "Signature ornament repeats", "Presence stays recognizable"],
    why: [
      "Appearances should make recurrence feel concrete instead of abstract.",
      "Images help because they prove sameness across work.",
      "The next move should naturally be activation into live use."
    ],
    activationHeading: "Activation should now feel justified",
    activationCopy: "Once recurrence is clear, bringing the entity into Workspace should feel earned and meaningful.",
    activationActions: [
      { label: "Activate in Workspace", variant: "primary", target: 4 },
      { label: "Back to entity", variant: "secondary", target: 2 }
    ],
    workspaceHeading: "The realm needs a strong bridge back to creation",
    workspaceCopy: "Continuity proves recurrence first, then returns to the live center through activation.",
    workspaceLine: [
      { label: "Appearances", current: true },
      { label: "Activate" },
      { label: "Workspace" }
    ],
    workspacePreviewTitle: "Next payoff",
    workspacePreviewCopy: "Use this continuity object to shape the next live session with clearer sameness.",
    workspaceEffects: [
      { label: "Recurrence proven", current: true },
      { label: "Activation now justified" },
      { label: "Workspace change ahead" }
    ],
    workspaceActions: [{ label: "Activate now", variant: "secondary", target: 4 }]
  },
  {
    id: 4,
    dockLabel: "State 4 - Activation Moment",
    title: "Activation should be a real bridge back into creation",
    description:
      "This step has to make it clear that Continuity matters because it can change live creative context, not because it stores entities beautifully.",
    nextMove: "Enter Workspace with Selene Vey active",
    primaryActionLabel: "Activate and enter Workspace",
    primaryActionTarget: 5,
    activeLens: 4,
    workspaceActive: false,
    realmKicker: "Activate",
    realmTitle: "Bring Selene Vey into the active workflow session",
    realmBadge: "Activation bridge",
    entityName: "Selene Vey",
    entitySummary: "The entity is ready to move from continuity truth into live use, while still remaining owned by Continuity.",
    entityThumbClass: "visual-thumb-entity",
    continuityChips: [
      { label: "Continuity truth" },
      { label: "Applied layer", current: true },
      { label: "Workspace handoff" }
    ],
    traceChips: [
      { label: "Traces already proven" },
      { label: "Activation bridge", current: true },
      { label: "Live payoff next" }
    ],
    appearancesKicker: "Activation effect",
    appearancesTitle: "The entity should now change live context visibly",
    appearancesBadge: "Live payoff",
    appearanceCards: [
      {
        visualClass: "visual-thumb-appearance-a",
        tag: "Will affect",
        title: "Subject identity",
        summary: "The live workflow now has a stable recurring subject to work from.",
        meta: ["Live session", "Subject lock", "Continuity active"],
        action: "Continue",
        target: 5,
        selected: true
      },
      {
        visualClass: "visual-thumb-appearance-b",
        tag: "Will affect",
        title: "Continuity cues",
        summary: "The session should now inherit stable visual anchors and presence.",
        meta: ["Live session", "Visual anchors", "Presence cues"],
        action: "Continue",
        target: 5
      }
    ],
    detailTitle: "Activation is the justification for the realm",
    detailBadge: "Activation",
    heroTag: "Activation bridge",
    heroName: "Selene Vey ready for live use",
    heroSummary:
      "Continuity only becomes valuable when the entity can enter the live workflow in a meaningful, lightweight way.",
    heroImageClass: "hero-image-activation",
    anchors: ["Stable subject identity", "Recognizable visual anchors", "Reusable presence cues"],
    why: [
      "Activation should feel like a real change in creative context.",
      "The entity remains owned by Continuity, even while active in Workspace.",
      "The next step has to visibly prove the payoff."
    ],
    activationHeading: "Take continuity back into the live center",
    activationCopy: "This should feel like applying recurring sameness to a new session, not like turning on a symbolic switch.",
    activationActions: [
      { label: "Activate in Workspace", variant: "primary", target: 5 },
      { label: "Review appearances", variant: "secondary", target: 3 }
    ],
    workspaceHeading: "The next moment must show visible payoff",
    workspaceCopy: "If Workspace barely changes after activation, Continuity will feel too weak to matter.",
    workspaceLine: [
      { label: "Continuity" },
      { label: "Activation", current: true },
      { label: "Workspace" }
    ],
    workspacePreviewTitle: "Upcoming workspace change",
    workspacePreviewCopy: "Selene Vey will appear as an active continuity layer inside the next live workflow session.",
    workspaceEffects: [
      { label: "Continuity layer enters session", current: true },
      { label: "Prompt Preview will change" },
      { label: "Workspace remains center" }
    ],
    workspaceActions: [{ label: "Enter Workspace", variant: "secondary", target: 5 }]
  },
  {
    id: 5,
    dockLabel: "State 5 - Workspace Handoff",
    title: "Continuity should pay off inside live work",
    description:
      "The final feeling should be simple: Continuity has returned to the core product and now visibly shapes the active creative session.",
    nextMove: "Continue shaping in Workspace",
    primaryActionLabel: "Stay in Workspace",
    primaryActionTarget: 5,
    activeLens: null,
    workspaceActive: true,
    realmKicker: "Handoff complete",
    realmTitle: "The entity remains a continuity object, but now it is active in live use",
    realmBadge: "Workspace payoff",
    entityName: "Selene Vey active",
    entitySummary: "Continuity has done its job: recurring sameness now meaningfully informs the live workflow session.",
    entityThumbClass: "visual-thumb-entity",
    continuityChips: [
      { label: "Continuity source" },
      { label: "Active in Workspace", current: true },
      { label: "Return to Continuity later" }
    ],
    traceChips: [
      { label: "Continuity proven" },
      { label: "Live context changed", current: true },
      { label: "Can return to source realm" }
    ],
    appearancesKicker: "Workspace effect",
    appearancesTitle: "Live work now carries continuity meaning",
    appearancesBadge: "Active session",
    appearanceCards: [
      {
        visualClass: "visual-thumb-appearance-a",
        tag: "Active layer",
        title: "Character identity applied",
        summary: "The session now inherits the recurring subject identity from Continuity.",
        meta: ["Workspace", "Active continuity", "Subject stable"],
        action: "Stay in Workspace",
        target: 5,
        selected: true
      },
      {
        visualClass: "visual-thumb-appearance-c",
        tag: "Visible payoff",
        title: "Prompt Preview changed",
        summary: "The live composition now reflects the continuity layer clearly and calmly.",
        meta: ["Prompt Preview", "Continuity visible", "Calm payoff"],
        action: "Stay in Workspace",
        target: 5
      }
    ],
    detailTitle: "Continuity has returned to the product center",
    detailBadge: "Workspace",
    heroTag: "Active continuity layer",
    heroName: "Selene Vey active in Workspace",
    heroSummary:
      "This is the payoff: the realm mattered because it changed the live creative context without taking over the product.",
    heroImageClass: "hero-image-workspace",
    anchors: ["Entity remains recognizable", "Live session now has continuity context", "Workspace stays the center"],
    why: [
      "Continuity succeeds when it feeds live creation.",
      "The entity should remain real without overpowering the active workflow.",
      "The realm now feels legitimate because it clearly returns to the core product."
    ],
    activationHeading: "Continuity is now active, not separate",
    activationCopy: "The user should be able to keep creating while still feeling the continuity layer is present and meaningful.",
    activationActions: [
      { label: "Continue in Workspace", variant: "primary", target: 5 },
      { label: "Return to Continuity", variant: "ghost", target: 2 }
    ],
    workspaceHeading: "Workspace stays the center of the product",
    workspaceCopy: "Continuity is successful because it strengthens live work without turning into a competing center.",
    workspaceLine: [
      { label: "Continuity" },
      { label: "Activation" },
      { label: "Workspace", current: true }
    ],
    workspacePreviewTitle: "Live session snapshot",
    workspacePreviewCopy:
      "Prompt Preview now shows Selene Vey as the active continuity layer: silver-white braid, luminous violet gaze, ceremonial crescent, calm oracle presence.",
    workspaceEffects: [
      { label: "Active entity layer", current: true },
      { label: "Prompt Preview shifted" },
      { label: "Workspace still central" }
    ],
    workspaceActions: [
      { label: "Reset slice", variant: "secondary", target: 1 },
      { label: "Return to Continuity", variant: "ghost", target: 2 }
    ]
  }
];

const lensButtons = [...document.querySelectorAll(".continuity-lens")];
const workspaceNavEl = document.getElementById("workspace-nav");
const continuityNavEl = document.getElementById("continuity-nav");
const titleEl = document.getElementById("state-title");
const descriptionEl = document.getElementById("state-description");
const nextMoveEl = document.getElementById("next-move");
const beginFlowEl = document.getElementById("begin-flow");
const realmKickerEl = document.getElementById("realm-kicker");
const realmTitleEl = document.getElementById("realm-title");
const realmBadgeEl = document.getElementById("realm-badge");
const entityNameEl = document.getElementById("entity-name");
const entitySummaryEl = document.getElementById("entity-summary");
const entityThumbEl = document.getElementById("entity-thumb");
const continuityStripEl = document.getElementById("continuity-strip");
const appearancesKickerEl = document.getElementById("appearances-kicker");
const appearancesTitleEl = document.getElementById("appearances-title");
const appearancesBadgeEl = document.getElementById("appearances-badge");
const traceStripEl = document.getElementById("trace-strip");
const appearanceListEl = document.getElementById("appearance-list");
const detailTitleEl = document.getElementById("detail-title");
const detailBadgeEl = document.getElementById("detail-badge");
const heroTagEl = document.getElementById("hero-tag");
const heroNameEl = document.getElementById("hero-name");
const heroSummaryEl = document.getElementById("hero-summary");
const heroImageFillEl = document.getElementById("hero-image-fill");
const anchorListEl = document.getElementById("anchor-list");
const whyListEl = document.getElementById("why-list");
const activationHeadingEl = document.getElementById("activation-heading");
const activationCopyEl = document.getElementById("activation-copy");
const activationRowEl = document.getElementById("activation-row");
const workspaceHeadingEl = document.getElementById("workspace-heading");
const workspaceCopyEl = document.getElementById("workspace-copy");
const workspaceLineEl = document.getElementById("workspace-line");
const workspacePreviewEl = document.getElementById("workspace-preview");
const workspaceEffectsEl = document.getElementById("workspace-effects");
const workspaceActionsEl = document.getElementById("workspace-actions");
const dockStateEl = document.getElementById("dock-state");
const stateStepperEl = document.getElementById("state-stepper");
const resetButtonEl = document.getElementById("reset-button");

let currentState = 1;

function renderStateButtons() {
  stateStepperEl.innerHTML = "";

  states.forEach((state) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "state-button";
    button.textContent = String(state.id);
    button.setAttribute("aria-label", state.dockLabel);

    if (state.id === currentState) {
      button.classList.add("is-current");
    }

    button.addEventListener("click", () => setState(state.id));
    stateStepperEl.appendChild(button);
  });
}

function renderChipSet(items, container, className) {
  container.innerHTML = "";

  items.forEach((item) => {
    const chip = document.createElement("span");
    chip.className = className;
    chip.textContent = item.label;
    if (item.current) {
      chip.classList.add("is-current");
    }
    container.appendChild(chip);
  });
}

function renderAppearanceCards(cards) {
  appearanceListEl.innerHTML = "";

  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "appearance-card";
    if (card.selected) {
      article.classList.add("is-selected");
    }

    const visual = document.createElement("div");
    visual.className = `visual-thumb ${card.visualClass}`;

    const copy = document.createElement("div");
    copy.className = "appearance-copy";
    const metaHtml = (card.meta || [])
      .map((item) => `<span>${item}</span>`)
      .join("");

    copy.innerHTML = `
      <span class="appearance-tag">${card.tag}</span>
      <strong>${card.title}</strong>
      <p>${card.summary}</p>
      ${metaHtml ? `<div class="appearance-meta">${metaHtml}</div>` : ""}
    `;

    const action = document.createElement("button");
    action.type = "button";
    action.className = "secondary-button";
    action.textContent = card.action;
    action.addEventListener("click", () => setState(card.target));

    article.append(visual, copy, action);
    appearanceListEl.appendChild(article);
  });
}

function renderAnchorChips(anchors) {
  anchorListEl.innerHTML = "";
  anchors.forEach((anchor) => {
    const chip = document.createElement("span");
    chip.className = "anchor-chip";
    chip.textContent = anchor;
    anchorListEl.appendChild(chip);
  });
}

function renderWhy(items) {
  whyListEl.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    whyListEl.appendChild(li);
  });
}

function renderWorkspacePreview(title, copy) {
  workspacePreviewEl.innerHTML = `
    <strong>${title}</strong>
    <p>${copy}</p>
  `;
}

function renderActions(actions, container) {
  container.innerHTML = "";

  actions.forEach((actionConfig) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = actionConfig.label;
    button.className =
      actionConfig.variant === "primary"
        ? "primary-button"
        : actionConfig.variant === "secondary"
          ? "secondary-button"
          : "ghost-button";

    button.addEventListener("click", () => setState(actionConfig.target));
    container.appendChild(button);
  });
}

function setActiveLens(activeLens) {
  lensButtons.forEach((button) => {
    const target = Number(button.dataset.stateTarget);
    button.classList.toggle("is-active", activeLens === target);
  });
}

function setShellWeight(workspaceActive) {
  workspaceNavEl.classList.toggle("is-active", workspaceActive);
  continuityNavEl.classList.toggle("is-active", !workspaceActive);
}

function setState(id) {
  const state = states.find((entry) => entry.id === id);
  if (!state) {
    return;
  }

  currentState = id;

  titleEl.textContent = state.title;
  descriptionEl.textContent = state.description;
  nextMoveEl.textContent = state.nextMove;
  beginFlowEl.textContent = state.primaryActionLabel;
  beginFlowEl.onclick = () => setState(state.primaryActionTarget);

  realmKickerEl.textContent = state.realmKicker;
  realmTitleEl.textContent = state.realmTitle;
  realmBadgeEl.textContent = state.realmBadge;
  entityNameEl.textContent = state.entityName;
  entitySummaryEl.textContent = state.entitySummary;
  entityThumbEl.className = `visual-thumb ${state.entityThumbClass}`;
  renderChipSet(state.continuityChips, continuityStripEl, "continuity-chip");

  appearancesKickerEl.textContent = state.appearancesKicker;
  appearancesTitleEl.textContent = state.appearancesTitle;
  appearancesBadgeEl.textContent = state.appearancesBadge;
  renderChipSet(state.traceChips, traceStripEl, "trace-chip");
  renderAppearanceCards(state.appearanceCards);

  detailTitleEl.textContent = state.detailTitle;
  detailBadgeEl.textContent = state.detailBadge;
  heroTagEl.textContent = state.heroTag;
  heroNameEl.textContent = state.heroName;
  heroSummaryEl.textContent = state.heroSummary;
  heroImageFillEl.className = `hero-image-fill ${state.heroImageClass}`;
  renderAnchorChips(state.anchors);
  renderWhy(state.why);

  activationHeadingEl.textContent = state.activationHeading;
  activationCopyEl.textContent = state.activationCopy;
  renderActions(state.activationActions, activationRowEl);

  workspaceHeadingEl.textContent = state.workspaceHeading;
  workspaceCopyEl.textContent = state.workspaceCopy;
  renderChipSet(state.workspaceLine, workspaceLineEl, "workspace-chip");
  renderWorkspacePreview(state.workspacePreviewTitle, state.workspacePreviewCopy);
  renderChipSet(state.workspaceEffects, workspaceEffectsEl, "effect-chip");
  renderActions(state.workspaceActions, workspaceActionsEl);

  dockStateEl.textContent = state.dockLabel;
  setActiveLens(state.activeLens);
  setShellWeight(state.workspaceActive);
  renderStateButtons();
}

lensButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setState(Number(button.dataset.stateTarget));
  });
});

resetButtonEl.addEventListener("click", () => setState(1));

setState(1);
