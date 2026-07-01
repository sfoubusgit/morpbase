/**
 * v3 Synthesis — the "art-director" step.
 *
 * Takes the elements a user assembled (characters, scenery, mood, …) and
 * resolves them into ONE coherent image prompt. Slice ships a local heuristic
 * provider; a real LLM provider (Claude/etc.) implements the same interface and
 * drops in without any UI change.
 */

export type SynthMethod = 'faithful' | 'cinematic' | 'minimal';

export type SynthElement = {
  /** lane key: 'character' | 'scenery' | 'environment' | 'mood' | 'objects' | 'lighting' | 'composition' */
  kind: string;
  name: string;
  phrases: string[];
};

export type SynthResult = { text: string; source: 'ai' | 'local' };

/** A directed interaction between two characters, e.g. { from:'Ana', verb:'is kissing', to:'Bo' }. */
export type SynthRelation = { from: string; verb: string; to: string };

export interface SynthesisProvider {
  synthesize(elements: SynthElement[], method: SynthMethod, relations?: SynthRelation[]): Promise<SynthResult>;
}

const relationText = (relations?: SynthRelation[]): string =>
  (relations ?? []).map(r => `${r.from} ${r.verb} ${r.to}`).join('; ');

const byKind = (els: SynthElement[], kind: string) => els.filter(e => e.kind === kind);

function joinNames(els: SynthElement[]): string {
  const arr = els.map(e => e.name);
  if (arr.length === 0) return '';
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  return `${arr.slice(0, -1).join(', ')}, and ${arr[arr.length - 1]}`;
}

function uniquePhrases(els: SynthElement[]): string[] {
  const seen = new Set<string>();
  els.forEach(e => e.phrases.forEach(p => { const t = p.trim(); if (t) seen.add(t); }));
  return [...seen];
}

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// Light per-call variation so Re-synthesize visibly changes even offline.
function shuffle<T>(arr: T[]): T[] {
  const x = arr.slice();
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
}

function compose(elements: SynthElement[], method: SynthMethod, relations?: SynthRelation[]): string {
  const relText = relationText(relations);
  const lead = relText ? cap(relText) + '. ' : '';
  const chars = byKind(elements, 'character');
  const scenery = byKind(elements, 'scenery');
  const environment = byKind(elements, 'environment');
  const mood = byKind(elements, 'mood');
  const objects = byKind(elements, 'objects');

  const lighting = byKind(elements, 'lighting');
  const composition = byKind(elements, 'composition');

  const subject = chars.length ? joinNames(chars) : 'the scene';
  const charDetails = shuffle(uniquePhrases(chars));
  const sceneryText = uniquePhrases(scenery).join(', ') || joinNames(scenery);
  const envText = uniquePhrases(environment).join(', ') || joinNames(environment);
  const moodText = uniquePhrases(mood).join(', ') || joinNames(mood);
  const objText = uniquePhrases(objects).join(', ') || joinNames(objects);
  const lightText = uniquePhrases(lighting).join(', ') || joinNames(lighting);
  const compText = uniquePhrases(composition).join(', ') || joinNames(composition);

  if (method === 'minimal') {
    const bits = [subject, charDetails.slice(0, 3).join(', ')].filter(Boolean);
    if (sceneryText) bits.push(sceneryText);
    if (lightText) bits.push(lightText);
    if (compText) bits.push(compText);
    return lead + cap(bits.filter(Boolean).join(', ') + '.');
  }

  if (method === 'cinematic') {
    let s = `A cinematic frame — ${subject}`;
    if (charDetails.length) s += `, ${charDetails.join(', ')}`;
    if (sceneryText) s += `. ${cap(sceneryText)}`;
    if (envText) s += `, set in ${envText}`;
    if (objText) s += `, ${objText} in view`;
    if (moodText) s += `. The air is ${moodText}`;
    if (lightText) s += `. ${cap(lightText)}`;
    if (compText) s += `, ${compText}`;
    s += '. Dramatic depth, a held breath of tension.';
    return lead + cap(s);
  }

  // faithful
  let s = subject;
  if (charDetails.length) s += `: ${charDetails.join(', ')}`;
  if (sceneryText) s += `. ${cap(sceneryText)}`;
  if (envText) s += `, in ${envText}`;
  if (objText) s += `, with ${objText}`;
  if (moodText) s += `, ${moodText} mood`;
  if (lightText) s += `, ${lightText}`;
  if (compText) s += `, ${compText}`;
  return lead + cap(s.endsWith('.') ? s : s + '.');
}

/** Local heuristic — also the graceful fallback when the LLM is unreachable. */
class LocalSynthesisProvider implements SynthesisProvider {
  async synthesize(elements: SynthElement[], method: SynthMethod, relations?: SynthRelation[]): Promise<SynthResult> {
    return { text: compose(elements, method, relations), source: 'local' };
  }
}

// ── Real art-director LLM (free model, OpenRouter) ──
// Endpoint: dev uses the Vite /llm proxy; production sets VITE_LLM_URL to a
// hosted proxy (Cloudflare Worker in workers/llm-proxy.js) that injects the key
// server-side, so it works from any origin without shipping the key. Model is a
// completely free OpenRouter model; the worker also force-overrides to free.
// Dev: the Vite /llm proxy injects the key. Prod: a Vercel serverless function
// at /api/llm injects the key (set OPENROUTER_KEY in Vercel). Key never ships.
const LLM_ENDPOINT =
  (import.meta.env.VITE_LLM_URL as string | undefined) ||
  (import.meta.env.DEV ? '/llm/chat/completions' : '/api/llm');
// High-quality paid model — best for coherent, vivid art-director synthesis.
const LLM_MODEL = (import.meta.env.VITE_SYNTH_MODEL as string | undefined) || 'anthropic/claude-opus-4.8';

const SYSTEM_PROMPT =
  'You are an expert art director. Weave the given scene elements (characters, ' +
  'scenery/action, environment, mood, objects, lighting) into ONE coherent moment — ' +
  'a tiny vivid scene with a clear sense of what is happening — written as a single ' +
  'image-generation prompt. Place the characters into the action and setting, and carry ' +
  'the mood through it. If Interactions between characters are given (e.g. "A is kissing B"), ' +
  'make that interaction the FOCUS of the moment and stage the characters accordingly. ' +
  '1–3 sentences, present tense, concrete, describing only what is seen. ' +
  'Do not specify art medium or style — that is chosen separately. ' +
  'Output ONLY the prompt text: no preamble, labels, options, or quotes.';

/** Tidy an LLM prompt: drop wrapping quotes, normalise odd hyphens/whitespace. */
function cleanPrompt(s: string): string {
  return s.replace(/[‐-―]/g, '-').replace(/^["'\s]+|["'\s]+$/g, '').replace(/\s+/g, ' ').trim();
}

function methodGuidance(method: SynthMethod): string {
  if (method === 'cinematic') return 'Take cinematic license — dramatic framing, depth, and tension.';
  if (method === 'minimal') return 'Keep it minimal and clean — foreground only the most important elements.';
  return "Preserve every element's described details faithfully.";
}

function buildUserMessage(elements: SynthElement[], method: SynthMethod, relations?: SynthRelation[]): string {
  const lines = elements.map(e => `- ${cap(e.kind)}: ${e.name}${e.phrases.length ? ` — ${e.phrases.join('; ')}` : ''}`);
  const rels = (relations ?? []).map(r => `- ${r.from} ${r.verb} ${r.to}`);
  const relBlock = rels.length ? `\n\nInteractions (make these the focus):\n${rels.join('\n')}` : '';
  return `Method: ${methodGuidance(method)}\n\nElements:\n${lines.join('\n')}${relBlock}\n\nCompose the single image prompt now.`;
}

class LlmSynthesisProvider implements SynthesisProvider {
  async synthesize(elements: SynthElement[], method: SynthMethod, relations?: SynthRelation[]): Promise<SynthResult> {
    const res = await fetch(LLM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: LLM_MODEL,
        max_tokens: 400,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserMessage(elements, method, relations) },
        ],
      }),
    });
    if (!res.ok) throw new Error(`LLM ${res.status}`);
    const j = await res.json();
    const text = (j?.choices?.[0]?.message?.content ?? '').trim();
    if (!text) throw new Error('LLM returned no content');
    return { text: cleanPrompt(text), source: 'ai' };
  }
}

// Keyless, CORS-open, free, callable directly from the browser — so real AI
// synthesis works from any origin with no proxy/key/infra. Primary provider.
const POLLINATIONS_URL = 'https://text.pollinations.ai/openai';

class PollinationsSynthesisProvider implements SynthesisProvider {
  async synthesize(elements: SynthElement[], method: SynthMethod, relations?: SynthRelation[]): Promise<SynthResult> {
    const res = await fetch(POLLINATIONS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserMessage(elements, method, relations) },
        ],
      }),
    });
    if (!res.ok) throw new Error(`pollinations ${res.status}`);
    const j = await res.json();
    const raw = (j?.choices?.[0]?.message?.content ?? '').trim();
    if (!raw) throw new Error('pollinations returned no content');
    return { text: cleanPrompt(raw), source: 'ai' };
  }
}

/**
 * Best model first: the paid OpenRouter model (Claude Opus 4.8) via a
 * key-injecting proxy — dev uses the Vite /llm proxy, prod a Vercel /api/llm
 * function. If that's unreachable (e.g. no key set), fall back to the keyless
 * Pollinations model, then the local heuristic. The key never reaches the browser.
 */
class SmartSynthesisProvider implements SynthesisProvider {
  private openrouter = new LlmSynthesisProvider();
  private pollinations = new PollinationsSynthesisProvider();
  private local = new LocalSynthesisProvider();
  async synthesize(elements: SynthElement[], method: SynthMethod, relations?: SynthRelation[]): Promise<SynthResult> {
    try {
      return await this.openrouter.synthesize(elements, method, relations);
    } catch {
      try {
        return await this.pollinations.synthesize(elements, method, relations);
      } catch {
        return this.local.synthesize(elements, method, relations);
      }
    }
  }
}

export const synthesisProvider: SynthesisProvider = new SmartSynthesisProvider();
