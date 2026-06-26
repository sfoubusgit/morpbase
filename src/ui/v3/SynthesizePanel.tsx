import { useEffect, useState } from 'react';
import { synthesisProvider, type SynthElement, type SynthMethod } from './synthesis';

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

  const run = async (m: SynthMethod) => {
    setWorking(true);
    const res = await synthesisProvider.synthesize(elements, m);
    setPrompt(res.text);
    setSource(res.source);
    setWorking(false);
  };

  useEffect(() => { void run(method); /* re-run on method or scene change */ }, [method, elements.length]);

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
          <button type="button" className="v3-btn primary" onClick={() => onGenerate(prompt)} disabled={!prompt.trim()}>
            Generate image →
          </button>
        </div>
        <div className="v3-legend">Nouns (character, object, environment) + the scenery verb + mood → one sensible scene.</div>
      </div>
    </div>
  );
}
