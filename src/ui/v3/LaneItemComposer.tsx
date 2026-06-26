import { useRef, useState, type ChangeEvent } from 'react';
import { generationProvider, type GenProgress } from './generation';
import { createLaneItem, type RemoteLaneItem } from './laneItemsStore';

type LaneItemComposerProps = {
  lane: string;        // lane key, e.g. 'scenery'
  laneLabel: string;   // 'Scenery'
  accent: string;      // rgb-triplet var, e.g. 'var(--la-scenery)'
  kind?: 'character' | 'object';
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
export function LaneItemComposer({ lane, laneLabel, accent, kind = 'object', viewerName, viewerAuthUid, onClose, onCreated }: LaneItemComposerProps) {
  const isChar = kind === 'character';
  const singular = isChar ? 'character' : laneLabel.toLowerCase().replace(/s$/, '');
  const namePlaceholder = isChar ? 'e.g. Yumi Kurosawa' : `e.g. ${laneLabel === 'Scenery' ? 'Rooftop standoff' : 'A short, memorable name'}`;
  const phrasesHint = isChar ? 'one per line · the character’s look & feel' : 'one per line · fed into synthesis';
  const phrasesPlaceholder = isChar
    ? 'tall woman with sharp features and a long black coat\nsilver undercut, calm grey eyes, a faint scar over one brow'
    : 'a tense standoff on a rain-slicked neon rooftop\nthe city glowing far below, rain hanging in the cold air';
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [phrasesText, setPhrasesText] = useState('');
  const [coverBlob, setCoverBlob] = useState<Blob | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState<GenProgress | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const phrases = phrasesText.split('\n').map(p => p.trim()).filter(Boolean);
  const canSave = name.trim().length > 0 && phrases.length > 0 && !saving;
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
    if (!canSave) return;
    setSaving(true); setError(null);
    try {
      const item = await createLaneItem({
        lane, authUid: viewerAuthUid, authorLabel: viewerName,
        name: name.trim(), summary: summary.trim(), phrases, coverBlob,
      });
      onCreated(item);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Couldn’t save. Try again.');
      setSaving(false);
    }
  };

  return (
    <div className="v3-modal-backdrop" onClick={onClose}>
      <div className="v3-modal" style={{ ['--c' as string]: accent }} onClick={e => e.stopPropagation()}>
        <div className="v3-modal-head">
          <div>
            <div className="v3-eyebrow">New {singular} · {laneLabel} lane</div>
            <h2>Create a {singular}</h2>
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
                <button type="button" className="v3-btn utility" onClick={generateCover} disabled={rendering || saving}>{rendering ? 'Rendering…' : 'Generate'}</button>
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

          {error && <div className="v3-cmp-error">{error}</div>}
        </div>

        <div className="v3-modal-foot">
          <span className="v3-cmp-note">Shared publicly as community content · by @{viewerName.toLowerCase().replace(/\s+/g, '')}</span>
          <div className="v3-cmp-footacts">
            <button type="button" className="v3-btn secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="button" className="v3-btn primary" onClick={save} disabled={!canSave}>{saving ? 'Publishing…' : `Publish ${singular}`}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
