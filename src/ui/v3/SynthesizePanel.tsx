import { useEffect, useMemo, useState } from 'react';
import { synthesisProvider, type SynthElement, type SynthMethod, type SynthRelation } from './synthesis';
import { GENERATION_LIVE } from './generation';
import { INTERACTIONS } from './interactions';

type SynthesizePanelProps = {
  elements: SynthElement[];
  onBack: () => void;
  onGenerate: (prompt: string) => void;
};

const METHODS: { id: SynthMethod; label: string; desc: string }[] = [
  { id: 'faithful', label: 'Faithful', desc: 'keep every element literally' },
  { id: 'cinematic', label: 'Cinematic', desc: 'creative license for drama' },
  { id: 'minimal', label: 'Minimal', desc: 'clean, few elements foregrounded' },
];

const KIND_ACCENT: Record<string, string> = {
  character: 'var(--la-character)',
  scenery: 'var(--la-scenery)',
  objects: 'var(--la-objects)',
  environment: 'var(--la-environment)',
  mood: 'var(--la-mood)',
  lighting: 'var(--la-lighting)',
  composition: 'var(--la-composition)',
};

/**
 * Step 1 of the loop — the art-director pass. Shows the assembled elements,
 * a synthesis method, and the composed (editable) prompt. Calls the synthesis
 * provider seam; a real LLM swaps in behind it.
 */
export function SynthesizePanel({ elements, onBack, onGenerate }: SynthesizePanelProps) {
  const [method, setMethod] = useState<SynthMethod>('faithful');
  const [prompt, setPrompt] = useState('');
  const [working, setWorking] = useState(false);
  const [source, setSource] = useState<'ai' | 'local' | null>(null);
  const [relations, setRelations] = useState<SynthRelation[]>([]);

  // Character names in the scene — the endpoints an interaction can connect.
  const charNames = useMemo(() => elements.filter(e => e.kind === 'character').map(e => e.name), [elements]);
  // Add-row state for building a new interaction.
  const [newVerb, setNewVerb] = useState(INTERACTIONS[0].id);
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');

  const relKey = relations.map(r => `${r.from}|${r.verb}|${r.to}`).join(',');

  const run = async (m: SynthMethod) => {
    setWorking(true);
    const res = await synthesisProvider.synthesize(elements, m, relations);
    setPrompt(res.text);
    setSource(res.source);
    setWorking(false);
  };

  useEffect(() => { void run(method); /* re-run on method, scene, or interaction change */ }, [method, elements.length, relKey]);

  const addRelation = () => {
    const from = newFrom || charNames[0];
    const to = newTo || charNames.find(n => n !== from) || '';
    if (!from || !to || from === to) return;
    const rel = INTERACTIONS.find(i => i.id === newVerb)?.rel ?? 'is with';
    setRelations(rs => [...rs, { from, verb: rel, to }]);
    setNewFrom(''); setNewTo('');
  };
  const removeRelation = (i: number) => setRelations(rs => rs.filter((_, idx) => idx !== i));

  return (
    <div className="v3-flow">
      <button type="button" className="v3-flow-back" onClick={onBack}>← Back to lanes</button>

      <div className="v3-head">
        <div>
          <div className="v3-eyebrow">Step 1 of 2 · compose</div>
          <h2>Synthesize scene</h2>
          <div className="v3-sub">An art-director pass resolves your elements into one coherent image prompt.</div>
        </div>
        <div className="v3-segwrap">
          {METHODS.map(m => (
            <button key={m.id} type="button" className={`v3-seg${method === m.id ? ' on' : ''}`} onClick={() => setMethod(m.id)} title={m.desc}>
              <span className="d" /> {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="v3-panel live">
        <div className="ph">Contributing elements · {elements.length}</div>
        <div className="v3-elrow">
          {elements.map((e, i) => (
            <span key={`${e.name}-${i}`} className="v3-el" style={{ ['--c' as string]: KIND_ACCENT[e.kind] ?? 'var(--la-character)' }}>
              {e.name}
            </span>
          ))}
        </div>

        {charNames.length >= 2 && (
          <div className="v3-interact">
            <div className="ph" style={{ marginTop: 18 }}>Interactions <span className="v3-int-hint">how the characters relate — the focus of the scene</span></div>
            {relations.length > 0 && (
              <div className="v3-int-chips">
                {relations.map((r, i) => (
                  <span key={i} className="v3-int-chip">
                    {r.from} <b>{r.verb}</b> {r.to}
                    <button type="button" className="x" onClick={() => removeRelation(i)} aria-label="Remove">✕</button>
                  </span>
                ))}
              </div>
            )}
            <div className="v3-int-add">
              <select value={newFrom || charNames[0]} onChange={e => setNewFrom(e.target.value)}>
                {charNames.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <select value={newVerb} onChange={e => setNewVerb(e.target.value)}>
                {INTERACTIONS.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
              </select>
              <select value={newTo || (charNames.find(n => n !== (newFrom || charNames[0])) ?? '')} onChange={e => setNewTo(e.target.value)}>
                {charNames.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <button type="button" className="v3-btn utility" onClick={addRelation}>＋ Link</button>
            </div>
          </div>
        )}

        <div className="ph" style={{ marginTop: 20 }}>
          Synthesized prompt · editable
          {working && <span className="v3-synth-src busy"> · synthesizing<span className="v3-dots" /></span>}
          {!working && source === 'ai' && <span className="v3-synth-src ai"> · composed by AI</span>}
          {!working && source === 'local' && <span className="v3-synth-src"> · offline composer (AI proxy not reachable)</span>}
        </div>
        <div className={`v3-prompt-wrap${working ? ' busy' : ''}`}>
          <textarea
            className="v3-promptbox v3-prompt-edit"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            rows={5}
            spellCheck={false}
            readOnly={working}
          />
          {working && (
            <div className="v3-synth-overlay">
              <span className="v3-synth-overlay-label">Synthesizing your scene<span className="v3-dots" /></span>
              <div className="v3-bar indet"><i /></div>
            </div>
          )}
        </div>

        <div className="v3-flow-actions">
          <button type="button" className="v3-btn utility" onClick={() => run(method)} disabled={working}>
            {working ? 'Synthesizing…' : '↻ Re-synthesize'}
          </button>
          {GENERATION_LIVE ? (
            <button type="button" className="v3-btn primary" onClick={() => onGenerate(prompt)} disabled={!prompt.trim()}>
              Generate image →
            </button>
          ) : (
            <button type="button" className="v3-btn primary" disabled title="Cloud rendering is coming soon">
              🔒 Image generation — coming soon
            </button>
          )}
        </div>
        <div className="v3-legend">
          {GENERATION_LIVE
            ? 'Nouns (character, object, environment) + the scenery verb + mood → one sensible scene.'
            : 'Your scene is composed into a render-ready prompt. One-click image generation goes live soon.'}
        </div>
      </div>
    </div>
  );
}
