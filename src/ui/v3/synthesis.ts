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

/**
 * A character action fed to synthesis. Pair actions carry a target
 * ({ from:'Ana', verb:'is kissing', to:'Bo' } → "Ana is kissing Bo"); solo
 * actions omit `to` ({ from:'Ana', verb:'is kneeling' } → "Ana is kneeling").
 */
export type SynthRelation = { from: string; verb: string; to?: string };

export interface SynthesisProvider {
  synthesize(elements: SynthElement[], method: SynthMethod, relations?: SynthRelation[]): Promise<SynthResult>;
}

const relText1 = (r: SynthRelation): string => (r.to ? `${r.from} ${r.verb} ${r.to}` : `${r.from} ${r.verb}`);
const relationText = (relations?: SynthRelation[]): string =>
  (relations ?? []).map(relText1).join('; ');

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

const NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
const castPhrases = (c: SynthElement, brief: boolean): string => {
  const ph = uniquePhrases([c]);
  return (brief ? ph.slice(0, 2) : ph).join(', ');
};

/**
 * Describe the cast with each character's attributes BOUND to that character (plus
 * a spatial slot for 2–3), so a diffusion model keeps them as separate figures
 * instead of smearing one character's features onto another. The core fix for
 * multi-character prompts — works identically in the Quick (offline) path.
 */
function describeCast(chars: SynthElement[], brief = false): string {
  if (chars.length === 0) return 'the scene';
  if (chars.length === 1) {
    const ph = castPhrases(chars[0], brief);
    return chars[0].name + (ph ? `: ${ph}` : '');
  }
  const slots = chars.length === 2 ? ['on the left', 'on the right']
    : chars.length === 3 ? ['on the left', 'in the center', 'on the right'] : [];
  const blocks = chars.map((c, i) => {
    const ph = castPhrases(c, brief);
    const pos = slots[i] ? ` (${slots[i]})` : '';
    return `${c.name}${pos}${ph ? ` — ${ph}` : ''}`;
  });
  const count = NUM_WORDS[chars.length] ?? String(chars.length);
  return `${cap(count)} distinct characters in one frame — ${blocks.join('; ')}`;
}

/**
 * A composition authored for one subject ("a single central subject") must not
 * collapse several characters into one figure — soften its count-specific
 * language when the scene actually has 2+ characters.
 */
function countAwareComposition(compText: string, charCount: number): string {
  if (charCount < 2 || !compText) return compText;
  const n = NUM_WORDS[charCount] ?? String(charCount);
  return compText
    .replace(/\ba single (?:central )?subject\b/gi, `all ${n} subjects together`)
    .replace(/\bsingle (?:central )?subject\b/gi, 'the subjects side by side')
    .replace(/\bthe central subject\b/gi, 'the subjects')
    .replace(/\bon the central vertical axis\b/gi, 'arranged across the frame');
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

  // Each character's attributes are bound to that character (with a spatial slot
  // for 2–3) so they render as distinct figures instead of merging.
  const castFull = describeCast(chars, false);
  const castBrief = describeCast(chars, true);
  const sceneryText = uniquePhrases(scenery).join(', ') || joinNames(scenery);
  const envText = uniquePhrases(environment).join(', ') || joinNames(environment);
  const moodText = uniquePhrases(mood).join(', ') || joinNames(mood);
  const objText = uniquePhrases(objects).join(', ') || joinNames(objects);
  const lightText = uniquePhrases(lighting).join(', ') || joinNames(lighting);
  // Reconcile a single-subject composition against the actual cast size.
  const compText = countAwareComposition(uniquePhrases(composition).join(', ') || joinNames(composition), chars.length);

  if (method === 'minimal') {
    const bits = [castBrief].filter(Boolean);
    if (sceneryText) bits.push(sceneryText);
    if (lightText) bits.push(lightText);
    if (compText) bits.push(compText);
    return lead + cap(bits.filter(Boolean).join(', ') + '.');
  }

  if (method === 'cinematic') {
    let s = `A cinematic frame — ${castFull}`;
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
  let s = castFull;
  if (sceneryText) s += `. ${cap(sceneryText)}`;
  if (envText) s += `, in ${envText}`;
  if (objText) s += `, with ${objText}`;
  if (moodText) s += `, ${moodText} mood`;
  if (lightText) s += `, ${lightText}`;
  if (compText) s += `, ${compText}`;
  return lead + cap(s.endsWith('.') ? s : s + '.');
}

/**
 * Instant, LLM-free prompt straight from the local heuristic — for a "quick
 * prompt" the user can grab without waiting on an AI synthesis round-trip.
 */
export function quickPrompt(elements: SynthElement[], method: SynthMethod = 'faithful', relations?: SynthRelation[]): string {
  return compose(elements, method, relations);
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
// Art-director model — Sonnet 4.6 gives near-Opus prose quality for this bounded
// synthesis task at ~40% lower cost. Override via VITE_SYNTH_MODEL (e.g. bump to
// anthropic/claude-opus-4.8 for max quality, or drop to claude-haiku-4.5 to cut cost).
const LLM_MODEL = (import.meta.env.VITE_SYNTH_MODEL as string | undefined) || 'anthropic/claude-sonnet-4.6';

const SYSTEM_PROMPT =
  'You are an expert art director. Weave the given scene elements (characters, ' +
  'scenery/action, environment, mood, objects, lighting) into ONE coherent moment — ' +
  'a tiny vivid scene with a clear sense of what is happening — written as a single ' +
  'image-generation prompt. Place the characters into the action and setting, and carry ' +
  'the mood through it. If Actions are given — whether solo (e.g. "A is kneeling") or ' +
  'between characters (e.g. "A is kissing B") — make them the FOCUS of the moment and ' +
  'stage the characters accordingly. ' +
  'CRITICAL for multiple characters: render each as a DISTINCT figure. Keep every ' +
  'character\'s described features bound to that character, place them separately in ' +
  'the frame (e.g. one on the left, one on the right), and NEVER blend one character\'s ' +
  'traits onto another. If a composition/framing describes a single subject but several ' +
  'characters are present, show them all together instead of collapsing them into one. ' +
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
  const rels = (relations ?? []).map(r => `- ${relText1(r)}`);
  const relBlock = rels.length ? `\n\nActions (make these the focus):\n${rels.join('\n')}` : '';
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
 * Best model first: the paid OpenRouter model (Claude Sonnet 4.6) via a
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
