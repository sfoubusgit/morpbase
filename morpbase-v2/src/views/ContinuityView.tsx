import type { ContinuityEntity, KeptWork } from "../morpbaseModel";
import { cleanReadableText, type ImpactSignal } from "../morpbaseReadings";
import {
  FocusPrompt,
  ImpactCluster,
  InvitationNote,
  PathChipCluster,
  ThresholdBand,
  TraceBand,
} from "../morpbaseUiFragments";

type ContinuityViewProps = {
  continuityBridgeMessage: string;
  continuityEntities: ContinuityEntity[];
  selectedContinuity: ContinuityEntity | null;
  selectedContinuityImpact: ImpactSignal[];
  hasPublicTrace: boolean;
  onOpenContinuityEntity: (entity: ContinuityEntity) => void;
  onActivateContinuity: (entity: ContinuityEntity) => void;
  onOpenAppearanceInMemory: (work: KeptWork) => void;
};

export function ContinuityView({
  continuityBridgeMessage,
  continuityEntities,
  selectedContinuity,
  selectedContinuityImpact,
  hasPublicTrace,
  onOpenContinuityEntity,
  onActivateContinuity,
  onOpenAppearanceInMemory,
}: ContinuityViewProps) {
  return (
    <div className="view-shell continuity-view">
      <section className="continuity-main">
        <div className="panel-header">
          <span className="eyebrow">Continuity</span>
          <h1>Recurring sameness should feel visible and reusable.</h1>
          <p>
            This first Continuity slice explains one recurring character through real kept work,
            then sends that sameness back into creation.
          </p>
        </div>

        <div className="continuity-banner">
          <strong>{continuityBridgeMessage}</strong>
          <span>
            Continuity is not storage. It is the reading of recurring identity across multiple
            works.
          </span>
        </div>

        <div className="continuity-layout">
          <section className="continuity-list">
            <header className="section-head">
              <div>
                <span className="eyebrow">Continuity Home</span>
                <h2>Recurring entities</h2>
              </div>
            </header>

            {continuityEntities.length === 0 ? (
              <div className="empty-card">
                <h3>No recurring line yet.</h3>
                <p>Keep a few works with the same subject in Memory to make continuity readable.</p>
              </div>
            ) : (
              <div className="card-stack">
                {continuityEntities.map((entity) => (
                  <button
                    key={entity.key}
                    className={
                      entity.key === selectedContinuity?.key
                        ? "continuity-card selected"
                        : "continuity-card"
                    }
                    onClick={() => onOpenContinuityEntity(entity)}
                    type="button"
                  >
                    <div className="continuity-card-image">
                      {entity.appearances[0]?.imageLabel ?? entity.name}
                    </div>
                    <div className="continuity-card-copy">
                      <small className="card-tag">Character Line</small>
                      <strong>{entity.name}</strong>
                      <span>{entity.identityReading}</span>
                      <small>{entity.appearances.length} appearance(s)</small>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <aside className="continuity-focus signature-surface signature-continuity">
            <header className="section-head">
              <div>
                <span className="eyebrow">Entity Focus</span>
                <h2>{selectedContinuity ? selectedContinuity.name : "Choose a recurring entity"}</h2>
              </div>
            </header>

            {selectedContinuity ? (
              <>
                <div className="surface-signature-strip continuity-signature-strip">
                  <div className="surface-reading-card">
                    <span className="mini-label">Continuity Reading</span>
                    <strong>Recurring sameness</strong>
                    <p>
                      This is where a line proves it can stay itself across multiple works without
                      becoming static.
                    </p>
                  </div>
                  <div className="surface-reading-card">
                    <span className="mini-label">Why It Holds</span>
                    <strong>
                      {selectedContinuity.appearances.length > 1
                        ? `${selectedContinuity.appearances.length} readable appearances`
                        : "Only one readable appearance so far"}
                    </strong>
                    <p>
                      {selectedContinuity.appearances.length > 1
                        ? "The line now carries enough repetition to feel like recurrence, not just one strong keep."
                        : "This line still needs more repetition before its sameness can feel fully proven."}
                    </p>
                  </div>
                </div>
                <div className="focus-image">
                  {selectedContinuity.appearances[0]?.imageLabel ?? selectedContinuity.name}
                </div>
                <p className="focus-summary">{selectedContinuity.identityReading}</p>
                <FocusPrompt label="Visual Anchor Reading">
                  <p>{cleanReadableText(selectedContinuity.visualAnchorReading)}</p>
                </FocusPrompt>
                <TraceBand
                  wrapperClassName="continuity-carried-trace-band"
                  family="continuity"
                  state={selectedContinuity.appearances.length > 1 ? "active" : "dormant"}
                  label="Recurrence Trace"
                  title={
                    selectedContinuity.appearances.length > 1
                      ? "This line now leaves a readable recurrence trace"
                      : "This line is beginning to leave a recurrence trace"
                  }
                  copy={
                    selectedContinuity.appearances.length > 1
                      ? "Across multiple appearances, the line now leaves fine signs of recognizable sameness."
                      : "With more appearances, this line will leave a stronger recurrence reading instead of relying on explanation alone."
                  }
                />
                <div className="continuity-trace-block">
                  <span className="mini-label">What Stays Recognizable</span>
                  <div className="continuity-trace-row">
                    <span className="continuity-trace-chip">{selectedContinuity.name}</span>
                    <span className="continuity-trace-chip">
                      {selectedContinuity.appearances.length} appearance
                      {selectedContinuity.appearances.length === 1 ? "" : "s"}
                    </span>
                    {selectedContinuity.carriedSignals.slice(0, 3).map((signal) => (
                      <span key={signal} className="continuity-trace-chip">
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>
                <PathChipCluster label="Return Paths">
                  <span className="path-chip memory strong">Built from Memory</span>
                  <span className={`path-chip community ${hasPublicTrace ? "strong" : "muted"}`}>
                    {hasPublicTrace ? "Public trace exists" : "Can surface publicly later"}
                  </span>
                  <span className="path-chip workspace">Can activate in Workspace</span>
                </PathChipCluster>
                <ImpactCluster signals={selectedContinuityImpact} />
                <InvitationNote copy="This line matters when its sameness can keep living through new work, not when it stays explained here." />
                <div className="continuity-signals">
                  <span className="mini-label">Carried Signals</span>
                  <div className="continuity-chip-row">
                    {selectedContinuity.carriedSignals.map((signal) => (
                      <span key={signal} className="continuity-chip">
                        {signal}
                      </span>
                    ))}
                  </div>
                  <p className="continuity-activation-copy">{selectedContinuity.activationReading}</p>
                </div>
                <ThresholdBand
                  wrapperClassName="continuity-threshold-band"
                  family="activate"
                  state="open"
                  label="Activation Crossing"
                  title="Recurrence can cross into live creation"
                  copy="This line is ready to become active in new work without losing what makes it recognizable."
                />
                <div className="focus-actions">
                  <button
                    className="primary-action activate-action"
                    onClick={() => onActivateContinuity(selectedContinuity)}
                    type="button"
                  >
                    Carry this line forward
                  </button>
                </div>

                <div className="appearance-stack">
                  <div className="appearance-header">
                    <span className="mini-label">Appearances</span>
                    <strong>Evidence through real kept work</strong>
                  </div>
                  {selectedContinuity.appearances.map((appearance) => (
                    <button
                      key={appearance.id}
                      className="appearance-card"
                      onClick={() => onOpenAppearanceInMemory(appearance)}
                      type="button"
                    >
                      <div className="appearance-image">{appearance.imageLabel}</div>
                      <div className="appearance-copy">
                        <small className="card-tag">
                          {appearance.id === selectedContinuity.appearances[0].id
                            ? "Latest anchor"
                            : "Same line variation"}
                        </small>
                        <strong>{appearance.title}</strong>
                        <span>{cleanReadableText(appearance.summary)}</span>
                        <small>Kept {appearance.keptAt}</small>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-card">
                <h3>No continuity focus yet.</h3>
                <p>
                  This area should prove that recurring sameness can feel real, not just
                  well-explained.
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
