import { useCallback, useState } from 'react';
import { InspirationField } from './InspirationField';
import { WallPostComposer } from './wall/WallPostComposer';
import { WorldStatePanel } from './WorldStatePanel';
import type { WallPostIdentityTag } from '../../types/community';
import './WorkspacePage.css';

type LaneSlotProps = {
  label: string;
  activeName: string | null;
  variant: 'character' | 'environment' | 'wardrobe' | 'style' | 'lighting' | 'composition' | 'mood' | 'aura';
  inPrompt?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  onChoose: () => void;
  onDeactivate?: () => void;
};

type MultiLaneSlotProps = {
  label: string;
  variant: 'negative' | 'object';
  items: { id: string; name: string }[];
  onChoose: () => void;
  onRemove: (id: string) => void;
};

function MultiLaneSlot({ label, variant, items, onChoose, onRemove }: MultiLaneSlotProps) {
  return (
    <div className={`ws-lane-slot ws-lane-slot-${variant}${items.length > 0 ? ' ws-lane-slot-active' : ''}`}>
      <div className="ws-lane-label">{label}</div>
      {items.length === 0 ? (
        <div className="ws-lane-name"><span className="ws-lane-name-empty">None</span></div>
      ) : (
        <div className="ws-multi-tags">
          {items.map(item => (
            <span key={item.id} className="ws-multi-tag">
              {item.name}
              <button
                type="button"
                className="ws-multi-tag-remove"
                onClick={() => onRemove(item.id)}
                title={`Remove ${item.name}`}
              >×</button>
            </span>
          ))}
        </div>
      )}
      <div className="ws-lane-actions">
        <button type="button" className="ws-lane-btn ws-lane-btn-choose" onClick={onChoose}>
          {items.length > 0 ? '+ Add' : 'Choose'}
        </button>
      </div>
    </div>
  );
}

function LaneSlot({
  label,
  activeName,
  variant,
  inPrompt,
  onAdd,
  onRemove,
  onChoose,
  onDeactivate,
}: LaneSlotProps) {
  const hasTwoStep = onAdd !== undefined || onRemove !== undefined;
  const isActiveInPrompt = hasTwoStep ? inPrompt : Boolean(activeName);

  return (
    <div className={`ws-lane-slot ws-lane-slot-${variant}${isActiveInPrompt ? ' ws-lane-slot-active' : ''}`}>
      <div className="ws-lane-label">{label}</div>
      <div className="ws-lane-name">{activeName ?? <span className="ws-lane-name-empty">None</span>}</div>
      <div className="ws-lane-actions">
        {hasTwoStep ? (
          <>
            {activeName && !inPrompt && onAdd && (
              <button type="button" className="ws-lane-btn ws-lane-btn-add" onClick={onAdd}>
                Add
              </button>
            )}
            {inPrompt && onRemove && (
              <button type="button" className="ws-lane-btn ws-lane-btn-remove" onClick={onRemove}>
                Remove
              </button>
            )}
            <button type="button" className="ws-lane-btn ws-lane-btn-choose" onClick={onChoose}>
              {activeName ? 'Change' : 'Choose'}
            </button>
          </>
        ) : (
          <>
            {activeName && onDeactivate && (
              <button type="button" className="ws-lane-btn ws-lane-btn-remove" onClick={onDeactivate}>
                Off
              </button>
            )}
            <button type="button" className="ws-lane-btn ws-lane-btn-choose" onClick={onChoose}>
              {activeName ? 'Change' : 'Choose'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

type WorkspacePageProps = {
  activeChipTexts: string[];
  onChipToggle: (text: string) => void;
  assembledPrompt: string;
  onSavePrompt?: () => void;

  activeCharacterName: string | null;
  onChooseCharacter: () => void;
  onDeactivateCharacter?: () => void;

  activeEnvironmentName: string | null;
  environmentInPrompt: boolean;
  onChooseEnvironment: () => void;
  onAddEnvironment?: () => void;
  onRemoveEnvironment?: () => void;
  worldVariationEnabled: boolean;
  onWorldVariationToggle: () => void;
  onWorldVariationNext: () => void;

  activeOutfitName: string | null;
  onChooseWardrobe: () => void;
  onDeactivateWardrobe?: () => void;

  activeStyleName: string | null;
  onChooseStyle: () => void;
  onDeactivateStyle?: () => void;

  activeLightingName: string | null;
  onChooseLighting: () => void;
  onDeactivateLighting?: () => void;

  activeCompositionName: string | null;
  onChooseComposition: () => void;
  onDeactivateComposition?: () => void;

  activeMoodName: string | null;
  onChooseMood: () => void;
  onDeactivateMood?: () => void;

  activeNegativeItems: { id: string; name: string }[];
  assembledNegativePrompt: string;
  onChooseNegative: () => void;
  onRemoveNegative: (id: string) => void;

  activeObjectItems: { id: string; name: string }[];
  onChooseObject: () => void;
  onRemoveObject: (id: string) => void;

  activeWorldName: string | null;
  activeWorldPhrases: string[];
  onChooseWorld: () => void;
  onDeactivateWorld?: () => void;

  authUid?: string | null;
  userId?: string | null;
  userName?: string | null;
  activeIdentityTags?: WallPostIdentityTag[];
};

export function WorkspacePage({
  activeChipTexts,
  onChipToggle,
  assembledPrompt,
  onSavePrompt,
  activeCharacterName,
  onChooseCharacter,
  onDeactivateCharacter,
  activeEnvironmentName,
  environmentInPrompt,
  onChooseEnvironment,
  onAddEnvironment,
  onRemoveEnvironment,
  worldVariationEnabled,
  onWorldVariationToggle,
  onWorldVariationNext,
  activeOutfitName,
  onChooseWardrobe,
  onDeactivateWardrobe,
  activeStyleName,
  onChooseStyle,
  onDeactivateStyle,
  activeLightingName,
  onChooseLighting,
  onDeactivateLighting,
  activeCompositionName,
  onChooseComposition,
  onDeactivateComposition,
  activeMoodName,
  onChooseMood,
  onDeactivateMood,
  activeNegativeItems,
  assembledNegativePrompt,
  onChooseNegative,
  onRemoveNegative,
  activeObjectItems,
  onChooseObject,
  onRemoveObject,
  activeWorldName,
  activeWorldPhrases,
  onChooseWorld,
  onDeactivateWorld,
  authUid = null,
  userId = null,
  userName = null,
  activeIdentityTags = [],
}: WorkspacePageProps) {
  const [wallComposerOpen, setWallComposerOpen] = useState(false);

  const handleCopy = useCallback(() => {
    if (!assembledPrompt) return;
    void navigator.clipboard.writeText(assembledPrompt);
  }, [assembledPrompt]);

  const handleCopyNegative = useCallback(() => {
    if (!assembledNegativePrompt) return;
    void navigator.clipboard.writeText(assembledNegativePrompt);
  }, [assembledNegativePrompt]);

  return (
    <div className="workspace-page">
      <div className="workspace-body">

        {/* Left column: output */}
        <div className="workspace-main">
          <div className="workspace-main-inner">
          <div className="workspace-field workspace-field-grow">
            <div className="workspace-field-label">Assembled Prompt</div>
            <div className="workspace-output">
              {assembledPrompt ? (
                <p className="workspace-output-text">{assembledPrompt}</p>
              ) : (
                <p className="workspace-output-empty">
                  Select starting points or activate an identity lane to build your prompt.
                </p>
              )}
            </div>
            <div className="workspace-output-actions">
              <button
                type="button"
                className="workspace-action-primary"
                onClick={handleCopy}
                disabled={!assembledPrompt}
              >
                Copy Prompt
              </button>
              {onSavePrompt && (
                <button
                  type="button"
                  className="workspace-action-secondary"
                  onClick={onSavePrompt}
                  disabled={!assembledPrompt}
                >
                  Save to Memory
                </button>
              )}
              {authUid && userId && userName && assembledPrompt && !wallComposerOpen && (
                <button
                  type="button"
                  className="workspace-action-wall"
                  onClick={() => setWallComposerOpen(true)}
                >
                  Post to Wall
                </button>
              )}
            </div>

            {wallComposerOpen && authUid && userId && userName && (
              <WallPostComposer
                authUid={authUid}
                userId={userId}
                userName={userName}
                availableIdentityTags={activeIdentityTags}
                promptText={assembledPrompt}
                onPosted={() => setWallComposerOpen(false)}
                onCancel={() => setWallComposerOpen(false)}
                compact
              />
            )}
          </div>

          <div className="workspace-field">
            <div className="workspace-field-label workspace-field-label-negative">Negative Prompt</div>
            <div className={`workspace-output workspace-output-negative${assembledNegativePrompt ? ' workspace-output-negative-active' : ''}`}>
              {assembledNegativePrompt ? (
                <p className="workspace-output-text">{assembledNegativePrompt}</p>
              ) : (
                <p className="workspace-output-empty">
                  Activate a negative preset to populate the exclusion list.
                </p>
              )}
            </div>
            <div className="workspace-output-actions">
              <button
                type="button"
                className="workspace-action-negative"
                onClick={handleCopyNegative}
                disabled={!assembledNegativePrompt}
              >
                Copy Negative
              </button>
            </div>
          </div>

          </div>
        </div>

        {/* Middle column: inspiration field */}
        <div className="workspace-inspiration">
          <InspirationField
            activeCharacterName={activeCharacterName}
            worldPhrases={activeWorldPhrases}
            activeTexts={activeChipTexts}
            onChipToggle={onChipToggle}
          />
        </div>

        {/* Right column: identity lane panel */}
        <aside className="workspace-panel">
          <div className="workspace-panel-header">
            <span className="workspace-panel-title">Identities</span>
          </div>
          <div className="workspace-lane-list">
            <LaneSlot
              label="Character"
              activeName={activeCharacterName}
              variant="character"
              onChoose={onChooseCharacter}
              onDeactivate={onDeactivateCharacter}
            />
            <LaneSlot
              label="Environment"
              activeName={activeEnvironmentName}
              variant="environment"
              inPrompt={environmentInPrompt}
              onAdd={onAddEnvironment}
              onRemove={onRemoveEnvironment}
              onChoose={onChooseEnvironment}
            />
            {environmentInPrompt && (
              <WorldStatePanel enabled={worldVariationEnabled} onToggle={onWorldVariationToggle} onNext={onWorldVariationNext} />
            )}
            <LaneSlot
              label="Wardrobe"
              activeName={activeOutfitName}
              variant="wardrobe"
              onChoose={onChooseWardrobe}
              onDeactivate={onDeactivateWardrobe}
            />
            <LaneSlot
              label="Style"
              activeName={activeStyleName}
              variant="style"
              onChoose={onChooseStyle}
              onDeactivate={onDeactivateStyle}
            />
            <LaneSlot
              label="Lighting"
              activeName={activeLightingName}
              variant="lighting"
              onChoose={onChooseLighting}
              onDeactivate={onDeactivateLighting}
            />
            <LaneSlot
              label="Composition"
              activeName={activeCompositionName}
              variant="composition"
              onChoose={onChooseComposition}
              onDeactivate={onDeactivateComposition}
            />
            <LaneSlot
              label="Mood"
              activeName={activeMoodName}
              variant="mood"
              onChoose={onChooseMood}
              onDeactivate={onDeactivateMood}
            />
            <div className="ws-lane-divider" />
            <MultiLaneSlot
              label="Objects"
              variant="object"
              items={activeObjectItems}
              onChoose={onChooseObject}
              onRemove={onRemoveObject}
            />
            <MultiLaneSlot
              label="Negative"
              variant="negative"
              items={activeNegativeItems}
              onChoose={onChooseNegative}
              onRemove={onRemoveNegative}
            />
            <div className="ws-lane-divider" />
            <LaneSlot
              label="Aura"
              activeName={activeWorldName}
              variant="aura"
              onChoose={onChooseWorld}
              onDeactivate={onDeactivateWorld}
            />
          </div>
        </aside>

      </div>
    </div>
  );
}
