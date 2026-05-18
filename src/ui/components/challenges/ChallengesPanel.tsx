import { useCallback, useEffect, useState } from 'react';
import type { Challenge, ChallengeEntry, WallPostIdentityTag } from '../../../types/community';
import {
  listActiveChallenges,
  listPastChallenges,
  getChallengeEntryCount,
  getUserChallengeEntry,
  enterChallenge,
  listChallengeEntries,
  voteForEntry,
  unvoteEntry,
  subscribeToChallengeEntries,
  type ChallengeEntryWithPost,
} from '../../../engine/challengeStore';
import './ChallengesPanel.css';

type ChallengesPanelProps = {
  authUid: string | null;
  userId: string | null;
  userName: string | null;
  activeIdentityTags: WallPostIdentityTag[];
  currentPromptText: string;
};

function formatDeadline(endsAt: number): string {
  const diff = endsAt - Date.now();
  if (diff <= 0) return 'Ended';
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 24) return `${hours}h left`;
  const days = Math.floor(hours / 24);
  return `${days}d left`;
}

function TypeBadge({ type }: { type: string }) {
  return <span className={`challenge-type-badge challenge-type-badge--${type}`}>{type}</span>;
}

type ActiveChallengeCardProps = {
  challenge: Challenge;
  authUid: string | null;
  userId: string | null;
  userName: string | null;
  activeIdentityTags: WallPostIdentityTag[];
  currentPromptText: string;
};

function ActiveChallengeCard({
  challenge,
  authUid,
  userId,
  userName,
  activeIdentityTags,
  currentPromptText,
}: ActiveChallengeCardProps) {
  const [entryCount, setEntryCount] = useState(0);
  const [myEntry, setMyEntry] = useState<ChallengeEntry | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [entriesOpen, setEntriesOpen] = useState(false);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [entries, setEntries] = useState<ChallengeEntryWithPost[]>([]);

  useEffect(() => {
    void getChallengeEntryCount(challenge.id).then(setEntryCount);
    if (authUid) void getUserChallengeEntry(challenge.id, authUid).then(setMyEntry);
  }, [challenge.id, authUid]);

  // Real-time: refresh entry count + open list when anyone enters or votes.
  useEffect(() => {
    const unsubscribe = subscribeToChallengeEntries(challenge.id, () => {
      void getChallengeEntryCount(challenge.id).then(setEntryCount);
      if (entriesOpen) {
        void listChallengeEntries(challenge.id, authUid).then(setEntries);
      }
    });
    return unsubscribe;
  }, [challenge.id, authUid, entriesOpen]);

  const handleEnter = async () => {
    if (!authUid || !userId || !userName) return;
    if (!currentPromptText.trim()) {
      setError('Build a prompt in the Workspace first, then come back to enter.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const entry = await enterChallenge(
        challenge,
        authUid,
        userId,
        userName,
        currentPromptText,
        activeIdentityTags,
      );
      setMyEntry(entry);
      setEntryCount(c => c + 1);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const hasEntered = myEntry !== null || done;

  const handleToggleEntries = async () => {
    if (entriesOpen) { setEntriesOpen(false); return; }
    setEntriesOpen(true);
    if (entries.length === 0) {
      setEntriesLoading(true);
      const list = await listChallengeEntries(challenge.id, authUid);
      setEntries(list);
      setEntriesLoading(false);
    }
  };

  const handleToggleVote = async (entry: ChallengeEntryWithPost) => {
    if (!authUid || entry.authUid === authUid) return;
    const willVote = !entry.iVoted;
    setEntries(prev => prev.map(e =>
      e.entryId === entry.entryId
        ? { ...e, iVoted: willVote, voteCount: Math.max(0, e.voteCount + (willVote ? 1 : -1)) }
        : e,
    ));
    if (willVote) {
      await voteForEntry(entry.entryId, challenge.id, authUid);
    } else {
      await unvoteEntry(entry.entryId, authUid);
    }
  };

  return (
    <div className="challenge-card challenge-card--active">
      <div className="challenge-card-header">
        <div className="challenge-card-meta">
          <span className="challenge-card-number">#{challenge.number}</span>
          <TypeBadge type={challenge.type} />
          <span className="challenge-card-deadline">{formatDeadline(challenge.endsAt)}</span>
        </div>
        <span className="challenge-card-entry-count">{entryCount} {entryCount === 1 ? 'entry' : 'entries'}</span>
      </div>

      <h2 className="challenge-card-title">{challenge.title}</h2>

      <div className="challenge-card-constraint">
        <span className="challenge-card-constraint-label">Constraint</span>
        <p className="challenge-card-constraint-text">{challenge.constraintText}</p>
      </div>

      {challenge.description && (
        <p className="challenge-card-description">{challenge.description}</p>
      )}

      {authUid ? (
        hasEntered ? (
          <div className="challenge-card-entered">
            ✓ You've entered this challenge — your prompt is on the Wall.
          </div>
        ) : (
          <div className="challenge-card-enter-section">
            {currentPromptText ? (
              <div className="challenge-card-prompt-preview">
                <span className="challenge-card-prompt-label">Your current prompt</span>
                <p className="challenge-card-prompt-text">
                  {currentPromptText.length > 160
                    ? currentPromptText.slice(0, 160) + '…'
                    : currentPromptText}
                </p>
              </div>
            ) : (
              <p className="challenge-card-no-prompt">
                Go to Workspace, build a prompt, then return here to enter.
              </p>
            )}
            {error && <p className="challenge-card-error">{error}</p>}
            <button
              type="button"
              className="challenge-card-enter-btn"
              disabled={submitting || !currentPromptText.trim()}
              onClick={handleEnter}
            >
              {submitting ? 'Submitting…' : 'Enter with Current Prompt'}
            </button>
          </div>
        )
      ) : (
        <p className="challenge-card-login-hint">Log in to enter this challenge.</p>
      )}

      {entryCount > 0 && (
        <div className="challenge-card-entries">
          <button
            type="button"
            className="challenge-card-entries-toggle"
            onClick={handleToggleEntries}
          >
            {entriesOpen ? '▲ Hide entries' : `▼ See ${entryCount} ${entryCount === 1 ? 'entry' : 'entries'}`}
          </button>
          {entriesOpen && (
            <div className="challenge-card-entries-list">
              {entriesLoading && <p className="challenge-entries-loading">Loading…</p>}
              {!entriesLoading && entries.map((e, i) => {
                const isMine = authUid != null && e.authUid === authUid;
                return (
                  <div key={e.entryId} className="challenge-entry-row">
                    <span className={`challenge-entry-rank${i === 0 && e.voteCount > 0 ? ' challenge-entry-rank--top' : ''}`}>
                      #{i + 1}
                    </span>
                    <div className="challenge-entry-main">
                      <span className="challenge-entry-author">{e.authorName}{isMine ? ' (you)' : ''}</span>
                      <p className="challenge-entry-text">
                        {e.promptText.length > 120 ? e.promptText.slice(0, 120) + '…' : e.promptText}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`challenge-entry-vote${e.iVoted ? ' challenge-entry-vote--on' : ''}`}
                      disabled={!authUid || isMine}
                      onClick={() => void handleToggleVote(e)}
                      title={!authUid ? 'Log in to vote' : isMine ? 'Cannot vote on your own entry' : (e.iVoted ? 'Remove vote' : 'Vote')}
                    >
                      ▲ {e.voteCount}
                    </button>
                  </div>
                );
              })}
              {!entriesLoading && entries.length === 0 && (
                <p className="challenge-entries-loading">No entries yet.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ChallengesPanel({
  authUid,
  userId,
  userName,
  activeIdentityTags,
  currentPromptText,
}: ChallengesPanelProps) {
  const [active, setActive] = useState<Challenge[]>([]);
  const [past, setPast] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [a, p] = await Promise.all([listActiveChallenges(), listPastChallenges()]);
    setActive(a);
    setPast(p);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading) return <div className="challenges-loading">Loading challenges…</div>;

  return (
    <div className="challenges-panel">
      {active.length === 0 && past.length === 0 && (
        <div className="challenges-empty">
          No challenges yet. Check back soon — weekly challenges drop every Monday.
        </div>
      )}

      {active.map(c => (
        <ActiveChallengeCard
          key={c.id}
          challenge={c}
          authUid={authUid}
          userId={userId}
          userName={userName}
          activeIdentityTags={activeIdentityTags}
          currentPromptText={currentPromptText}
        />
      ))}

      {past.length > 0 && (
        <div className="challenges-archive">
          <div className="challenges-archive-title">Past Challenges</div>
          <div className="challenges-archive-list">
            {past.map(c => (
              <div key={c.id} className="challenge-archive-row">
                <span className="challenge-archive-number">#{c.number}</span>
                <TypeBadge type={c.type} />
                <span className="challenge-archive-title-text">{c.title}</span>
                <span className="challenge-archive-constraint">{c.constraintText}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
