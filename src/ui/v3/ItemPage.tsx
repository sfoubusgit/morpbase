import { useEffect, useState, type FormEvent } from 'react';
import { listGeneratedImages, type RemoteImage } from './channelImagesStore';
import { listComments, addComment, getRatings, setRating, type RemoteComment, type RatingSummary } from './channelSocialStore';
import { LanePlaceholder } from './LanePlaceholder';
import { FollowButton } from './FollowButton';

export type ItemSubject = {
  id: string;
  name: string;
  /** lane key for the colorless placeholder, e.g. 'scenery' */
  kind: string;
  /** human lane label, e.g. 'Scenery' */
  laneLabel: string;
  /** rgb-triplet accent var, e.g. 'var(--la-scenery)' */
  accent: string;
  image: string | null;
  phrases: string[];
  summary: string;
  author: string;
  /** the creator's auth uid (null for seeded 'MorpBase' content) */
  authorAuthUid: string | null;
};

type ItemPageProps = {
  subject: ItemSubject;
  inScene: boolean;
  viewerName: string;
  viewerAuthUid?: string | null;
  onBack: () => void;
  onAdd: (id: string) => void;
  onLogin?: () => void;
  /** edit this item — only offered to its author */
  onEdit?: (id: string) => void;
  /** delete this item — only offered to its author */
  onDelete?: (id: string) => void;
};

type Tab = 'gallery' | 'comments' | 'about';

/**
 * The page for a single lane object — the same "place" a character has, for
 * Scenery / Objects / Environment / Mood / Lighting / Composition. Reached by
 * clicking the item's image. Gallery, comments and ratings are real (Supabase),
 * keyed by the item id, exactly like a character's page.
 */
export function ItemPage({ subject, inScene, viewerName, viewerAuthUid, onBack, onAdd, onLogin, onEdit, onDelete }: ItemPageProps) {
  const isMine = Boolean(viewerAuthUid && subject.authorAuthUid && subject.authorAuthUid === viewerAuthUid);
  const confirmDelete = () => {
    if (onDelete && window.confirm(`Delete "${subject.name}"? This can't be undone.`)) onDelete(subject.id);
  };
  const [tab, setTab] = useState<Tab>('gallery');
  const [remote, setRemote] = useState<RemoteImage[]>([]);
  const [comments, setComments] = useState<RemoteComment[]>([]);
  const [ratings, setRatings] = useState<RatingSummary>({ avg: 0, count: 0, mine: null });
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [cmtError, setCmtError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    setRemote([]); setComments([]); setRatings({ avg: 0, count: 0, mine: null });
    listGeneratedImages(subject.id).then(v => { if (live) setRemote(v); }).catch(() => {});
    listComments(subject.id).then(v => { if (live) setComments(v); }).catch(() => {});
    getRatings(subject.id, viewerAuthUid).then(v => { if (live) setRatings(v); }).catch(() => {});
    return () => { live = false; };
  }, [subject.id, viewerAuthUid]);

  const element = subject.phrases.join(', ');
  const rated = ratings.count > 0;
  const displayRating = ratings.mine ?? (rated ? Math.round(ratings.avg) : 0);

  const handleRate = async (r: number) => {
    if (!viewerAuthUid) { setRatings(prev => ({ ...prev, mine: r })); return; }
    try {
      await setRating({ subjectId: subject.id, authUid: viewerAuthUid, rating: r });
      setRatings(await getRatings(subject.id, viewerAuthUid));
    } catch { /* offline */ }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || posting || !viewerAuthUid) return;
    setPosting(true); setCmtError(null);
    try {
      const c = await addComment({ subjectId: subject.id, authUid: viewerAuthUid, authorLabel: viewerName, body });
      setComments(prev => [c, ...prev]);
      setDraft('');
    } catch (err) {
      setCmtError(err instanceof Error ? err.message : 'Could not post comment.');
    } finally { setPosting(false); }
  };

  const heroStyle = subject.image ? { backgroundImage: `url(${subject.image})` } : undefined;

  return (
    <div className="v3-chan" style={{ ['--c' as string]: subject.accent }}>
      <button type="button" className="v3-chan-back" onClick={onBack}>← {subject.laneLabel}</button>

      <div className="v3-chero">
        <div className={`big${subject.image ? '' : ' v3-ph'}`} style={heroStyle}>
          {!subject.image && <LanePlaceholder lane={subject.kind} />}
        </div>
        <div>
          <div className="v3-eyebrow">{subject.laneLabel}</div>
          <h2>{subject.name}</h2>
          <div className="by">
            by <b>@{subject.author}</b>
            {rated
              ? <> · <span className="v3-stars">{'★'.repeat(Math.round(ratings.avg))}{'☆'.repeat(5 - Math.round(ratings.avg))}</span> {ratings.avg.toFixed(1)} <span className="dim">({ratings.count})</span></>
              : <span className="dim"> · not rated yet</span>}
          </div>

          <div className="v3-chan-actions">
            <button type="button" className="v3-btn primary" onClick={() => onAdd(subject.id)} disabled={inScene}>
              {inScene ? 'In your scene' : '＋ Add to your scene'}
            </button>
            <FollowButton creatorAuthUid={subject.authorAuthUid} viewerAuthUid={viewerAuthUid} showCount onRequireLogin={onLogin} />
            {isMine && onEdit && (
              <button type="button" className="v3-btn secondary" onClick={() => onEdit(subject.id)}>Edit</button>
            )}
            {isMine && onDelete && (
              <button type="button" className="v3-btn danger" onClick={confirmDelete}>Delete</button>
            )}
            <span className="v3-rate" title={`Rate this ${subject.laneLabel.toLowerCase()}`}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" className={n <= displayRating ? 'lit' : ''} onClick={() => handleRate(n)} aria-label={`Rate ${n}`}>★</button>
              ))}
            </span>
          </div>

          <div className="v3-panel">
            <div className="ph">Prompt element</div>
            <div className="body">{element || 'No phrases on this item yet.'}</div>
          </div>
        </div>
      </div>

      <div className="v3-tabs">
        <button type="button" className={`v3-tab2${tab === 'gallery' ? ' on' : ''}`} onClick={() => setTab('gallery')}>Gallery · {remote.length}</button>
        <button type="button" className={`v3-tab2${tab === 'comments' ? ' on' : ''}`} onClick={() => setTab('comments')}>Comments · {comments.length}</button>
        <button type="button" className={`v3-tab2${tab === 'about' ? ' on' : ''}`} onClick={() => setTab('about')}>About</button>
      </div>

      {tab === 'gallery' && (
        <>
          <div className="v3-eyebrow" style={{ marginBottom: 12 }}>What people made with {subject.name}</div>
          {remote.length === 0
            ? <div className="v3-empty">No images yet. Add this to a scene, synthesize, and save what you render here.</div>
            : (
              <div className="v3-gal">
                {remote.map(ri => (
                  <div key={ri.id} className="g" style={{ backgroundImage: `url(${ri.url})` }}><small>@{ri.author}</small></div>
                ))}
              </div>
            )}
        </>
      )}

      {tab === 'comments' && (
        <div style={{ maxWidth: 760 }}>
          <form className="v3-comment-form" onSubmit={handleSubmit}>
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder={viewerAuthUid ? `Share how you used ${subject.name}…` : 'Log in to comment.'}
              disabled={!viewerAuthUid}
            />
            <button type="submit" className="v3-btn primary" disabled={posting || !viewerAuthUid}>{posting ? 'Posting…' : 'Post'}</button>
          </form>
          {cmtError && <div className="v3-cmp-error" style={{ marginTop: 0, marginBottom: 14 }}>{cmtError}</div>}
          {comments.length === 0
            ? <div className="v3-empty">No comments yet. Be the first.</div>
            : comments.map(c => (
              <div key={c.id} className="v3-cmt">
                <div className="a" />
                <div className="b"><b>@{c.author}</b> {c.body}<div className="m">community</div></div>
              </div>
            ))}
        </div>
      )}

      {tab === 'about' && (
        <div className="v3-panel" style={{ maxWidth: 760 }}>
          <div className="ph">About this {subject.laneLabel.toLowerCase()}</div>
          <div className="body">{subject.summary || 'No description yet.'}</div>
        </div>
      )}
    </div>
  );
}
