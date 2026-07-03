import { useEffect, useMemo, useState } from 'react';
import type { CharacterIdentity } from '../../types/characters';
import { CharacterWall } from './CharacterWall';
import { LaneWall } from './LaneWall';
import { LanePlaceholder } from './LanePlaceholder';
import { ItemChannel } from './ItemChannel';
import { ItemPage, type ItemSubject } from './ItemPage';
import { SynthesizePanel } from './SynthesizePanel';
import { GeneratePanel } from './GeneratePanel';
import { consistencySeed } from './generation';
import { V3Profile } from './V3Profile';
import { LaneItemComposer } from './LaneItemComposer';
import { listLaneItems, deleteLaneItem, type RemoteLaneItem } from './laneItemsStore';
import { DEV_LANE_ITEMS } from './laneItemSeed';
import { scenesStore, type Scene, type SceneInteraction } from './scenesStore';
import { listAds, type AdItem } from './adsStore';
import { ratingForText, ratingVisible } from './contentRating';
import { quickPrompt } from './synthesis';
import type { SynthElement, SynthRelation } from './synthesis';
import { INTERACTIONS } from './interactions';
import { ActionEmblem } from './ActionEmblem';
import { SCENERY_ITEMS } from './scenery';
import { OBJECT_ITEMS } from './objects';
import { MOOD_ITEMS } from './mood';
import { LIGHTING_ITEMS } from './lighting';
import { COMPOSITION_ITEMS } from './composition';
import { ENVIRONMENT_ITEMS } from './environment';
import { favoritesStore } from './favoritesStore';
/** Worlds are emergent: each created item carries an optional world label, and
 *  the workspace groups/filters by it. 'all' = the global pool (no filter). */
const ALL_WORLDS = 'all';
import { characterImage, tintIndex } from './media';
import './v3.css';

type V3LabPageProps = {
  characters: CharacterIdentity[];
  viewerName?: string | null;
  viewerAvatarUrl?: string | null;
  viewerAuthUid?: string | null;
  onLogout?: () => void;
  onLogin?: () => void;
  onEditProfile?: () => void;
};

type LaneDef = { key: string; label: string; accent: string; status: 'live' | 'soon'; isNew?: boolean };

const LANES: LaneDef[] = [
  { key: 'characters', label: 'Characters', accent: 'var(--la-character)', status: 'live' },
  { key: 'actions', label: 'Actions', accent: 'var(--la-mood)', status: 'live', isNew: true },
  { key: 'scenery', label: 'Scenery', accent: 'var(--la-scenery)', status: 'live' },
  { key: 'objects', label: 'Objects', accent: 'var(--la-objects)', status: 'live' },
  { key: 'environment', label: 'Environment', accent: 'var(--la-environment)', status: 'live' },
  { key: 'mood', label: 'Mood', accent: 'var(--la-mood)', status: 'live' },
  { key: 'lighting', label: 'Lighting', accent: 'var(--la-lighting)', status: 'live' },
  { key: 'composition', label: 'Composition', accent: 'var(--la-composition)', status: 'live' },
];

const cssVar = (v: string) => ({ ['--c' as string]: v });
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Data-driven config for the LaneWall-powered lanes (everything except Characters).
type WallSeed = { id: string; name: string; summary: string; phrases: string[]; tint: number };
type WallLaneCfg = { label: string; accent: string; badge: string; kind: string; ph: string; sub: string; items: WallSeed[] };
const WALL_LANES: Record<string, WallLaneCfg> = {
  scenery: { label: 'Scenery', accent: 'var(--la-scenery)', badge: 'Scenery', kind: 'scenery', ph: 'scenery', sub: 'what happens in the image. Add one, drop in a character, and synthesize.', items: SCENERY_ITEMS },
  objects: { label: 'Objects', accent: 'var(--la-objects)', badge: 'Object', kind: 'objects', ph: 'object', sub: 'props the scene can carry. Add one alongside a character.', items: OBJECT_ITEMS },
  mood: { label: 'Mood', accent: 'var(--la-mood)', badge: 'Mood', kind: 'mood', ph: 'mood', sub: 'the emotional charge that colours the whole frame.', items: MOOD_ITEMS },
  lighting: { label: 'Lighting', accent: 'var(--la-lighting)', badge: 'Lighting', kind: 'lighting', ph: 'lighting', sub: 'how the scene is lit — applied as a prompt layer.', items: LIGHTING_ITEMS },
  composition: { label: 'Composition', accent: 'var(--la-composition)', badge: 'Composition', kind: 'composition', ph: 'composition', sub: 'framing and camera language for the shot.', items: COMPOSITION_ITEMS },
  environment: { label: 'Environment', accent: 'var(--la-environment)', badge: 'Environment', kind: 'environment', ph: 'environment', sub: 'where it happens — the setting of the image.', items: ENVIRONMENT_ITEMS },
};

// Lane metadata keyed by the registry lane (`ph`) value, for the variation engine.
const LANE_META_BY_PH: Record<string, { label: string; accent: string }> = {
  character: { label: 'Characters', accent: 'var(--la-character)' },
};
for (const wl of Object.values(WALL_LANES)) LANE_META_BY_PH[wl.ph] = { label: wl.label, accent: wl.accent };
// Canonical order lanes appear in the "Vary" picker.
const VARY_LANE_ORDER = ['character', 'scenery', 'object', 'environment', 'mood', 'lighting', 'composition'];

/**
 * v3 workspace — the new main surface. Owns its full chrome (so the legacy app
 * nav is hidden here): a global search bar on top, the UNIVERSE context above
 * the lanes, the LANES as the horizontal main nav (no sidebar), a full-width
 * public thumbnail wall, and a floating scene dock. Community lives inside each
 * item's Channel. Characters is the live lane; the rest are scaffolded.
 */
export function V3LabPage({ characters, viewerName, viewerAvatarUrl, viewerAuthUid, onLogout, onLogin, onEditProfile }: V3LabPageProps) {
  const [world, setWorld] = useState<string>(ALL_WORLDS);
  const [uniOpen, setUniOpen] = useState(false);
  const [lane, setLane] = useState<string>('characters');
  const [query, setQuery] = useState('');
  const [channelId, setChannelId] = useState<string | null>(null);

  // ── Scenes: independent arrangements you swap between (v0: tabs + duplicate) ──
  // A scene holds references (item ids) + interactions, never content — so
  // duplicating is cheap and editing a library object propagates everywhere. The
  // ACTIVE scene projects onto `scene`/`interactions`, so the rest of the page
  // (dock, synthesis) is unchanged. Full schema/rationale in scenesStore.
  const boot = useMemo(() => scenesStore.load(), []);
  const [scenes, setScenes] = useState<Scene[]>(boot.scenes);
  const [activeId, setActiveId] = useState<string>(boot.activeId);
  const active = scenes.find(s => s.id === activeId) ?? scenes[0];
  const scene = active.items;
  const interactions = active.interactions;
  const updateActive = (fn: (s: Scene) => Scene) =>
    setScenes(list => list.map(s => (s.id === active.id ? { ...fn(s), updatedAt: new Date().toISOString() } : s)));
  const setScene = (upd: string[] | ((prev: string[]) => string[])) =>
    updateActive(s => ({ ...s, items: typeof upd === 'function' ? upd(s.items) : upd }));
  const setInteractions = (upd: SceneInteraction[] | ((prev: SceneInteraction[]) => SceneInteraction[])) =>
    updateActive(s => ({ ...s, interactions: typeof upd === 'function' ? upd(s.interactions) : upd }));

  const [favorites, setFavorites] = useState<string[]>(() => favoritesStore.list());
  const [showProfile, setShowProfile] = useState(false);
  const [flow, setFlow] = useState<'synthesize' | 'generate' | null>(null);
  const [genPrompt, setGenPrompt] = useState('');
  const [createdLaneItems, setCreatedLaneItems] = useState<RemoteLaneItem[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [ads, setAds] = useState<AdItem[]>([]);

  useEffect(() => {
    let live = true;
    listAds().then(a => { if (live) setAds(a); }).catch(() => { /* no ads */ });
    return () => { live = false; };
  }, []);

  // User-created lane objects (shared via Supabase) merged into the seeded lanes.
  // In dev we prepend read-only test fixtures (2 per lane) so every lane has
  // content to work with; prod stays a clean slate.
  useEffect(() => {
    let live = true;
    const seed = import.meta.env.DEV ? DEV_LANE_ITEMS : [];
    listLaneItems()
      .then(items => { if (live) setCreatedLaneItems([...seed, ...items]); })
      .catch(() => { if (live) setCreatedLaneItems(seed); });
    return () => { live = false; };
  }, []);

  // Persist scenes locally so they survive a refresh (debounced in the store).
  useEffect(() => { scenesStore.save(scenes, activeId); }, [scenes, activeId]);

  const goWorkspace = () => { setShowProfile(false); setChannelId(null); setFlow(null); };
  const openLane = (key: string) => { setShowProfile(false); setChannelId(null); setFlow(null); setLane(key); };
  // Open an item's page (clicking its image), from anywhere — exits profile/flow.
  const openItem = (id: string) => { setShowProfile(false); setFlow(null); setChannelId(id); };
  // Delete a user-created item (RLS enforces author-only); drop it locally + go back.
  const deleteCreatedItem = async (id: string) => {
    setCreatedLaneItems(prev => prev.filter(it => it.id !== id)); // optimistic
    setChannelId(null);
    // prune the deleted library item (and any interaction using it) from every scene
    setScenes(list => list.map(s => ({
      ...s,
      items: s.items.filter(x => x !== id),
      interactions: s.interactions.filter(r => r.from !== id && r.to !== id),
    })));
    try { await deleteLaneItem(id); } catch { /* RLS/offline — already removed from view */ }
  };

  const viewer = viewerName?.trim() || 'you';

  // User-created characters live in v3_lane_items under lane 'character'. Map them
  // to the CharacterIdentity shape so the wall, channels, scene and synthesis all
  // treat them exactly like seeded characters.
  const toCharacter = (it: RemoteLaneItem): CharacterIdentity => ({
    id: it.id,
    name: it.name,
    summary: it.summary || undefined,
    coverImageUrl: it.coverUrl || undefined,
    tags: [it.author],
    identity: { visualAnchors: [], motifs: [] },
    phraseBundle: { core: it.phrases },
    createdAt: Date.parse(it.createdAt) || 0,
    updatedAt: Date.parse(it.createdAt) || 0,
  });
  // SFW gate — NSFW content (detected from its own text) is hidden from every
  // public surface until the future age-gated red section opens the gate.
  const charText = (c: CharacterIdentity) =>
    `${c.name} ${c.summary ?? ''} ${(c.phraseBundle?.core ?? []).join(' ')} ${(c.identity?.visualAnchors ?? []).map(a => a.text).join(' ')}`;
  const itemText = (it: RemoteLaneItem) => `${it.name} ${it.summary} ${it.phrases.join(' ')}`;
  const visibleCharacters = useMemo(() => characters.filter(c => ratingVisible(ratingForText(charText(c)))), [characters]);
  const visibleCreatedItems = useMemo(() => createdLaneItems.filter(it => ratingVisible(ratingForText(itemText(it)))), [createdLaneItems]);

  const createdChars = useMemo(
    () => visibleCreatedItems.filter(it => it.lane === 'characters').map(toCharacter),
    [visibleCreatedItems],
  );
  const allCharacters = useMemo(() => [...createdChars, ...visibleCharacters], [createdChars, visibleCharacters]);
  // The current viewer's own creations (Supabase-authored + legacy local), for the profile.
  const myCreatedCharacters = useMemo(() => {
    const mine = visibleCreatedItems
      .filter(it => it.lane === 'characters' && it.authorAuthUid && it.authorAuthUid === viewerAuthUid)
      .map(toCharacter);
    const localOwn = visibleCharacters.filter(c => !c.id.startsWith('character_seed_'));
    return [...mine, ...localOwn];
  }, [visibleCreatedItems, viewerAuthUid, visibleCharacters]);
  // The viewer's own created lane objects (non-character lanes) — for the typed profile tabs.
  const myCreatedItems = useMemo(
    () => visibleCreatedItems.filter(it => it.authorAuthUid && it.authorAuthUid === viewerAuthUid && it.lane !== 'characters'),
    [visibleCreatedItems, viewerAuthUid],
  );

  const byId = (id: string) => allCharacters.find(c => c.id === id) ?? null;
  const channelChar = channelId ? byId(channelId) : null;
  // Worlds are derived from the labels users put on their created items.
  const worlds = useMemo(
    () => Array.from(new Set(visibleCreatedItems.map(it => it.world).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [visibleCreatedItems],
  );
  const worldOf = useMemo(() => {
    const m: Record<string, string> = {};
    for (const it of visibleCreatedItems) if (it.world) m[it.id] = it.world;
    return m;
  }, [visibleCreatedItems]);

  // Unified resolver so the scene (tray, synthesis) can hold items from any lane.
  type SceneItem = { id: string; lane: string; kind: string; name: string; accent: string; tint: number; image: string | null; phrases: string[] };
  const registry = useMemo<Record<string, SceneItem>>(() => {
    const m: Record<string, SceneItem> = {};
    for (const c of allCharacters) {
      m[c.id] = { id: c.id, lane: 'character', kind: 'character', name: c.name, accent: 'var(--la-character)', tint: tintIndex(c.id), image: characterImage(c), phrases: c.phraseBundle?.core ?? [] };
    }
    for (const wl of Object.values(WALL_LANES)) {
      for (const it of wl.items) {
        m[it.id] = { id: it.id, lane: wl.ph, kind: wl.kind, name: it.name, accent: wl.accent, tint: it.tint, image: null, phrases: it.phrases };
      }
    }
    // User-created lane objects resolve through the same registry as seeds.
    for (const it of visibleCreatedItems) {
      const wl = WALL_LANES[it.lane];
      if (!wl) continue;
      m[it.id] = { id: it.id, lane: wl.ph, kind: wl.kind, name: it.name, accent: wl.accent, tint: tintIndex(it.id), image: it.coverUrl, phrases: it.phrases };
    }
    return m;
  }, [allCharacters, visibleCreatedItems]);

  // Selectable objects grouped by lane — the pool the variation engine fans across.
  const laneObjects = useMemo(() => {
    const m: Record<string, SceneItem[]> = {};
    for (const it of Object.values(registry)) (m[it.lane] ||= []).push(it);
    for (const k of Object.keys(m)) m[k].sort((a, b) => a.name.localeCompare(b.name));
    return m;
  }, [registry]);
  const varyLanes = useMemo(() => VARY_LANE_ORDER.filter(l => laneObjects[l]?.length), [laneObjects]);

  // Every non-character lane item resolves to a page subject (seeds + created).
  const laneSubjects = useMemo<Record<string, ItemSubject>>(() => {
    const m: Record<string, ItemSubject> = {};
    for (const wl of Object.values(WALL_LANES)) {
      for (const it of wl.items) {
        m[it.id] = { id: it.id, name: it.name, kind: wl.ph, laneLabel: wl.label, accent: wl.accent, image: null, phrases: it.phrases, summary: it.summary, author: 'MorpBase', authorAuthUid: null };
      }
    }
    for (const it of visibleCreatedItems) {
      const wl = WALL_LANES[it.lane];
      if (!wl) continue; // skip created characters (handled by ItemChannel)
      m[it.id] = { id: it.id, name: it.name, kind: wl.ph, laneLabel: wl.label, accent: wl.accent, image: it.coverUrl, phrases: it.phrases, summary: it.summary, author: it.author, authorAuthUid: it.authorAuthUid };
    }
    return m;
  }, [visibleCreatedItems]);
  const openSubject = channelId && !channelChar ? laneSubjects[channelId] ?? null : null;
  // The creator (auth uid) of the open character, for follow — null for seeds.
  const channelCreatorUid = channelChar
    ? createdLaneItems.find(it => it.id === channelChar.id && it.lane === 'characters')?.authorAuthUid ?? null
    : null;

  const addToScene = (id: string) => setScene(s => (s.includes(id) ? s : [...s, id]));
  const removeFromScene = (id: string) => {
    setScene(s => s.filter(x => x !== id));
    // drop any interaction that referenced the removed element
    setInteractions(list => list.filter(x => x.from !== id && x.to !== id));
  };

  // `interactions` (directed A→action→B links) lives on the ACTIVE scene — see
  // the scenes block above for the derived `interactions` + `setInteractions`.
  // Tap-to-link builder: null = idle; otherwise a partial link being assembled.
  // Phase is derived — no `from` → pick who; `from` but no `action` → pick action;
  // both set → pick whom. Guides the user through an explicit A → action → B link.
  const [linkStep, setLinkStep] = useState<null | { from?: string; action?: PickAction }>(null);
  const [sceneMenu, setSceneMenu] = useState(false); // scene switcher dropdown
  const [renamingId, setRenamingId] = useState<string | null>(null); // scene being renamed
  const [renameText, setRenameText] = useState('');
  // Variation engine: fan the current scene across one lane's objects.
  const [varyOpen, setVaryOpen] = useState(false);
  const [varyLane, setVaryLane] = useState<string | null>(null);
  const [varyPick, setVaryPick] = useState<string[]>([]); // selected object ids to fan across
  // Quick prompt: instant local-heuristic prompt, no AI round-trip.
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickCopied, setQuickCopied] = useState(false);
  const toggleFavorite = (id: string) => setFavorites(favoritesStore.toggle(id, viewerAuthUid));

  // On login, merge the user's remote favorites into the local set so they
  // follow the user across devices.
  useEffect(() => {
    if (!viewerAuthUid) return;
    let live = true;
    favoritesStore.sync(viewerAuthUid).then(ids => { if (live) setFavorites(ids); }).catch(() => { /* offline */ });
    return () => { live = false; };
  }, [viewerAuthUid]);

  const q = query.trim().toLowerCase();
  const matchesQuery = (c: CharacterIdentity) =>
    !q ||
    c.name.toLowerCase().includes(q) ||
    (c.summary?.toLowerCase().includes(q) ?? false) ||
    (c.tags?.some(t => t.toLowerCase().includes(q)) ?? false);
  const inWorld = (id: string) => world === ALL_WORLDS || worldOf[id] === world;

  const browseChars = useMemo(
    () => allCharacters.filter(c => inWorld(c.id) && matchesQuery(c)),
    [allCharacters, world, worldOf, q],
  );
  // Wall lanes share one filtered view, scoped to the selected world (if any).
  const wallView = useMemo(() => {
    const wl = WALL_LANES[lane];
    if (!wl) return [];
    const created = visibleCreatedItems
      .filter(it => it.lane === lane && inWorld(it.id) && (!q || it.name.toLowerCase().includes(q) || it.summary.toLowerCase().includes(q)))
      .map(it => ({ id: it.id, name: it.name, subtitle: it.summary, tint: tintIndex(it.id), image: it.coverUrl }));
    // Seeds belong to no world, so they only show in the global ("All worlds") view.
    const seeds = world !== ALL_WORLDS ? [] : wl.items
      .filter(it => !q || it.name.toLowerCase().includes(q) || it.summary.toLowerCase().includes(q))
      .map(it => ({ id: it.id, name: it.name, subtitle: it.summary, tint: it.tint, image: null as string | null }));
    return [...created, ...seeds];
  }, [lane, q, visibleCreatedItems, world, worldOf]);

  // Favorites span every lane — each card carries its own accent/badge.
  const favItems = useMemo(
    () => Object.values(registry)
      .filter(r => favorites.includes(r.id) && (!q || r.name.toLowerCase().includes(q)))
      .map(r => ({ id: r.id, name: r.name, tint: r.tint, image: r.image, accent: r.accent, badge: cap(r.lane), lane: r.lane })),
    [registry, favorites, q],
  );

  const laneLabel = LANES.find(l => l.key === lane)?.label ?? 'Characters';

  const sceneElements: SynthElement[] = scene
    .map(id => registry[id])
    .filter((s): s is SceneItem => Boolean(s))
    .map(s => ({ kind: s.kind, name: s.name, phrases: s.phrases }));

  // first character in the scene — the channel that Generate results save to
  const sceneCharacter = scene.map(id => registry[id]).find(s => s?.lane === 'character') ?? null;

  // characters in the scene (ordered) — the endpoints an interaction can link
  const sceneCharItems = scene.map(id => registry[id]).filter((s): s is SceneItem => !!s && s.lane === 'character');
  // actions → the relations synthesis understands (resolve names). Solo actions
  // have no `to`; pair actions carry the target's name.
  const sceneRelations: SynthRelation[] = interactions
    .map(x => {
      const from = registry[x.from]?.name;
      if (!from || !x.verb) return null;
      if (!x.to) return { from, verb: x.verb };            // solo
      const to = registry[x.to]?.name;
      return to ? { from, verb: x.verb, to } : null;       // pair
    })
    .filter((r): r is SynthRelation => !!r);
  // Actions available to pick: seeded emblems + user-created action cards.
  type PickAction = { key: string; label: string; verb: string; solo?: boolean; emblem?: string; cover?: string | null };
  const pickActions: PickAction[] = [
    ...INTERACTIONS.map(i => ({ key: i.id, label: i.label, verb: i.rel, solo: i.solo, emblem: i.id })),
    ...visibleCreatedItems
      .filter(it => it.lane === 'actions' && it.relation)
      .map(it => ({ key: it.id, label: it.name, verb: it.relation, solo: it.solo, cover: it.coverUrl })),
  ];
  // Action builder. Tap a character (subject), pick an action; a SOLO action
  // commits right there, a PAIR action then asks you to tap a second character.
  const startLink = () => setLinkStep({});
  const cancelLink = () => setLinkStep(null);
  const pickLinkAction = (a: PickAction) => {
    setLinkStep(s => {
      if (!s || !s.from) return s;
      if (a.solo) {
        // solo → commit immediately, no target
        const from = s.from;
        setInteractions(list =>
          list.some(x => x.from === from && !x.to && x.verb === a.verb)
            ? list
            : [...list, { from, verb: a.verb, emblem: a.emblem, cover: a.cover }]);
        return null;
      }
      return { ...s, action: a };
    });
  };
  // Tapping a character chip while building: sets `from`, or completes a pair as `to`.
  const tapCharForLink = (id: string) => {
    setLinkStep(s => {
      if (!s) return s;
      if (!s.from) return { from: id };            // step 1 → picked subject
      if (s.from && s.action && id !== s.from) {   // step 3 (pair) → picked target → commit
        const a = s.action;
        setInteractions(list =>
          list.some(x => x.from === s.from && x.to === id && x.verb === a.verb)
            ? list
            : [...list, { from: s.from!, to: id, verb: a.verb, emblem: a.emblem, cover: a.cover }]);
        return null;
      }
      return s;
    });
  };
  const removeInteraction = (i: number) => setInteractions(list => list.filter((_, idx) => idx !== i));

  // ── scene operations (swap / new / duplicate / close) ──
  // Auto-name off the highest existing "Scene N" so numbers don't collide after deletes.
  const nextSceneName = () => {
    let max = 0;
    for (const s of scenes) { const m = /^Scene (\d+)$/.exec(s.name); if (m) max = Math.max(max, Number(m[1])); }
    return `Scene ${max + 1}`;
  };
  const closeSceneMenu = () => { setSceneMenu(false); setRenamingId(null); };
  const switchScene = (id: string) => { setActiveId(id); setLinkStep(null); closeSceneMenu(); };
  const renameScene = (id: string, name: string) => {
    const n = name.trim();
    setScenes(list => list.map(s => (s.id === id ? { ...s, name: n || s.name, updatedAt: new Date().toISOString() } : s)));
  };
  const startRename = (id: string, current: string) => { setRenamingId(id); setRenameText(current); };
  const commitRename = () => { if (renamingId) renameScene(renamingId, renameText); setRenamingId(null); };
  const sceneIndex = scenes.findIndex(s => s.id === active.id);
  // Cycle to the previous/next scene (wraps around); no-op with a single scene.
  const stepScene = (dir: 1 | -1) => {
    if (scenes.length < 2) return;
    const n = (sceneIndex + dir + scenes.length) % scenes.length;
    switchScene(scenes[n].id);
  };
  const newScene = () => {
    const s = scenesStore.make(nextSceneName());
    setScenes(list => [...list, s]);
    setActiveId(s.id); setLinkStep(null); closeSceneMenu();
  };
  const duplicateScene = (id: string) => {
    const src = scenes.find(s => s.id === id); if (!src) return;
    const copy = scenesStore.duplicate(src, `${src.name} copy`);
    setScenes(list => { const i = list.findIndex(s => s.id === id); const next = [...list]; next.splice(i + 1, 0, copy); return next; });
    setActiveId(copy.id); setLinkStep(null); closeSceneMenu();
  };
  const deleteScene = (id: string) => {
    const idx = scenes.findIndex(s => s.id === id);
    const filtered = scenes.filter(s => s.id !== id);
    const next = filtered.length ? filtered : [scenesStore.make('Scene 1')]; // always keep ≥1
    setScenes(next);
    if (id === activeId) setActiveId(next[Math.min(idx, next.length - 1)].id);
    setLinkStep(null);
  };

  // ── variation engine: fan the current scene across one lane's objects ──
  const gid = () => `axis_${Math.random().toString(36).slice(2, 10)}`;
  const openVary = () => {
    setSceneMenu(false); setRenamingId(null);
    // Default to a lane the scene already has (most likely target); else the first available.
    const present = VARY_LANE_ORDER.find(l => active.items.some(id => registry[id]?.lane === l) && laneObjects[l]?.length);
    setVaryLane(present ?? varyLanes[0] ?? null);
    setVaryPick([]); setVaryOpen(true);
  };
  const closeVary = () => { setVaryOpen(false); setVaryPick([]); };
  const pickVaryLane = (lane: string) => { setVaryLane(lane); setVaryPick([]); };
  const toggleVaryPick = (id: string) => setVaryPick(list => (list.includes(id) ? list.filter(x => x !== id) : [...list, id]));
  const createVariants = () => {
    if (!varyLane || varyPick.length === 0) return;
    const base = active;
    const groupId = gid();
    const kept = base.items.filter(id => registry[id]?.lane !== varyLane); // drop existing items of the varied lane
    const built = varyPick.map(objId => {
      const items = [...kept, objId];
      const alive = new Set(items);
      const interactions = base.interactions.filter(r => alive.has(r.from) && alive.has(r.to));
      const s = scenesStore.make(`${base.name} · ${registry[objId]?.name ?? 'variant'}`, items, interactions);
      return { ...s, parentId: base.id, axisGroupId: groupId };
    });
    setScenes(list => { const i = list.findIndex(x => x.id === base.id); const next = [...list]; next.splice(i + 1, 0, ...built); return next; });
    setActiveId(built[0].id);
    setVaryOpen(false); setVaryPick([]); setLinkStep(null);
  };

  // ── quick prompt: instant local-heuristic prompt (no AI) ──
  const copyQuick = async () => {
    const text = quickPrompt(sceneElements, 'faithful', sceneRelations).trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      document.body.removeChild(ta);
    }
    setQuickCopied(true); window.setTimeout(() => setQuickCopied(false), 1600);
  };

  return (
    <div className="v3" onClick={() => { if (uniOpen) setUniOpen(false); if (sceneMenu) closeSceneMenu(); if (varyOpen) closeVary(); if (quickOpen) setQuickOpen(false); }}>
      {/* ── top bar: brand · universe (above lanes) · global search · profile ── */}
      <header className="v3-topbar">
        <button type="button" className="v3-brand" onClick={goWorkspace} title="Workspace">
          <span className="v3-wordmark"><span className="base">MORPBASE</span><span className="ai">AI</span></span>
        </button>

        {worlds.length > 0 && (
        <div className="v3-uni" onClick={e => e.stopPropagation()}>
          <button type="button" className="v3-unibtn" onClick={() => setUniOpen(o => !o)}>
            <span className={`v3-uni-dot${world === ALL_WORLDS ? ' all' : ''}`} />
            <span className="lbl">World</span>
            <b>{world === ALL_WORLDS ? 'All worlds' : world}</b>
            <span className="caret">▾</span>
          </button>
          {uniOpen && (
            <div className="v3-unipop">
              <button type="button" className={`v3-uni-opt${world === ALL_WORLDS ? ' on' : ''}`} onClick={() => { setWorld(ALL_WORLDS); setUniOpen(false); setChannelId(null); }}>
                <span className="v3-uni-dot all" />
                <span className="txt"><span className="n">All worlds</span><span className="b">browse everything</span></span>
              </button>
              {worlds.map(w => (
                <button type="button" key={w} className={`v3-uni-opt${world === w ? ' on' : ''}`} onClick={() => { setWorld(w); setUniOpen(false); setChannelId(null); }}>
                  <span className="v3-uni-dot" />
                  <span className="txt"><span className="n">{w}</span></span>
                </button>
              ))}
              <div className="v3-unipop-foot">A world groups related characters and lane objects. Set one when you create an item.</div>
            </div>
          )}
        </div>
        )}

        <div className="v3-search2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search characters, scenes, creators…" />
        </div>

        <div className="v3-userbar">
          <button type="button" className={`v3-userchip${showProfile ? ' active' : ''}`} onClick={() => { setShowProfile(true); setChannelId(null); setFlow(null); }} title="Your profile">
            {viewerAvatarUrl
              ? <img className="av img" src={viewerAvatarUrl} alt={viewer} />
              : <span className="av">{viewer[0]?.toUpperCase() ?? '?'}</span>}
            <span className="nm">{viewer}</span>
          </button>
          <span className="v3-userbar-sep" aria-hidden="true" />
          {viewerAuthUid
            ? <button type="button" className="v3-userbar-link" onClick={onLogout}>Log out</button>
            : <button type="button" className="v3-userbar-link" onClick={onLogin}>Log in</button>}
        </div>
      </header>

      {/* ── lanes = the main nav (no sidebar) ── */}
      <nav className="v3-lanenav">
        <div className="v3-lanetabs">
          {LANES.map(l => (
            <button
              key={l.key}
              type="button"
              className={`v3-lanetab${lane === l.key ? ' active' : ''}${l.status !== 'live' ? ' soon' : ''}`}
              style={cssVar(l.accent)}
              disabled={l.status !== 'live'}
              onClick={() => { if (l.status === 'live') openLane(l.key); }}
            >
              <span className="dot" /> {l.label}
              {l.isNew && <span className="nw">New</span>}
              {l.status === 'soon' && !l.isNew && <span className="soon-tag">soon</span>}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`v3-lanetab favtab${lane === 'favorites' && !showProfile ? ' active' : ''}`}
          onClick={() => openLane('favorites')}
        >
          ★ Favorites{favorites.length > 0 && <span className="cnt">{favorites.length}</span>}
        </button>
      </nav>

      {/* ── content ── */}
      <main className="v3-content">
        {showProfile ? (
          <V3Profile
            viewerName={viewer}
            viewerAvatarUrl={viewerAvatarUrl}
            viewerAuthUid={viewerAuthUid}
            createdCharacters={myCreatedCharacters}
            createdItems={myCreatedItems}
            favItems={favItems}
            favorites={favorites}
            scene={scene}
            onAdd={addToScene}
            onOpenChannel={openItem}
            onToggleFavorite={toggleFavorite}
            isLoggedIn={Boolean(viewerAuthUid)}
            onLogout={onLogout}
            onLogin={onLogin}
            onEditProfile={onEditProfile}
          />
        ) : flow === 'synthesize' ? (
          <SynthesizePanel
            elements={sceneElements}
            relations={sceneRelations}
            onBack={() => setFlow(null)}
            onGenerate={(p) => { setGenPrompt(p); setFlow('generate'); }}
          />
        ) : flow === 'generate' ? (
          <GeneratePanel
            prompt={genPrompt}
            channelTarget={sceneCharacter ? { id: sceneCharacter.id, name: sceneCharacter.name } : null}
            lockName={sceneCharacter?.name ?? null}
            lockSeed={sceneCharacter ? consistencySeed(sceneCharacter.id) : null}
            viewerName={viewer}
            viewerAuthUid={viewerAuthUid}
            onBack={() => setFlow('synthesize')}
          />
        ) : channelChar ? (
          <ItemChannel
            character={channelChar}
            inScene={scene.includes(channelChar.id)}
            viewerName={viewer}
            viewerAuthUid={viewerAuthUid}
            creatorAuthUid={channelCreatorUid}
            onBack={() => setChannelId(null)}
            onAdd={addToScene}
            onLogin={onLogin}
            onDelete={deleteCreatedItem}
          />
        ) : openSubject ? (
          <ItemPage
            subject={openSubject}
            inScene={scene.includes(openSubject.id)}
            viewerName={viewer}
            viewerAuthUid={viewerAuthUid}
            onBack={() => setChannelId(null)}
            onAdd={addToScene}
            onLogin={onLogin}
            onDelete={deleteCreatedItem}
          />
        ) : lane === 'characters' ? (
          <>
            <div className="v3-head">
              <div>
                <div className="v3-eyebrow">{world === ALL_WORLDS ? 'All worlds' : world} · Characters</div>
                <h2>Characters</h2>
                <div className="v3-sub">
                  {browseChars.length} character{browseChars.length === 1 ? '' : 's'} {world === ALL_WORLDS ? 'across every world' : `in ${world}`} · favorite the ones you like to reuse them.
                </div>
              </div>
              <button
                type="button"
                className="v3-create-btn"
                style={cssVar('var(--la-character)')}
                onClick={() => (viewerAuthUid ? setComposerOpen(true) : onLogin?.())}
                title={viewerAuthUid ? 'Create a new character' : 'Log in to create'}
              >
                <span className="pl">＋</span> Create
              </button>
            </div>
            <CharacterWall
              characters={browseChars}
              selectedIds={scene}
              favorites={favorites}
              onAdd={addToScene}
              onOpenChannel={openItem}
              onToggleFavorite={toggleFavorite}
              ads={ads}
              adEvery={10}
              emptyHint={q ? 'No characters match your search.' : (world === ALL_WORLDS ? 'No characters yet.' : `No characters in ${world} yet.`)}
            />
          </>
        ) : WALL_LANES[lane] ? (
          <>
            <div className="v3-head">
              <div>
                <div className="v3-eyebrow">{WALL_LANES[lane].label} lane</div>
                <h2>{WALL_LANES[lane].label}</h2>
                <div className="v3-sub">{wallView.length} item{wallView.length === 1 ? '' : 's'} · {WALL_LANES[lane].sub}</div>
              </div>
              <button
                type="button"
                className="v3-create-btn"
                style={cssVar(WALL_LANES[lane].accent)}
                onClick={() => (viewerAuthUid ? setComposerOpen(true) : onLogin?.())}
                title={viewerAuthUid ? `Create a new ${WALL_LANES[lane].label.toLowerCase()} object` : 'Log in to create'}
              >
                <span className="pl">＋</span> Create
              </button>
            </div>
            <LaneWall
              items={wallView}
              accent={WALL_LANES[lane].accent}
              badge={WALL_LANES[lane].badge}
              lane={WALL_LANES[lane].ph}
              selectedIds={scene}
              favorites={favorites}
              onAdd={addToScene}
              onOpen={openItem}
              onToggleFavorite={toggleFavorite}
              ads={ads}
              adEvery={10}
              emptyHint={q ? `No ${WALL_LANES[lane].label.toLowerCase()} matches your search.` : `No ${WALL_LANES[lane].label.toLowerCase()} yet.`}
            />
          </>
        ) : lane === 'actions' ? (
          <>
            <div className="v3-head">
              <div>
                <div className="v3-eyebrow">Actions lane</div>
                <h2>Actions</h2>
                <div className="v3-sub">
                  {pickActions.length} action{pickActions.length === 1 ? '' : 's'} · interactions you can place between two characters in a scene.
                </div>
              </div>
              <button
                type="button"
                className="v3-create-btn"
                style={cssVar('var(--la-mood)')}
                onClick={() => (viewerAuthUid ? setComposerOpen(true) : onLogin?.())}
                title={viewerAuthUid ? 'Create a new action' : 'Log in to create'}
              >
                <span className="pl">＋</span> Create
              </button>
            </div>
            <div className="v3-actwall">
              {pickActions.map(a => {
                const mine = createdLaneItems.find(it => it.id === a.key && it.lane === 'actions' && it.authorAuthUid && it.authorAuthUid === viewerAuthUid);
                return (
                  <div key={a.key} className="v3-actwall-card">
                    <span className="art" style={a.cover ? { backgroundImage: `url(${a.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
                      {!a.cover && <ActionEmblem id={a.emblem ?? ''} />}
                    </span>
                    <div className="meta">
                      <div className="nm">{a.label}</div>
                      <div className="rel">A <b>{a.verb}</b>{a.solo ? '' : ' B'}</div>
                    </div>
                    {mine && (
                      <button type="button" className="del" onClick={() => deleteCreatedItem(a.key)} title="Delete this action" aria-label="Delete">✕</button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : lane === 'favorites' ? (
          <>
            <div className="v3-head">
              <div>
                <div className="v3-eyebrow">Your favorites</div>
                <h2>Favorites</h2>
                <div className="v3-sub">{favItems.length} saved across every lane · reuse them in any scene.</div>
              </div>
            </div>
            <LaneWall
              items={favItems}
              accent="var(--la-character)"
              badge="Item"
              lane="character"
              selectedIds={scene}
              favorites={favorites}
              onAdd={addToScene}
              onOpen={openItem}
              onToggleFavorite={toggleFavorite}
              ads={ads}
              adEvery={10}
              emptyHint="No favorites yet. Tap the ☆ on any thumbnail to save it here."
            />
          </>
        ) : (
          <div className="v3-lane-soon">
            <div className="v3-eyebrow">Coming soon</div>
            <h2>{laneLabel}</h2>
            <p>This lane arrives in a later slice. Characters is live now — pick one to see how the wall and channels work.</p>
          </div>
        )}
      </main>

      {/* ── floating scene dock (replaces the old right sidebar) ── */}
      {(scenes.length > 1 || scene.length > 0) && !channelChar && !showProfile && !flow && (
        <div className="v3-dock" onClick={e => e.stopPropagation()}>
          <div className="v3-dock-main">
          {/* scene switcher — step through scenes, or open the dropdown for direct access */}
          <div className="v3-scene-nav">
            <div className="v3-scene-step">
              <button type="button" aria-label="Previous scene" title="Previous scene" onClick={() => stepScene(-1)} disabled={scenes.length < 2}>▲</button>
              <button type="button" aria-label="Next scene" title="Next scene" onClick={() => stepScene(1)} disabled={scenes.length < 2}>▼</button>
            </div>
            <button type="button" className={`v3-scene-current${sceneMenu ? ' open' : ''}`} onClick={() => { setSceneMenu(o => !o); setRenamingId(null); setVaryOpen(false); }} title="Switch scene">
              <span className="nm">{active.name}</span>
              <span className="ct">{active.items.length}</span>
              <span className="caret">▾</span>
            </button>
            <button type="button" className="v3-scene-act" onClick={() => duplicateScene(active.id)} aria-label="Duplicate this scene" title="Duplicate this scene">⧉</button>
            <button type="button" className="v3-scene-act" onClick={newScene} aria-label="New empty scene" title="New empty scene">＋</button>
            {scene.length > 0 && varyLanes.length > 0 && (
              <button type="button" className={`v3-scene-act vary${varyOpen ? ' open' : ''}`} onClick={() => (varyOpen ? closeVary() : openVary())} aria-label="Vary this scene" title="Vary this scene across a lane">⋔</button>
            )}

            {varyOpen && varyLane && (
              <div className="v3-vary-menu">
                <div className="v3-vary-hd">
                  <span>Vary <b>{active.name}</b> across a lane</span>
                  <button type="button" className="v3-vary-x" onClick={closeVary} aria-label="Close">✕</button>
                </div>
                {/* pick which lane to fan across */}
                <div className="v3-vary-lanes">
                  {varyLanes.map(l => (
                    <button
                      type="button"
                      key={l}
                      className={`v3-vary-lane${varyLane === l ? ' on' : ''}`}
                      style={cssVar(LANE_META_BY_PH[l]?.accent ?? 'var(--la-character)')}
                      onClick={() => pickVaryLane(l)}
                    >
                      {LANE_META_BY_PH[l]?.label ?? l}
                    </button>
                  ))}
                </div>
                {/* pick which objects become the variants */}
                <div className="v3-vary-objs">
                  {(laneObjects[varyLane] ?? []).map(o => {
                    const picked = varyPick.includes(o.id);
                    const inBase = scene.includes(o.id);
                    return (
                      <button type="button" key={o.id} className={`v3-vary-obj${picked ? ' on' : ''}`} onClick={() => toggleVaryPick(o.id)}>
                        <span className="tick">{picked ? '✓' : ''}</span>
                        <span className="nm">{o.name}</span>
                        {inBase && <span className="cur">current</span>}
                      </button>
                    );
                  })}
                </div>
                <button type="button" className="v3-vary-go" onClick={createVariants} disabled={varyPick.length === 0}>
                  Create {varyPick.length || ''} variant{varyPick.length === 1 ? '' : 's'}
                </button>
                <div className="v3-vary-note">Keeps everything else fixed · each pick becomes its own scene.</div>
              </div>
            )}

            {sceneMenu && (
              <div className="v3-scene-menu">
                <div className="v3-scene-menu-hd">Scenes · {scenes.length}</div>
                <div className="v3-scene-menu-list">
                  {scenes.map(s => (
                    <div
                      key={s.id}
                      className={`v3-scene-row${s.id === active.id ? ' on' : ''}${renamingId === s.id ? ' editing' : ''}`}
                      onClick={() => { if (renamingId !== s.id) switchScene(s.id); }}
                    >
                      {renamingId === s.id ? (
                        <input
                          className="v3-scene-rename"
                          autoFocus
                          value={renameText}
                          maxLength={40}
                          onClick={e => e.stopPropagation()}
                          onChange={e => setRenameText(e.target.value)}
                          onBlur={commitRename}
                          onKeyDown={e => { if (e.key === 'Enter') commitRename(); else if (e.key === 'Escape') setRenamingId(null); }}
                        />
                      ) : (
                        <>
                          <span className="nm" onDoubleClick={e => { e.stopPropagation(); startRename(s.id, s.name); }}>{s.name}</span>
                          <span className="ct">{s.items.length}</span>
                          <span className="edit" role="button" aria-label="Rename" title="Rename" onClick={e => { e.stopPropagation(); startRename(s.id, s.name); }}>✎</span>
                          <span className="dup" role="button" aria-label="Duplicate" title="Duplicate" onClick={e => { e.stopPropagation(); duplicateScene(s.id); }}>⧉</span>
                          {scenes.length > 1 && (
                            <span className="cl" role="button" aria-label="Close" title="Close" onClick={e => { e.stopPropagation(); deleteScene(s.id); }}>✕</span>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" className="v3-scene-menu-new" onClick={newScene}>＋ New scene</button>
              </div>
            )}
          </div>
          <div className="v3-dock-items">
            {scene.length === 0 && <span className="v3-dock-empty">Empty scene — add objects from any lane, or ⧉ duplicate another.</span>}
            {scene.map(id => {
              const item = registry[id];
              if (!item) return null;
              const isChar = item.lane === 'character';
              // Which character chips are tappable right now depends on the link phase.
              const pickFrom = !!linkStep && !linkStep.from && isChar;
              const pickTo = !!linkStep && !!linkStep.from && !!linkStep.action && isChar && id !== linkStep.from;
              const linkable = pickFrom || pickTo;
              const isFrom = linkStep?.from === id;
              const dim = !!linkStep && !linkable && !isFrom;
              return (
                <span
                  key={id}
                  className={`v3-dock-chip${linkable ? ' linkable' : ''}${isFrom ? ' isfrom' : ''}${dim ? ' dim' : ''}`}
                  style={cssVar(item.accent)}
                  onClick={linkable ? () => tapCharForLink(id) : undefined}
                  role={linkable ? 'button' : undefined}
                  title={pickFrom ? `Link from ${item.name}` : pickTo ? `Link to ${item.name}` : undefined}
                >
                  <span className={`sw${item.image ? '' : ' v3-ph'}`} style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}>
                    {!item.image && <LanePlaceholder lane={item.lane} />}
                  </span>
                  <span className="t">{item.name}</span>
                  {!linkStep && <button type="button" className="x" onClick={() => removeFromScene(id)} aria-label="Remove">✕</button>}
                </span>
              );
            })}
          </div>

          {/* actions — what each character is doing (solo or between two), built by tapping */}
          {sceneCharItems.length >= 1 && (
            <div className="v3-dock-actions">
              {interactions.map((x, i) => {
                const from = registry[x.from];
                if (!from) return null;
                const to = x.to ? registry[x.to] : null;
                if (x.to && !to) return null; // dangling pair target
                return (
                  <span key={i} className={`v3-sentence${to ? '' : ' solo'}`} title={`${from.name} ${x.verb}${to ? ` ${to.name}` : ''}`}>
                    <span className="ep">
                      <span className={`sw${from.image ? '' : ' v3-ph'}`} style={from.image ? { backgroundImage: `url(${from.image})` } : undefined}>{!from.image && <LanePlaceholder lane={from.lane} />}</span>
                      <span className="nm">{from.name}</span>
                    </span>
                    <span className="v3-link">
                      <span className="v3-actemb" style={x.cover ? { backgroundImage: `url(${x.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
                        {!x.cover && <ActionEmblem id={x.emblem ?? ''} />}
                      </span>
                      <span className="vb">{x.verb}</span>
                    </span>
                    {to && (
                      <span className="ep">
                        <span className={`sw${to.image ? '' : ' v3-ph'}`} style={to.image ? { backgroundImage: `url(${to.image})` } : undefined}>{!to.image && <LanePlaceholder lane={to.lane} />}</span>
                        <span className="nm">{to.name}</span>
                      </span>
                    )}
                    <button type="button" className="x" onClick={() => removeInteraction(i)} aria-label="Remove">✕</button>
                  </span>
                );
              })}

              {/* guided action builder */}
              {!linkStep ? (
                <button type="button" className="v3-actadd" onClick={startLink} title="Add an action to a character">＋ action</button>
              ) : (
                <div className="v3-linkbar">
                  <div className="v3-linkbar-hd">
                    <span className="v3-linkstep">
                      {!linkStep.from ? (
                        <><b>1</b> Tap a character above</>
                      ) : !linkStep.action ? (
                        <><b>2</b> Pick an action for <em>{registry[linkStep.from]?.name}</em></>
                      ) : (
                        <><b>3</b> Tap who <em>{registry[linkStep.from]?.name} {linkStep.action.verb}</em></>
                      )}
                    </span>
                    <button type="button" className="v3-linkcancel" onClick={cancelLink}>Cancel</button>
                  </div>
                  {/* action picker — pair actions only when a second character exists */}
                  {linkStep.from && !linkStep.action && (
                    <div className="v3-actpick-grid">
                      {pickActions.filter(a => a.solo || sceneCharItems.length >= 2).map(a => (
                        <button type="button" key={a.key} className={`v3-actcard${a.solo ? ' solo' : ''}`} onClick={() => pickLinkAction(a)} title={a.solo ? `${a.label} (solo)` : a.label}>
                          <span className="em" style={a.cover ? { backgroundImage: `url(${a.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
                            {!a.cover && <ActionEmblem id={a.emblem ?? ''} />}
                          </span>
                          <span className="lb">{a.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {scene.length > 0 && (
            <div className="v3-quick-wrap">
              <button type="button" className={`v3-quick-btn${quickOpen ? ' on' : ''}`} onClick={() => setQuickOpen(o => !o)} title="Instant prompt — no AI">⚡ Quick</button>
              {quickOpen && (
                <div className="v3-quick-pop">
                  <div className="v3-quick-hd">
                    <span>Quick prompt <em>instant · no AI</em></span>
                    <button type="button" className="v3-quick-x" onClick={() => setQuickOpen(false)} aria-label="Close">✕</button>
                  </div>
                  <textarea className="v3-quick-text" readOnly rows={4} value={quickPrompt(sceneElements, 'faithful', sceneRelations)} onFocus={e => e.currentTarget.select()} />
                  <div className="v3-quick-acts">
                    <button type="button" className={`v3-btn utility${quickCopied ? ' ok' : ''}`} onClick={copyQuick}>{quickCopied ? '✓ Copied' : '⧉ Copy'}</button>
                    <button type="button" className="v3-btn secondary" onClick={() => { setQuickOpen(false); setFlow('synthesize'); }}>Synthesize instead →</button>
                  </div>
                </div>
              )}
            </div>
          )}
          {scene.length > 0 && (
            <button type="button" className="v3-syn" onClick={() => setFlow('synthesize')}>
              Synthesize ({scene.length})
            </button>
          )}
          </div>
        </div>
      )}

      {composerOpen && viewerAuthUid && (WALL_LANES[lane] || lane === 'characters' || lane === 'actions') && (
        <LaneItemComposer
          lane={lane}
          laneLabel={WALL_LANES[lane]?.label ?? (lane === 'actions' ? 'Actions' : 'Characters')}
          accent={WALL_LANES[lane]?.accent ?? (lane === 'actions' ? 'var(--la-mood)' : 'var(--la-character)')}
          kind={lane === 'characters' ? 'character' : lane === 'actions' ? 'action' : 'object'}
          worlds={worlds}
          viewerName={viewer}
          viewerAuthUid={viewerAuthUid}
          onClose={() => setComposerOpen(false)}
          onCreated={item => { setCreatedLaneItems(prev => [item, ...prev]); setComposerOpen(false); }}
        />
      )}
    </div>
  );
}
