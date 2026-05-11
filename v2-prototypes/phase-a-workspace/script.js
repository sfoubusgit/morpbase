const stateDefinitions = [
  {
    id: 1,
    label: "Workspace Entry",
    title: "Enter the real Workspace",
    description:
      "The product should feel immediately active and calm. Start by shaping one meaningful subject choice.",
    nextMove: "Open the first block",
    stageBadge: "Entry state",
    trust: "Preview is waking up",
    why: [
      "The workspace should feel active before the user understands every system.",
      "Preview should build trust through response, not through dense controls.",
      "The first keep moment should feel earned."
    ]
  },
  {
    id: 2,
    label: "Guided First-Flow Layer",
    title: "Begin through one clear move",
    description:
      "The first-use layer lives inside the real product. It narrows attention without turning into a tutorial.",
    nextMove: "Choose an archetype and role",
    stageBadge: "Guided entry",
    trust: "Preview is ready to respond",
    why: [
      "Guidance should feel embedded inside the real workspace.",
      "The user does not need to understand Memory, Community, or Continuity yet.",
      "One obvious move is better than broad early choice."
    ]
  },
  {
    id: 3,
    label: "First Authoring Action",
    title: "Make the first shaping move",
    description:
      "The user should feel like they are shaping something real, not answering a questionnaire.",
    nextMove: "Give the subject a stronger presence",
    stageBadge: "First move",
    trust: "Preview has a visible direction",
    why: [
      "The first action should feel concrete and low-friction.",
      "Subject choices should create immediate ownership of the flow.",
      "The preview should now feel connected, not decorative."
    ]
  },
  {
    id: 4,
    label: "Early Preview Trust",
    title: "Trust the preview early",
    description:
      "Preview should become a confidence companion quickly, without turning into a separate control center.",
    nextMove: "Choose a visual direction",
    stageBadge: "Preview trust",
    trust: "Preview is becoming trustworthy",
    why: [
      "The preview must react to shaping work early.",
      "The user should feel response, not randomness.",
      "Confidence should rise before the keep moment exists."
    ]
  },
  {
    id: 5,
    label: "Mid-Flow Confidence",
    title: "Build confidence without checklist pressure",
    description:
      "The flow should feel more coherent and more directed, but never like a rigid wizard.",
    nextMove: "Stage the image and tighten the result",
    stageBadge: "Confidence state",
    trust: "Preview feels coherent",
    why: [
      "The product should feel guided but non-wizard.",
      "Support systems stay quiet while the center gains strength.",
      "The result should now feel like it has direction."
    ]
  },
  {
    id: 6,
    label: "Keep / Save Emergence",
    title: "Let preserving feel earned",
    description:
      "Keep and Save should surface once the result becomes preserve-worthy through use.",
    nextMove: "Keep the result for Memory",
    stageBadge: "Keep-ready",
    trust: "Preview is worth preserving",
    why: [
      "Keep should feel like continuation, not filing.",
      "The user should feel that something meaningful now exists.",
      "Memory should begin to make sense without opening it yet."
    ]
  },
  {
    id: 7,
    label: "Handoff Toward Memory",
    title: "Turn keeping into future value",
    description:
      "The work should now feel durable. Memory becomes the natural continuation of the Workspace loop.",
    nextMove: "Open the kept work inside Memory",
    stageBadge: "Memory handoff",
    trust: "The loop now has future value",
    why: [
      "Saved work should feel reusable, not archived away.",
      "The product loop should already be visible from this first slice.",
      "The shell should now imply a broader system without stealing focus."
    ]
  }
];

const summaryTemplates = {
  "subject-core": "Choose an archetype and role.",
  "presence-signature": "Give the subject a stronger presence.",
  "visual-direction": "Point the image toward a style direction.",
  "mood-light": "Set atmosphere and luminous pressure.",
  "scene-pressure": "Decide how much environment the portrait carries.",
  "framing-focus": "Choose where the eye lands first.",
  "tighten-result": "Make the result feel preserve-worthy."
};

const fieldsByBlock = {
  "subject-core": ["archetype", "role"],
  "presence-signature": ["presence", "signature"],
  "visual-direction": ["visualDirection", "finish"],
  "mood-light": ["mood", "light"],
  "scene-pressure": ["scenePressure"],
  "framing-focus": ["framing", "focusCue"],
  "tighten-result": ["tighten"]
};

const selections = {
  archetype: "",
  role: "",
  presence: "",
  signature: "",
  visualDirection: "",
  finish: "",
  mood: "",
  light: "",
  scenePressure: "",
  framing: "",
  focusCue: "",
  tighten: "",
  kept: false
};

let currentState = 1;
let flowStarted = false;

const elements = {
  beginFlow: document.getElementById("begin-flow"),
  stateTitle: document.getElementById("state-title"),
  stateDescription: document.getElementById("state-description"),
  nextMove: document.getElementById("next-move"),
  previewStageBadge: document.getElementById("preview-stage-badge"),
  previewTrust: document.getElementById("preview-trust"),
  previewSummary: document.getElementById("preview-summary"),
  previewPrompt: document.getElementById("preview-prompt"),
  whyList: document.getElementById("why-list"),
  saveSurface: document.getElementById("save-surface"),
  saveHeading: document.getElementById("save-heading"),
  saveCopy: document.getElementById("save-copy"),
  saveReasons: document.getElementById("save-reasons"),
  memoryHandoff: document.getElementById("memory-handoff"),
  memoryTitle: document.getElementById("memory-title"),
  memoryCopy: document.querySelector("#memory-handoff p + h3 + p"),
  dockState: document.getElementById("dock-state"),
  stateStepper: document.getElementById("state-stepper"),
  keepButton: document.getElementById("keep-button"),
  saveButton: document.getElementById("save-button"),
  branchButton: document.getElementById("branch-button"),
  resetButton: document.getElementById("reset-button"),
  portraitSilhouette: document.getElementById("portrait-silhouette"),
  signatureNote: document.getElementById("signature-note"),
  signalSubject: document.getElementById("signal-subject"),
  signalLook: document.getElementById("signal-look"),
  signalKeep: document.getElementById("signal-keep")
};

function countMeaningfulFields() {
  return Object.entries(selections).filter(([key, value]) => key !== "kept" && String(value).trim()).length;
}

function hasSubject() {
  return Boolean(selections.archetype && selections.role);
}

function hasLook() {
  return Boolean(selections.visualDirection && selections.mood && selections.light);
}

function isKeepReady() {
  return Boolean(
    selections.archetype &&
      selections.role &&
      selections.visualDirection &&
      selections.mood &&
      selections.light &&
      selections.framing &&
      selections.tighten
  );
}

function isBlockComplete(blockKey) {
  return fieldsByBlock[blockKey].every((field) => String(selections[field]).trim());
}

function deriveState() {
  if (selections.kept) {
    return 7;
  }

  const totalFields = countMeaningfulFields();
  const firstMove = selections.archetype || selections.role;

  if (!flowStarted) {
    return 1;
  }

  if (!firstMove) {
    return 2;
  }

  if (!hasSubject()) {
    return 3;
  }

  if (!selections.visualDirection && !selections.finish) {
    return 4;
  }

  if (isKeepReady() || totalFields >= 8) {
    return 6;
  }

  if (hasLook()) {
    return 5;
  }

  return 4;
}

function buildPreviewSummary() {
  if (!selections.archetype && !selections.role) {
    return "Start with a subject choice and the preview will begin taking shape.";
  }

  const subject = [selections.archetype, selections.role].filter(Boolean).join(" ");
  const presence = selections.presence ? `with ${selections.presence}` : "with an unresolved presence";
  const direction = selections.visualDirection ? `guided toward a ${selections.visualDirection}` : "waiting for a visual direction";
  const mood = selections.mood ? `inside a ${selections.mood} atmosphere` : "before the atmosphere is set";

  return `${subject.charAt(0).toUpperCase() + subject.slice(1)} ${presence}, ${direction}, ${mood}.`;
}

function buildPromptText() {
  const lines = [];

  if (selections.archetype || selections.role) {
    lines.push([selections.archetype, selections.role].filter(Boolean).join(" "));
  } else {
    lines.push("Portrait workflow waiting for direction.");
  }

  if (selections.presence) lines.push(`Presence: ${selections.presence}`);
  if (selections.signature) lines.push(`Signature: ${selections.signature}`);

  if (selections.visualDirection || selections.finish) {
    lines.push(`Look: ${[selections.visualDirection, selections.finish].filter(Boolean).join(", ")}`);
  }

  if (selections.mood || selections.light) {
    lines.push(`Atmosphere: ${[selections.mood, selections.light].filter(Boolean).join(", ")}`);
  }

  if (selections.scenePressure) lines.push(`Scene: ${selections.scenePressure}`);

  if (selections.framing || selections.focusCue) {
    lines.push(`Framing: ${[selections.framing, selections.focusCue].filter(Boolean).join(", ")}`);
  }

  if (selections.tighten) lines.push(`Tighten: ${selections.tighten}`);

  return lines.join("\n");
}

function buildSaveReasons() {
  const reasons = [];

  if (hasSubject()) {
    reasons.push(`The subject now reads as ${[selections.archetype, selections.role].filter(Boolean).join(" ")}.`);
  }

  if (selections.visualDirection) {
    reasons.push(`The image has a visible direction: ${selections.visualDirection}.`);
  }

  if (selections.mood || selections.light) {
    reasons.push(`Atmosphere is forming through ${[selections.mood, selections.light].filter(Boolean).join(" and ")}.`);
  }

  if (selections.tighten) {
    reasons.push(`The result has already been tightened through ${selections.tighten}.`);
  }

  if (!reasons.length) {
    reasons.push("The result is beginning to feel distinct.");
  }

  return reasons.slice(0, 3);
}

function updateBlockSummaries() {
  Object.keys(summaryTemplates).forEach((blockKey) => {
    const element = document.getElementById(`summary-${blockKey}`);
    if (!element) return;

    const values = fieldsByBlock[blockKey].map((field) => selections[field]).filter(Boolean);
    element.textContent = values.length ? values.join(" / ") : summaryTemplates[blockKey];
  });

  document.querySelectorAll(".workflow-block").forEach((block) => {
    block.classList.toggle("is-complete", isBlockComplete(block.dataset.block));
  });
}

function recommendedBlockForState(state) {
  const stateToBlock = {
    1: "subject-core",
    2: "subject-core",
    3: "presence-signature",
    4: "visual-direction",
    5: "mood-light",
    6: "tighten-result",
    7: "tighten-result"
  };

  return stateToBlock[state];
}

function updateFocusBlock() {
  const activeBlock = recommendedBlockForState(currentState);
  document.querySelectorAll(".workflow-block").forEach((block) => {
    block.classList.toggle("is-focused", block.dataset.block === activeBlock);
  });
}

function updatePhaseStrip() {
  const stateToPhase = {
    1: "subject",
    2: "subject",
    3: "subject",
    4: "look",
    5: "scene",
    6: "refine",
    7: "refine"
  };

  const activePhase = stateToPhase[currentState];
  document.querySelectorAll(".phase-pill").forEach((pill) => {
    pill.classList.toggle("is-active", pill.dataset.phase === activePhase);
  });
}

function updateChoiceClasses() {
  document.querySelectorAll("[data-field]").forEach((button) => {
    button.classList.toggle("is-selected", selections[button.dataset.field] === button.dataset.value);
  });
}

function updateStateStepper() {
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
      if (state.id > 1) {
        flowStarted = true;
      }
      selections.kept = state.id === 7;
      currentState = state.id;
      renderState();
    });

    elements.stateStepper.appendChild(button);
  });
}

function updatePreviewPanels() {
  const subjectReady = hasSubject();
  const lookReady = hasLook();
  const keepReady = currentState >= 6;
  const nearKeep = currentState >= 5;

  elements.previewSummary.textContent = buildPreviewSummary();
  elements.previewPrompt.textContent = buildPromptText();

  elements.signalSubject.classList.toggle("is-on", subjectReady);
  elements.signalLook.classList.toggle("is-on", lookReady);
  elements.signalKeep.classList.toggle("is-on", keepReady);

  elements.portraitSilhouette.classList.toggle("is-awake", currentState >= 4);
  elements.portraitSilhouette.classList.toggle("is-confident", currentState >= 5);
  elements.portraitSilhouette.classList.toggle("is-keepable", keepReady);

  elements.saveSurface.classList.toggle("is-visible", nearKeep);
  elements.saveSurface.classList.toggle("is-ready", keepReady);
  elements.memoryHandoff.classList.toggle("is-visible", currentState === 7);

  elements.keepButton.disabled = !keepReady;
  elements.saveButton.disabled = !keepReady;

  if (currentState >= 6) {
    elements.saveHeading.textContent = "Keep this in Memory";
    elements.saveCopy.textContent =
      "This now feels preserve-worthy. Keeping it should feel like continuation, not storage.";
  } else {
    elements.saveHeading.textContent = "This is almost worth keeping";
    elements.saveCopy.textContent =
      "The result has direction now. One more tightening move should make it feel ready for Memory.";
  }

  elements.saveReasons.innerHTML = "";
  buildSaveReasons().forEach((reason) => {
    const item = document.createElement("li");
    item.textContent = reason;
    elements.saveReasons.appendChild(item);
  });

  elements.memoryCopy.innerHTML =
    "The kept result can return as reusable work inside <strong>Memory Home</strong>, where it becomes part of the product's continuation loop.";

  const savedName = [selections.archetype, selections.role].filter(Boolean).join(" ") || "Portrait base";
  elements.memoryTitle.textContent = savedName.replace(/\b\w/g, (char) => char.toUpperCase());
}

function renderState() {
  const state = stateDefinitions[currentState - 1];

  elements.stateTitle.textContent = state.title;
  elements.stateDescription.textContent = state.description;
  elements.nextMove.textContent = state.nextMove;
  elements.previewStageBadge.textContent = state.stageBadge;
  elements.previewTrust.textContent = state.trust;
  elements.dockState.textContent = `State ${state.id} - ${state.label}`;

  elements.whyList.innerHTML = "";
  state.why.forEach((line) => {
    const item = document.createElement("li");
    item.textContent = line;
    elements.whyList.appendChild(item);
  });

  updateBlockSummaries();
  updateFocusBlock();
  updatePhaseStrip();
  updateChoiceClasses();
  updateStateStepper();
  updatePreviewPanels();
}

function commitSelection(field, value) {
  selections[field] = value;
  currentState = deriveState();
  renderState();
}

document.querySelectorAll("[data-field]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!flowStarted) {
      flowStarted = true;
    }
    commitSelection(button.dataset.field, button.dataset.value);
  });
});

elements.beginFlow.addEventListener("click", () => {
  flowStarted = true;
  currentState = deriveState();
  renderState();
});

elements.signatureNote.addEventListener("input", (event) => {
  selections.signature = event.target.value.trim();
  if (!flowStarted) {
    flowStarted = true;
  }
  currentState = deriveState();
  renderState();
});

elements.keepButton.addEventListener("click", () => {
  selections.kept = true;
  currentState = 7;
  renderState();
});

elements.saveButton.addEventListener("click", () => {
  selections.kept = true;
  currentState = 7;
  renderState();
});

elements.branchButton.addEventListener("click", () => {
  selections.tighten = selections.tighten || "branch from current shape";
  selections.kept = false;
  currentState = 6;
  renderState();
});

elements.resetButton.addEventListener("click", () => {
  Object.keys(selections).forEach((key) => {
    selections[key] = key === "kept" ? false : "";
  });
  flowStarted = false;
  elements.signatureNote.value = "";
  currentState = 1;
  renderState();
});

renderState();
