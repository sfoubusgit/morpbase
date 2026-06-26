import { useState } from 'react';
import { generationProvider, stubGenerationProvider, STYLE_PRESETS, type GenResult, type GenProgress } from './generation';
import { channelStore } from './channelStore';
import { saveGeneratedImage } from './channelImagesStore';

type GeneratePanelProps = {
  prompt: string;
  /** the character in the current scene whose channel results can be saved to */
  channelTarget?: { id: string; name: string } | null;
  /** the locked character's name + consistency seed (keeps them consistent across renders) */
  lockName?: string | null;
  lockSeed?: number | null;
  viewerName?: string;
  /** auth uid — when present, saves are shared via Supabase; otherwise local-only */
  viewerAuthUid?: string | null;
  onBack: () => void;
};

/**
 * Step 2 of the loop — render. Style is picked here (not a lane). Calls the
 * generation provider seam; a real local KREA2/ComfyUI call swaps in behind it.
 */
export function GeneratePanel({ prompt, channelTarget, lockName, lockSeed, viewerName, viewerAuthUid, onBack }: GeneratePanelProps) {
  const [styleId, setStyleId] = useState('photography');
  const [count, setCount] = useState(4);
  const [aspect, setAspect] = useState('2:3');
  const [results, setResults] = useState<GenResult[]>([]);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<GenProgress | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  // Character consistency: lock to the character's seed; "variation" nudges it
  // to a new-but-reproducible take; unlocking renders fully random each time.
  const canLock = typeof lockSeed === 'number';
  const [locked, setLocked] = useState(true);
  const [variation, setVariation] = useState(0);
  const effectiveSeed = canLock && locked ? (lockSeed as number) + variation : undefined;

  const author = viewerName?.trim() || 'you';
  // Authenticated → upload to Supabase (shared, persistent). Otherwise → local only.
  const persist = async (r: GenResult) => {
    if (!channelTarget || !r.url) return;
    if (viewerAuthUid) {
      try {
        const blob = await (await fetch(r.url)).blob();
        await saveGeneratedImage({ subjectId: channelTarget.id, authUid: viewerAuthUid, authorLabel: author, blob });
        return;
      } catch {
        /* fall through to local */
      }
    }
    channelStore.addGalleryImage(channelTarget.id, author, r.url);
  };
  const saveOne = (r: GenResult) => {
    if (!channelTarget || !r.url || savedIds.includes(r.id)) return;
    setSavedIds(ids => [...ids, r.id]);
    void persist(r);
  };
  const saveAll = () => {
    if (!channelTarget) return;
    const fresh = results.filter(r => r.url && !savedIds.includes(r.id));
    setSavedIds(results.map(r => r.id));
    fresh.forEach(r => void persist(r));
  };
  const allSaved = results.length > 0 && results.every(r => savedIds.includes(r.id));

  const pct = progress && progress.max > 0 ? Math.round((progress.value / progress.max) * 100) : null;

  const run = async () => {
    setRendering(true);
    setResults([]);
    setError(null);
    setProgress(null);
    setSavedIds([]);
    const genParams = { count, aspect, styleId, seed: effectiveSeed };
    try {
      const r = await generationProvider.generate(prompt, genParams, setProgress);
      setResults(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed.');
      // graceful fallback so the surface still demonstrates the flow
      const fb = await stubGenerationProvider.generate(prompt, genParams, setProgress);
      setResults(fb);
    } finally {
      setRendering(false);
      setProgress(null);
    }
  };

  return (
    <div className="v3-flow">
      <button type="button" className="v3-flow-back" onClick={onBack}>← Back to synthesis</button>

      <div className="v3-head">
        <div>
          <div className="v3-eyebrow">Step 2 of 2 · render</div>
          <h2>Generate</h2>
          <div className="v3-sub">Local KREA2 via ComfyUI · free now, metered later.</div>
        </div>
      </div>

      <div className="v3-gen">
        <div className="v3-gen-left">
          <div className="v3-panel">
            <div className="ph">Prompt · from synthesis</div>
            <div className="v3-promptbox ro">{prompt}</div>
            <div className="v3-fields">
              <label className="v3-field2">Aspect
                <select value={aspect} onChange={e => setAspect(e.target.value)}>
                  <option value="2:3">2:3</option>
                  <option value="1:1">1:1</option>
                  <option value="3:2">3:2</option>
                  <option value="16:9">16:9</option>
                </select>
              </label>
              <label className="v3-field2">Count
                <select value={count} onChange={e => setCount(Number(e.target.value))}>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                </select>
              </label>
            </div>

            {canLock && (
              <div className={`v3-lock${locked ? ' on' : ''}`}>
                <button type="button" className="v3-lock-toggle" onClick={() => setLocked(l => !l)} title={locked ? 'Character locked for consistency' : 'Character unlocked — renders vary'}>
                  <span className="ic">{locked ? '🔒' : '🔓'}</span>
                  <span className="tx">
                    <b>{locked ? `Locked to ${lockName ?? 'character'}` : 'Consistency off'}</b>
                    <small>{locked ? 'same character across renders' : 'each render fully random'}</small>
                  </span>
                </button>
                {locked && (
                  <button type="button" className="v3-lock-vary" onClick={() => setVariation(v => v + 1)} title="New variation of the same character">⟳ Variation</button>
                )}
              </div>
            )}
            <div className="v3-gen-go">
              <button type="button" className="v3-btn primary" onClick={run} disabled={rendering}>
                {rendering ? 'Rendering…' : 'Generate'}
              </button>
              {rendering && (
                <>
                  <div className={`v3-bar${pct === null ? ' indet' : ''}`}>
                    <i style={pct === null ? undefined : { width: `${pct}%` }} />
                  </div>
                  <span className="v3-pct">{pct === null ? '…' : `${pct}%`}</span>
                </>
              )}
            </div>
            <div className="v3-legend">steps 6 · cfg 1.0 · <code>krea2_turbo</code> · ~3s/image on your box</div>
          </div>

          <div className="v3-panel">
            <div className="ph">Style · chosen at render, not a lane</div>
            <div className="v3-styles">
              {STYLE_PRESETS.map(s => (
                <button key={s.id} type="button" className={`v3-sty${styleId === s.id ? ' on' : ''}`} onClick={() => setStyleId(s.id)}>
                  <span className={`sc v3-tint-${s.tint}`} />
                  <span className="sl">{s.label}</span>
                </button>
              ))}
            </div>
            <div className="v3-legend">each style = a preset / LoRA. add as many as you like.</div>
          </div>
        </div>

        <div className="v3-panel">
          <div className="ph">Results</div>
          {error && (
            <div className="v3-gen-error">
              Couldn’t reach local KREA2: {error}. Showing placeholders — start ComfyUI on <code>:8188</code> and retry.
            </div>
          )}
          {results.length === 0 && !rendering && !error && <div className="v3-gen-empty">Pick a style and hit Generate.</div>}
          {rendering && <div className="v3-gen-empty">Rendering {count} image{count === 1 ? '' : 's'} on local KREA2…</div>}
          <div className="v3-results">
            {results.map(r => (
              <div
                key={r.id}
                className={`v3-res${r.url ? ' has-img' : ` v3-tint-${r.tint}`}`}
                style={r.url ? { backgroundImage: `url(${r.url})` } : undefined}
              >
                <div className="ov">
                  <span className="pip">Upscale</span>
                  {channelTarget && r.url && (
                    <span className="pip" onClick={() => saveOne(r)}>
                      {savedIds.includes(r.id) ? '✓ Saved' : '♥ Save'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {results.length > 0 && (
            <div className="v3-gen-save">
              <button
                type="button"
                className="v3-btn green"
                onClick={saveAll}
                disabled={!channelTarget || allSaved}
                title={channelTarget ? `Save to ${channelTarget.name}'s channel` : 'Add a character to the scene to save to a channel'}
              >
                {allSaved ? '✓ Saved to channel' : channelTarget ? `♥ Save to ${channelTarget.name}'s channel` : '♥ Save to channel'}
              </button>
              <button type="button" className="v3-btn secondary">Save to Memory</button>
              <button type="button" className="v3-btn utility">Post to world</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
