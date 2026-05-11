const states = [
  {
    id: 1,
    dockLabel: "State 1 - Publish Handoff From Memory",
    title: "Real work enters public life",
    description:
      "Publishing should feel like releasing real private work into the public layer, not stepping into a separate upload app.",
    nextMove: "Release one real object",
    primaryActionLabel: "Start the public loop",
    primaryActionTarget: 2,
    activeLens: null,
    originKicker: "Publish origin",
    originTitle: "This began as private work inside Memory",
    originBadge: "Private to public",
    originName: "Moonlit oracle portrait",
    originSummary: "A kept workflow result is about to become a public object with visible proof.",
    originAction: { label: "Release to Discover", target: 2 },
    streamKicker: "Public release",
    streamTitle: "One object is moving outward from Memory",
    streamBadge: "Release step",
    streamCards: [
      {
        visual: "memory",
        tag: "Saved Work",
        title: "Moonlit oracle portrait",
        summary: "A kept result that already has value in private use.",
        action: "Release",
        target: 2,
        selected: true
      }
    ],
    detailTitle: "Public life begins with real work",
    detailBadge: "Downstream proof",
    heroTag: "Public workflow result",
    heroName: "Moonlit oracle portrait",
    heroSummary:
      "The first Community signal should be simple: this object matters because it already mattered in Memory.",
    heroImageClass: "hero-image-result",
    creator: {
      name: "Sel Vey Studio",
      note: "Public creator identity should appear through work, not before it."
    },
    why: [
      "Community should begin from real private work.",
      "Publishing must feel lighter than a dashboard.",
      "The object should carry visible proof before it becomes public."
    ],
    actionHeading: "Release into Discover",
    actionCopy: "This should feel like the object is entering a real public circulation layer.",
    actions: [
      { label: "Release now", variant: "primary", target: 2 },
      { label: "Stay private", variant: "ghost", target: 1 }
    ],
    returnHeading: "The public loop has not replaced the core product",
    returnCopy: "Even here, the work still belongs to the same MorpBase object flow.",
    returnActions: [{ label: "Back to Memory", variant: "secondary", target: 1 }]
  },
  {
    id: 2,
    dockLabel: "State 2 - Discover Landing",
    title: "Discover should feel alive without becoming a feed",
    description:
      "Visible outcomes should help public objects compete for attention, but the surface still has to feel useful and calm.",
    nextMove: "Open a strong public object",
    primaryActionLabel: "Open a featured result",
    primaryActionTarget: 3,
    activeLens: 2,
    originKicker: "Public loop",
    originTitle: "The public layer now has real momentum",
    originBadge: "Object circulation",
    originName: "Freshly released work is now discoverable",
    originSummary: "Discover should show real movement and visible proof, not endless noise.",
    originAction: { label: "See featured result", target: 3 },
    streamKicker: "Discover",
    streamTitle: "Public objects worth opening",
    streamBadge: "Visible value",
    streamCards: [
      {
        visual: "result",
        tag: "Workflow Result",
        title: "Moonlit oracle portrait",
        summary: "A public result with visible proof and clear branch potential.",
        action: "Open",
        target: 3,
        selected: true
      },
      {
        visual: "asset",
        tag: "Reusable Asset",
        title: "Ritual halo lighting pack",
        summary: "A reusable shaping object meant to influence future workflows.",
        action: "Compare",
        target: 4
      },
      {
        visual: "creator",
        tag: "Creator",
        title: "Sel Vey Studio",
        summary: "A creator signal grounded in published work, not profile theater.",
        action: "View",
        target: 5
      }
    ],
    detailTitle: "Public objects need fast visible proof",
    detailBadge: "Discover",
    heroTag: "Featured result",
    heroName: "Moonlit oracle portrait",
    heroSummary:
      "Images belong here because they make public workflow results worth opening, not because Community is an image feed.",
    heroImageClass: "hero-image-result",
    creator: {
      name: "Sel Vey Studio",
      note: "Known for ceremonial portrait workflows and reusable atmosphere assets."
    },
    why: [
      "Discover should feel curated, useful, and object-rich.",
      "Visible proof should help the user trust the object fast.",
      "Workflow results and reusable assets must feel clearly different."
    ],
    actionHeading: "Choose where to go deeper",
    actionCopy: "The next move should naturally be an object page or creator context, not endless scrolling.",
    actions: [
      { label: "Open result", variant: "primary", target: 3 },
      { label: "Open asset", variant: "secondary", target: 4 },
      { label: "View creator", variant: "ghost", target: 5 }
    ],
    returnHeading: "Public circulation still points back toward use",
    returnCopy: "The value of Discover is not just seeing work. It is finding work worth bringing back into practice.",
    returnActions: [{ label: "Jump to import path", variant: "secondary", target: 6 }]
  },
  {
    id: 3,
    dockLabel: "State 3 - Public Workflow Result Page",
    title: "A public result should be more than a pretty image",
    description:
      "The visible outcome should attract attention, but the page has to explain why the result is reusable, branchable, and worth learning from.",
    nextMove: "Import or branch from this result",
    primaryActionLabel: "Import into Memory",
    primaryActionTarget: 6,
    activeLens: 3,
    originKicker: "Object page",
    originTitle: "This page should explain both proof and usefulness",
    originBadge: "Public workflow result",
    originName: "Moonlit oracle portrait",
    originSummary: "A public result page should combine visible proof, creator grounding, and practical reuse value.",
    originAction: { label: "Import result", target: 6 },
    streamKicker: "Result context",
    streamTitle: "This object is worth opening because it can be used",
    streamBadge: "Branch and reuse",
    streamCards: [
      {
        visual: "result",
        tag: "Workflow Result",
        title: "Moonlit oracle portrait",
        summary: "Visible proof, workflow meaning, and clear import value all in one place.",
        action: "Import",
        target: 6,
        selected: true
      },
      {
        visual: "creator",
        tag: "Creator",
        title: "Sel Vey Studio",
        summary: "Understand the maker through the result, not through profile decoration.",
        action: "Open creator",
        target: 5
      }
    ],
    detailTitle: "Visible proof plus workflow meaning",
    detailBadge: "Result page",
    heroTag: "Public workflow result",
    heroName: "Moonlit oracle portrait",
    heroSummary:
      "This object feels strong because the image proves the outcome while the actions prove the workflow value.",
    heroImageClass: "hero-image-result",
    creator: {
      name: "Sel Vey Studio",
      note: "Builds atmosphere-rich portrait workflows designed to be branched, not just viewed."
    },
    why: [
      "A strong public result page must answer why this matters, not just what it looks like.",
      "The image should help the user trust the object fast.",
      "Import, branch, and creator context should all feel close at hand."
    ],
    actionHeading: "Bring this back into practice",
    actionCopy: "Import should feel stronger than collecting. It should feel like adopting a proven result into your own flow.",
    actions: [
      { label: "Import result", variant: "primary", target: 6 },
      { label: "Open creator", variant: "secondary", target: 5 },
      { label: "Compare asset", variant: "ghost", target: 4 }
    ],
    returnHeading: "This public result should lead somewhere useful",
    returnCopy: "If the page ends only in admiration, Community becomes too shallow. It needs a strong path back into personal use.",
    returnActions: [{ label: "Import into Memory", variant: "secondary", target: 6 }]
  },
  {
    id: 4,
    dockLabel: "State 4 - Public Reusable Asset Glimpse",
    title: "Reusable assets need visuals too, but for a different reason",
    description:
      "A public reusable asset should show what kind of future work it can shape, not act like another artwork page.",
    nextMove: "See how this could shape future work",
    primaryActionLabel: "Use asset in Memory",
    primaryActionTarget: 6,
    activeLens: 4,
    originKicker: "Asset distinction",
    originTitle: "Reusable shaping material should feel different from a result",
    originBadge: "Public reusable asset",
    originName: "Ritual halo lighting pack",
    originSummary: "Images still matter here, but they should explain use range rather than become the main event.",
    originAction: { label: "Adopt asset", target: 6 },
    streamKicker: "Reusable Assets",
    streamTitle: "Public shaping material for future workflows",
    streamBadge: "Future use",
    streamCards: [
      {
        visual: "asset",
        tag: "Reusable Asset",
        title: "Ritual halo lighting pack",
        summary: "Reusable mood-and-light guidance with example outcomes showing its range.",
        action: "Use",
        target: 6,
        selected: true
      },
      {
        visual: "result",
        tag: "Workflow Result",
        title: "Moonlit oracle portrait",
        summary: "Return to the public result to feel the difference in object meaning.",
        action: "Compare",
        target: 3
      }
    ],
    detailTitle: "Support future workflows, not just public display",
    detailBadge: "Asset page",
    heroTag: "Public reusable asset",
    heroName: "Ritual halo lighting pack",
    heroSummary:
      "This object is worth importing because it can shape future work, not because it wins attention like a standalone artwork.",
    heroImageClass: "hero-image-asset",
    creator: {
      name: "Sel Vey Studio",
      note: "Publishes reusable atmosphere material alongside finished public results."
    },
    why: [
      "Reusable assets need visual proof so users can judge future usefulness quickly.",
      "The page should answer what kind of work this can shape.",
      "This object must feel clearly different from a public workflow result."
    ],
    actionHeading: "Adopt shaping material",
    actionCopy: "Import should put this into Reusable Assets, where it can feed future sessions.",
    actions: [
      { label: "Import asset", variant: "primary", target: 6 },
      { label: "Back to result", variant: "secondary", target: 3 }
    ],
    returnHeading: "Public value should return as future shaping power",
    returnCopy: "A reusable asset is successful when it becomes part of future creative work, not just a public page.",
    returnActions: [{ label: "Import into Memory", variant: "secondary", target: 6 }]
  },
  {
    id: 5,
    dockLabel: "State 5 - Creator Practice Glimpse",
    title: "Creator pages should feel human without becoming social-profile theater",
    description:
      "The user should understand the person through their work, their reusable contributions, and their public practice.",
    nextMove: "Return to the object with more trust",
    primaryActionLabel: "Follow creator lightly",
    primaryActionTarget: 3,
    activeLens: 5,
    originKicker: "Creator context",
    originTitle: "Public creator identity should be grounded in real objects",
    originBadge: "Object-grounded creator",
    originName: "Sel Vey Studio",
    originSummary: "The creator becomes legible because their public workflow results and reusable assets already carry meaning.",
    originAction: { label: "Back to result", target: 3 },
    streamKicker: "Creators",
    streamTitle: "Understand people through what they publish",
    streamBadge: "Public practice",
    streamCards: [
      {
        visual: "creator",
        tag: "Creator",
        title: "Sel Vey Studio",
        summary: "A public practice page led by strong objects, not profile clutter.",
        action: "Return to object",
        target: 3,
        selected: true
      },
      {
        visual: "asset",
        tag: "Reusable Asset",
        title: "Ritual halo lighting pack",
        summary: "One of the reusable contributions that defines this creator's public practice.",
        action: "Open asset",
        target: 4
      }
    ],
    detailTitle: "Object-grounded public practice",
    detailBadge: "Creator page",
    heroTag: "Creator practice",
    heroName: "Sel Vey Studio",
    heroSummary:
      "This page should feel like a creative practice surface - human, grounded, and still tied to the same object loop.",
    heroImageClass: "hero-image-creator",
    creator: {
      name: "Sel Vey Studio",
      note: "Known for atmospheric portrait results, lighting assets, and careful continuity-rich mood work."
    },
    why: [
      "Creator pages should explain the person through published work.",
      "The page needs warmth without drifting into generic social behavior.",
      "The strongest exit is still back toward useful public objects."
    ],
    actionHeading: "Creator trust should strengthen object trust",
    actionCopy: "This page matters because it helps the user trust what is worth importing or following.",
    actions: [
      { label: "Return to result", variant: "primary", target: 3 },
      { label: "Open asset", variant: "secondary", target: 4 }
    ],
    returnHeading: "Creator pages are still part of the same loop",
    returnCopy: "They should deepen trust and context, then point back toward objects and use.",
    returnActions: [{ label: "Import from result", variant: "secondary", target: 6 }]
  },
  {
    id: 6,
    dockLabel: "State 6 - Import Into Memory",
    title: "Import should feel like adoption into practice",
    description:
      "The user should immediately understand where the public object landed and why it now belongs to their own creative memory.",
    nextMove: "Open it from Memory",
    primaryActionLabel: "Continue from Memory",
    primaryActionTarget: 7,
    activeLens: null,
    originKicker: "Import result",
    originTitle: "Public value has entered personal Memory",
    originBadge: "Adoption into practice",
    originName: "Imported into Saved Work",
    originSummary: "The strongest import result is not a bookmark. It is a real object now living inside your own product loop.",
    originAction: { label: "Continue from Memory", target: 7 },
    streamKicker: "Import landing",
    streamTitle: "The object now has a personal home",
    streamBadge: "Personal reuse",
    streamCards: [
      {
        visual: "memory",
        tag: "Saved Work",
        title: "Moonlit oracle portrait",
        summary: "Imported public value is now available for branch, use, and return to Workspace.",
        action: "Continue",
        target: 7,
        selected: true
      }
    ],
    detailTitle: "Public value becomes personal value",
    detailBadge: "Import landing",
    heroTag: "Imported object",
    heroName: "Moonlit oracle portrait",
    heroSummary:
      "This should feel like the object has been adopted into your own creative memory, ready to shape future work.",
    heroImageClass: "hero-image-import",
    creator: {
      name: "Import completed",
      note: "The object keeps its origin, but now belongs inside your Memory."
    },
    why: [
      "Import must feel stronger than saving something for later.",
      "The landing should immediately show the object's new home.",
      "The next move toward use should feel obvious."
    ],
    actionHeading: "Move from import to use",
    actionCopy: "Now that the object belongs to you, the strongest next step is reopening it through Memory and back into Workspace.",
    actions: [
      { label: "Open in Memory", variant: "primary", target: 7 },
      { label: "Return to Discover", variant: "ghost", target: 2 }
    ],
    returnHeading: "The import loop should close back into the core product",
    returnCopy: "Community is only successful if it feeds Memory and Workspace, not if it ends in collection.",
    returnActions: [{ label: "Return toward Workspace", variant: "secondary", target: 7 }]
  },
  {
    id: 7,
    dockLabel: "State 7 - Return Toward Workspace",
    title: "The public loop must return to creation",
    description:
      "The final feeling should be simple: Community helped you find something useful, Memory kept it alive, and Workspace is the natural next move.",
    nextMove: "Open this back in Workspace",
    primaryActionLabel: "Return to Workspace",
    primaryActionTarget: 7,
    activeLens: null,
    originKicker: "Loop completed",
    originTitle: "The object is now part of your ongoing practice",
    originBadge: "Community to core",
    originName: "Open, branch, or use from Memory",
    originSummary: "The public layer has done its job when the next move feels like creation, not consumption.",
    originAction: { label: "Restart Discover", target: 2 },
    streamKicker: "Ready for use",
    streamTitle: "Community has fed the real product center",
    streamBadge: "Back to creation",
    streamCards: [
      {
        visual: "memory",
        tag: "Saved Work",
        title: "Moonlit oracle portrait",
        summary: "Now ready to reopen, branch, or use inside Workspace.",
        action: "Open in Workspace",
        target: 7,
        selected: true
      }
    ],
    detailTitle: "Community succeeds when it returns to the core",
    detailBadge: "Loop closure",
    heroTag: "Ready for Workspace",
    heroName: "Moonlit oracle portrait",
    heroSummary:
      "The public loop now feels complete because it has ended in personal creative momentum, not just public consumption.",
    heroImageClass: "hero-image-import",
    creator: {
      name: "Loop completed",
      note: "The object remains traceable to its public origin while still serving your own workflow."
    },
    why: [
      "The strongest proof of Community is a return to use.",
      "Memory should hold the imported object without making it feel second class.",
      "Workspace should still feel like the emotional center of the product."
    ],
    actionHeading: "Return into live creation",
    actionCopy: "The last step should be obvious: reopen or branch from this object in Workspace.",
    actions: [
      { label: "Open in Workspace", variant: "primary", target: 7 },
      { label: "Back to Memory", variant: "secondary", target: 6 },
      { label: "Restart public loop", variant: "ghost", target: 2 }
    ],
    returnHeading: "The loop is complete",
    returnCopy: "Make, keep, share, discover, import, and use again - this is what makes Community feel integrated.",
    returnActions: [
      { label: "Restart slice", variant: "secondary", target: 1 },
      { label: "Open Workspace", variant: "primary", target: 7 }
    ]
  }
];

const lensButtons = [...document.querySelectorAll(".community-lens")];
const titleEl = document.getElementById("state-title");
const descriptionEl = document.getElementById("state-description");
const nextMoveEl = document.getElementById("next-move");
const beginLoopEl = document.getElementById("begin-loop");
const originKickerEl = document.getElementById("origin-kicker");
const originTitleEl = document.getElementById("origin-title");
const originBadgeEl = document.getElementById("origin-badge");
const originNameEl = document.getElementById("origin-name");
const originSummaryEl = document.getElementById("origin-summary");
const originCardEl = document.getElementById("origin-card");
const thresholdStripEl = document.getElementById("threshold-strip");
const streamKickerEl = document.getElementById("stream-kicker");
const streamTitleEl = document.getElementById("stream-title");
const streamBadgeEl = document.getElementById("stream-badge");
const circulationStripEl = document.getElementById("circulation-strip");
const streamListEl = document.getElementById("stream-list");
const detailTitleEl = document.getElementById("detail-title");
const detailBadgeEl = document.getElementById("detail-badge");
const heroTagEl = document.getElementById("hero-tag");
const heroNameEl = document.getElementById("hero-name");
const heroSummaryEl = document.getElementById("hero-summary");
const heroImageFillEl = document.getElementById("hero-image-fill");
const creatorGroundingEl = document.getElementById("creator-grounding");
const creatorSignalsEl = document.getElementById("creator-signals");
const whyListEl = document.getElementById("why-list");
const actionHeadingEl = document.getElementById("action-heading");
const actionCopyEl = document.getElementById("action-copy");
const actionRowEl = document.getElementById("action-row");
const returnHeadingEl = document.getElementById("return-heading");
const returnCopyEl = document.getElementById("return-copy");
const loopLineEl = document.getElementById("loop-line");
const returnActionsEl = document.getElementById("return-actions");
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

function renderStreamCards(cards) {
  streamListEl.innerHTML = "";

  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "stream-card";
    if (card.selected) {
      article.classList.add("is-selected");
    }

    const visual = document.createElement("div");
    visual.className = "visual-thumb";
    visual.classList.add(`visual-thumb-${card.visual}`);

    const copy = document.createElement("div");
    copy.className = "stream-card-copy";
    copy.innerHTML = `
      <span class="card-tag">${card.tag}</span>
      <strong>${card.title}</strong>
      <p>${card.summary}</p>
    `;

    const action = document.createElement("button");
    action.type = "button";
    action.className = "secondary-button action-button";
    action.textContent = card.action;
    action.addEventListener("click", () => setState(card.target));

    article.append(visual, copy, action);
    streamListEl.appendChild(article);
  });
}

function renderCreator(creator) {
  creatorGroundingEl.innerHTML = `
    <article class="creator-card">
      <strong>${creator.name}</strong>
      <p>${creator.note}</p>
    </article>
  `;
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

function getThresholdForState(id) {
  if (id === 1) {
    return [
      { label: "Memory", current: true },
      { label: "Release" },
      { label: "Discover" }
    ];
  }

  if (id === 2 || id === 3 || id === 4 || id === 5) {
    return [
      { label: "Memory" },
      { label: "Released" },
      { label: "Public life", current: true }
    ];
  }

  return [
    { label: "Memory", current: true },
    { label: "Imported" },
    { label: "Ready for use" }
  ];
}

function getCirculationForState(id) {
  if (id === 1) {
    return [
      { label: "Private value" },
      { label: "Public threshold", current: true },
      { label: "Visible proof" }
    ];
  }

  if (id === 2) {
    return [
      { label: "Fresh release", current: true },
      { label: "Worth opening" },
      { label: "Import-ready" }
    ];
  }

  if (id === 3) {
    return [
      { label: "Visible proof", current: true },
      { label: "Branch potential" },
      { label: "Creator trust" }
    ];
  }

  if (id === 4) {
    return [
      { label: "Shaping material", current: true },
      { label: "Future use" },
      { label: "Adopt into Memory" }
    ];
  }

  if (id === 5) {
    return [
      { label: "Public practice", current: true },
      { label: "Object-led trust" },
      { label: "Return to useful work" }
    ];
  }

  if (id === 6) {
    return [
      { label: "Imported", current: true },
      { label: "Personal value" },
      { label: "Back to use" }
    ];
  }

  return [
    { label: "Community fed Memory" },
    { label: "Ready for Workspace", current: true },
    { label: "Creation resumes" }
  ];
}

function getCreatorSignalsForState(id) {
  if (id === 5) {
    return [
      { label: "Practice-led", current: true },
      { label: "Result + asset creator" },
      { label: "Follow lightly" }
    ];
  }

  return [
    { label: "Object-grounded" },
    { label: "Visible through work", current: true },
    { label: "Not profile-first" }
  ];
}

function getLoopLineForState(id) {
  const currentMap = {
    1: "Community",
    2: "Community",
    3: "Community",
    4: "Community",
    5: "Community",
    6: "Memory",
    7: "Workspace"
  };

  const current = currentMap[id];

  return [
    { label: "Workspace" },
    { label: "Memory", current: current === "Memory" },
    { label: "Community", current: current === "Community" },
    { label: "Workspace", current: current === "Workspace" }
  ];
}

function renderWhy(items) {
  whyListEl.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    whyListEl.appendChild(li);
  });
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

function renderOriginAction(action) {
  const existing = originCardEl.querySelector(".action-button");
  if (existing) {
    existing.remove();
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "secondary-button action-button";
  button.textContent = action.label;
  button.addEventListener("click", () => setState(action.target));
  originCardEl.appendChild(button);
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
  beginLoopEl.textContent = state.primaryActionLabel;
  beginLoopEl.onclick = () => setState(state.primaryActionTarget);

  originKickerEl.textContent = state.originKicker;
  originTitleEl.textContent = state.originTitle;
  originBadgeEl.textContent = state.originBadge;
  originNameEl.textContent = state.originName;
  originSummaryEl.textContent = state.originSummary;
  renderOriginAction(state.originAction);
  renderChipSet(getThresholdForState(state.id), thresholdStripEl, "threshold-chip");

  streamKickerEl.textContent = state.streamKicker;
  streamTitleEl.textContent = state.streamTitle;
  streamBadgeEl.textContent = state.streamBadge;
  renderChipSet(getCirculationForState(state.id), circulationStripEl, "circulation-chip");
  renderStreamCards(state.streamCards);

  detailTitleEl.textContent = state.detailTitle;
  detailBadgeEl.textContent = state.detailBadge;
  heroTagEl.textContent = state.heroTag;
  heroNameEl.textContent = state.heroName;
  heroSummaryEl.textContent = state.heroSummary;
  heroImageFillEl.className = `hero-image-fill ${state.heroImageClass}`;
  renderCreator(state.creator);
  renderChipSet(getCreatorSignalsForState(state.id), creatorSignalsEl, "creator-chip");
  renderWhy(state.why);

  actionHeadingEl.textContent = state.actionHeading;
  actionCopyEl.textContent = state.actionCopy;
  renderActions(state.actions, actionRowEl);

  returnHeadingEl.textContent = state.returnHeading;
  returnCopyEl.textContent = state.returnCopy;
  renderChipSet(getLoopLineForState(state.id), loopLineEl, "loop-chip");
  renderActions(state.returnActions, returnActionsEl);

  dockStateEl.textContent = state.dockLabel;
  setActiveLens(state.activeLens);
  renderStateButtons();
}

lensButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setState(Number(button.dataset.stateTarget));
  });
});

resetButtonEl.addEventListener("click", () => setState(1));

setState(1);
