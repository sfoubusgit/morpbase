import { useRef, useState, type ChangeEvent } from 'react';
import { generationProvider, GENERATION_LIVE, type GenProgress } from './generation';
import { createLaneItem, updateLaneItem, type RemoteLaneItem } from './laneItemsStore';
import { nsfwMatch } from './contentRating';
import { ContentRatingBadge } from './ContentRatingBadge';

type LaneItemComposerProps = {
  lane: string;        // lane key, e.g. 'scenery'
  laneLabel: string;   // 'Scenery'
  accent: string;      // rgb-triplet var, e.g. 'var(--la-scenery)'
  kind?: 'character' | 'object' | 'action';
  /** existing world names, for the autocomplete on the World field */
  worlds?: string[];
  /** when set, the composer edits this item instead of creating a new one */
  editItem?: RemoteLaneItem | null;
  viewerName: string;
  viewerAuthUid: string;
  onClose: () => void;
  onCreated: (item: RemoteLaneItem) => void;
};

/**
 * Create a new lane object — the first content users author themselves. A lane
 * object is a name + summary + a few prompt phrases (what synthesis consumes) +
 * an optional cover, which can be uploaded or rendered on the spot with KREA2.
 * Saves to Supabase as public community content.
 */
export function LaneItemComposer({ lane, laneLabel, accent, kind = 'object', worlds = [], editItem = null, viewerName, viewerAuthUid, onClose, onCreated }: LaneItemComposerProps) {
  const isEdit = !!editItem;
  const isChar = kind === 'character';
  const isAction = kind === 'action';
  const singular = isChar ? 'character' : isAction ? 'action' : laneLabel.toLowerCase().replace(/s$/, '');
  const namePlaceholder = isChar ? 'e.g. Yumi Kurosawa' : isAction ? 'e.g. Skating a halfpipe' : `e.g. ${laneLabel === 'Scenery' ? 'Rooftop standoff' : 'A short, memorable name'}`;
  const phrasesHint = isChar ? 'one per line · the character’s look & feel' : isAction ? 'the action as one self-contained moment · applied to a character' : 'one per line · fed into synthesis';
  const phrasesPlaceholder = isChar
    ? 'tall woman with sharp features and a long black coat\nsilver undercut, calm grey eyes, a faint scar over one brow'
    : isAction
      ? 'riding a big skateboard up the steep wall of a massive concrete halfpipe, launching off the lip into a soaring mid-air trick, arms flung wide, grinning with pure exhilaration'
      : 'a tense standoff on a rain-slicked neon rooftop\nthe city glowing far below, rain hanging in the cold air';
  const [name, setName] = useState(editItem?.name ?? '');
  const [summary, setSummary] = useState(editItem?.summary ?? '');
  const [world, setWorld] = useState(editItem?.world ?? '');
  const [phrasesText, setPhrasesText] = useState((editItem?.phrases ?? []).join('\n'));
  const [coverBlob, setCoverBlob] = useState<Blob | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(editItem?.coverUrl ?? null);
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState<GenProgress | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const phrases = phrasesText.split('\n').map(p => p.trim()).filter(Boolean);
  // Live SFW rating of the draft — so the creator sees, before publishing, whether
  // it'll be visible on public lanes (and exactly which word flags it if not).
  const flaggedTerm = nsfwMatch(`${name} ${summary} ${phrasesText}`);
  const pct = progress && progress.max > 0 ? Math.round((progress.value / progress.max) * 100) : null;

  const setCover = (blob: Blob) => {
    setCoverBlob(blob);
    setCoverUrl(prev => { if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev); return URL.createObjectURL(blob); });
  };

  const onPickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCover(file);
    e.target.value = '';
  };

  const generateCover = async () => {
    const prompt = [name.trim(), ...phrases].filter(Boolean).join(', ');
    if (!prompt) { setError('Add a name and a phrase first, then generate a cover.'); return; }
    setRendering(true); setError(null); setProgress(null);
    try {
      const [res] = await generationProvider.generate(prompt, { count: 1, aspect: '1:1', styleId: 'photography' }, setProgress);
      if (!res?.url) throw new Error('no image');
      const blob = await (await fetch(res.url)).blob();
      setCover(blob);
    } catch {
      setError('Couldn’t reach local KREA2 — start ComfyUI on :8188, or upload a cover instead.');
    } finally {
      setRendering(false); setProgress(null);
    }
  };

  const save = async () => {
    if (saving) return;
    // Validate with a clear reason instead of a silently-disabled button.
    if (!name.trim()) { setError('Add a name first.'); return; }
    if (phrases.length === 0) {
      setError(isAction
        ? 'Describe the action — one self-contained moment. It’s what gets applied to the character.'
        : `Add at least one phrase for this ${singular} (one per line) — it’s what synthesis uses.`);
      return;
    }
    setSaving(true); setError(null);
    try {
      const item = editItem
        ? await updateLaneItem({
            id: editItem.id, authUid: viewerAuthUid, lane,
            name: name.trim(), summary: summary.trim(), phrases, world: world.trim(),
            coverBlob, coverCleared: !coverBlob && !coverUrl && !!editItem.coverUrl,
          })
        : await createLaneItem({
            lane, authUid: viewerAuthUid, authorLabel: viewerName,
            name: name.trim(), summary: summary.trim(), phrases, world: world.trim(), coverBlob,
          });
      onCreated(item);
    } catch (e) {
      console.error('[composer] create failed —', e);
      setError(e instanceof Error ? e.message : 'Couldn’t save. Try again.');
      setSaving(false);
    }
  };

  return (
    // Backdrop clicks do NOT close the composer — a stray click shouldn't wipe an
    // in-progress draft. Only the ✕ and Cancel close it.
    <div className="v3-modal-backdrop">
      <div className="v3-modal" style={{ ['--c' as string]: accent }}>
        <div className="v3-modal-head">
          <div>
            <div className="v3-eyebrow">{isEdit ? 'Edit' : 'New'} {singular} · {laneLabel} lane</div>
            <h2>{isEdit ? 'Edit' : 'Create a'} {singular} <ContentRatingBadge rating={flaggedTerm ? 'nsfw' : 'sfw'} /></h2>
          </div>
          <button type="button" className="v3-modal-x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="v3-modal-body">
          <div className="v3-cmp-grid">
            {/* cover */}
            <div className="v3-cmp-cover">
              <div className={`v3-cmp-coverbox${coverUrl ? ' has' : ''}`} style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}>
                {!coverUrl && !rendering && <span className="ph">No cover yet</span>}
                {rendering && (
                  <div className="v3-cmp-rendering">
                    <div className={`v3-bar${pct === null ? ' indet' : ''}`}><i style={pct === null ? undefined : { width: `${pct}%` }} /></div>
                    <span>{pct === null ? 'Rendering…' : `${pct}%`}</span>
                  </div>
                )}
              </div>
              <div className="v3-cmp-coveracts">
                <button type="button" className="v3-btn utility" onClick={() => fileRef.current?.click()} disabled={rendering || saving}>Upload</button>
                {GENERATION_LIVE && (
                  <button type="button" className="v3-btn utility" onClick={generateCover} disabled={rendering || saving}>{rendering ? 'Rendering…' : 'Generate'}</button>
                )}
                {coverUrl && <button type="button" className="v3-btn ghost" onClick={() => { setCoverBlob(null); setCoverUrl(null); }} disabled={rendering || saving}>Clear</button>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />
              <div className="v3-legend">Optional — a cover helps it stand out on the wall.</div>
            </div>

            {/* fields */}
            <div className="v3-cmp-fields">
              <label className="v3-cmp-field">Name
                <input value={name} onChange={e => setName(e.target.value)} placeholder={namePlaceholder} maxLength={80} />
              </label>
              <label className="v3-cmp-field">Summary <span className="opt">optional</span>
                <input value={summary} onChange={e => setSummary(e.target.value)} placeholder="One line describing it." maxLength={160} />
              </label>
              <label className="v3-cmp-field">World <span className="opt">optional · groups your related items</span>
                <input value={world} onChange={e => setWorld(e.target.value)} placeholder="e.g. Neon District — type a new one or pick an existing" list="v3-world-list" maxLength={60} />
                <datalist id="v3-world-list">{worlds.map(w => <option key={w} value={w} />)}</datalist>
              </label>
              <label className="v3-cmp-field">Phrases <span className="opt">{phrasesHint}</span>
                <textarea
                  value={phrasesText}
                  onChange={e => setPhrasesText(e.target.value)}
                  rows={5}
                  placeholder={phrasesPlaceholder}
                />
              </label>
              <div className="v3-legend">{phrases.length} phrase{phrases.length === 1 ? '' : 's'} · these are what the synthesizer weaves into the scene.</div>
            </div>
          </div>

          {flaggedTerm && (
            <div className="v3-cmp-warn">
              <b>Marked 18+</b> — matched the word “{flaggedTerm}”. It’ll still save, but stays hidden from public lanes (including your own view) until the age-gated section opens. Reword it to publish publicly now.
            </div>
          )}
          {error && <div className="v3-cmp-error">{error}</div>}
        </div>

        <div className="v3-modal-foot">
          <span className="v3-cmp-note">Shared publicly as community content · by @{viewerName.toLowerCase().replace(/\s+/g, '')}</span>
          <div className="v3-cmp-footacts">
            <button type="button" className="v3-btn secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="button" className="v3-btn primary" onClick={save} disabled={saving}>{saving ? (isEdit ? 'Saving…' : 'Publishing…') : isEdit ? 'Save changes' : `Publish ${singular}`}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
