/**
 * v3 Generation — the render step.
 *
 * Turns a synthesized prompt + chosen style into images via the user's LOCAL
 * ComfyUI + KREA2. The graph + protocol below are transcribed from the studio
 * HQ's proven `comfy_krea2` (services.py): krea2_turbo_fp8_scaled + qwen3vl_4b
 * (type "krea2") + qwen_image_vae, KSampler 8-step / cfg 1.0 / euler / simple,
 * negative = ConditioningZeroOut. No auth.
 *
 * The browser reaches ComfyUI through the Vite proxy: /comfy/* → :8188/*.
 * `stubGenerationProvider` is the offline fallback (placeholder tiles).
 *
 * Style is chosen HERE, at render time — not a lane. Each preset is a prompt
 * prefix (a LoRA can back it later).
 */

export type StylePreset = {
  id: string;
  label: string;
  /** index into the v3 tint palette for the picker thumbnail */
  tint: number;
  prefix: string;
  negative: string;
};

export const STYLE_PRESETS: StylePreset[] = [
  { id: 'photography', label: 'Photography', tint: 5, prefix: 'photorealistic, 50mm, natural light, fine detail', negative: 'illustration, anime, painting, cartoon' },
  { id: 'ghibli', label: 'Ghibli', tint: 2, prefix: 'studio ghibli style, hand-painted, soft gouache', negative: 'photo, 3d render, harsh contrast' },
  { id: 'retro-anime', label: 'Retro Anime', tint: 8, prefix: '1990s retro anime cel, film grain, muted palette', negative: 'photo, modern 3d, smooth gradients' },
  { id: 'noir', label: 'Noir', tint: 0, prefix: 'high-contrast black and white noir, hard shadows', negative: 'color, flat lighting' },
  { id: 'watercolor', label: 'Watercolor', tint: 9, prefix: 'loose watercolor, bleeding pigment, paper texture', negative: 'photo, hard edges, 3d' },
  { id: '3d', label: '3D Render', tint: 7, prefix: 'octane 3d render, subsurface scattering, studio', negative: '2d, flat, sketch' },
  { id: 'ukiyo-e', label: 'Ukiyo-e', tint: 4, prefix: 'ukiyo-e woodblock print, flat ink, bold linework', negative: 'photo, 3d, gradients' },
  { id: 'comic', label: 'Comic', tint: 3, prefix: 'inked comic book panel, halftone, bold ink', negative: 'photo, blurry, soft' },
];

export type GenResult = { id: string; tint: number; prompt: string; styleId: string; url?: string };
export type GenParams = {
  count: number;
  aspect: string;
  styleId: string;
  /** fixed seed for character consistency; random when omitted */
  seed?: number;
};
export type GenProgress = { value: number; max: number };

/** Deterministic seed from a stable id (e.g. a character id) — the consistency anchor. */
export function consistencySeed(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) % 1_000_000_000;
}

export interface GenerationProvider {
  generate(prompt: string, params: GenParams, onProgress?: (p: GenProgress) => void): Promise<GenResult[]>;
}

/** ComfyUI base; the Vite dev proxy maps /comfy → http://127.0.0.1:8188 */
const COMFY = (import.meta.env.VITE_COMFY_URL as string | undefined) || '/comfy';

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

function dimsFor(aspect: string): { w: number; h: number } {
  switch (aspect) {
    case '1:1': return { w: 1024, h: 1024 };
    case '2:3': return { w: 832, h: 1216 };
    case '3:2': return { w: 1216, h: 832 };
    case '16:9': return { w: 1216, h: 688 };
    default: return { w: 1024, h: 1024 };
  }
}

/** The krea2 text-to-image graph, exactly as the HQ builds it (services.py comfy_krea2). */
function krea2Graph(prompt: string, seed: number, w: number, h: number, count: number, steps = 8) {
  return {
    '10': { class_type: 'UNETLoader', inputs: { unet_name: 'krea2_turbo_fp8_scaled.safetensors', weight_dtype: 'default' } },
    '11': { class_type: 'CLIPLoader', inputs: { clip_name: 'qwen3vl_4b_fp8_scaled.safetensors', type: 'krea2' } },
    '12': { class_type: 'VAELoader', inputs: { vae_name: 'qwen_image_vae.safetensors' } },
    '6': { class_type: 'CLIPTextEncode', inputs: { clip: ['11', 0], text: prompt } },
    '13': { class_type: 'ConditioningZeroOut', inputs: { conditioning: ['6', 0] } },
    '5': { class_type: 'EmptyLatentImage', inputs: { width: w, height: h, batch_size: count } },
    '3': {
      class_type: 'KSampler',
      inputs: {
        model: ['10', 0], positive: ['6', 0], negative: ['13', 0], latent_image: ['5', 0],
        seed, steps, cfg: 1.0, sampler_name: 'euler', scheduler: 'simple', denoise: 1.0,
      },
    },
    '8': { class_type: 'VAEDecode', inputs: { samples: ['3', 0], vae: ['12', 0] } },
    '9': { class_type: 'SaveImage', inputs: { images: ['8', 0], filename_prefix: 'krea2' } },
  } as Record<string, { class_type: string; inputs: Record<string, unknown> }>;
}

type ComfyImageRef = { filename: string; subfolder?: string; type?: string };

async function submit(graph: object, clientId: string): Promise<string> {
  const r = await fetch(`${COMFY}/api/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: graph, client_id: clientId }),
  });
  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`ComfyUI /api/prompt ${r.status}${body ? ` — ${body.slice(0, 200)}` : ''}`);
  }
  const j = await r.json();
  if (j.error) throw new Error(typeof j.error === 'string' ? j.error : (j.error?.message ?? JSON.stringify(j.error)));
  if (!j.prompt_id) throw new Error('ComfyUI returned no prompt_id');
  return j.prompt_id as string;
}

async function pollImages(pid: string, timeoutMs = 600_000): Promise<ComfyImageRef[]> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await sleep(1500);
    const r = await fetch(`${COMFY}/history/${pid}`);
    if (!r.ok) continue;
    const hist = await r.json();
    const entry = hist?.[pid];
    if (entry?.status?.completed) {
      const outputs = entry.outputs ?? {};
      for (const o of Object.values<{ images?: ComfyImageRef[] }>(outputs)) {
        if (o.images?.length) return o.images;
      }
      throw new Error('Render completed but produced no image.');
    }
  }
  throw new Error('Render timed out (is ComfyUI busy?).');
}

function viewUrl(im: ComfyImageRef): string {
  const q = new URLSearchParams({ filename: im.filename, subfolder: im.subfolder ?? '', type: im.type ?? 'output' });
  return `${COMFY}/view?${q.toString()}`;
}

/** ws:// URL for ComfyUI's progress socket (through the proxy in dev, or the absolute COMFY url in prod). */
function comfyWsUrl(clientId: string): string {
  if (/^https?:\/\//.test(COMFY)) {
    const u = new URL(COMFY);
    return `${u.protocol === 'https:' ? 'wss:' : 'ws:'}//${u.host}/ws?clientId=${clientId}`;
  }
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${window.location.host}${COMFY}/ws?clientId=${clientId}`;
}

/**
 * Open ComfyUI's progress socket and resolve with the output images, emitting
 * real per-step progress along the way. Rejects on error/timeout so the caller
 * can fall back to /history polling.
 */
function openProgressSocket(
  clientId: string,
  getPid: () => string,
  onProgress?: (p: GenProgress) => void,
  timeoutMs = 600_000,
): Promise<ComfyImageRef[]> {
  return new Promise((resolve, reject) => {
    let ws: WebSocket;
    try { ws = new WebSocket(comfyWsUrl(clientId)); } catch (e) { reject(e); return; }
    let images: ComfyImageRef[] | null = null;
    let settled = false;
    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { ws.close(); } catch { /* ignore */ }
      fn();
    };
    const timer = setTimeout(() => finish(() => reject(new Error('Render timed out'))), timeoutMs);
    ws.onerror = () => finish(() => reject(new Error('WebSocket error')));
    ws.onmessage = (ev) => {
      if (typeof ev.data !== 'string') return; // binary latent-preview frames — ignore
      let msg: { type?: string; data?: Record<string, unknown> };
      try { msg = JSON.parse(ev.data); } catch { return; }
      const d = msg.data ?? {};
      const pid = getPid();
      if (msg.type === 'progress' && (!pid || d.prompt_id === pid)) {
        if (typeof d.value === 'number' && typeof d.max === 'number') {
          onProgress?.({ value: d.value, max: d.max });
        }
      } else if (msg.type === 'executed' && d.prompt_id === pid) {
        const out = (d.output as { images?: ComfyImageRef[] } | undefined)?.images;
        if (out?.length) images = out;
      } else if (msg.type === 'executing' && d.prompt_id === pid && d.node === null) {
        finish(() => (images ? resolve(images) : reject(new Error('completed-no-image'))));
      }
    };
  });
}

class ComfyGenerationProvider implements GenerationProvider {
  async generate(prompt: string, params: GenParams, onProgress?: (p: GenProgress) => void): Promise<GenResult[]> {
    const style = STYLE_PRESETS.find(s => s.id === params.styleId);
    const full = style ? `${style.prefix}, ${prompt}` : prompt;
    const { w, h } = dimsFor(params.aspect);
    const seed = params.seed ?? Math.floor(Math.random() * 1_000_000_000_000) + 1;
    const graph = krea2Graph(full, seed, w, h, Math.max(1, params.count));
    const clientId =
      (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? crypto.randomUUID()
        : `mb_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

    // Open the progress socket first so we don't miss early events, then submit.
    let pid = '';
    const wsImages = openProgressSocket(clientId, () => pid, onProgress).catch(() => null);
    pid = await submit(graph, clientId);

    let images = await wsImages;
    if (!images) images = await pollImages(pid); // fallback if the socket failed
    return images.map((im, i) => ({
      id: `${pid}_${i}`,
      tint: i % 10,
      prompt: full,
      styleId: params.styleId,
      url: viewUrl(im),
    }));
  }
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

class StubGenerationProvider implements GenerationProvider {
  async generate(prompt: string, params: GenParams, onProgress?: (p: GenProgress) => void): Promise<GenResult[]> {
    const style = STYLE_PRESETS.find(s => s.id === params.styleId);
    const full = style ? `${style.prefix}, ${prompt}` : prompt;
    const steps = 8;
    for (let s = 1; s <= steps; s++) { await sleep(110); onProgress?.({ value: s, max: steps }); }
    const base = hash(full + params.aspect);
    return Array.from({ length: params.count }, (_, i) => ({
      id: `stub_${base}_${i}`, tint: (base + i * 3) % 10, prompt: full, styleId: params.styleId,
    }));
  }
}

export const generationProvider: GenerationProvider = new ComfyGenerationProvider();
export const stubGenerationProvider: GenerationProvider = new StubGenerationProvider();
