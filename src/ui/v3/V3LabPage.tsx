import { useEffect, useMemo, useState } from 'react';
import type { CharacterIdentity } from '../../types/characters';
import { CharacterWall } from './CharacterWall';
import { LaneWall } from './LaneWall';
import { LanePlaceholder } from './LanePlaceholder';
import { ItemChannel } from './ItemChannel';
import { SynthesizePanel } from './SynthesizePanel';
import { GeneratePanel } from './GeneratePanel';
import { V3Profile } from './V3Profile';
import type { SynthElement } from './synthesis';
import { SCENERY_ITEMS } from './scenery';
import { OBJECT_ITEMS } from './objects';
import { MOOD_ITEMS } from './mood';
import { LIGHTING_ITEMS } from './lighting';
import { COMPOSITION_ITEMS } from './composition';
import { ENVIRONMENT_ITEMS } from './environment';
import { favoritesStore } from './favoritesStore';
import { UNIVERSES, ALL_UNIVERSES_ID, universeById, universeOfItem } from './universes';
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
  { key: 'scenery', label: 'Scenery', accent: 'var(--la-scenery)', status: 'live', isNew: true },
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

/**
 * v3 workspace — the new main surface. Owns its full chrome (so the legacy app
 * nav is hidden here): a global search bar on top, the UNIVERSE context above
 * the lanes, the LANES as the horizontal main nav (no sidebar), a full-width
 * public thumbnail wall, and a floating scene dock. Community lives inside each
 * item's Channel. Characters is the live lane; the rest are scaffolded.
 */
export function V3LabPage({ characters, viewerName, viewerAvatarUrl, viewerAuthUid, onLogout, onLogin, onEditProfile }: V3LabPageProps) {
  const [universe, setUniverse] = useState<string>(ALL_UNIVERSES_ID);
  const [uniOpen, setUniOpen] = useState(false);
  const [lane, setLane] = useState<string>('characters');
  const [query, setQuery] = useState('');
  const [scene, setScene] = useState<string[]>([]);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => favoritesStore.list());
  const [showProfile, setShowProfile] = useState(false);
  const [flow, setFlow] = useState<'synthesize' | 'generate' | null>(null);
  const [genPrompt, setGenPrompt] = useState('');

  const goWorkspace = () => { setShowProfile(false); setChannelId(null); setFlow(null); };
  const openLane = (key: string) => { setShowProfile(false); setChannelId(null); setFlow(null); setLane(key); };

  const viewer = viewerName?.trim() || 'you';
  const byId = (id: string) => characters.find(c => c.id === id) ?? null;
  const channelChar = channelId ? byId(channelId) : null;
  const activeUniverse = universeById(universe);

  // Unified resolver so the scene (tray, synthesis) can hold items from any lane.
  type SceneItem = { id: string; lane: string; kind: string; name: string; accent: string; tint: number; image: string | null; phrases: string[] };
  const registry = useMemo<Record<string, SceneItem>>(() => {
    const m: Record<string, SceneItem> = {};
    for (const c of characters) {
      m[c.id] = { id: c.id, lane: 'character', kind: 'character', name: c.name, accent: 'var(--la-character)', tint: tintIndex(c.id), image: characterImage(c), phrases: c.phraseBundle?.core ?? [] };
    }
    for (const wl of Object.values(WALL_LANES)) {
      for (const it of wl.items) {
        m[it.id] = { id: it.id, lane: wl.ph, kind: wl.kind, name: it.name, accent: wl.accent, tint: it.tint, image: null, phrases: it.phrases };
      }
    }
    return m;
  }, [characters]);

  const addToScene = (id: string) => setScene(s => (s.includes(id) ? s : [...s, id]));
  const removeFromScene = (id: string) => setScene(s => s.filter(x => x !== id));
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
  const inUniverse = (c: CharacterIdentity) =>
    universe === ALL_UNIVERSES_ID || universeOfItem(c.id) === universe;

  const browseChars = useMemo(
    () => characters.filter(c => inUniverse(c) && matchesQuery(c)),
    [characters, universe, q],
  );
  // Wall lanes (scenery/objects/mood/lighting/composition) share one filtered view.
  // Modifier lanes are universe-agnostic — filter by search only.
  const wallView = useMemo(() => {
    const wl = WALL_LANES[lane];
    if (!wl) return [];
    return wl.items
      .filter(it => !q || it.name.toLowerCase().includes(q) || it.summary.toLowerCase().includes(q))
      .map(it => ({ id: it.id, name: it.name, subtitle: it.summary, tint: it.tint }));
  }, [lane, q]);

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

  return (
    <div className="v3" onClick={() => uniOpen && setUniOpen(false)}>
      {/* ── top bar: brand · universe (above lanes) · global search · profile ── */}
      <header className="v3-topbar">
        <button type="button" className="v3-brand" onClick={goWorkspace} title="Workspace">
          <span className="v3-wordmark"><span className="base">MORPBASE</span><span className="ai">AI</span></span>
        </button>

        <div className="v3-uni" onClick={e => e.stopPropagation()}>
          <button type="button" className="v3-unibtn" onClick={() => setUniOpen(o => !o)}>
            <span className={`v3-uni-dot${activeUniverse ? '' : ' all'}`} style={activeUniverse ? { background: `rgb(${activeUniverse.accent})` } : undefined} />
            <span className="lbl">Universe</span>
            <b>{activeUniverse ? activeUniverse.name : 'All universes'}</b>
            <span className="caret">▾</span>
          </button>
          {uniOpen && (
            <div className="v3-unipop">
              <button type="button" className={`v3-uni-opt${universe === ALL_UNIVERSES_ID ? ' on' : ''}`} onClick={() => { setUniverse(ALL_UNIVERSES_ID); setUniOpen(false); setChannelId(null); }}>
                <span className="v3-uni-dot all" />
                <span className="txt"><span className="n">All universes</span><span className="b">browse the global public pool</span></span>
              </button>
              {UNIVERSES.map(u => (
                <button type="button" key={u.id} className={`v3-uni-opt${universe === u.id ? ' on' : ''}`} onClick={() => { setUniverse(u.id); setUniOpen(false); setChannelId(null); }}>
                  <span className="v3-uni-dot" style={{ background: `rgb(${u.accent})` }} />
                  <span className="txt"><span className="n">{u.name}</span><span className="b">{u.blurb}</span></span>
                </button>
              ))}
              <div className="v3-unipop-foot">A universe sits one level above every lane — it curates all lanes into one coherent world.</div>
            </div>
          )}
        </div>

        <div className="v3-search2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search characters, scenes, creators…" />
        </div>

        <button type="button" className={`v3-userchip${showProfile ? ' active' : ''}`} onClick={() => { setShowProfile(true); setChannelId(null); setFlow(null); }} title="Your profile">
          {viewerAvatarUrl
            ? <img className="av img" src={viewerAvatarUrl} alt={viewer} />
            : <span className="av">{viewer[0]?.toUpperCase() ?? '?'}</span>}
          <span className="nm">{viewer}</span>
        </button>
        {viewerAuthUid
          ? <button type="button" className="v3-authbtn" onClick={onLogout} title="Log out">Log out</button>
          : <button type="button" className="v3-authbtn primary" onClick={onLogin} title="Log in">Log in</button>}
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
            characters={characters}
            favItems={favItems}
            favorites={favorites}
            scene={scene}
            onAdd={addToScene}
            onOpenChannel={setChannelId}
            onToggleFavorite={toggleFavorite}
            isLoggedIn={Boolean(viewerAuthUid)}
            onLogout={onLogout}
            onLogin={onLogin}
            onEditProfile={onEditProfile}
          />
        ) : flow === 'synthesize' ? (
          <SynthesizePanel
            elements={sceneElements}
            onBack={() => setFlow(null)}
            onGenerate={(p) => { setGenPrompt(p); setFlow('generate'); }}
          />
        ) : flow === 'generate' ? (
          <GeneratePanel
            prompt={genPrompt}
            channelTarget={sceneCharacter ? { id: sceneCharacter.id, name: sceneCharacter.name } : null}
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
            onBack={() => setChannelId(null)}
            onAdd={addToScene}
          />
        ) : lane === 'characters' ? (
          <>
            <div className="v3-head">
              <div>
                <div className="v3-eyebrow">{activeUniverse ? activeUniverse.name : 'All universes'} · Characters</div>
                <h2>Characters</h2>
                <div className="v3-sub">
                  {browseChars.length} public character{browseChars.length === 1 ? '' : 's'} {activeUniverse ? `in ${activeUniverse.name}` : 'across every universe'} · favorite the ones you like to reuse them.
                </div>
              </div>
            </div>
            <CharacterWall
              characters={browseChars}
              selectedIds={scene}
              favorites={favorites}
              onAdd={addToScene}
              onOpenChannel={setChannelId}
              onToggleFavorite={toggleFavorite}
              emptyHint={q ? 'No characters match your search.' : 'No characters in this universe yet.'}
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
            </div>
            <LaneWall
              items={wallView}
              accent={WALL_LANES[lane].accent}
              badge={WALL_LANES[lane].badge}
              lane={WALL_LANES[lane].ph}
              selectedIds={scene}
              favorites={favorites}
              onAdd={addToScene}
              onToggleFavorite={toggleFavorite}
              emptyHint={q ? `No ${WALL_LANES[lane].label.toLowerCase()} matches your search.` : `No ${WALL_LANES[lane].label.toLowerCase()} yet.`}
            />
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
              onToggleFavorite={toggleFavorite}
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
      {scene.length > 0 && !channelChar && !showProfile && !flow && (
        <div className="v3-dock">
          <span className="v3-eyebrow dock-lbl">Your scene</span>
          <div className="v3-dock-items">
            {scene.map(id => {
              const item = registry[id];
              if (!item) return null;
              return (
                <span key={id} className="v3-dock-chip" style={cssVar(item.accent)}>
                  <span className={`sw${item.image ? '' : ' v3-ph'}`} style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}>
                    {!item.image && <LanePlaceholder lane={item.lane} />}
                  </span>
                  <span className="t">{item.name}</span>
                  <button type="button" className="x" onClick={() => removeFromScene(id)} aria-label="Remove">✕</button>
                </span>
              );
            })}
          </div>
          <button type="button" className="v3-syn" onClick={() => setFlow('synthesize')}>
            Synthesize ({scene.length})
          </button>
        </div>
      )}
    </div>
  );
}
