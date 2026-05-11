import {
  framingOptions,
  moodOptions,
  presenceOptions,
  scenePressureOptions,
  subjectClueOptions,
  subjectOptionGroups,
  visualOptionGroups,
} from "../morpbaseModel";
import type { WorkspaceDraft, WorkspaceOrigin } from "../morpbaseModel";
import {
  buildImageLabel,
  buildPrompt,
  getCenterTraceReading,
  getWorkspaceArrivalReading,
  summarizeDraft,
} from "../morpbaseReadings";
import { ThresholdBand, TraceBand } from "../morpbaseUiFragments";

type WorkspaceViewProps = {
  draft: WorkspaceDraft;
  draftOrigin: WorkspaceOrigin;
  focusedWorkspacePhase: number | null;
  workspaceBridgeMessage: string;
  onUpdateDraft: <K extends keyof WorkspaceDraft>(key: K, value: WorkspaceDraft[K]) => void;
  onToggleWorkspacePhase: (index: number) => void;
  onFocusRecommendedPhase: (index: number) => void;
  onKeep: () => void;
};

export function WorkspaceView({
  draft,
  draftOrigin,
  focusedWorkspacePhase,
  workspaceBridgeMessage,
  onUpdateDraft,
  onToggleWorkspacePhase,
  onFocusRecommendedPhase,
  onKeep,
}: WorkspaceViewProps) {
  const previewPrompt = buildPrompt(draft);
  const keepReady = Boolean(draft.subject && draft.visual && draft.framing);
  const missingCoreAnchors = [
    !draft.subject ? "a subject" : null,
    !draft.visual ? "a look" : null,
    !draft.framing ? "a framing" : null,
  ].filter((item): item is string => Boolean(item));
  const missingCoreLabel =
    missingCoreAnchors.length <= 1
      ? missingCoreAnchors[0] ?? ""
      : missingCoreAnchors.length === 2
        ? `${missingCoreAnchors[0]} and ${missingCoreAnchors[1]}`
        : `${missingCoreAnchors.slice(0, -1).join(", ")}, and ${
            missingCoreAnchors[missingCoreAnchors.length - 1]
          }`;
  const currentPhaseIndex = !draft.subject ? 0 : !draft.visual ? 1 : !draft.framing ? 2 : 3;
  const workspaceArrival = getWorkspaceArrivalReading(draftOrigin);
  const centerTrace = getCenterTraceReading(draftOrigin);
  const selectedSubjectClues = draft.subject ? subjectClueOptions[draft.subject] : [];
  const recommendedPhaseIndex = workspaceArrival?.recommendedPhase ?? currentPhaseIndex;
  const activePhaseIndex = focusedWorkspacePhase ?? recommendedPhaseIndex;
  const workspacePhases = [
    {
      title: "Define The Subject",
      copy: "Set the recognizable center and give it more character.",
    },
    {
      title: "Shape The Look",
      copy: "Choose the image language and emotional tone.",
    },
    {
      title: "Stage The Image",
      copy: "Decide how the viewer meets the line.",
    },
    {
      title: "Refine And Keep",
      copy: "Tighten lightly, then keep it once it holds together.",
    },
  ] as const;
  const activePhase = workspacePhases[activePhaseIndex];
  const phaseSummaries = [
    [
      draft.subject ?? "subject still open",
      draft.subject ? draft.subjectClue.trim() || "distinctive clue still open" : null,
      draft.presence ? `${draft.presence} presence` : "presence still open",
    ].filter((item): item is string => Boolean(item)),
    [
      draft.visual ? `${draft.visual} look` : "visual direction still open",
      draft.mood ? `${draft.mood} tone` : "mood still open",
    ],
    [
      draft.framing ? `${draft.framing} framing` : "framing still open",
      draft.scenePressure ? `${draft.scenePressure} pressure` : "scene pressure still open",
    ],
    [
      keepReady ? "coherence reading ready" : "light refinement open",
      draft.detail.trim() ? "finishing note added" : "finishing note still open",
    ],
  ] as const;
  const focusCopy = [
    "Choose the subject and give it a more particular presence.",
    "Shape the look and emotional pressure of the image.",
    "Decide how the viewer meets the line and how much force the image carries before Keep can really emerge.",
    "Read what now holds together, add one finishing note, then let the Preview judge whether the line is worth keeping.",
  ] as const;
  const thresholdCopy = !draft.subject
    ? "The subject is still missing."
    : !draft.visual
      ? "The visual direction is still missing."
      : !draft.framing
        ? "The framing is still missing."
        : "The core threshold is now met.";
  const keepThresholdItems = [
    { label: "Subject", ready: Boolean(draft.subject) },
    { label: "Look", ready: Boolean(draft.visual) },
    { label: "Framing", ready: Boolean(draft.framing) },
  ] as const;
  const lineStateTitle = keepReady
    ? "The line now holds together."
    : "The line is still gathering shape.";
  const lineStateCopy = keepReady
    ? "The subject, look, and viewer meeting point are now present, so refinement can become more particular instead of more structural."
    : "The line still needs its strongest structural anchors before it can feel return-worthy.";
  const previewTrustTitle = keepReady
    ? "Preview now reads like proof."
    : "Preview is still building trust.";
  const previewTrustCopy = keepReady
    ? "The line is now readable enough that Keep can feel like a real crossing, not just a save action."
    : "The preview is beginning to prove the line, but it still needs the core shape to fully hold together.";
  const proofTraces = [
    draft.subject ?? "subject pending",
    draft.visual ? `${draft.visual} look` : "look pending",
    draft.framing ? `${draft.framing} framing` : "viewer meeting pending",
    ...(draft.scenePressure ? [`${draft.scenePressure} pressure`] : []),
  ] as const;
  const preKeepCoherenceSignals = [
    draft.subject,
    draft.subjectClue.trim() || null,
    draft.visual ? `${draft.visual} look` : null,
    draft.framing ? `${draft.framing} framing` : null,
    draft.scenePressure ? `${draft.scenePressure} pressure` : null,
    draft.mood ? `${draft.mood} tone` : null,
  ].filter((item): item is string => Boolean(item));
  const preKeepCoherenceTitle = keepReady
    ? "A readable line is now here."
    : "The line is still gathering.";
  const preKeepCoherenceCopy = keepReady
    ? "The core now holds together. Let the finishing note sharpen what is already readable instead of rebuilding the line."
    : "The preview can already sense a direction, but the line still needs its core anchors before the crossing should open.";
  const showReturnToRecommended =
    focusedWorkspacePhase !== null && focusedWorkspacePhase !== recommendedPhaseIndex;
  const simpleStartCopy = keepReady
    ? "You can keep this now. Everything else here is optional for this first loop."
    : `To unlock Keep, just choose ${missingCoreLabel}. You can ignore the rest for now.`;

  return (
    <div className="view-shell">
      <section className="authoring-panel signature-surface signature-workspace">
        <div className="panel-header">
          <span className="eyebrow">Workspace</span>
          <h1>Shape a keep-worthy portrait workflow.</h1>
          <p>
            MorpBase V2 starts here: guide the subject, tighten the look, trust the live preview,
            then keep the result when it feels real.
          </p>
        </div>

        <div className="surface-signature-strip workspace-signature-strip">
          <div className="surface-reading-card">
            <span className="mini-label">Workspace Reading</span>
            <strong>Live instrument</strong>
            <p>This is the active making surface where the line gains real shape and direction.</p>
          </div>
          <div className="surface-reading-card">
            <span className="mini-label">Line State</span>
            <strong>{lineStateTitle}</strong>
            <p>{lineStateCopy}</p>
          </div>
        </div>

        <div className="guidance-strip">
          <span className={`status-pill ${keepReady ? "ready" : "guiding"}`}>
            {keepReady ? "Keep is ready to emerge" : "Guided first flow active"}
          </span>
          <p>
            {keepReady
              ? "The core now holds together. Presence, mood, scene pressure, and the last note can make the line feel more yours before you keep it."
              : "Move through subject, look, and framing first. Presence, mood, scene pressure, and the last note deepen the line without making it heavy."}
          </p>
          <div className="workspace-focus-band">
            <div>
              <span className="mini-label">Current Focus</span>
              <strong>{activePhase.title}</strong>
              <p>{focusCopy[activePhaseIndex]}</p>
            </div>
            <div>
              <span className="mini-label">Core Threshold</span>
              <strong>{thresholdCopy}</strong>
            </div>
          </div>
          <div className="simple-start-note">
            <span className="mini-label">Plainly</span>
            <strong>{keepReady ? "Keep is now unlocked." : "If this feels like a lot, do only 3 things first."}</strong>
            <p>{simpleStartCopy}</p>
          </div>
          {workspaceArrival ? (
            <div className="workspace-arrival-note">
              {centerTrace ? (
                <TraceBand
                  wrapperClassName="arrival-trace-band"
                  family="center"
                  toneClassName={`trace-language-${centerTrace.tone}`}
                  label={centerTrace.arrivalLabel}
                  title={centerTrace.arrivalTitle}
                  copy={centerTrace.arrivalCopy}
                />
              ) : null}
              <div className="workspace-arrival-grid">
                <div>
                  <span className="mini-label">Arrival Reading</span>
                  <strong>{workspaceArrival.label}</strong>
                  <p>{workspaceArrival.copy}</p>
                </div>
                <div>
                  <span className="mini-label">Best Next Move</span>
                  <strong>{workspaceArrival.recommendedLabel}</strong>
                </div>
              </div>
            </div>
          ) : null}
          <div className="bridge-note">
            <span className="mini-label">Loop State</span>
            <strong>{workspaceBridgeMessage}</strong>
          </div>
          {showReturnToRecommended ? (
            <button
              className="ghost-action compact-action workspace-return-action"
              onClick={() => onFocusRecommendedPhase(recommendedPhaseIndex)}
              type="button"
            >
              Focus best next move
            </button>
          ) : null}
        </div>

        <div className="phase-rail" aria-label="Workspace flow">
          {workspacePhases.map((phase, index) => {
            const state =
              index < currentPhaseIndex
                ? "completed"
                : index === currentPhaseIndex
                  ? "active"
                  : "upcoming";

            return (
              <button
                key={phase.title}
                className={`phase-pill ${state} ${activePhaseIndex === index ? "focused" : ""}`}
                onClick={() => onToggleWorkspacePhase(index)}
                type="button"
              >
                <span className="phase-pill-step">0{index + 1}</span>
                <div className="phase-pill-copy">
                  <strong>{phase.title}</strong>
                  <span>{phase.copy}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="phase-stack">
          <section
            className={`phase-group ${
              currentPhaseIndex === 0 ? "active" : currentPhaseIndex > 0 ? "completed" : "upcoming"
            } ${activePhaseIndex === 0 ? "expanded" : "collapsed"}`}
          >
            <div className="phase-group-header">
              <div>
                <span className="eyebrow">Phase 1</span>
                <h2>Define The Subject</h2>
              </div>
              <p>Start with who this line is and what makes it feel particular.</p>
            </div>

            {activePhaseIndex === 0 ? (
              <div className="phase-blocks">
                <article className="workflow-block active">
                  <header>
                    <span className="block-step">01</span>
                    <div>
                      <h2>Subject Core</h2>
                      <p>Give the portrait a recognizable center.</p>
                    </div>
                  </header>
                  <div className="subject-group-grid">
                    {subjectOptionGroups.map((group) => (
                      <div key={group.label} className="subject-group-card">
                        <span className="mini-label">{group.label}</span>
                        <div className="chip-row subject-chip-row">
                          {group.options.map((option) => (
                            <button
                              key={option}
                              className={option === draft.subject ? "chip selected" : "chip"}
                              onClick={() => onUpdateDraft("subject", option)}
                              type="button"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {draft.subject ? (
                    <div className="subject-clue-panel">
                      <div className="subject-clue-copy">
                        <span className="mini-label">Make This One Yours</span>
                        <strong>Give this {draft.subject.toLowerCase()} one recognizable clue.</strong>
                        <p>
                          One clue is enough: a mark, object, material, or facial cue that makes this
                          line feel more particular early.
                        </p>
                      </div>
                      <div className="chip-row subject-clue-row">
                        {selectedSubjectClues.map((clue) => (
                          <button
                            key={clue}
                            className={clue === draft.subjectClue ? "chip selected" : "chip"}
                            onClick={() => onUpdateDraft("subjectClue", clue)}
                            type="button"
                          >
                            {clue}
                          </button>
                        ))}
                      </div>
                      <input
                        className="subject-clue-input"
                        value={draft.subjectClue}
                        onChange={(event) => onUpdateDraft("subjectClue", event.target.value)}
                        placeholder={`One clue is enough: ${selectedSubjectClues.slice(0, 2).join(", ")}`}
                      />
                    </div>
                  ) : null}
                </article>

                <article className="workflow-block compact">
                  <header>
                    <span className="block-step">02</span>
                    <div>
                      <h2>Presence And Signature</h2>
                      <p>Give the subject a stronger felt character.</p>
                    </div>
                  </header>
                  <div className="chip-row">
                    {presenceOptions.map((option) => (
                      <button
                        key={option}
                        className={option === draft.presence ? "chip selected" : "chip"}
                        onClick={() => onUpdateDraft("presence", option)}
                        type="button"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </article>
              </div>
            ) : (
              <div className="phase-summary">
                <div className="summary-chip-row">
                  {phaseSummaries[0].map((item) => (
                    <span key={item} className="summary-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section
            className={`phase-group ${
              currentPhaseIndex === 1 ? "active" : currentPhaseIndex > 1 ? "completed" : "upcoming"
            } ${activePhaseIndex === 1 ? "expanded" : "collapsed"}`}
          >
            <div className="phase-group-header">
              <div>
                <span className="eyebrow">Phase 2</span>
                <h2>Shape The Look</h2>
              </div>
              <p>Decide the visual language and the emotional pressure on the image.</p>
            </div>

            {activePhaseIndex === 1 ? (
              <div className="phase-blocks">
                <article className="workflow-block active">
                  <header>
                    <span className="block-step">03</span>
                    <div>
                      <h2>Visual Direction</h2>
                      <p>Choose the image language that will carry the result.</p>
                    </div>
                  </header>
                  <div className="visual-group-grid">
                    {visualOptionGroups.map((group) => (
                      <div key={group.label} className="visual-group-card">
                        <span className="mini-label">{group.label}</span>
                        <div className="chip-row visual-chip-row">
                          {group.options.map((option) => (
                            <button
                              key={option}
                              className={option === draft.visual ? "chip selected" : "chip"}
                              onClick={() => onUpdateDraft("visual", option)}
                              type="button"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="workflow-block compact">
                  <header>
                    <span className="block-step">04</span>
                    <div>
                      <h2>Mood And Light</h2>
                      <p>
                        Keep this broad. It should pressure the image, not compete with the look
                        field.
                      </p>
                    </div>
                  </header>
                  <div className="chip-row">
                    {moodOptions.map((option) => (
                      <button
                        key={option}
                        className={option === draft.mood ? "chip selected" : "chip"}
                        onClick={() => onUpdateDraft("mood", option)}
                        type="button"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </article>
              </div>
            ) : (
              <div className="phase-summary">
                <div className="summary-chip-row">
                  {phaseSummaries[1].map((item) => (
                    <span key={item} className="summary-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section
            className={`phase-group ${
              currentPhaseIndex === 2 ? "active" : currentPhaseIndex > 2 ? "completed" : "upcoming"
            } ${activePhaseIndex === 2 ? "expanded" : "collapsed"}`}
          >
            <div className="phase-group-header">
              <div>
                <span className="eyebrow">Phase 3</span>
                <h2>Stage The Image</h2>
              </div>
              <p>Decide how close, how focused, and how the viewer meets the line.</p>
            </div>

            {activePhaseIndex === 2 ? (
              <div className="phase-blocks">
                <article className="workflow-block active">
                  <header>
                    <span className="block-step">05</span>
                    <div>
                      <h2>Framing And Focus</h2>
                      <p>This is the last core move before Keep can truly emerge.</p>
                    </div>
                  </header>
                  <div className="chip-row">
                    {framingOptions.map((option) => (
                      <button
                        key={option}
                        className={option === draft.framing ? "chip selected" : "chip"}
                        onClick={() => onUpdateDraft("framing", option)}
                        type="button"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </article>

                <article className="workflow-block compact">
                  <header>
                    <span className="block-step">06</span>
                    <div>
                      <h2>Scene Pressure</h2>
                      <p>Decide how still, charged, or confrontational the image should feel.</p>
                    </div>
                  </header>
                  <div className="chip-row">
                    {scenePressureOptions.map((option) => (
                      <button
                        key={option}
                        className={option === draft.scenePressure ? "chip selected" : "chip"}
                        onClick={() => onUpdateDraft("scenePressure", option)}
                        type="button"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </article>
              </div>
            ) : (
              <div className="phase-summary">
                <div className="summary-chip-row">
                  {phaseSummaries[2].map((item) => (
                    <span key={item} className="summary-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section
            className={`phase-group ${currentPhaseIndex === 3 ? "active" : "upcoming"} ${
              activePhaseIndex === 3 ? "expanded" : "collapsed"
            }`}
          >
            <div className="phase-group-header">
              <div>
                <span className="eyebrow">Phase 4</span>
                <h2>Refine And Keep</h2>
              </div>
              <p>
                Read what now holds together, tighten lightly, then let the Preview decide when it
                is worth keeping.
              </p>
            </div>

            {activePhaseIndex === 3 ? (
              <div className="phase-blocks">
                <article className="workflow-block compact pre-keep-coherence-panel">
                  <header>
                    <span className="block-step">07</span>
                    <div>
                      <h2>What Now Holds</h2>
                      <p>Read the line once before it crosses into Memory.</p>
                    </div>
                  </header>
                  <div className="pre-keep-coherence-copy">
                    <span className="mini-label">Coherence Reading</span>
                    <strong>{preKeepCoherenceTitle}</strong>
                    <p>{preKeepCoherenceCopy}</p>
                  </div>
                  <div className="summary-chip-row">
                    {preKeepCoherenceSignals.map((item) => (
                      <span key={item} className="summary-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </article>

                <article className="workflow-block compact">
                  <header>
                    <span className="block-step">08</span>
                    <div>
                      <h2>Tighten The Result</h2>
                      <p>One finishing note is enough for this slice.</p>
                    </div>
                  </header>
                  <textarea
                    className="detail-input"
                    value={draft.detail}
                    onChange={(event) => onUpdateDraft("detail", event.target.value)}
                    placeholder="Add one finishing detail: reflected trim, cracked clasp, rain-soft grain."
                  />
                </article>
              </div>
            ) : (
              <div className="phase-summary">
                <div className="summary-chip-row">
                  {phaseSummaries[3].map((item) => (
                    <span key={item} className="summary-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </section>

      <aside className="preview-panel signature-surface signature-preview">
        <div className="preview-header">
          <span className="eyebrow">Prompt Preview</span>
          <h2>Trust builds here.</h2>
          <p>
            The preview is not a side widget. It is the live companion that helps the workflow feel
            worth keeping.
          </p>
        </div>

        <div className="surface-signature-strip preview-signature-strip">
          <div className="surface-reading-card">
            <span className="mini-label">Preview Reading</span>
            <strong>Proof surface</strong>
            <p>This is where the line starts to justify Memory instead of staying an idea.</p>
          </div>
          <div className="surface-reading-card">
            <span className="mini-label">Trust State</span>
            <strong>{previewTrustTitle}</strong>
            <p>{previewTrustCopy}</p>
          </div>
        </div>

        <div className="proof-frame">
          <div className="proof-image">
            <span>{buildImageLabel(draft)}</span>
          </div>
          <div className="proof-copy">
            {centerTrace ? (
              <TraceBand
                wrapperClassName="preview-arrival-trace"
                family="center"
                toneClassName={`trace-language-${centerTrace.tone}`}
                label="Incoming Reading"
                title={centerTrace.previewTitle}
                copy={centerTrace.previewCopy}
              />
            ) : null}
            <span className="mini-label">Current Focus</span>
            <strong>{activePhase.title}</strong>
            <p>{focusCopy[activePhaseIndex]}</p>
            <span className="mini-label">Preview Reading</span>
            <strong>{summarizeDraft(draft)}</strong>
            <p>{previewPrompt}</p>
            <div className="proof-trace-row">
              {proofTraces.map((trace) => (
                <span key={trace} className="proof-trace-chip">
                  {trace}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="link-cluster">
          <span className="mini-label">What This Can Become</span>
          <div className="path-chip-row">
            <span className={`path-chip memory ${keepReady ? "strong" : ""}`}>
              Memory return point
            </span>
            <span className="path-chip community muted">Community release later</span>
            <span className={`path-chip continuity ${draft.subject ? "" : "muted"}`}>
              {draft.subject
                ? "Continuity-ready once repeated"
                : "Continuity opens once a subject repeats"}
            </span>
          </div>
        </div>

        <div className="keep-panel signature-threshold">
          <div>
            <span className="mini-label">Keep</span>
            <h3>
              {keepReady
                ? "This line is now worth keeping."
                : "Keep waits until the line can hold together."}
            </h3>
            <p>
              {keepReady
                ? "You have enough shape to move this into Memory and continue from there later."
                : "Choose the subject, visual direction, and framing first. Presence, mood, scene pressure, and refinement can stay light."}
            </p>
          </div>
          <ThresholdBand
            wrapperClassName="threshold-language-band keep-threshold-band"
            family="keep"
            state={keepReady ? "open" : "held"}
            label="Crossing Mark"
            title={keepReady ? "Second-home crossing is open" : "Second-home crossing is still forming"}
          />
          <div className="keep-threshold-reading">
            <div className="keep-threshold-head">
              <span className="mini-label">Threshold Reading</span>
              <strong>{keepReady ? "Crossing is open" : "Crossing is still held"}</strong>
            </div>
            <div className="keep-threshold-row">
              {keepThresholdItems.map((item) => (
                <span
                  key={item.label}
                  className={item.ready ? "keep-threshold-chip ready" : "keep-threshold-chip waiting"}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <div className="keep-crossing-note">
            <span className="mini-label">What Crosses</span>
            <p>
              {keepReady
                ? "This line can now enter Memory as a living return point, ready to continue, branch, or later circulate."
                : "When the core anchors are present, this line can cross into Memory as living value instead of staying a draft."}
            </p>
          </div>
          <button
            className={keepReady ? "primary-action keep-action" : "primary-action keep-action disabled"}
            disabled={!keepReady}
            onClick={onKeep}
            type="button"
          >
            Keep to Memory
          </button>
          <p className="keep-help-text">
            {keepReady
              ? "Ready: this can move into Memory now."
              : "Not ready yet: choose a Subject, a Look, and a Framing first."}
          </p>
        </div>

        <div className="support-note">
          <strong>Current loop</strong>
          <span>{"Workspace -> Keep -> Memory -> return"}</span>
        </div>
      </aside>
    </div>
  );
}
