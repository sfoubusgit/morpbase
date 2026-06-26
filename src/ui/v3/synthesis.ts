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

export interface SynthesisProvider {
  synthesize(elements: SynthElement[], method: SynthMethod): Promise<SynthResult>;
}

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

function compose(elements: SynthElement[], method: SynthMethod): string {
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
    return cap(bits.filter(Boolean).join(', ') + '.');
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
    return cap(s);
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
  return cap(s.endsWith('.') ? s : s + '.');
}

/** Local heuristic — also the graceful fallback when the LLM is unreachable. */
class LocalSynthesisProvider implements SynthesisProvider {
  async synthesize(elements: SynthElement[], method: SynthMethod): Promise<SynthResult> {
    return { text: compose(elements, method), source: 'local' };
  }
}

// ── Real art-director LLM (free model, OpenRouter) ──
// Endpoint: dev uses the Vite /llm proxy; production sets VITE_LLM_URL to a
// hosted proxy (Cloudflare Worker in workers/llm-proxy.js) that injects the key
// server-side, so it works from any origin without shipping the key. Model is a
// completely free OpenRouter model; the worker also force-overrides to free.
const LLM_ENDPOINT = (import.meta.env.VITE_LLM_URL as string | undefined) || '/llm/chat/completions';
const LLM_MODEL = (import.meta.env.VITE_SYNTH_MODEL as string | undefined) || 'openai/gpt-oss-20b:free';

const SYSTEM_PROMPT =
  'You are an expert art director composing prompts for an image generator. ' +
  'Given a set of scene elements (characters, scenery/action, environment, mood, objects, lighting), ' +
  'write ONE coherent visual prompt that places the characters into the scene, respecting the mood and the action. ' +
  'Be vivid and concrete, 1–3 sentences, present tense, describing only what is seen. ' +
  'Do not specify art medium or style — that is chosen separately. ' +
  'Output ONLY the prompt text: no preamble, labels, options, or quotes.';

function methodGuidance(method: SynthMethod): string {
  if (method === 'cinematic') return 'Take cinematic license — dramatic framing, depth, and tension.';
  if (method === 'minimal') return 'Keep it minimal and clean — foreground only the most important elements.';
  return "Preserve every element's described details faithfully.";
}

function buildUserMessage(elements: SynthElement[], method: SynthMethod): string {
  const lines = elements.map(e => `- ${cap(e.kind)}: ${e.name}${e.phrases.length ? ` — ${e.phrases.join('; ')}` : ''}`);
  return `Method: ${methodGuidance(method)}\n\nElements:\n${lines.join('\n')}\n\nCompose the single image prompt now.`;
}

class LlmSynthesisProvider implements SynthesisProvider {
  async synthesize(elements: SynthElement[], method: SynthMethod): Promise<SynthResult> {
    const res = await fetch(LLM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: LLM_MODEL,
        max_tokens: 400,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserMessage(elements, method) },
        ],
      }),
    });
    if (!res.ok) throw new Error(`LLM ${res.status}`);
    const j = await res.json();
    const text = (j?.choices?.[0]?.message?.content ?? '').trim();
    if (!text) throw new Error('LLM returned no content');
    return { text: text.replace(/^["']+|["']+$/g, ''), source: 'ai' };
  }
}

/** Tries the real LLM, falls back to the local heuristic on any failure. */
class SmartSynthesisProvider implements SynthesisProvider {
  private llm = new LlmSynthesisProvider();
  private local = new LocalSynthesisProvider();
  async synthesize(elements: SynthElement[], method: SynthMethod): Promise<SynthResult> {
    try {
      return await this.llm.synthesize(elements, method);
    } catch {
      return this.local.synthesize(elements, method);
    }
  }
}

export const synthesisProvider: SynthesisProvider = new SmartSynthesisProvider();
