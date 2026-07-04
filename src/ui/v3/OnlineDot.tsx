/**
 * Presence indicator — a small status dot (green = online now, muted = offline),
 * optionally with a label. Presentational: pass `online` computed from the shared
 * presence set (useOnlineAuthUids), so a page can subscribe once and reuse it.
 */
export function OnlineDot({ online, label, className }: { online: boolean; label?: boolean; className?: string }) {
  return (
    <span
      className={`v3-online${online ? ' on' : ''}${className ? ` ${className}` : ''}`}
      title={online ? 'Online now' : 'Offline'}
    >
      <span className="dot" />
      {label && <span className="lbl">{online ? 'Online' : 'Offline'}</span>}
    </span>
  );
}
