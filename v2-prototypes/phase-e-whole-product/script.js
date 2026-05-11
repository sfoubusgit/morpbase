const states = [
  {
    realm: "workspace",
    realmLabel: "Workspace",
    showFuture: false,
    chip: "Center Alive",
    title: "Live Workspace Center",
    summary:
      "The product opens where creation is happening right now. The session already feels close to worth keeping, so the center reads as active and meaningful instead of empty.",
    primaryLabel: "Active Session",
    primaryTitle: "Studio portrait session nearing a keep-worthy result",
    primaryBody:
      "The left side is still guiding the work, the right side is still proving it, and the product still feels like it begins from one live creative center. The question here is simple: does everything else feel like it belongs to this engine, or does it still feel like future admin around it?",
    primaryAction: "Keep Result",
    tiles: [
      {
        title: "Guided But Open",
        body: "One clear next move is visible, but the session still feels like a workspace and not a wizard."
      },
      {
        title: "Preview Trust",
        body: "The image-backed result gives proof that the workflow is producing something worth keeping."
      },
      {
        title: "Value Starting Point",
        body: "Every later realm only matters because something meaningful begins here first."
      },
      {
        title: "Soft Readiness",
        body: "The session feels close to ready without the product turning it into a checklist."
      }
    ],
    meaning:
      "This is the heart test. If the whole product does not clearly begin from live creation, the rest of the structure becomes decorative.",
    next:
      "Turn live progress into durable value by keeping the result and moving naturally into Memory.",
    proofCaption: "Preview image proves why the workflow feels close to worth keeping.",
    proofNote:
      "The visual is not the product center. It is proof that the workflow session has real output value.",
    futureTitle: "What later growth must not break",
    futureBody:
      "Any later sharing, collaboration, or playful layer has to strengthen this center rather than compete with it.",
    futureTags: ["Share from real work", "Collaborate around objects", "Playfulness around creation"],
    rail: [
      "Live creation starts value",
      "Keep turns it into durable value",
      "Memory keeps it moving",
      "Public life can circulate it",
      "Continuity can stabilize it",
      "Everything returns to creation"
    ],
    dock:
      "Start at the center and ask the most important question first: does the product still begin from live creation?"
  },
  {
    realm: "memory",
    realmLabel: "Memory",
    showFuture: false,
    chip: "Value Preserved",
    title: "Keep Into Memory",
    summary:
      "The handoff from live work into Memory should feel like preservation of momentum, not the end of a session. This is the strongest success moment in the whole product.",
    primaryLabel: "Keep Handoff",
    primaryTitle: "A live result becomes durable creative value",
    primaryBody:
      "The product acknowledges that the result now matters beyond this moment. The handoff is light, calm, and clearly connected to what was just created, so the user feels continuity rather than interruption.",
    primaryAction: "Open In Memory",
    tiles: [
      {
        title: "Still The Same Work",
        body: "The kept object still feels tied to the live session that produced it."
      },
      {
        title: "No Dead End",
        body: "Saving does not close the loop. It opens the second home of the product."
      },
      {
        title: "Meaning Over Filing",
        body: "The user feels that something worth keeping has been preserved, not just stored."
      },
      {
        title: "Clear Continuation",
        body: "The next move is obvious: continue through Memory, not restart from scratch."
      }
    ],
    meaning:
      "If Keep feels like a dead administrative step, the whole Memory concept weakens. This moment has to feel like creative value becoming durable.",
    next:
      "Move into Memory and prove that the work still has momentum after the active session ends.",
    proofCaption: "The kept result still carries visual proof of why it mattered enough to save.",
    proofNote:
      "The image stays as evidence of value while the object itself becomes reusable beyond this moment.",
    futureTitle: "What this moment should allow later",
    futureBody:
      "Real sharing, collaboration, and public release should all start from meaningful kept work, not from empty posting behavior.",
    futureTags: ["Share from kept value", "Collaborate on strong objects", "Challenges start from real work"],
    rail: [
      "Live creation starts value",
      "Keep makes value durable",
      "Memory becomes the second home",
      "Public release can happen later",
      "Continuity can trace recurrence",
      "Everything still points back to work"
    ],
    dock:
      "This is the strongest success transition: the session becomes something you can return to, branch from, and build on."
  },
  {
    realm: "memory",
    realmLabel: "Memory",
    showFuture: false,
    chip: "Second Home",
    title: "Memory In Motion",
    summary:
      "Memory should feel like work that is still alive. It is not only where things rest. It is where the product remembers enough to help the next creation pass happen faster and with more meaning.",
    primaryLabel: "Memory Home",
    primaryTitle: "Saved work, reusable assets, and next moves still feel active",
    primaryBody:
      "The newly kept work sits in a place that immediately suggests continuation. One path points back to Workspace through branch or open. Another path points outward into public life through publish. The realm earns its place by keeping value moving.",
    primaryAction: "Publish This Work",
    tiles: [
      {
        title: "Saved Work",
        body: "Strong finished or semi-finished results live here as real reusable starting points."
      },
      {
        title: "Reusable Assets",
        body: "Shaping material can stay useful without being mistaken for whole finished work."
      },
      {
        title: "Capture Inbox",
        body: "Rough things can exist without cluttering the stronger kept layer."
      },
      {
        title: "Fast Return",
        body: "Open, branch, and use actions make clear that Memory exists to feed creation."
      }
    ],
    meaning:
      "Memory is the second home of MorpBase. If it feels like storage, the product loses one of its clearest strengths.",
    next:
      "Promote a strong object into public life and test whether Community grows naturally out of real work.",
    proofCaption: "Memory keeps proof attached to work so reuse does not become abstract.",
    proofNote:
      "Visuals help the user recognize what a result is, why it mattered, and why it is worth reopening.",
    futureTitle: "How later systems should attach here",
    futureBody:
      "Sharing, collaboration, and playful participation should all grow out of strong remembered objects, not out of random activity for its own sake.",
    futureTags: ["Meaningful share points", "Co-work from kept objects", "Playable prompts can start here"],
    rail: [
      "Keep leads into continuation",
      "Memory keeps value alive",
      "Branch returns to Workspace",
      "Publish gives public life",
      "Continuity can read recurrence",
      "Creation gets stronger next time"
    ],
    dock:
      "Memory should feel like a second home for creative work, not a neat archive you forget about."
  },
  {
    realm: "community",
    realmLabel: "Community",
    showFuture: true,
    chip: "Public Life",
    title: "Public Release",
    summary:
      "Community only earns its place if it feels like the public life of real MorpBase work. It should not look like a separate content world that happens to share a shell.",
    primaryLabel: "Publishing And Discover",
    primaryTitle: "A kept object enters public circulation without losing its origin",
    primaryBody:
      "The publish action starts from Memory, not from a blank upload world. Once released, the object appears inside a living Discover surface where proof images, creator grounding, and usefulness sit together without turning the product into a feed.",
    primaryAction: "Open Public Result",
    tiles: [
      {
        title: "Public Workflow Result",
        body: "A reusable public outcome with visible proof, creator context, and clear import value."
      },
      {
        title: "Public Reusable Asset",
        body: "Shaping material that can help future work without pretending to be a whole finished result."
      },
      {
        title: "Creator Grounding",
        body: "People are understood through real objects and practice, not through generic profile noise."
      },
      {
        title: "Discover Energy",
        body: "The realm feels alive without becoming scroll-hungry or marketplace-shaped."
      }
    ],
    meaning:
      "Community works only if it feels downstream from real work and upstream to reuse. Otherwise it becomes a detached public layer.",
    next:
      "Import useful value back inward and prove that public life feeds personal creation instead of just collecting attention.",
    proofCaption: "Visible outcomes make public work worth opening, but the workflow object still carries the meaning.",
    proofNote:
      "Images help public objects compete for attention, but the real value is still reuse, import, and creative leverage.",
    futureTitle: "What later public energy could become",
    futureBody:
      "Challenges, playful prompts, collaborative calls, and other participation loops could grow here later if they stay tied to real objects and real creative value.",
    futureTags: ["Challenge-ready objects", "Creator invites", "Public collaboration hooks"],
    rail: [
      "Private value earns public life",
      "Discover makes it legible",
      "Creator context stays object-grounded",
      "Import keeps it useful",
      "Public value returns inward",
      "Creation stays the final destination"
    ],
    dock:
      "The public side should feel alive, but it should still feel like MorpBase and not a separate content app."
  },
  {
    realm: "memory",
    realmLabel: "Memory",
    showFuture: true,
    chip: "Value Returns",
    title: "Public Value Returns",
    summary:
      "The public loop is only worth having if useful value can come back into personal practice. Import has to feel like adoption, not like bookmarking or collecting.",
    primaryLabel: "Import Into Memory",
    primaryTitle: "A useful public object becomes part of personal creative practice",
    primaryBody:
      "The imported object lands in the correct Memory pillar with enough origin context to stay meaningful. The user can now branch, use, or combine it with what already lives in Memory. The product proves that public circulation strengthens private creation instead of distracting from it.",
    primaryAction: "Use In Workspace",
    tiles: [
      {
        title: "Adoption, Not Bookmarking",
        body: "The object now belongs to your practice in a real way and can be used immediately."
      },
      {
        title: "Correct Landing",
        body: "The product knows whether this belongs with Saved Work or Reusable Assets."
      },
      {
        title: "Origin Still Legible",
        body: "Public provenance stays visible enough to feel honest without cluttering the object."
      },
      {
        title: "Fast Re-entry",
        body: "The next move back toward Workspace is obvious and low-friction."
      }
    ],
    meaning:
      "This is the moment where Community proves it is useful. If import feels thin, the whole public layer becomes ornamental.",
    next:
      "Bring recurring sameness into the same engine and test whether Continuity feels meaningful without becoming heavy.",
    proofCaption: "Imported value still carries enough proof to feel worth using, not just worth saving.",
    proofNote:
      "The product uses visible outcomes to help recognition, but it keeps the imported object tied to future creation.",
    futureTitle: "How later shared work could attach",
    futureBody:
      "Later collaboration can likely grow from this same adoption logic: bring outside value inward, then continue work together around real objects.",
    futureTags: ["Shared starting points", "Co-edit later", "Meaningful reuse"],
    rail: [
      "Public work becomes useful",
      "Import creates personal value",
      "Memory absorbs it cleanly",
      "Use returns it to Workspace",
      "Continuity can deepen sameness",
      "The engine keeps tightening"
    ],
    dock:
      "Import should feel stronger than collecting. It should feel like useful public value becoming part of your own engine."
  },
  {
    realm: "continuity",
    realmLabel: "Continuity",
    showFuture: true,
    chip: "Recurring Sameness",
    title: "Continuity Activation",
    summary:
      "Continuity stays lighter than the rest of the product, but it becomes real when recurring sameness can visibly shape live work instead of staying as an abstract layer.",
    primaryLabel: "Entity Activation",
    primaryTitle: "A recurring entity proves itself through appearances and then enters live creation",
    primaryBody:
      "One entity is visible through real appearances in kept work. Those traces prove recurrence. Then activation carries that stable sameness back into the live session, where the payoff is obvious without turning Workspace into a continuity editor.",
    primaryAction: "Activate In Workspace",
    tiles: [
      {
        title: "Entity Meaning",
        body: "This is a recurring thing that can live across work, not just one more saved object."
      },
      {
        title: "Appearance Evidence",
        body: "Past appearances show sameness through real work and images act as proof."
      },
      {
        title: "Live Payoff",
        body: "Activation changes the session context in a visible way that helps the next creation pass."
      },
      {
        title: "Correct Weight",
        body: "Continuity matters, but it stays disciplined and does not overtake the product."
      }
    ],
    meaning:
      "Continuity only earns its place when recurring sameness can be felt in live work. Otherwise it becomes a clever but abstract side realm.",
    next:
      "Return to Workspace and judge whether the whole product now feels like one strengthened engine.",
    proofCaption: "Images in Continuity are evidence of recurrence, not a gallery trying to steal attention.",
    proofNote:
      "Visual proof helps users understand recurring sameness without pushing Continuity into image-first behavior.",
    futureTitle: "What later deeper continuity could become",
    futureBody:
      "Storylines, shared universes, and richer continuity play should only grow later if they can stay grounded in this same recurrence-through-work logic.",
    futureTags: ["Storyline-ready later", "Shared continuity later", "Entity-driven play later"],
    rail: [
      "Continuity reads recurrence",
      "Appearances prove sameness",
      "Activation changes live context",
      "The realm stays lighter",
      "Creation benefits directly",
      "The whole product tightens again"
    ],
    dock:
      "Continuity should feel meaningful because it changes the live session, not because it sounds conceptually impressive."
  },
  {
    realm: "workspace",
    realmLabel: "Workspace",
    showFuture: true,
    chip: "Return Complete",
    title: "Back In Workspace",
    summary:
      "The whole product has to land here naturally. If this final return feels stronger, clearer, and more alive than the opening state, then the engine is working.",
    primaryLabel: "Integrated Return",
    primaryTitle: "The next live session feels stronger because the whole product fed it",
    primaryBody:
      "The session now carries durable work from Memory, useful value that came back from Community, and recurring sameness activated through Continuity. Nothing feels bolted on. It all reads as support around the same act of creation.",
    primaryAction: "Continue Creating",
    tiles: [
      {
        title: "Center Still Holds",
        body: "Even after multiple realm moves, the product still feels built around live creation."
      },
      {
        title: "Real Return Systems",
        body: "Memory, Community, and Continuity each earned their place by strengthening the next session."
      },
      {
        title: "Human Product Logic",
        body: "The product feels like creative work that remembers, circulates, and recurs, not like tool panels."
      },
      {
        title: "Growth Without Fragmentation",
        body: "Future sharing, collaboration, challenge-style play, and storylines can now be imagined as attachment layers, not separate apps."
      }
    ],
    meaning:
      "This is the whole-product judgment. If this return still feels like a summary of different sections, V2 is not ready yet. If it feels like a stronger live session, the foundation is working.",
    next:
      "Keep shaping from this stronger session and preserve this return-loop logic in everything that comes next.",
    proofCaption: "Proof now exists across the whole product, but creation still remains the center of gravity.",
    proofNote:
      "Images, public results, and continuity traces all help prove value, but they still serve the workflow-centered engine instead of replacing it.",
    futureTitle: "Integrated future attachment points",
    futureBody:
      "The promising future layers are not new isolated realms. They are extensions of the same object flow: meaningful sharing, real collaboration around objects, playful challenge loops, and storyline-like continuity that still feed back into creation.",
    futureTags: ["Sharability", "Collaboration", "Challenges", "Storylines", "Meaningful reward"],
    rail: [
      "Creation starts value",
      "Memory keeps it alive",
      "Community circulates it",
      "Continuity stabilizes it",
      "Everything returns to creation",
      "The product feels like one engine"
    ],
    dock:
      "This is the real synthesis question: does MorpBase now feel like one integrated creative engine?"
  }
];

const realmButtons = [...document.querySelectorAll(".nav-item")];
const dockSteps = document.getElementById("dock-steps");
const stateTitle = document.getElementById("state-title");
const stateChip = document.getElementById("state-chip");
const realmLabel = document.getElementById("realm-label");
const stateSummary = document.getElementById("state-summary");
const primaryLabel = document.getElementById("primary-label");
const primaryTitle = document.getElementById("primary-title");
const primaryBody = document.getElementById("primary-body");
const primaryAction = document.getElementById("primary-action");
const primaryGrid = document.getElementById("primary-grid");
const meaningText = document.getElementById("meaning-text");
const nextText = document.getElementById("next-text");
const futureTitle = document.getElementById("future-title");
const futureBody = document.getElementById("future-body");
const futureTags = document.getElementById("future-tags");
const returnRail = document.getElementById("return-rail");
const proofCaption = document.getElementById("proof-caption");
const proofNote = document.getElementById("proof-note");
const dockText = document.getElementById("dock-text");

let activeIndex = 0;

function renderDock() {
  dockSteps.innerHTML = "";
  states.forEach((state, index) => {
    const button = document.createElement("button");
    button.className = "dock-step";
    if (index === activeIndex) button.classList.add("active");
    button.innerHTML = `<span>${index + 1}. ${state.title}</span><small>${state.realmLabel}</small>`;
    button.addEventListener("click", () => setState(index));
    dockSteps.appendChild(button);
  });
}

function renderRail(state) {
  returnRail.innerHTML = "";
  state.rail.forEach((copy, index) => {
    const item = document.createElement("div");
    item.className = "rail-step";
    if (index < activeIndex) item.classList.add("completed");
    if (index === activeIndex || (index === state.rail.length - 1 && activeIndex === states.length - 1)) {
      item.classList.add("current");
    }
    item.innerHTML = `<span class="rail-name">${copy}</span><span class="rail-copy">This step only matters if it strengthens the same creative engine.</span>`;
    returnRail.appendChild(item);
  });
}

function renderTiles(state) {
  primaryGrid.innerHTML = "";
  state.tiles.forEach((tile) => {
    const article = document.createElement("article");
    article.className = "info-tile";
    article.innerHTML = `<strong>${tile.title}</strong><span>${tile.body}</span>`;
    primaryGrid.appendChild(article);
  });
}

function renderFuture(state) {
  if (!state.showFuture) {
    futureCard.style.display = "none";
    return;
  }

  futureCard.style.display = "block";
  futureTitle.textContent = state.futureTitle;
  futureBody.textContent = state.futureBody;
  futureTags.innerHTML = "";
  state.futureTags.forEach((tag) => {
    const span = document.createElement("span");
    span.className = "future-tag";
    span.textContent = tag;
    futureTags.appendChild(span);
  });
}

function renderNav(state) {
  realmButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.realm === state.realm);
  });
}

function setState(index) {
  activeIndex = index;
  const state = states[index];

  realmLabel.textContent = state.realmLabel;
  stateTitle.textContent = state.title;
  stateChip.textContent = state.chip;
  stateSummary.textContent = state.summary;
  primaryLabel.textContent = state.primaryLabel;
  primaryTitle.textContent = state.primaryTitle;
  primaryBody.textContent = state.primaryBody;
  primaryAction.textContent = state.primaryAction;
  meaningText.textContent = state.meaning;
  nextText.textContent = state.next;
  proofCaption.textContent = state.proofCaption;
  proofNote.textContent = state.proofNote;
  dockText.textContent = state.dock;

  renderTiles(state);
  renderFuture(state);
  renderRail(state);
  renderDock();
  renderNav(state);
}

primaryAction.addEventListener("click", () => {
  if (activeIndex < states.length - 1) {
    setState(activeIndex + 1);
  }
});

realmButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextIndex = states.findIndex((state) => state.realm === button.dataset.realm);
    if (nextIndex >= 0) {
      setState(nextIndex);
    }
  });
});

setState(0);
