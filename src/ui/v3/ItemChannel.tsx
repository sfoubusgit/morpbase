import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { CharacterIdentity } from '../../types/characters';
import { channelStore, type ItemChannel as ItemChannelData } from './channelStore';
import { listGeneratedImages, type RemoteImage } from './channelImagesStore';
import { LanePlaceholder } from './LanePlaceholder';
import { characterImage, promptElement, compact } from './media';

type ItemChannelProps = {
  character: CharacterIdentity;
  inScene: boolean;
  viewerName: string;
  onBack: () => void;
  onAdd: (id: string) => void;
};

type ChanTab = 'gallery' | 'comments' | 'about';

/**
 * A character's origin Channel — the surface where the old Community now lives:
 * a gallery of community results, a rating, and a comment thread, all attached
 * to this one reusable item. Social data comes from the local channel seam.
 */
export function ItemChannel({ character, inScene, viewerName, onBack, onAdd }: ItemChannelProps) {
  const [data, setData] = useState<ItemChannelData>(() => channelStore.getChannel(character.id));
  const [tab, setTab] = useState<ChanTab>('gallery');
  const [draft, setDraft] = useState('');
  const [remote, setRemote] = useState<RemoteImage[]>([]);

  // Pull the real (Supabase) generated images shared to this channel.
  useEffect(() => {
    let live = true;
    setRemote([]);
    listGeneratedImages(character.id).then(imgs => { if (live) setRemote(imgs); }).catch(() => { /* offline */ });
    return () => { live = false; };
  }, [character.id]);

  const img = characterImage(character);
  const heroStyle = img
    ? { backgroundImage: `url(${img})` }
    : undefined;
  const element = useMemo(() => promptElement(character), [character]);
  const displayRating = data.myRating ?? Math.round(data.stats.rating);

  const handleRate = (r: number) => setData(channelStore.rate(character.id, r));
  const handleFollow = () => setData(channelStore.toggleFollow(character.id));
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setData(channelStore.addComment(character.id, viewerName, draft));
    setDraft('');
    setTab('comments');
  };

  return (
    <div className="v3-chan">
      <button type="button" className="v3-chan-back" onClick={onBack}>← Characters</button>

      <div className="v3-chero">
        <div className={`big${img ? '' : ' v3-ph'}`} style={heroStyle}>
          {!img && <LanePlaceholder lane="character" />}
        </div>
        <div>
          <div className="v3-eyebrow">Character · origin channel</div>
          <h2>{character.name}</h2>
          <div className="by">
            by <b>@{character.tags?.[0] ?? 'community'}</b> ·{' '}
            <span className="v3-stars">{'★'.repeat(Math.round(data.stats.rating))}{'☆'.repeat(5 - Math.round(data.stats.rating))}</span>{' '}
            {data.stats.rating.toFixed(1)}
          </div>

          <div className="v3-metrics">
            <div className="v3-metric"><div className="v">{compact(data.stats.likes)}</div><div className="k">Likes</div></div>
            <div className="v3-metric"><div className="v">{compact(data.stats.scenesMade)}</div><div className="k">Scenes made</div></div>
            <div className="v3-metric"><div className="v">{compact(data.stats.followers)}</div><div className="k">Followers</div></div>
          </div>

          <div className="v3-chan-actions">
            <button type="button" className="v3-btn primary" onClick={() => onAdd(character.id)} disabled={inScene}>
              {inScene ? 'In your scene' : '＋ Add to your scene'}
            </button>
            <button type="button" className={`v3-btn utility${data.following ? ' on' : ''}`} onClick={handleFollow}>
              {data.following ? 'Following' : 'Follow'}
            </button>
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
        <button type="button" className={`v3-tab2${tab === 'comments' ? ' on' : ''}`} onClick={() => setTab('comments')}>Comments · {data.comments.length}</button>
        <button type="button" className={`v3-tab2${tab === 'about' ? ' on' : ''}`} onClick={() => setTab('about')}>About</button>
      </div>

      {tab === 'gallery' && (
        <>
          <div className="v3-eyebrow" style={{ marginBottom: 12 }}>What people made with {character.name}</div>
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
              placeholder={`Share how you used ${character.name}…`}
            />
            <button type="submit" className="v3-btn primary">Post</button>
          </form>
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
