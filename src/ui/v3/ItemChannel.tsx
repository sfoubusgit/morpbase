import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { CharacterIdentity } from '../../types/characters';
import { channelStore, type ItemChannel as ItemChannelData } from './channelStore';
import { listGeneratedImages, type RemoteImage } from './channelImagesStore';
import { listComments, addComment, getRatings, setRating, type RemoteComment, type RatingSummary } from './channelSocialStore';
import { LanePlaceholder } from './LanePlaceholder';
import { CreatorLink } from './CreatorLink';
import { characterImage, promptElement, compact } from './media';

type ItemChannelProps = {
  character: CharacterIdentity;
  inScene: boolean;
  viewerName: string;
  viewerAuthUid?: string | null;
  /** the character's creator (null for seeded 'MorpBase' characters) */
  creatorAuthUid?: string | null;
  onBack: () => void;
  onAdd: (id: string) => void;
  onLogin?: () => void;
  /** open the creator's profile (where you can follow / message them) */
  onViewCreator?: (authUid: string, name: string) => void;
  /** edit this character — only offered to its author */
  onEdit?: (id: string) => void;
  /** delete this character — only offered to its author */
  onDelete?: (id: string) => void;
};

type ChanTab = 'gallery' | 'comments' | 'about';

/**
 * A character's origin Channel — the surface where the old Community now lives:
 * a gallery of community results, a rating, and a comment thread, all attached
 * to this one reusable item. Social data comes from the local channel seam.
 */
export function ItemChannel({ character, inScene, viewerName, viewerAuthUid, creatorAuthUid, onBack, onAdd, onLogin, onViewCreator, onEdit, onDelete }: ItemChannelProps) {
  const isMine = Boolean(viewerAuthUid && creatorAuthUid && creatorAuthUid === viewerAuthUid);
  const confirmDelete = () => {
    if (onDelete && window.confirm(`Delete "${character.name}"? This can't be undone.`)) onDelete(character.id);
  };
  const [data, setData] = useState<ItemChannelData>(() => channelStore.getChannel(character.id));
  const [tab, setTab] = useState<ChanTab>('gallery');
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [cmtError, setCmtError] = useState<string | null>(null);
  const [remote, setRemote] = useState<RemoteImage[]>([]);
  const [remoteComments, setRemoteComments] = useState<RemoteComment[]>([]);
  const [ratings, setRatings] = useState<RatingSummary>({ avg: 0, count: 0, mine: null });

  // Pull the real (Supabase) social data shared to this channel.
  useEffect(() => {
    let live = true;
    setRemote([]); setRemoteComments([]); setRatings({ avg: 0, count: 0, mine: null });
    listGeneratedImages(character.id).then(v => { if (live) setRemote(v); }).catch(() => { /* offline */ });
    listComments(character.id).then(v => { if (live) setRemoteComments(v); }).catch(() => { /* offline */ });
    getRatings(character.id, viewerAuthUid).then(v => { if (live) setRatings(v); }).catch(() => { /* offline */ });
    return () => { live = false; };
  }, [character.id, viewerAuthUid]);

  const img = characterImage(character);
  const heroStyle = img
    ? { backgroundImage: `url(${img})` }
    : undefined;
  const element = useMemo(() => promptElement(character), [character]);

  // Prefer real ratings when any exist, else the seeded display.
  const realRating = ratings.count > 0 ? ratings.avg : data.stats.rating;
  const displayRating = ratings.mine ?? data.myRating ?? Math.round(realRating);
  const commentCount = remoteComments.length + data.comments.length;

  const handleRate = async (r: number) => {
    setRatings(prev => ({ ...prev, mine: r }));    // optimistic — the star lights immediately
    setData(channelStore.rate(character.id, r));   // local / offline mirror
    if (viewerAuthUid) {
      try {
        await setRating({ subjectId: character.id, authUid: viewerAuthUid, rating: r });
        setRatings(await getRatings(character.id, viewerAuthUid));
      } catch { /* keep the optimistic value */ }
    }
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || posting) return;
    setTab('comments');
    if (viewerAuthUid) {
      setPosting(true); setCmtError(null);
      try {
        const c = await addComment({ subjectId: character.id, authUid: viewerAuthUid, authorLabel: viewerName, body });
        setRemoteComments(prev => [c, ...prev]);
        setDraft('');
      } catch (err) {
        setCmtError(err instanceof Error ? err.message : 'Could not post comment.');
      } finally { setPosting(false); }
    } else {
      setData(channelStore.addComment(character.id, viewerName, body));
      setDraft('');
    }
  };

  return (
    <div className="v3-chan">
      <button type="button" className="v3-chan-back" onClick={onBack}>← Characters</button>

      <div className="v3-chero">
        <div className={`big${img ? '' : ' v3-ph'}`} style={heroStyle}>
          {!img && <LanePlaceholder lane="character" />}
        </div>
        <div>
          <div className="v3-eyebrow">Character</div>
          <h2>{character.name}</h2>
          <div className="by">
            by <CreatorLink authUid={creatorAuthUid} name={character.tags?.[0] ?? 'community'} onViewCreator={onViewCreator} /> ·{' '}
            {ratings.count > 0 ? (
              <>
                <span className="v3-stars">{'★'.repeat(Math.round(realRating))}{'☆'.repeat(5 - Math.round(realRating))}</span>{' '}
                {realRating.toFixed(1)}<span className="dim"> ({ratings.count})</span>
              </>
            ) : (
              <span className="dim">Not yet rated</span>
            )}
          </div>

          <div className="v3-metrics">
            <div className="v3-metric"><div className="v">{compact(data.stats.likes)}</div><div className="k">Likes</div></div>
            <div className="v3-metric"><div className="v">{compact(data.stats.scenesMade)}</div><div className="k">Scenes made</div></div>
          </div>

          <div className="v3-chan-actions">
            <button type="button" className="v3-btn primary" onClick={() => onAdd(character.id)} disabled={inScene}>
              {inScene ? 'In your scene' : '＋ Add to your scene'}
            </button>
            {isMine && onEdit && (
              <button type="button" className="v3-btn secondary" onClick={() => onEdit(character.id)}>Edit</button>
            )}
            {isMine && onDelete && (
              <button type="button" className="v3-btn danger" onClick={confirmDelete}>Delete</button>
            )}
            <span className="v3-rate" title="Rate this character">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  className={n <= displayRating ? 'lit' : ''}
                  onClick={() => handleRate(n)}
                  aria-label={`Rate ${n}`}
                >★</button>
              ))}
            </span>
          </div>

          <div className="v3-panel">
            <div className="ph">Prompt element</div>
            <div className="body">{element || 'No phrase bundle on this character yet.'}</div>
          </div>
        </div>
      </div>

      <div className="v3-tabs">
        <button type="button" className={`v3-tab2${tab === 'gallery' ? ' on' : ''}`} onClick={() => setTab('gallery')}>Gallery · {data.gallery.length + remote.length}</button>
        <button type="button" className={`v3-tab2${tab === 'comments' ? ' on' : ''}`} onClick={() => setTab('comments')}>Comments · {commentCount}</button>
        <button type="button" className={`v3-tab2${tab === 'about' ? ' on' : ''}`} onClick={() => setTab('about')}>About</button>
      </div>

      {tab === 'gallery' && (
        <>
          <div className="v3-eyebrow" style={{ marginBottom: 12 }}>What people made with {character.name}</div>
          {data.gallery.length + remote.length === 0 && (
            <div className="v3-empty">Nothing here yet — images saved from Generate with {character.name} will show up here.</div>
          )}
          <div className="v3-gal">
            {remote.map(ri => (
              <div key={ri.id} className="g" style={{ backgroundImage: `url(${ri.url})` }}><small>@{ri.author}</small></div>
            ))}
            {data.gallery.map(gi => (
              <div
                key={gi.id}
                className={`g${gi.url ? '' : ` v3-tint-${gi.tint}`}`}
                style={gi.url ? { backgroundImage: `url(${gi.url})` } : undefined}
              ><small>@{gi.author}</small></div>
            ))}
          </div>
        </>
      )}

      {tab === 'comments' && (
        <div style={{ maxWidth: 760 }}>
          <form className="v3-comment-form" onSubmit={handleSubmit}>
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder={viewerAuthUid ? `Share how you used ${character.name}…` : `Log in to post — or jot a local note…`}
            />
            <button type="submit" className="v3-btn primary" disabled={posting}>{posting ? 'Posting…' : 'Post'}</button>
          </form>
          {cmtError && <div className="v3-cmp-error" style={{ marginTop: 0, marginBottom: 14 }}>{cmtError}</div>}
          {commentCount === 0 && <div className="v3-empty">No comments yet — be the first to share how you used {character.name}.</div>}
          {remoteComments.map(c => (
            <div key={c.id} className="v3-cmt">
              <div className="a" />
              <div className="b">
                <b>@{c.author}</b> {c.body}
                <div className="m">community</div>
              </div>
            </div>
          ))}
          {data.comments.map(c => (
            <div key={c.id} className="v3-cmt">
              <div className="a" />
              <div className="b">
                <b>@{c.author}</b> {c.body}
                <div className="m" onClick={() => setData(channelStore.likeComment(character.id, c.id))}>
                  ♥ {c.likes} · reply · {c.ago}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'about' && (
        <div className="v3-panel" style={{ maxWidth: 760 }}>
          <div className="ph">About this character</div>
          <div className="body">
            {character.summary || 'No summary yet.'}
            {character.identity?.archetype && <div style={{ marginTop: 10 }}>Archetype: {character.identity.archetype}</div>}
            {character.tags && character.tags.length > 0 && (
              <div style={{ marginTop: 6 }}>Tags: {character.tags.join(', ')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
