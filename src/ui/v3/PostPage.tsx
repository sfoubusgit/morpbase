import { useEffect, useState, type FormEvent } from 'react';
import { getPost, deletePost, type FeedPost } from './channelImagesStore';
import { listComments, addComment, getRatings, setRating, type RemoteComment, type RatingSummary } from './channelSocialStore';
import { getPublicProfileByAuthUid } from '../../engine/profileStore';
import { FollowButton } from './FollowButton';
import { nsfwMatch } from './contentRating';

type PostPageProps = {
  postId: string;
  viewerName: string;
  viewerAuthUid?: string | null;
  /** resolve a credited subject id → name (shown as plain text, not a link) */
  nameOf?: (id: string) => string | undefined;
  onBack: () => void;
  onViewCreator: (authUid: string, name: string) => void;
  onMessage: (authUid: string, name: string) => void;
  onLogin?: () => void;
  /** the post was deleted — leave the page */
  onDeleted: () => void;
};

const relTime = (iso: string): string => {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
};

/**
 * A post's own page — the image(s) it shared, plus its own social life: rating,
 * comments, and author actions. Comments and ratings reuse the channel social
 * store keyed by the post id, so no new tables. Deliberately does NOT link out
 * to the lane objects it was made with — a post is its own thing; the credits
 * are shown as plain attribution text.
 */
export function PostPage({ postId, viewerName, viewerAuthUid, nameOf, onBack, onViewCreator, onMessage, onLogin, onDeleted }: PostPageProps) {
  const [post, setPost] = useState<FeedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState<string | null>(null);
  const [comments, setComments] = useState<RemoteComment[]>([]);
  const [ratings, setRatings] = useState<RatingSummary>({ avg: 0, count: 0, mine: null });
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [cmtError, setCmtError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    setLoading(true); setPost(null); setActive(0); setComments([]); setRatings({ avg: 0, count: 0, mine: null });
    getPost(postId).then(p => {
      if (!live) return;
      setPost(p); setLoading(false);
      if (p) {
        setAuthorName(p.author);
        getPublicProfileByAuthUid(p.authorAuthUid).then(prof => {
          if (!live || !prof) return;
          if (prof.displayName?.trim()) setAuthorName(prof.displayName.trim());
          setAuthorAvatar(prof.avatarUrl ?? null);
        }).catch(() => {});
      }
    }).catch(() => { if (live) setLoading(false); });
    listComments(postId).then(v => { if (live) setComments(v); }).catch(() => {});
    getRatings(postId, viewerAuthUid).then(v => { if (live) setRatings(v); }).catch(() => {});
    return () => { live = false; };
  }, [postId, viewerAuthUid]);

  const isMine = Boolean(viewerAuthUid && post && post.authorAuthUid === viewerAuthUid);
  const handle = authorName.toLowerCase().replace(/\s+/g, '');
  const rated = ratings.count > 0;
  const displayRating = ratings.mine ?? (rated ? Math.round(ratings.avg) : 0);

  const handleRate = async (r: number) => {
    setRatings(prev => ({ ...prev, mine: r })); // optimistic
    if (!viewerAuthUid) return;
    try {
      await setRating({ subjectId: postId, authUid: viewerAuthUid, rating: r });
      setRatings(await getRatings(postId, viewerAuthUid));
    } catch { /* keep optimistic */ }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || posting || !viewerAuthUid) return;
    if (nsfwMatch(body)) { setCmtError('That comment was flagged 18+ — MorpBase is SFW for now.'); return; }
    setPosting(true); setCmtError(null);
    try {
      const c = await addComment({ subjectId: postId, authUid: viewerAuthUid, authorLabel: viewerName, body });
      setComments(prev => [c, ...prev]);
      setDraft('');
    } catch (err) {
      setCmtError(err instanceof Error ? err.message : 'Could not post comment.');
    } finally { setPosting(false); }
  };

  const confirmDelete = async () => {
    if (!post || !window.confirm('Delete this post? This can’t be undone.')) return;
    try { await deletePost(postId); } catch { /* ignore */ }
    onDeleted();
  };

  const creditNames = (post?.subjectIds ?? []).map(id => nameOf?.(id)).filter((n): n is string => !!n);

  if (loading) return <div className="v3-chan v3-postpage"><button type="button" className="v3-chan-back" onClick={onBack}>← Back</button><div className="v3-empty">Loading…</div></div>;
  if (!post) return <div className="v3-chan v3-postpage"><button type="button" className="v3-chan-back" onClick={onBack}>← Back</button><div className="v3-empty">This post isn’t available — it may have been deleted.</div></div>;

  return (
    <div className="v3-chan v3-postpage">
      <button type="button" className="v3-chan-back" onClick={onBack}>← Back</button>

      <div className="v3-postpage-main">
        {/* media */}
        <div className="v3-postpage-media">
          <div className="hero" style={{ backgroundImage: `url(${post.images[active]})` }} />
          {post.images.length > 1 && (
            <div className="thumbs">
              {post.images.map((u, i) => (
                <button type="button" key={i} className={`th${i === active ? ' on' : ''}`} style={{ backgroundImage: `url(${u})` }} onClick={() => setActive(i)} aria-label={`Image ${i + 1}`} />
              ))}
            </div>
          )}
        </div>

        {/* meta + social */}
        <div className="v3-postpage-side">
          <button type="button" className="v3-postpage-author" onClick={() => onViewCreator(post.authorAuthUid, authorName)}>
            <span className="av">{authorAvatar ? <img src={authorAvatar} alt={authorName} /> : (authorName[0]?.toUpperCase() ?? '?')}</span>
            <span className="who"><span className="nm">{authorName}</span><span className="hd">@{handle} · {relTime(post.createdAt)}</span></span>
          </button>

          <div className="v3-postpage-actions">
            {!isMine && <FollowButton creatorAuthUid={post.authorAuthUid} viewerAuthUid={viewerAuthUid} showCount onRequireLogin={onLogin} />}
            {!isMine && (
              <button type="button" className="v3-btn secondary" onClick={() => (viewerAuthUid ? onMessage(post.authorAuthUid, authorName) : onLogin?.())}>✉ Message</button>
            )}
            {isMine && <button type="button" className="v3-btn danger" onClick={confirmDelete}>Delete</button>}
          </div>

          {post.caption && <div className="v3-postpage-cap">{post.caption}</div>}

          <div className="v3-postpage-rate">
            <span className="v3-rate" title="Rate this post">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" className={n <= displayRating ? 'lit' : ''} onClick={() => handleRate(n)} aria-label={`Rate ${n}`}>★</button>
              ))}
            </span>
            <span className="v3-postpage-ratenote">{rated ? `${ratings.avg.toFixed(1)} · ${ratings.count} rating${ratings.count === 1 ? '' : 's'}` : 'Not yet rated'}</span>
          </div>

          {creditNames.length > 0 && (
            <div className="v3-postpage-credits">Made with <span>{creditNames.join(', ')}</span></div>
          )}
        </div>
      </div>

      {/* comments */}
      <div className="v3-postpage-comments">
        <div className="v3-eyebrow" style={{ marginBottom: 12 }}>Comments · {comments.length}</div>
        <form className="v3-comment-form" onSubmit={handleSubmit}>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder={viewerAuthUid ? 'Add a comment…' : 'Log in to comment.'}
            disabled={!viewerAuthUid}
            maxLength={500}
          />
          <button type="submit" className="v3-btn primary" disabled={posting || !viewerAuthUid || !draft.trim()}>{posting ? 'Posting…' : 'Post'}</button>
        </form>
        {cmtError && <div className="v3-cmp-error" style={{ marginTop: 0, marginBottom: 14 }}>{cmtError}</div>}
        {comments.length === 0
          ? <div className="v3-empty">No comments yet — be the first.</div>
          : comments.map(c => (
            <div key={c.id} className="v3-cmt">
              <div className="a" />
              <div className="b"><b>@{c.author}</b> {c.body}<div className="m">{relTime(c.createdAt)}</div></div>
            </div>
          ))}
      </div>
    </div>
  );
}
