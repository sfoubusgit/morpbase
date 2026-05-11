const stateDefinitions = [
  {
    id: 1,
    label: "Arrival From Workspace",
    title: "Your kept result still matters",
    description:
      "Memory should feel like the next natural place for the work you just shaped, not a storage area.",
    nextMove: "Enter Memory Home",
    collectionKicker: "Arrival",
    collectionTitle: "The result you kept has become part of your creative memory",
    collectionBadge: "Continuation after success",
    detailBadge: "Arrival",
    why: [
      "The move from Workspace to Memory should feel like continuation.",
      "The kept result should still feel emotionally central.",
      "Memory should already feel more alive than storage."
    ]
  },
  {
    id: 2,
    label: "Memory Home",
    title: "Memory should feel alive immediately",
    description:
      "Memory Home is the front door for what is active, useful, and worth returning to.",
    nextMove: "Open Saved Work or Reusable Assets",
    collectionKicker: "Memory Home",
    collectionTitle: "What is active in your creative memory right now",
    collectionBadge: "Living front door",
    detailBadge: "Home",
    why: [
      "Memory Home should feel active, not archival.",
      "The user should see strong return paths quickly.",
      "The realm should feel structured without becoming heavy."
    ]
  },
  {
    id: 3,
    label: "Saved Work Focus",
    title: "Saved work should feel reusable",
    description:
      "Kept results need to feel like living creative objects that can be reopened or branched from.",
    nextMove: "Open or branch a saved result",
    collectionKicker: "Saved Work",
    collectionTitle: "Preserved results that still want to be used",
    collectionBadge: "Reusable outcomes",
    detailBadge: "Saved Work",
    why: [
      "Saved Work should never feel like dead prompt records.",
      "Branch and open should feel central.",
      "The path back into Workspace should be obvious."
    ]
  },
  {
    id: 4,
    label: "Reusable Assets Focus",
    title: "Reusable assets should shape future sessions",
    description:
      "This section should feel clearly different from Saved Work. It holds material for new workflows.",
    nextMove: "Use an asset in Workspace",
    collectionKicker: "Reusable Assets",
    collectionTitle: "Shaping material for future workflows",
    collectionBadge: "Future-shaping material",
    detailBadge: "Assets",
    why: [
      "Reusable Assets must feel useful and distinct.",
      "This should not feel like a second app.",
      "Using an asset should point naturally back into live work."
    ]
  },
  {
    id: 5,
    label: "Capture Inbox Glimpse",
    title: "Rough captures should still feel valid",
    description:
      "Capture Inbox should stay lighter than kept work, but it must not feel like a trash bin.",
    nextMove: "Notice rough value without losing the center",
    collectionKicker: "Capture Inbox",
    collectionTitle: "Rough material that may matter later",
    collectionBadge: "Light but valid",
    detailBadge: "Inbox",
    why: [
      "Quick captures should keep dignity.",
      "Capture Inbox should not dominate Memory.",
      "The second pole should still feel coherent."
    ]
  },
  {
    id: 6,
    label: "Return To Workspace",
    title: "Memory should feed live work again",
    description:
      "The return to Workspace should feel strong enough that Memory becomes part of the creative loop.",
    nextMove: "Return to Workspace",
    collectionKicker: "Return",
    collectionTitle: "Make Memory lead back into active creation",
    collectionBadge: "Loop completed",
    detailBadge: "Return",
    why: [
      "Memory should be one step away from active work.",
      "Returning should feel like continuation, not app switching.",
      "This is what makes Memory a true second home."
    ]
  }
];

const collections = {
  home: [
    {
      name: "Moonlit oracle portrait",
      summary: "The newly kept portrait base that should still feel warm and reusable.",
      tag: "Saved Work",
      action: "Branch",
      type: "saved",
      detail: "A kept result that should feel ready to reopen, branch, and evolve."
    },
    {
      name: "Sacred silk and silver motifs",
      summary: "A reusable material set that can shape future portraits without becoming another destination.",
      tag: "Reusable Asset",
      action: "Use",
      type: "asset",
      detail: "Material for future workflows that should stay one step away from Workspace."
    },
    {
      name: "Late-night fog silhouette",
      summary: "A rough quick save that feels worth returning to later.",
      tag: "Capture Inbox",
      action: "Review",
      type: "capture",
      detail: "An unfinished spark that should feel valid without overpowering the slice."
    }
  ],
  saved: [
    {
      name: "Moonlit oracle portrait",
      summary: "Calm, ceremonial portrait base with luminous silver sidelight.",
      tag: "Saved Work",
      action: "Branch",
      type: "saved",
      detail: "A kept result that should feel ready to reopen, branch, and evolve."
    },
    {
      name: "Amber relic studio portrait",
      summary: "A warmer portrait direction with stronger relic emphasis and softer grain.",
      tag: "Saved Work",
      action: "Open",
      type: "saved",
      detail: "A second kept result proving that saved work can stay alive without feeling like records."
    }
  ],
  assets: [
    {
      name: "Luminous fabric finish set",
      summary: "Finish cues and visual material that can shape new portrait workflows.",
      tag: "Reusable Asset",
      action: "Use",
      type: "asset",
      detail: "Reusable shaping material that should feed active sessions naturally."
    },
    {
      name: "Ceremonial framing starter",
      summary: "A framing direction bundle for waist-up ritual portraits.",
      tag: "Reusable Asset",
      action: "Use",
      type: "asset",
      detail: "A reusable starting point that should clearly differ from a saved final result."
    }
  ],
  capture: [
    {
      name: "Street visionary silhouette",
      summary: "Rough quick save with good atmosphere, not yet promoted.",
      tag: "Capture Inbox",
      action: "Review",
      type: "capture",
      detail: "Rough but worthwhile material that still deserves dignity."
    },
    {
      name: "Window haze relic study",
      summary: "Unfinished study that may become a reusable asset later.",
      tag: "Capture Inbox",
      action: "Promote",
      type: "capture",
      detail: "A rough capture that hints at future value without claiming too much attention now."
    }
  ]
};

const momentumByCollection = {
  home: [
    { title: "Recently kept", text: "The latest result still sits at the center instead of disappearing into storage." },
    { title: "Ready to continue", text: "Strong return paths stay visible so Memory keeps creative momentum alive." },
    { title: "More than one kind of value", text: "Saved work, reusable material, and rough captures all have different roles." }
  ],
  saved: [
    { title: "Reusable outcome", text: "Saved Work should feel ready to branch, reopen, and continue." },
    { title: "Still warm", text: "The result should still feel close to active making, not archived away." },
    { title: "Back to Workspace", text: "The strongest action should naturally pull the user back into live work." }
  ],
  assets: [
    { title: "Future-shaping material", text: "Reusable Assets should feel like fuel for the next session." },
    { title: "Clearly different", text: "This area should not be mistaken for another saved-results zone." },
    { title: "Use now", text: "The point is to bring helpful material straight back into Workspace." }
  ],
  capture: [
    { title: "Light but valid", text: "Rough captures keep their dignity without crowding the core of Memory." },
    { title: "Return later", text: "These items stay visible because unfinished work can still matter." },
    { title: "Promotion path", text: "Capture Inbox should hint at future value instead of feeling like a trash bin." }
  ]
};

const elements = {
  enterMemory: document.getElementById("enter-memory"),
  stateTitle: document.getElementById("state-title"),
  stateDescription: document.getElementById("state-description"),
  nextMove: document.getElementById("next-move"),
  collectionKicker: document.getElementById("collection-kicker"),
  collectionTitle: document.getElementById("collection-title"),
  collectionBadge: document.getElementById("collection-badge"),
  collectionList: document.getElementById("collection-list"),
  homeOverview: document.getElementById("home-overview"),
  momentumStrip: document.getElementById("momentum-strip"),
  heroTitle: document.getElementById("hero-title"),
  heroSummary: document.getElementById("hero-summary"),
  detailTitle: document.getElementById("detail-title"),
  detailBadge: document.getElementById("detail-badge"),
  selectedName: document.getElementById("selected-name"),
  selectedSummary: document.getElementById("selected-summary"),
  whyList: document.getElementById("why-list"),
  actionSummary: document.getElementById("action-summary"),
  actionDetail: document.getElementById("action-detail"),
  returnPath: document.getElementById("return-path"),
  returnHeading: document.getElementById("return-heading"),
  returnCopy: document.getElementById("return-copy"),
  returnSurface: document.getElementById("return-surface"),
  returnButton: document.getElementById("return-button"),
  inspectButton: document.getElementById("inspect-button"),
  keptTag: document.getElementById("kept-tag"),
  stateStepper: document.getElementById("state-stepper"),
  dockState: document.getElementById("dock-state"),
  resetButton: document.getElementById("reset-button")
};

let currentState = 1;
let selectedCollection = "home";
let selectedItem = collections.home[0];
let selectedAction = "continue";

function stateToCollection(state) {
  if (state === 3) return "saved";
  if (state === 4) return "assets";
  if (state === 5) return "capture";
  return "home";
}

function collectionForCurrentState() {
  if (currentState === 2) return collections.home;
  if (currentState === 3) return collections.saved;
  if (currentState === 4) return collections.assets;
  if (currentState === 5) return collections.capture;
  return collections.home;
}

function setState(nextState, nextCollection = stateToCollection(nextState), nextItem = null, nextAction = null) {
  currentState = nextState;
  selectedCollection = nextCollection;
  selectedItem = nextItem || collections[nextCollection][0];
  selectedAction = nextAction || (nextState === 6 ? "return" : "continue");
  render();
}

function buildActionCopy() {
  if (currentState === 1) {
    return {
      summary: "You just kept something meaningful. Memory now has to prove it can hold that value without going cold.",
      detail: "Move into Memory Home and see whether the result still feels alive, visible, and ready to continue.",
      returnHeading: "Continue into Memory Home",
      returnCopy: "The first test is simple: does the kept result still feel important once it enters Memory?",
      button: "Enter Memory Home"
    };
  }

  if (currentState === 6) {
    return {
      summary: `${selectedAction} should feel like a natural move back into active creation.`,
      detail: `${selectedItem.name} is now proving whether Memory truly feeds live work instead of simply holding onto it.`,
      returnHeading: "Return this to Workspace",
      returnCopy: "If this move feels obvious and strong, Memory is working as a real second home.",
      button: "Return to Workspace"
    };
  }

  if (selectedCollection === "saved") {
    return {
      summary: `${selectedItem.name} should feel like a living result, not a stored record.`,
      detail: `Actions like ${selectedItem.action} need to feel central so Saved Work stays reusable.`,
      returnHeading: `${selectedItem.action} this back into Workspace`,
      returnCopy: "Saved Work succeeds only if it naturally re-enters live making.",
      button: selectedItem.action === "Open" ? "Open in Workspace" : `${selectedItem.action} in Workspace`
    };
  }

  if (selectedCollection === "assets") {
    return {
      summary: `${selectedItem.name} should feel like shaping material for future sessions.`,
      detail: "Reusable Assets should be clearly different from saved results while still pointing back into Workspace.",
      returnHeading: "Use this in Workspace",
      returnCopy: "This should feel like bringing helpful material into live work, not visiting a second app.",
      button: "Use in Workspace"
    };
  }

  if (selectedCollection === "capture") {
    return {
      summary: `${selectedItem.name} should feel rough but still valid.`,
      detail: "Capture Inbox is here to keep rough value visible without crowding the center of Memory.",
      returnHeading: "Promote or return later",
      returnCopy: "Rough material should feel possible, not disposable.",
      button: selectedItem.action
    };
  }

  return {
    summary: "Memory Home should show what is still active and worth returning to.",
    detail: "The user should immediately understand that Memory is part of the creative loop, not a storage destination.",
    returnHeading: "Return something to Workspace",
    returnCopy: "A strong second pole always keeps the path back into live work visible.",
    button: "Open in Workspace"
  };
}

function renderCollection() {
  const items = collectionForCurrentState();
  elements.collectionList.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "list-card";
    if (selectedItem && selectedItem.name === item.name) {
      card.classList.add("is-selected");
    }

    const meta = document.createElement("div");
    meta.className = "list-meta";

    const tag = document.createElement("span");
    tag.className = "memory-tag";
    tag.textContent = item.tag;
    meta.appendChild(tag);

    const title = document.createElement("h4");
    title.textContent = item.name;
    title.style.margin = "0";

    const summary = document.createElement("p");
    summary.textContent = item.summary;

    const actions = document.createElement("div");
    actions.className = "object-actions";

    const inspect = document.createElement("button");
    inspect.className = "secondary-button";
    inspect.type = "button";
    inspect.textContent = "Inspect";
    inspect.addEventListener("click", () => {
      selectedItem = item;
      selectedAction = "inspect";
      render();
    });

    const act = document.createElement("button");
    act.className = "primary-button";
    act.type = "button";
    act.textContent = item.action;
    act.addEventListener("click", () => {
      setState(6, selectedCollection, item, item.action.toLowerCase());
    });

    actions.appendChild(inspect);
    actions.appendChild(act);

    card.addEventListener("click", () => {
      selectedItem = item;
      render();
    });

    card.appendChild(meta);
    card.appendChild(title);
    card.appendChild(summary);
    card.appendChild(actions);
    elements.collectionList.appendChild(card);
  });
}

function renderMomentum() {
  const entries = momentumByCollection[selectedCollection] || momentumByCollection.home;
  elements.momentumStrip.innerHTML = "";

  entries.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "momentum-card";

    const title = document.createElement("strong");
    title.textContent = entry.title;

    const text = document.createElement("p");
    text.textContent = entry.text;

    card.appendChild(title);
    card.appendChild(text);
    elements.momentumStrip.appendChild(card);
  });
}

function renderReturnPath() {
  const chipsByCollection = {
    home: ["Keep something", "See it stay alive", "Continue in Workspace"],
    saved: ["Open", "Branch", "Continue live work"],
    assets: ["Choose material", "Use in Workspace", "Start a new session"],
    capture: ["Notice rough value", "Review later", "Promote when ready"]
  };

  const chips = chipsByCollection[selectedCollection] || chipsByCollection.home;
  elements.returnPath.innerHTML = "";

  chips.forEach((chip) => {
    const span = document.createElement("span");
    span.className = "return-chip";
    span.textContent = chip;
    elements.returnPath.appendChild(span);
  });
}

function renderHomeOverview() {
  elements.homeOverview.style.display = currentState === 1 || currentState === 2 ? "grid" : "none";
}

function renderTabs() {
  document.querySelectorAll(".memory-tab").forEach((tab) => {
    tab.classList.toggle("is-active", Number(tab.dataset.stateTarget) === currentState);
  });
}

function renderStateStepper() {
  elements.stateStepper.innerHTML = "";

  stateDefinitions.forEach((state) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "state-button";
    button.textContent = state.id;
    button.title = state.label;
    if (state.id === currentState) {
      button.classList.add("is-current");
    }
    button.addEventListener("click", () => {
      setState(state.id);
    });
    elements.stateStepper.appendChild(button);
  });
}

function render() {
  const state = stateDefinitions[currentState - 1];
  const actionCopy = buildActionCopy();

  elements.stateTitle.textContent = state.title;
  elements.stateDescription.textContent = state.description;
  elements.nextMove.textContent = state.nextMove;
  elements.collectionKicker.textContent = state.collectionKicker;
  elements.collectionTitle.textContent = state.collectionTitle;
  elements.collectionBadge.textContent = state.collectionBadge;
  elements.detailBadge.textContent = state.detailBadge;
  elements.dockState.textContent = `State ${state.id} - ${state.label}`;

  elements.heroTitle.textContent = collections.home[0].name;
  elements.heroSummary.textContent = collections.home[0].summary;
  elements.detailTitle.textContent = currentState === 6 ? "Return to active work" : "Memory keeps creative value alive";
  elements.selectedName.textContent = selectedItem.name;
  elements.selectedSummary.textContent = selectedItem.detail;
  elements.keptTag.textContent = selectedItem.tag;

  elements.whyList.innerHTML = "";
  state.why.forEach((line) => {
    const item = document.createElement("li");
    item.textContent = line;
    elements.whyList.appendChild(item);
  });

  elements.actionSummary.textContent = actionCopy.summary;
  elements.actionDetail.textContent = actionCopy.detail;
  elements.returnHeading.textContent = actionCopy.returnHeading;
  elements.returnCopy.textContent = actionCopy.returnCopy;
  elements.returnButton.textContent = actionCopy.button;

  renderCollection();
  renderHomeOverview();
  renderMomentum();
  renderReturnPath();
  renderTabs();
  renderStateStepper();
}

elements.enterMemory.addEventListener("click", () => {
  setState(2);
});

document.querySelectorAll(".memory-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    setState(Number(tab.dataset.stateTarget));
  });
});

document.querySelectorAll(".pillar-card").forEach((card) => {
  card.addEventListener("click", () => {
    setState(Number(card.dataset.stateTarget));
  });
});

document.querySelectorAll(".object-action").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action.toLowerCase();
    const item = action === "open" ? collections.saved[1] : collections.saved[0];
    setState(6, "saved", item, action);
  });
});

elements.returnButton.addEventListener("click", () => {
  setState(6, selectedCollection, selectedItem, "return");
});

elements.inspectButton.addEventListener("click", () => {
  setState(Math.max(2, currentState));
});

elements.resetButton.addEventListener("click", () => {
  currentState = 1;
  selectedCollection = "home";
  selectedItem = collections.home[0];
  selectedAction = "continue";
  render();
});

render();
