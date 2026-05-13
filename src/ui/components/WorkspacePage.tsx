import { useCallback, useState } from 'react';
import { InspirationField } from './InspirationField';
import { WallPostComposer } from './wall/WallPostComposer';
import type { WallPostIdentityTag } from '../../types/community';
import './WorkspacePage.css';

type LaneSlotProps = {
  label: string;
  activeItems: { id: string; name: string }[];
  variant: 'character' | 'environment' | 'wardrobe' | 'style' | 'lighting' | 'composition' | 'mood' | 'aura';
  onRemoveItem: (id: string) => void;
  onChoose: () => void;
  locked?: boolean;
  onToggleLock?: () => void;
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
  activeItems,
  variant,
  onRemoveItem,
  onChoose,
  locked = false,
  onToggleLock,
}: LaneSlotProps) {
  const isActive = activeItems.length > 0;

  return (
    <div
      className={`ws-lane-slot ws-lane-slot-${variant}${isActive ? ' ws-lane-slot-active' : ''}${locked ? ' ws-lane-slot-locked' : ''}${onToggleLock ? ' ws-lane-slot-lockable' : ''}`}
      onClick={onToggleLock}
      title={onToggleLock ? (locked ? 'Click to remove from roll' : 'Click to include in roll') : undefined}
      role={onToggleLock ? 'button' : undefined}
    >
      <div className="ws-lane-label">{label}</div>
      {activeItems.length === 0 ? (
        <div className="ws-lane-name"><span className="ws-lane-name-empty">None</span></div>
      ) : (
        <div className="ws-multi-tags">
          {activeItems.map(item => (
            <span key={item.id} className="ws-multi-tag">
              {item.name}
              <button
                type="button"
                className="ws-multi-tag-remove"
                onClick={e => { e.stopPropagation(); onRemoveItem(item.id); }}
              >×</button>
            </span>
          ))}
        </div>
      )}
      <div className="ws-lane-actions" onClick={onToggleLock ? e => e.stopPropagation() : undefined}>
        <button type="button" className="ws-lane-btn ws-lane-btn-choose" onClick={onChoose}>
          {isActive ? '+ Add' : 'Choose'}
        </button>
      </div>
    </div>
  );
}

type WorkspacePageProps = {
  activeChipTexts: string[];
  onChipToggle: (text: string) => void;
  assembledPrompt: string;
  onSavePrompt?: () => void;

  activeCharacterItems: { id: string; name: string }[];
  onChooseCharacter: () => void;
  onRemoveCharacter: (id: string) => void;
  activeInteractionPhrase: { id: string; text: string } | null;
  onChooseInteraction: () => void;
  onRemoveInteraction: () => void;
  onRandomizeInteraction: () => void;

  activeEnvironmentItems: { id: string; name: string }[];
  onChooseEnvironment: () => void;
  onRemoveEnvironment: (id: string) => void;
  worldVariationEnabled: boolean;
  onWorldVariationToggle: () => void;
  onWorldVariationNext: () => void;

  activeOutfitItems: { id: string; name: string }[];
  onChooseWardrobe: () => void;
  onRemoveWardrobe: (id: string) => void;

  activeStyleItems: { id: string; name: string }[];
  onChooseStyle: () => void;
  onRemoveStyle: (id: string) => void;

  activeLightingItems: { id: string; name: string }[];
  onChooseLighting: () => void;
  onRemoveLighting: (id: string) => void;

  activeCompositionItems: { id: string; name: string }[];
  onChooseComposition: () => void;
  onRemoveComposition: (id: string) => void;

  activeMoodItems: { id: string; name: string }[];
  onChooseMood: () => void;
  onRemoveMood: (id: string) => void;

  activeNegativeItems: { id: string; name: string }[];
  assembledNegativePrompt: string;
  onChooseNegative: () => void;
  onRemoveNegative: (id: string) => void;

  activeObjectItems: { id: string; name: string }[];
  onChooseObject: () => void;
  onRemoveObject: (id: string) => void;

  activeWorldName: string | null;
  activeWorldPhrases: string[];
  activeWorldPhraseCount?: number;
  onChooseWorld: () => void;
  onDeactivateWorld?: () => void;
  auraVariationEnabled?: boolean;
  auraVariationMin?: number;
  auraVariationMax?: number;
  onAuraVariationToggle?: () => void;
  onAuraVariationNext?: () => void;
  onAuraVariationMinChange?: (n: number) => void;
  onAuraVariationMaxChange?: (n: number) => void;

  authUid?: string | null;
  userId?: string | null;
  userName?: string | null;
  activeIdentityTags?: WallPostIdentityTag[];
  onRandomize?: () => void;
  lockedLanes?: Set<string>;
  onToggleLaneLock?: (lane: string) => void;
  captureCount?: number;
  captureAutoName?: string;
  onCapture?: () => void;
  onSaveSet?: (name: string) => void;
  onClearCapture?: () => void;
};

export function WorkspacePage({
  activeChipTexts,
  onChipToggle,
  assembledPrompt,
  onSavePrompt,
  activeCharacterItems,
  onChooseCharacter,
  onRemoveCharacter,
  activeInteractionPhrase,
  onChooseInteraction,
  onRemoveInteraction,
  onRandomizeInteraction,
  activeEnvironmentItems,
  onChooseEnvironment,
  onRemoveEnvironment,
  worldVariationEnabled,
  onWorldVariationToggle,
  onWorldVariationNext,
  activeOutfitItems,
  onChooseWardrobe,
  onRemoveWardrobe,
  activeStyleItems,
  onChooseStyle,
  onRemoveStyle,
  activeLightingItems,
  onChooseLighting,
  onRemoveLighting,
  activeCompositionItems,
  onChooseComposition,
  onRemoveComposition,
  activeMoodItems,
  onChooseMood,
  onRemoveMood,
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
  activeWorldPhraseCount = 0,
  auraVariationEnabled = false,
  auraVariationMin = 1,
  auraVariationMax = 3,
  onAuraVariationToggle,
  onAuraVariationNext,
  onAuraVariationMinChange,
  onAuraVariationMaxChange,
  authUid = null,
  userId = null,
  userName = null,
  activeIdentityTags = [],
  onRandomize,
  lockedLanes,
  onToggleLaneLock,
  captureCount = 0,
  captureAutoName = '',
  onCapture,
  onSaveSet,
  onClearCapture,
}: WorkspacePageProps) {
  const [wallComposerOpen, setWallComposerOpen] = useState(false);
  const [saveSetOpen, setSaveSetOpen] = useState(false);
  const [setName, setSetName] = useState('');
  const [savedSetMessage, setSavedSetMessage] = useState<string | null>(null);

  const handleCopy = useCallback(() => {
    if (!assembledPrompt) return;
    void navigator.clipboard.writeText(assembledPrompt);
  }, [assembledPrompt]);

  const handleCopyNegative = useCallback(() => {
    if (!assembledNegativePrompt) return;
    void navigator.clipboard.writeText(assembledNegativePrompt);
  }, [assembledNegativePrompt]);

  // Use the first active character name for InspirationField
  const activeCharacterName = activeCharacterItems[0]?.name ?? null;

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
              {onCapture && (
                <button
                  type="button"
                  className="workspace-action-capture"
                  onClick={onCapture}
                  disabled={!assembledPrompt}
                >
                  {captureCount > 0 ? `+ Capture (${captureCount})` : '+ Capture'}
                </button>
              )}
            </div>

            {captureCount > 0 && onSaveSet && (
              <div className="workspace-capture-bar">
                {!saveSetOpen ? (
                  <>
                    <span className="workspace-capture-count">{captureCount} prompt{captureCount !== 1 ? 's' : ''} captured</span>
                    <button type="button" className="workspace-capture-save-btn" onClick={() => { setSetName(captureAutoName); setSaveSetOpen(true); }}>
                      Save as Set
                    </button>
                    {onClearCapture && (
                      <button type="button" className="workspace-capture-clear-btn" onClick={onClearCapture}>
                        Clear
                      </button>
                    )}
                  </>
                ) : (
                  <div className="workspace-capture-form">
                    <input
                      type="text"
                      className="workspace-capture-name-input"
                      value={setName}
                      onChange={e => setSetName(e.target.value)}
                      placeholder={captureAutoName}
                    />
                    <button
                      type="button"
                      className="workspace-capture-save-btn"
                      onClick={() => {
                        const name = setName || captureAutoName;
                        onSaveSet(name);
                        setSaveSetOpen(false);
                        setSetName('');
                        setSavedSetMessage(`Saved: "${name}"`);
                        setTimeout(() => setSavedSetMessage(null), 3000);
                      }}
                    >
                      Save
                    </button>
                    <button type="button" className="workspace-capture-clear-btn" onClick={() => setSaveSetOpen(false)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {savedSetMessage && (
              <div className="workspace-capture-toast">{savedSetMessage}</div>
            )}

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
            {onRandomize && (
              <div className="ws-randomize-group">
                <span className="ws-randomize-hint">lock to roll →</span>
                <button type="button" className="ws-randomize-btn" onClick={onRandomize} title="Randomize unlocked lanes">
                  ⚄ Randomize
                </button>
              </div>
            )}
          </div>
          <div className="workspace-lane-list">
            <LaneSlot
              label="Character"
              activeItems={activeCharacterItems}
              variant="character"
              onRemoveItem={onRemoveCharacter}
              onChoose={onChooseCharacter}
              locked={lockedLanes?.has('character')}
              onToggleLock={onToggleLaneLock ? () => onToggleLaneLock('character') : undefined}
            />
            {activeCharacterItems.length >= 2 && (
              <div className={`ws-lane-slot ws-lane-slot-interaction${activeInteractionPhrase ? ' ws-lane-slot-active' : ''}`}>
                <div className="ws-lane-label">Dynamics</div>
                {activeInteractionPhrase ? (
                  <div className="ws-lane-name ws-interaction-phrase-preview">{activeInteractionPhrase.text}</div>
                ) : (
                  <div className="ws-lane-name"><span className="ws-lane-name-empty">None</span></div>
                )}
                <div className="ws-lane-actions">
                  <button type="button" className="ws-lane-btn ws-lane-btn-choose" onClick={onRandomizeInteraction}>
                    ⚄ Roll
                  </button>
                  <button type="button" className="ws-lane-btn ws-lane-btn-choose" onClick={onChooseInteraction}>
                    Browse
                  </button>
                  {activeInteractionPhrase && (
                    <button type="button" className="ws-lane-btn" onClick={onRemoveInteraction} title="Clear dynamic">
                      ×
                    </button>
                  )}
                </div>
              </div>
            )}
            <div
              className={`ws-lane-slot ws-lane-slot-environment${activeEnvironmentItems.length > 0 ? ' ws-lane-slot-active' : ''}${lockedLanes?.has('environment') ? ' ws-lane-slot-locked' : ''}${onToggleLaneLock ? ' ws-lane-slot-lockable' : ''}`}
              onClick={onToggleLaneLock ? () => onToggleLaneLock('environment') : undefined}
              title={onToggleLaneLock ? (lockedLanes?.has('environment') ? 'Click to remove from roll' : 'Click to include in roll') : undefined}
              role={onToggleLaneLock ? 'button' : undefined}
            >
              <div className="ws-lane-label">Environment</div>
              {activeEnvironmentItems.length === 0 ? (
                <div className="ws-lane-name"><span className="ws-lane-name-empty">None</span></div>
              ) : (
                <div className="ws-multi-tags">
                  {activeEnvironmentItems.map(item => (
                    <span key={item.id} className="ws-multi-tag">
                      {item.name}
                      <button
                        type="button"
                        className="ws-multi-tag-remove"
                        onClick={e => { e.stopPropagation(); onRemoveEnvironment(item.id); }}
                      >×</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="ws-lane-actions" onClick={onToggleLaneLock ? e => e.stopPropagation() : undefined}>
                <button type="button" className="ws-lane-btn ws-lane-btn-choose" onClick={onChooseEnvironment}>
                  {activeEnvironmentItems.length > 0 ? '+ Add' : 'Choose'}
                </button>
              </div>
              {activeEnvironmentItems.length > 0 && (
                <div className="ws-env-variation" onClick={onToggleLaneLock ? e => e.stopPropagation() : undefined}>
                  <button
                    type="button"
                    className={`ws-env-variation-toggle${worldVariationEnabled ? ' ws-env-variation-toggle--on' : ''}`}
                    onClick={onWorldVariationToggle}
                  >
                    Variation {worldVariationEnabled ? 'On' : 'Off'}
                  </button>
                  {worldVariationEnabled && (
                    <button type="button" className="ws-env-variation-next" onClick={onWorldVariationNext}>→</button>
                  )}
                </div>
              )}
            </div>
            <LaneSlot
              label="Wardrobe"
              activeItems={activeOutfitItems}
              variant="wardrobe"
              onRemoveItem={onRemoveWardrobe}
              onChoose={onChooseWardrobe}
              locked={lockedLanes?.has('wardrobe')}
              onToggleLock={onToggleLaneLock ? () => onToggleLaneLock('wardrobe') : undefined}
            />
            <LaneSlot
              label="Style"
              activeItems={activeStyleItems}
              variant="style"
              onRemoveItem={onRemoveStyle}
              onChoose={onChooseStyle}
              locked={lockedLanes?.has('style')}
              onToggleLock={onToggleLaneLock ? () => onToggleLaneLock('style') : undefined}
            />
            <LaneSlot
              label="Lighting"
              activeItems={activeLightingItems}
              variant="lighting"
              onRemoveItem={onRemoveLighting}
              onChoose={onChooseLighting}
              locked={lockedLanes?.has('lighting')}
              onToggleLock={onToggleLaneLock ? () => onToggleLaneLock('lighting') : undefined}
            />
            <LaneSlot
              label="Composition"
              activeItems={activeCompositionItems}
              variant="composition"
              onRemoveItem={onRemoveComposition}
              onChoose={onChooseComposition}
              locked={lockedLanes?.has('composition')}
              onToggleLock={onToggleLaneLock ? () => onToggleLaneLock('composition') : undefined}
            />
            <LaneSlot
              label="Mood"
              activeItems={activeMoodItems}
              variant="mood"
              onRemoveItem={onRemoveMood}
              onChoose={onChooseMood}
              locked={lockedLanes?.has('mood')}
              onToggleLock={onToggleLaneLock ? () => onToggleLaneLock('mood') : undefined}
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
            <div className={`ws-lane-slot ws-lane-slot-aura${activeWorldName ? ' ws-lane-slot-active' : ''}`}>
              <div className="ws-lane-label">Aura</div>
              <div className="ws-lane-name">{activeWorldName ?? <span className="ws-lane-name-empty">None</span>}</div>
              <div className="ws-lane-actions">
                {activeWorldName && onDeactivateWorld && (
                  <button type="button" className="ws-lane-btn ws-lane-btn-remove" onClick={onDeactivateWorld}>Off</button>
                )}
                <button type="button" className="ws-lane-btn ws-lane-btn-choose" onClick={onChooseWorld}>
                  {activeWorldName ? 'Change' : 'Choose'}
                </button>
              </div>
              {activeWorldName && activeWorldPhraseCount >= 2 && onAuraVariationToggle && (
                <div className="ws-aura-variation">
                  <button
                    type="button"
                    className={`ws-env-variation-toggle${auraVariationEnabled ? ' ws-env-variation-toggle--on' : ''}`}
                    onClick={onAuraVariationToggle}
                  >
                    Variation {auraVariationEnabled ? 'On' : 'Off'}
                  </button>
                  {auraVariationEnabled && (
                    <>
                      <span className="ws-aura-variation-label">pick</span>
                      <input
                        type="number"
                        className="ws-aura-variation-input"
                        min={1}
                        max={activeWorldPhraseCount}
                        value={auraVariationMin}
                        onChange={e => onAuraVariationMinChange?.(Math.max(1, Math.min(activeWorldPhraseCount, Number(e.target.value))))}
                      />
                      <span className="ws-aura-variation-label">–</span>
                      <input
                        type="number"
                        className="ws-aura-variation-input"
                        min={1}
                        max={activeWorldPhraseCount}
                        value={auraVariationMax}
                        onChange={e => onAuraVariationMaxChange?.(Math.max(1, Math.min(activeWorldPhraseCount, Number(e.target.value))))}
                      />
                      <button type="button" className="ws-env-variation-next" onClick={onAuraVariationNext}>→</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
