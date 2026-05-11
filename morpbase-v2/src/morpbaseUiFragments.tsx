import type { ReactNode } from "react";
import type { CreatorProfile } from "./morpbaseModel";
import type { ImpactSignal } from "./morpbaseReadings";

function joinClasses(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

type ImpactClusterProps = {
  signals: ImpactSignal[];
  title?: string;
};

export function ImpactCluster({ signals, title = "Impact Line" }: ImpactClusterProps) {
  if (signals.length === 0) {
    return null;
  }

  return (
    <div className="impact-cluster">
      <span className="mini-label">{title}</span>
      <div className="impact-row">
        {signals.map((signal) => (
          <span key={`${signal.tone}-${signal.label}`} className={`impact-chip ${signal.tone}`}>
            {signal.label}
          </span>
        ))}
      </div>
    </div>
  );
}

type InvitationNoteProps = {
  copy: string;
};

export function InvitationNote({ copy }: InvitationNoteProps) {
  return (
    <div className="invitation-note">
      <span className="mini-label">Natural Next Move</span>
      <p>{copy}</p>
    </div>
  );
}

type CreatorStripProps = {
  profile: CreatorProfile;
};

export function CreatorStrip({ profile }: CreatorStripProps) {
  return (
    <div className="creator-strip">
      <div className="creator-avatar">{profile.initials}</div>
      <div className="creator-strip-copy">
        <span className="mini-label">Creator Practice</span>
        <strong>{profile.name}</strong>
        <p>{profile.practiceReading}</p>
      </div>
    </div>
  );
}

type FocusPromptProps = {
  label: string;
  children: ReactNode;
};

export function FocusPrompt({ label, children }: FocusPromptProps) {
  return (
    <div className="focus-prompt">
      <span className="mini-label">{label}</span>
      {children}
    </div>
  );
}

type PathChipClusterProps = {
  label: string;
  children: ReactNode;
};

export function PathChipCluster({ label, children }: PathChipClusterProps) {
  return (
    <div className="link-cluster">
      <span className="mini-label">{label}</span>
      <div className="path-chip-row">{children}</div>
    </div>
  );
}

type CompactEmptyCardProps = {
  children: ReactNode;
};

export function CompactEmptyCard({ children }: CompactEmptyCardProps) {
  return <div className="empty-card compact-empty">{children}</div>;
}

type CompactSectionHeadingProps = {
  label: string;
  title?: string;
  wrapperClassName?: string;
};

export function CompactSectionHeading({
  label,
  title,
  wrapperClassName,
}: CompactSectionHeadingProps) {
  const content = (
    <>
      <span className="mini-label">{label}</span>
      {title ? <strong>{title}</strong> : null}
    </>
  );

  if (!wrapperClassName) {
    return content;
  }

  return (
    <div className={wrapperClassName}>
      <div>{content}</div>
    </div>
  );
}

type CompactStackBodyProps = {
  hasItems: boolean;
  empty: ReactNode;
  children: ReactNode;
};

export function CompactStackBody({ hasItems, empty, children }: CompactStackBodyProps) {
  if (!hasItems) {
    return <CompactEmptyCard>{empty}</CompactEmptyCard>;
  }

  return <div className="compact-stack">{children}</div>;
}

type PracticeObjectCardProps = {
  title: string;
  note: string;
  onClick: () => void;
};

export function PracticeObjectCard({ title, note, onClick }: PracticeObjectCardProps) {
  return (
    <button className="practice-object-card" onClick={onClick} type="button">
      <strong>{title}</strong>
      <span>{note}</span>
    </button>
  );
}

type PublishingObjectCardProps = {
  tag: string;
  title: string;
  summary: string;
  details?: ReactNode;
  actions: ReactNode;
};

export function PublishingObjectCard({
  tag,
  title,
  summary,
  details,
  actions,
}: PublishingObjectCardProps) {
  return (
    <div className="publishing-object-card">
      <div className="publishing-object-copy">
        <small className="card-tag">{tag}</small>
        <strong>{title}</strong>
        <span>{summary}</span>
        {details}
      </div>
      <div className="publishing-actions">{actions}</div>
    </div>
  );
}

type ThresholdBandProps = {
  wrapperClassName: string;
  family: "keep" | "publish" | "use" | "activate";
  state: "open" | "held";
  label: string;
  title: string;
  copy?: string;
};

export function ThresholdBand({
  wrapperClassName,
  family,
  state,
  label,
  title,
  copy,
}: ThresholdBandProps) {
  return (
    <div className={wrapperClassName}>
      <div className={`threshold-language threshold-language-${family} ${state}`} aria-hidden="true">
        <span className="threshold-bracket left" />
        <span className="threshold-path" />
        <span className="threshold-node" />
        <span className="threshold-bracket right" />
      </div>
      <div className="threshold-language-copy">
        <span className="mini-label">{label}</span>
        <strong>{title}</strong>
        {copy ? <p>{copy}</p> : null}
      </div>
    </div>
  );
}

type TraceBandProps = {
  wrapperClassName: string;
  family: "center" | "memory" | "community" | "continuity";
  state?: "active" | "dormant";
  toneClassName?: string;
  label: string;
  title: string;
  copy?: string;
};

export function TraceBand({
  wrapperClassName,
  family,
  state = "active",
  toneClassName,
  label,
  title,
  copy,
}: TraceBandProps) {
  return (
    <div className={wrapperClassName}>
      <div
        className={joinClasses(`trace-language trace-language-${family}`, toneClassName, state)}
        aria-hidden="true"
      >
        <span className="trace-tail left" />
        <span className="trace-node strong" />
        <span className="trace-segment" />
        <span className="trace-node" />
        <span className="trace-segment" />
        <span className="trace-node echo" />
        <span className="trace-tail right" />
      </div>
      <div className="trace-language-copy">
        <span className="mini-label">{label}</span>
        <strong>{title}</strong>
        {copy ? <p>{copy}</p> : null}
      </div>
    </div>
  );
}
