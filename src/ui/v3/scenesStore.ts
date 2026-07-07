/**
 * Scenes — independent arrangements of lane objects + interactions that the user
 * swaps between (like tabs, one per picture idea) and duplicates to vary.
 *
 * The one architectural rule: a Scene stores REFERENCES (item ids), never copies
 * of content. Characters and lane objects live in the library; a scene is a thin
 * overlay pointing at them. That makes duplication cheap, lets edits to a library
 * object propagate to every scene using it, and makes future sequences (same
 * character across frames) fall out for free.
 *
 * The schema is declared in full here but only a few fields are used in v0. Every
 * field after the v0 core is OPTIONAL and defaulted, and no field is ever
 * repurposed — so later phases (variation matrix, storyboard, remix) only
 * populate more of the same object, never force a migration.
 */
import type { SynthMethod } from './synthesis';

/**
 * A "doing" — what a character is doing in this scene. It hangs off the subject
 * (not a library object, not a graph). Solo doings omit `target`; a doing that
 * targets another cast member is an interaction ("{subject} chasing {target}").
 * Scene-scoped and transient — the durable identity lives on the character.
 */
export type SceneDoing = {
  subject: string;         // subject item id, present in items[]
  verb: string;            // free-text action phrase (the full text fed to synthesis)
  target?: string;         // another cast member's item id (interaction), else absent
  actionId?: string;       // id of a saved/shared Action this doing came from (for display + reuse)
};

/** A generated image tied to a scene (urls/ids only — never blobs in storage). */
export type GenRef = { url: string; createdAt: string; seed?: number | null };

export type Scene = {
  id: string;

  // ── v0: the arrangement ──
  items: string[];              // ordered element ids (characters + lane objects)
  doings: SceneDoing[];         // what each character is doing (subject-scoped)
  name: string;
  createdAt: string;
  updatedAt: string;

  // ── style: the render layer applied to the whole scene (a Style lane item id) ──
  styleId?: string;

  // ── "used" signal: stamped when the scene's prompt is copied (taken off to
  //    render), so the Post composer can list recently-used scenes first ──
  lastUsedAt?: string;

  // ── v1: presentation & synthesis cache ──
  pinned?: boolean;
  color?: string;
  method?: SynthMethod;         // remembered per scene
  prompt?: string;              // cached synthesized text
  promptHash?: string;          // hash(items + interactions + method)
  promptEdited?: boolean;       // user hand-edited → don't auto-overwrite

  // ── v2: variation & lineage ──
  parentId?: string | null;     // duplicated-from
  locks?: string[];             // lane keys held constant in a variation
  axisGroupId?: string | null;  // cells of one variation matrix share this

  // ── v3: generation ──
  seed?: number | null;
  generations?: GenRef[];
  rating?: number;

  // ── projects / storyboard ──
  projectId?: string | null;
  frameIndex?: number | null;

  // ── social / remix ──
  authorAuthUid?: string | null;
  visibility?: 'private' | 'unlisted' | 'public';
  remixOfSceneId?: string | null;
};

const KEY = 'promptgen:scenes:v1';
const VERSION = 1;

const nowISO = () => new Date().toISOString();
const genId = () => `scene_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;

/** A fresh empty scene. */
export function makeScene(name: string, items: string[] = [], doings: SceneDoing[] = []): Scene {
  const t = nowISO();
  return { id: genId(), items: [...items], doings: doings.map(d => ({ ...d })), name, createdAt: t, updatedAt: t };
}

/** A duplicate for varying: same arrangement, fresh identity, no carried results. */
export function duplicateScene(src: Scene, name: string): Scene {
  const t = nowISO();
  return {
    ...src,
    id: genId(),
    name,
    items: [...src.items],
    doings: src.doings.map(d => ({ ...d })),
    parentId: src.id,           // lineage breadcrumb (informational, not ownership)
    axisGroupId: undefined,     // a plain duplicate is standalone
    generations: undefined,     // fresh canvas for results
    createdAt: t,
    updatedAt: t,
  };
}

/** Forward-only migration: keep known fields, default the rest. Never destructive. */
function migrate(payload: unknown): Scene[] {
  const p = payload as { scenes?: unknown[] } | null;
  if (!p || !Array.isArray(p.scenes)) return [];
  return p.scenes
    .filter((s): s is Record<string, unknown> => !!s && typeof (s as { id?: unknown }).id === 'string' && Array.isArray((s as { items?: unknown }).items))
    .map((s): Scene => ({
      id: s.id as string,
      items: (s.items as unknown[]).filter((x): x is string => typeof x === 'string'),
      // Prefer new `doings`; migrate legacy `interactions` ({from,to,verb}) → doings.
      doings: Array.isArray(s.doings)
        ? (s.doings as SceneDoing[]).filter(d => d && d.subject && d.verb)
        : Array.isArray(s.interactions)
          ? (s.interactions as Array<{ from?: string; to?: string; verb?: string }>)
              .filter(r => r && r.from && r.verb)
              .map(r => ({ subject: r.from as string, verb: r.verb as string, target: r.to }))
          : [],
      name: typeof s.name === 'string' ? s.name : 'Scene',
      createdAt: typeof s.createdAt === 'string' ? s.createdAt : nowISO(),
      updatedAt: typeof s.updatedAt === 'string' ? s.updatedAt : nowISO(),
      styleId: s.styleId as string | undefined,
      lastUsedAt: s.lastUsedAt as string | undefined,
      pinned: s.pinned as boolean | undefined,
      color: s.color as string | undefined,
      method: s.method as SynthMethod | undefined,
      prompt: s.prompt as string | undefined,
      promptHash: s.promptHash as string | undefined,
      promptEdited: s.promptEdited as boolean | undefined,
      parentId: (s.parentId as string | null | undefined) ?? null,
      locks: s.locks as string[] | undefined,
      axisGroupId: (s.axisGroupId as string | null | undefined) ?? null,
      seed: (s.seed as number | null | undefined) ?? null,
      generations: s.generations as GenRef[] | undefined,
      rating: s.rating as number | undefined,
      projectId: (s.projectId as string | null | undefined) ?? null,
      frameIndex: (s.frameIndex as number | null | undefined) ?? null,
      authorAuthUid: (s.authorAuthUid as string | null | undefined) ?? null,
      visibility: s.visibility as Scene['visibility'],
      remixOfSceneId: (s.remixOfSceneId as string | null | undefined) ?? null,
    }));
}

let saveTimer: number | undefined;

/**
 * Persistence seam. v0 is localStorage; a Supabase impl (per-account, shareable,
 * remixable) can slot in behind the same shape later without touching callers.
 */
export const scenesStore = {
  /** Always returns ≥1 scene + a valid activeId (creates a fresh one if empty). */
  load(): { scenes: Scene[]; activeId: string } {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as { activeId?: unknown };
        const scenes = migrate(parsed);
        if (scenes.length) {
          const stored = typeof parsed.activeId === 'string' ? parsed.activeId : '';
          const activeId = scenes.some(s => s.id === stored) ? stored : scenes[0].id;
          return { scenes, activeId };
        }
      }
    } catch { /* corrupt/absent — fall through to a fresh scene */ }
    const fresh = [makeScene('Scene 1')];
    return { scenes: fresh, activeId: fresh[0].id };
  },

  /** Debounced write. Quota/serialisation failures are swallowed. */
  save(scenes: Scene[], activeId: string): void {
    if (typeof window === 'undefined') return;
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify({ v: VERSION, scenes, activeId })); } catch { /* full — skip */ }
    }, 300);
  },

  make: makeScene,
  duplicate: duplicateScene,
};
