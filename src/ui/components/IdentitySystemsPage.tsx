import { useMemo } from 'react';
import type { CharacterIdentity, CharacterIdentityInput } from '../../types';
import { CharacterLibrarySurface } from './CharacterLibrarySurface';
import './IdentitySystemsPage.css';

type IdentitySystemsPageProps = {
  characters: CharacterIdentity[];
  activeCharacterId: string | null;
  isLoading?: boolean;
  onSelectCharacter: (characterId: string) => void;
  onCreateCharacter: (input: CharacterIdentityInput) => Promise<CharacterIdentity>;
  onUpdateCharacter: (characterId: string, input: CharacterIdentityInput) => Promise<CharacterIdentity>;
  onDeleteCharacter: (characterId: string) => Promise<void>;
  onGoToBuilder?: () => void;
  onGoToPrompts?: () => void;
};

const UPCOMING_LANES = [
  {
    title: 'Outfit Identity',
    description: 'Reusable clothing and wearable continuity that can travel across many workflows without living inside one Character.',
  },
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
  isLoading = false,
  onSelectCharacter,
  onCreateCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
  onGoToBuilder,
  onGoToPrompts,
}: IdentitySystemsPageProps) {
  const activeCharacter = useMemo(
    () => characters.find(character => character.id === activeCharacterId) ?? null,
    [characters, activeCharacterId]
  );
  const legacyCharacterCount = useMemo(
    () => characters.filter(character => character.identity.visualAnchors.length === 0).length,
    [characters]
  );

  return (
    <div className="identity-systems-page">
      <header className="identity-systems-header">
        <div>
          <div className="identity-systems-eyebrow">Reusable continuity realm</div>
          <h2>Identity Systems</h2>
          <p>
            Identity Systems is where reusable continuity entities live in MorpBase. Builder applies them,
            Prompt Preview activates them, and saved prompts remember when they were present.
          </p>
        </div>
        <div className="identity-systems-header-actions">
          {onGoToBuilder && (
            <button
              type="button"
              className="identity-systems-primary-action"
              onClick={onGoToBuilder}
            >
              Open Builder
            </button>
          )}
          {onGoToPrompts && (
            <button
              type="button"
              className="identity-systems-secondary-action"
              onClick={onGoToPrompts}
            >
              Open Prompt Archive
            </button>
          )}
        </div>
      </header>

      <section className="identity-systems-overview">
        <article className="identity-systems-overview-card identity-systems-overview-card-live">
          <div className="identity-systems-overview-label">Live Today</div>
          <h3>Character Identity is the first live lane</h3>
          <p>
            Character Identity is now a real reusable continuity lane. You can create, edit, apply,
            switch, and archive Character-linked outputs without pretending the whole future realm is finished.
          </p>
          <div className="identity-systems-metrics">
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{characters.length}</span>
              <span className="identity-systems-metric-label">Characters</span>
            </div>
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{activeCharacter ? activeCharacter.name : 'None'}</span>
              <span className="identity-systems-metric-label">Active in Builder</span>
            </div>
            <div className="identity-systems-metric">
              <span className="identity-systems-metric-value">{legacyCharacterCount}</span>
              <span className="identity-systems-metric-label">Legacy repairs</span>
            </div>
          </div>
        </article>

        <article className="identity-systems-overview-card">
          <div className="identity-systems-overview-label">System Relationship</div>
          <h3>Builder applies. The realm owns identity.</h3>
          <p>
            Identity Systems stays outside ordinary Builder content. Builder holds live activation state,
            while the realm owns reusable entity life, editing, and continuity structure.
          </p>
        </article>

        <article className="identity-systems-overview-card">
          <div className="identity-systems-overview-label">What Comes Next</div>
          <h3>The realm is bigger than Character</h3>
          <p>
            Character Identity is only the first proving lane. The page below also marks the next likely lanes
            so the realm already reads as a continuity system, not just one isolated feature.
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
            <p>
              Reusable recurring subject identity with workflow application, archive lineage, and a dedicated lane surface.
            </p>
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

      <section className="identity-systems-live-lane">
        <div className="identity-systems-section-heading">
          <div>
            <div className="identity-systems-section-label">Live Lane Surface</div>
            <h3>Character Identity</h3>
          </div>
        </div>
        <CharacterLibrarySurface
          characters={characters}
          activeCharacterId={activeCharacterId}
          isLoading={isLoading}
          onSelectCharacter={onSelectCharacter}
          onCreateCharacter={onCreateCharacter}
          onUpdateCharacter={onUpdateCharacter}
          onDeleteCharacter={onDeleteCharacter}
        />
      </section>
    </div>
  );
}
