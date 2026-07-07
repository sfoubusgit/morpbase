import type { FeedPost } from './channelImagesStore';

type PostCardProps = {
  post: FeedPost;
  /** open a credited item's channel (image / tag click) */
  onOpenSubject: (id: string) => void;
  /** resolve a credited subject id → display name (unresolved tags are hidden) */
  nameOf?: (id: string) => string | undefined;
  /** show the author header (feed); omit on a profile that already is the author */
  showAuthor?: boolean;
  /** open the author's profile from the header */
  onViewCreator?: (authUid: string, name: string) => void;
};

/**
 * One post — image(s), caption, and the characters/objects it was made with.
 * Shared by the Following feed and the profile "Posts" gallery so they stay
 * visually identical.
 */
export function PostCard({ post, onOpenSubject, nameOf, showAuthor = false, onViewCreator }: PostCardProps) {
  const n = Math.min(post.images.length, 4);
  return (
    <div className="v3-postcard">
      {showAuthor && (
        <div className="v3-postcard-hd">
          <button type="button" className="who" onClick={() => onViewCreator?.(post.authorAuthUid, post.author)}>
            <span className="av">{post.author[0]?.toUpperCase() ?? '?'}</span>
            <span className="nm">@{post.author.toLowerCase().replace(/\s+/g, '')}</span>
          </button>
        </div>
      )}
      <div
        className={`v3-postcard-imgs n${n}`}
        onClick={() => { if (post.subjectIds[0]) onOpenSubject(post.subjectIds[0]); }}
        role="button"
      >
        {post.images.slice(0, 4).map((u, i) => <span key={i} className="im" style={{ backgroundImage: `url(${u})` }} />)}
      </div>
      {post.caption && <div className="v3-postcard-cap">{post.caption}</div>}
      {post.subjectIds.length > 0 && (
        <div className="v3-postcard-tags">
          {post.subjectIds.map(sid => {
            const name = nameOf ? nameOf(sid) : undefined;
            return name ? <button key={sid} type="button" className="tag" onClick={() => onOpenSubject(sid)}>{name}</button> : null;
          })}
        </div>
      )}
    </div>
  );
}
