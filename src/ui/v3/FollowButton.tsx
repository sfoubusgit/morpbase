import { useEffect, useState } from 'react';
import { getFollowState, follow, unfollow, type FollowState } from './followStore';

type FollowButtonProps = {
  /** the creator (author) to follow; null for seeded 'MorpBase' content */
  creatorAuthUid: string | null | undefined;
  viewerAuthUid?: string | null;
  /** show the follower count next to the button */
  showCount?: boolean;
  /** called when a logged-out viewer tries to follow */
  onRequireLogin?: () => void;
};

/**
 * Follow a creator. Real (Supabase v3_follows): public follower counts, own-row
 * writes. Renders nothing for seeded content (no real creator). On your own
 * work it shows the follower count without a button.
 */
export function FollowButton({ creatorAuthUid, viewerAuthUid, showCount, onRequireLogin }: FollowButtonProps) {
  const [state, setState] = useState<FollowState>({ count: 0, following: false });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!creatorAuthUid) { setState({ count: 0, following: false }); return; }
    let live = true;
    getFollowState(creatorAuthUid, viewerAuthUid).then(s => { if (live) setState(s); }).catch(() => {});
    return () => { live = false; };
  }, [creatorAuthUid, viewerAuthUid]);

  if (!creatorAuthUid) return null; // seeded / no real creator to follow
  const isSelf = Boolean(viewerAuthUid && viewerAuthUid === creatorAuthUid);

  const toggle = async () => {
    if (!viewerAuthUid) { onRequireLogin?.(); return; }
    if (isSelf || busy) return;
    const next = !state.following;
    setBusy(true);
    setState(s => ({ count: Math.max(0, s.count + (next ? 1 : -1)), following: next })); // optimistic
    try {
      if (next) await follow(creatorAuthUid, viewerAuthUid);
      else await unfollow(creatorAuthUid, viewerAuthUid);
    } catch {
      setState(s => ({ count: Math.max(0, s.count + (next ? -1 : 1)), following: !next })); // revert
    } finally { setBusy(false); }
  };

  const countLabel = showCount ? `${state.count} follower${state.count === 1 ? '' : 's'}` : null;

  return (
    <span className="v3-follow">
      {!isSelf && (
        <button type="button" className={`v3-btn utility${state.following ? ' on' : ''}`} onClick={toggle} disabled={busy}>
          {state.following ? 'Following' : 'Follow'}
        </button>
      )}
      {countLabel && <span className="v3-follow-count">{countLabel}</span>}
    </span>
  );
}
