import type { FeedPost } from './channelImagesStore';

type PostCardProps = {
  post: FeedPost;
  /** open the post's own page */
  onOpen: (postId: string) => void;
  /** resolve a credited subject id → name (shown as plain text, not a link) */
  nameOf?: (id: string) => string | undefined;
  /** show the author header (feed); omit on a profile that already is the author */
  showAuthor?: boolean;
  /** open the author's profile from the header */
  onViewCreator?: (authUid: string, name: string) => void;
};

/**
 * One post — image(s), caption, and (as plain text) what it was made with.
 * The whole card opens the post's own page; it never links to a lane object.
 * Shared by the Following feed and the profile "Posts" gallery.
 */
export function PostCard({ post, onOpen, nameOf, showAuthor = false, onViewCreator }: PostCardProps) {
  const n = Math.min(post.images.length, 4);
  const creditNames = post.subjectIds.map(id => (nameOf ? nameOf(id) : undefined)).filter((x): x is string => !!x);
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
        onClick={() => onOpen(post.postId)}
        role="button"
        title="Open post"
      >
        {post.images.slice(0, 4).map((u, i) => <span key={i} className="im" style={{ backgroundImage: `url(${u})` }} />)}
      </div>
      {post.caption && <button type="button" className="v3-postcard-cap as-link" onClick={() => onOpen(post.postId)}>{post.caption}</button>}
      {creditNames.length > 0 && (
        <div className="v3-postcard-credits">Made with {creditNames.join(', ')}</div>
      )}
    </div>
  );
}
