import { useMemo } from 'react';
import type { CharacterIdentity, CompositionFrame, EnvironmentIdentity, LightingSetup, MoodPreset, OutfitIdentity, StylePreset } from '../../types';
import './IdentitySystemsPage.css';

type IdentitySystemsPageProps = {
  characters: CharacterIdentity[];
  activeCharacterId: string | null;
  environments: EnvironmentIdentity[];
  activeEnvironmentId: string | null;
  outfits: OutfitIdentity[];
  activeOutfitId: string | null;
  stylePresets: StylePreset[];
  activeStyleId: string | null;
  lightingSetups: LightingSetup[];
  activeLightingId: string | null;
  compositionFrames: CompositionFrame[];
  activeCompositionId: string | null;
  moodPresets: MoodPreset[];
  activeMoodId: string | null;
  onGoToBuilder?: () => void;
  onGoToPrompts?: () => void;
};

const UPCOMING_LANES = [
  {
    title: 'Prop / Artifact Identity',
    description: 'Recurring objects, relics, or signature items that deserve their own continuity outside ordinary workflow sources.',
  },
  {
    title: 'Creature Identity',
    description: 'Reusable non-human continuity for beings that need stable anatomy, motifs, and prompt-level recognition.',
  },
];

export function IdentitySystemsPage({
  characters,
  activeCharacterId,
  environments,
  activeEnvironmentId,
  outfits,
  activeOutfitId,
  stylePresets,
  activeStyleId,
  lightingSetups,
  activeLightingId,
  compositionFrames,
  activeCompositionId,
  moodPresets,
  activeMoodId,
  onGoToBuilder,
  onGoToPrompts,
}: IdentitySystemsPageProps) {
  const activeCharacter = useMemo(
    () => characters.find(c => c.id === activeCharacterId) ?? null,
    [characters, activeCharacterId]
  );
  const activeEnvironment = useMemo(
    () => environments.find(e => e.id === activeEnvironmentId) ?? null,
    [environments, activeEnvironmentId]
  );
  const activeOutfit = useMemo(
    () => outfits.find(o => o.id === activeOutfitId) ?? null,
    [outfits, activeOutfitId]
  );
  const activeStyle = useMemo(
    () => stylePresets.find(s => s.id === activeStyleId) ?? null,
    [stylePresets, activeStyleId]
  );
  const activeLighting = useMemo(
    () => lightingSetups.find(l => l.id === activeLightingId) ?? null,
    [lightingSetups, activeLightingId]
  );
  const activeComposition = useMemo(
    () => compositionFrames.find(c => c.id === activeCompositionId) ?? null,
    [compositionFrames, activeCompositionId]
  );
  const activeMood = useMemo(
    () => moodPresets.find(m => m.id === activeMoodId) ?? null,
    [moodPresets, activeMoodId]
  );

  return (
    <div className="identity-systems-page">
      <header className="identity-systems-header">
        <div>
          <div className="identity-systems-eyebrow">Continuity realm</div>
          <h2>Continuity</h2>
          <p>
            Continuity is where reusable recurring entities live in MorpBase. Workspace applies them,
            Prompt Preview activates them, and Memory remembers when they were present.
          </p>
        </div>
        <div className="identity-systems-header-actions">
          {onGoToBuilder && (
            <button
              type="button"
              className="identity-systems-primary-action"
              onClick={onGoToBuilder}
            >
              Open Workspace
            </button>
          )}
          {onGoToPrompts && (
            <button
              type="button"
              className="identity-systems-secondary-action"
              onClick={onGoToPrompts}
            >
              Open Memory
            </button>
          )}
        </div>
      </header>

      <section className="identity-systems-overview">
        <article className="identity-systems-overview-card identity-systems-overview-card-live">
          <div className="identity-systems-overview-label">Live Today</div>
          <h3>Seven live lanes</h3>
          <p>
            Character, Environment, Wardrobe, Style, Lighting, Composition, and Mood are all live reusable continuity lanes.
            Each can be created, edited, and activated from Workspace.
          </p>
          <div className="identity-systems-metrics">
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{characters.length}</span>
              <span className="identity-systems-metric-label">Characters</span>
            </div>
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{activeCharacter?.name ?? 'None'}</span>
              <span className="identity-systems-metric-label">Active character</span>
            </div>
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{environments.length}</span>
              <span className="identity-systems-metric-label">Environments</span>
            </div>
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{activeEnvironment?.name ?? 'None'}</span>
              <span className="identity-systems-metric-label">Active environment</span>
            </div>
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{outfits.length}</span>
              <span className="identity-systems-metric-label">Outfits</span>
            </div>
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{activeOutfit?.name ?? 'None'}</span>
              <span className="identity-systems-metric-label">Active outfit</span>
            </div>
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{stylePresets.length}</span>
              <span className="identity-systems-metric-label">Style presets</span>
            </div>
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{activeStyle?.name ?? 'None'}</span>
              <span className="identity-systems-metric-label">Active style</span>
            </div>
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{lightingSetups.length}</span>
              <span className="identity-systems-metric-label">Lighting setups</span>
            </div>
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{activeLighting?.name ?? 'None'}</span>
              <span className="identity-systems-metric-label">Active lighting</span>
            </div>
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{compositionFrames.length}</span>
              <span className="identity-systems-metric-label">Composition frames</span>
            </div>
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{activeComposition?.name ?? 'None'}</span>
              <span className="identity-systems-metric-label">Active composition</span>
            </div>
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{moodPresets.length}</span>
              <span className="identity-systems-metric-label">Mood presets</span>
            </div>
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{activeMood?.name ?? 'None'}</span>
              <span className="identity-systems-metric-label">Active mood</span>
            </div>
          </div>
        </article>

        <article className="identity-systems-overview-card">
          <div className="identity-systems-overview-label">System Relationship</div>
          <h3>Workspace applies. This realm owns identity.</h3>
          <p>
            Continuity stays outside ordinary Workspace content. Workspace holds live activation state,
            while this realm owns reusable entity structure, editing, and continuity life.
          </p>
        </article>

        <article className="identity-systems-overview-card">
          <div className="identity-systems-overview-label">What Comes Next</div>
          <h3>The realm grows as the system proves itself</h3>
          <p>
            Seven lanes are live. Each new lane that proves its value opens the next.
            The grid below marks the next likely additions so the realm already reads as a system.
          </p>
        </article>
      </section>

      <section className="identity-systems-lanes">
        <div className="identity-systems-section-heading">
          <div>
            <div className="identity-systems-section-label">Realm Map</div>
            <h3>Lane Status</h3>
          </div>
        </div>
        <div className="identity-systems-lane-grid">
          <article className="identity-systems-lane-card identity-systems-lane-card-live">
            <div className="identity-systems-lane-state">Live Lane</div>
            <div className="identity-systems-lane-title">Character Identity</div>
            <p>Reusable recurring subject identity with workflow application and a dedicated lane surface.</p>
          </article>
          <article className="identity-systems-lane-card identity-systems-lane-card-live">
            <div className="identity-systems-lane-state">Live Lane</div>
            <div className="identity-systems-lane-title">Environment Identity</div>
            <p>Reusable named scenes with core phrases and a light layer. Injects into the prompt from Workspace.</p>
          </article>
          <article className="identity-systems-lane-card identity-systems-lane-card-live">
            <div className="identity-systems-lane-state">Live Lane</div>
            <div className="identity-systems-lane-title">Wardrobe Identity</div>
            <p>Global reusable outfit library. One outfit active at a time — its phrases append alongside the active character.</p>
          </article>
          <article className="identity-systems-lane-card identity-systems-lane-card-live">
            <div className="identity-systems-lane-state">Live Lane</div>
            <div className="identity-systems-lane-title">Style Identity</div>
            <p>Art medium and rendering aesthetic. One preset active at a time — its phrases inject at the end of every prompt.</p>
          </article>
          <article className="identity-systems-lane-card identity-systems-lane-card-live">
            <div className="identity-systems-lane-state">Live Lane</div>
            <div className="identity-systems-lane-title">Lighting Identity</div>
            <p>Named lighting setups. One active at a time — defines light source, shadow character, and mood register.</p>
          </article>
          <article className="identity-systems-lane-card identity-systems-lane-card-live">
            <div className="identity-systems-lane-state">Live Lane</div>
            <div className="identity-systems-lane-title">Composition Identity</div>
            <p>Shot framing and camera angle. One frame active at a time — controls how the subject fills the image.</p>
          </article>
          <article className="identity-systems-lane-card identity-systems-lane-card-live">
            <div className="identity-systems-lane-state">Live Lane</div>
            <div className="identity-systems-lane-title">Mood Identity</div>
            <p>Emotional register and atmosphere. One preset active at a time — sets the feeling the image should carry.</p>
          </article>
          {UPCOMING_LANES.map(lane => (
            <article key={lane.title} className="identity-systems-lane-card">
              <div className="identity-systems-lane-state">Planned</div>
              <div className="identity-systems-lane-title">{lane.title}</div>
              <p>{lane.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
