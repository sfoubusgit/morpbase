import { useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { createPost } from './channelImagesStore';
import { nsfwMatch } from './contentRating';
import { LanePlaceholder } from './LanePlaceholder';

export type AttachSubject = { id: string; name: string; lane: string; image?: string | null };
export type PostScene = { id: string; name: string; lastUsedAt?: string; subjects: AttachSubject[] };

type PostComposerProps = {
  viewerAuthUid: string;
  viewerName: string;
  /** everything the viewer can credit — scene items, their creations, favorites */
  attachable: AttachSubject[];
  /** the viewer's scenes (one-tap credit bundles), recently-used first */
  scenes?: PostScene[];
  /** the currently-open scene id (pre-selected in the picker) */
  activeSceneId?: string;
  /** ids pre-checked (e.g. the current scene's items) */
  preselectedIds?: string[];
  onClose: () => void;
  onPosted: () => void;
};

const relUsed = (iso?: string): string => {
  if (!iso) return '';
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 3600) return 'used just now';
  if (s < 86400) return `used ${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `used ${Math.floor(s / 86400)}d ago`;
  return '';
};

const MAX_IMAGES = 8;
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB / file
const ACCEPT = ['image/png', 'image/jpeg', 'image/webp'];

/**
 * "Share what you made" — MorpBase makes the prompt, you bring the render back.
 * Upload image(s), credit the character(s)/objects you used, add a caption. Each
 * post lands in every credited item's gallery and in your followers' feed. SFW:
 * you attest before posting and the caption is rated like every other surface.
 */
export function PostComposer({ viewerAuthUid, viewerName, attachable, scenes = [], activeSceneId, preselectedIds = [], onClose, onPosted }: PostComposerProps) {
  // start on the active scene if it has items, else the most-recently-used one
  const initialScene = scenes.find(s => s.id === activeSceneId) ?? scenes[0] ?? null;
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [sceneId, setSceneId] = useState<string | null>(initialScene?.id ?? null);
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialScene ? initialScene.subjects.map(s => s.id) : preselectedIds),
  );
  const [search, setSearch] = useState('');
  const [agree, setAgree] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const flaggedTerm = nsfwMatch(caption);

  const addFiles = (incoming: FileList | File[]) => {
    setError(null);
    const list = Array.from(incoming);
    const accepted: File[] = [];
    for (const f of list) {
      if (!ACCEPT.includes(f.type)) { setError('Only PNG, JPEG or WebP images are accepted.'); continue; }
      if (f.size > MAX_BYTES) { setError(`“${f.name}” is over 20 MB.`); continue; }
      accepted.push(f);
    }
    setFiles(prev => {
      const next = [...prev, ...accepted].slice(0, MAX_IMAGES);
      setPreviews(p => {
        p.forEach(u => URL.revokeObjectURL(u));
        return next.map(f => URL.createObjectURL(f));
      });
      if (prev.length + accepted.length > MAX_IMAGES) setError(`Up to ${MAX_IMAGES} images per post.`);
      return next;
    });
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>) => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; };
  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files); };
  const removeAt = (i: number) => {
    setFiles(prev => prev.filter((_, x) => x !== i));
    setPreviews(prev => { const u = prev[i]; if (u) URL.revokeObjectURL(u); return prev.filter((_, x) => x !== i); });
  };
  const toggle = (id: string) => {
    setSceneId(null); // manual edit → no longer "exactly a scene"
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const pickScene = (s: PostScene) => { setSceneId(s.id); setSelected(new Set(s.subjects.map(x => x.id))); };

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q ? attachable.filter(a => a.name.toLowerCase().includes(q)) : attachable;
    // keep selected ones visible even when filtered out
    const extra = attachable.filter(a => selected.has(a.id) && !list.includes(a));
    return [...extra, ...list];
  }, [attachable, search, selected]);

  const canPost = files.length > 0 && selected.size > 0 && agree && !flaggedTerm && !posting;

  const submit = async () => {
    if (posting) return;
    if (files.length === 0) { setError('Add at least one image.'); return; }
    if (selected.size === 0) { setError('Credit at least one character or object you used.'); return; }
    if (flaggedTerm) { setError(`Caption flagged 18+ (“${flaggedTerm}”). MorpBase is SFW for now — reword it.`); return; }
    if (!agree) { setError('Please confirm your post follows the Content Policy.'); return; }
    setPosting(true); setError(null);
    try {
      await createPost({ authUid: viewerAuthUid, authorLabel: viewerName, caption, subjectIds: [...selected], blobs: files });
      previews.forEach(u => URL.revokeObjectURL(u));
      onPosted();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Couldn’t post. Try again.');
      setPosting(false);
    }
  };

  return (
    <div className="v3-modal-backdrop">
      <div className="v3-modal v3-post" style={{ ['--c' as string]: 'var(--la-character)' }}>
        <div className="v3-modal-head">
          <div>
            <div className="v3-eyebrow">Share what you made</div>
            <h2>New post</h2>
          </div>
          <button type="button" className="v3-modal-x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="v3-modal-body">
          {/* dropzone */}
          <div
            className={`v3-post-drop${dragOver ? ' over' : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            role="button"
            tabIndex={0}
          >
            {files.length === 0 ? (
              <>
                <div className="ic" aria-hidden="true">⬆</div>
                <div className="t">Drag images here or click to select</div>
                <div className="s">PNG, JPEG or WebP · up to {MAX_IMAGES} images · 20 MB each</div>
              </>
            ) : (
              <div className="v3-post-thumbs" onClick={e => e.stopPropagation()}>
                {previews.map((u, i) => (
                  <div key={u} className="th" style={{ backgroundImage: `url(${u})` }}>
                    <button type="button" onClick={() => removeAt(i)} aria-label="Remove">✕</button>
                  </div>
                ))}
                {files.length < MAX_IMAGES && (
                  <button type="button" className="th add" onClick={() => fileRef.current?.click()} aria-label="Add more">＋</button>
                )}
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept={ACCEPT.join(',')} multiple hidden onChange={onPick} />

          {/* caption */}
          <label className="v3-cmp-field" style={{ marginTop: 14 }}>Caption <span className="opt">optional</span>
            <textarea value={caption} onChange={e => setCaption(e.target.value)} rows={2} placeholder="Say something about it…" maxLength={400} />
          </label>

          {/* pick a scene → auto-credit everything it used (no hunting) */}
          {scenes.length > 0 && (
            <div className="v3-post-scenes">
              <div className="v3-post-attach-hd"><span>From which scene?</span></div>
              <div className="v3-post-scenerow">
                {scenes.map(s => (
                  <button
                    type="button"
                    key={s.id}
                    className={`v3-post-scene${sceneId === s.id ? ' on' : ''}`}
                    onClick={() => pickScene(s)}
                    title={s.subjects.map(x => x.name).join(', ')}
                  >
                    <span className="avs">
                      {s.subjects.slice(0, 3).map(x => (
                        <span key={x.id} className="a" style={x.image ? { backgroundImage: `url(${x.image})` } : undefined}>{!x.image && (x.name[0]?.toUpperCase() ?? '?')}</span>
                      ))}
                    </span>
                    <span className="meta">
                      <span className="nm">{s.name}</span>
                      <span className="sub">{s.subjects.length} item{s.subjects.length === 1 ? '' : 's'}{relUsed(s.lastUsedAt) ? ` · ${relUsed(s.lastUsedAt)}` : ''}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* credit / attach — pre-filled from the chosen scene, tweakable */}
          <div className="v3-post-attach">
            <div className="v3-post-attach-hd">
              <span>{scenes.length > 0 ? 'Credited items' : 'Made with'} <span className="req">· {scenes.length > 0 ? 'from your scene — adjust if needed' : 'credit at least one'}</span></span>
              {attachable.length > 6 && (
                <input className="v3-post-attach-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your library…" />
              )}
            </div>
            {attachable.length === 0 ? (
              <div className="v3-legend">Add characters/objects to a scene or create some first — then you can credit them here.</div>
            ) : (
              <div className="v3-post-attach-grid">
                {shown.map(a => (
                  <button
                    type="button"
                    key={a.id}
                    className={`v3-post-chip${selected.has(a.id) ? ' on' : ''}`}
                    onClick={() => toggle(a.id)}
                    title={a.name}
                  >
                    <span className={`sw${a.image ? '' : ' v3-ph'}`} style={a.image ? { backgroundImage: `url(${a.image})` } : undefined}>
                      {!a.image && <LanePlaceholder lane={a.lane === 'characters' ? 'character' : a.lane} />}
                    </span>
                    <span className="nm">{a.name}</span>
                    {selected.has(a.id) && <span className="ck">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SFW consent */}
          <label className="v3-post-consent">
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
            <span>This is SFW and follows the <b>Content Policy</b>. Illegal or exploitative content is removed and reported.</span>
          </label>

          {flaggedTerm && <div className="v3-cmp-warn"><b>Caption marked 18+</b> — matched “{flaggedTerm}”. MorpBase is SFW for now; reword it to post.</div>}
          {error && <div className="v3-cmp-error">{error}</div>}
        </div>

        <div className="v3-modal-foot">
          <span className="v3-cmp-note">Posts appear in each credited item’s gallery and your followers’ feed.</span>
          <div className="v3-cmp-footacts">
            <button type="button" className="v3-btn secondary" onClick={onClose} disabled={posting}>Cancel</button>
            <button type="button" className="v3-btn primary" onClick={submit} disabled={!canPost}>{posting ? 'Posting…' : 'Post'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
