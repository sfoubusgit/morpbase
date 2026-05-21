import { useCallback, useEffect, useRef, useState } from 'react';
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
  entryPoint?: boolean;
  pinnedItems?: Set<string>;
  onTogglePin?: (id: string) => void;
};

type MultiLaneSlotProps = {
  label: string;
  variant: 'negative' | 'object';
  items: { id: string; name: string }[];
  onChoose: () => void;
  onRemove: (id: string) => void;
  pinnedItems?: Set<string>;
  onTogglePin?: (id: string) => void;
};

function MultiLaneSlot({ label, variant, items, onChoose, onRemove, pinnedItems, onTogglePin }: MultiLaneSlotProps) {
  return (
    <div className={`ws-lane-slot ws-lane-slot-${variant}${items.length > 0 ? ' ws-lane-slot-active' : ''}`}>
      <div className="ws-lane-label">{label}</div>
      <div className="ws-multi-tags">
        {items.map(item => (
          <span key={item.id} className={`ws-multi-tag${pinnedItems?.has(item.id) ? ' ws-multi-tag--pinned' : ''}`}>
            {onTogglePin && (
              <button
                type="button"
                className="ws-multi-tag-pin"
                onClick={e => { e.stopPropagation(); onTogglePin(item.id); }}
                title={pinnedItems?.has(item.id) ? 'Unpin — allow this to be rolled' : 'Pin — keep this when rolling'}
              >{pinnedItems?.has(item.id) ? '●' : '○'}</button>
            )}
            {item.name}
            <button
              type="button"
              className="ws-multi-tag-remove"
              onClick={() => onRemove(item.id)}
              title={`Remove ${item.name}`}
            >×</button>
          </span>
        ))}
        <button
          type="button"
          className={`ws-multi-tag-add${items.length === 0 ? ' ws-multi-tag-add-empty' : ''}`}
          onClick={onChoose}
          title={items.length > 0 ? 'Add another' : 'Choose'}
        >
          {items.length > 0 ? '+' : '+ Add'}
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
  entryPoint = false,
  pinnedItems,
  onTogglePin,
}: LaneSlotProps) {
  const isActive = activeItems.length > 0;

  return (
    <div
      className={`ws-lane-slot ws-lane-slot-${variant}${isActive ? ' ws-lane-slot-active' : ''}${locked ? ' ws-lane-slot-locked' : ''}${onToggleLock ? ' ws-lane-slot-lockable' : ''}${entryPoint ? ' ws-lane-slot-entry' : ''}`}
      onClick={onToggleLock}
      title={onToggleLock ? (locked ? 'Click to remove from roll' : 'Click to include in roll') : undefined}
      role={onToggleLock ? 'button' : undefined}
    >
      <div className="ws-lane-label">{label}</div>
      {entryPoint && (
        <div className="ws-lane-entry-hint">Start here — who's in your scene?</div>
      )}
      <div className="ws-multi-tags">
        {activeItems.map(item => (
          <span key={item.id} className={`ws-multi-tag${pinnedItems?.has(item.id) ? ' ws-multi-tag--pinned' : ''}`}>
            {onTogglePin && (
              <button
                type="button"
                className="ws-multi-tag-pin"
                onClick={e => { e.stopPropagation(); onTogglePin(item.id); }}
                title={pinnedItems?.has(item.id) ? 'Unpin — allow this to be rolled' : 'Pin — keep this when rolling'}
              >{pinnedItems?.has(item.id) ? '●' : '○'}</button>
            )}
            {item.name}
            <button
              type="button"
              className="ws-multi-tag-remove"
              onClick={e => { e.stopPropagation(); onRemoveItem(item.id); }}
            >×</button>
          </span>
        ))}
        <button
          type="button"
          className={`ws-multi-tag-add${!isActive ? ' ws-multi-tag-add-empty' : ''}`}
          onClick={e => { e.stopPropagation(); onChoose(); }}
          title={isActive ? 'Add another' : 'Choose'}
        >
          {isActive ? '+' : '+ Add'}
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
  onOpenLaneSets?: () => void;
  onOpenUniverses?: () => void;
  activeUniverseName?: string | null;
  onDeactivateUniverse?: () => void;
  lockedLanes?: Set<string>;
  onToggleLaneLock?: (lane: string) => void;
  pinnedItems?: Set<string>;
  onTogglePin?: (id: string) => void;
  captureCount?: number;
  captureAutoName?: string;
  onCapture?: () => void;
  onSaveSet?: (name: string) => void;
  onClearCapture?: () => void;
  editedPrompt?: string | null;
  onEditPrompt?: (v: string | null) => void;
  onClearAllLanes?: () => void;
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
  onOpenLaneSets,
  onOpenUniverses,
  activeUniverseName,
  onDeactivateUniverse,
  lockedLanes,
  onToggleLaneLock,
  pinnedItems,
  onTogglePin,
  captureCount = 0,
  captureAutoName = '',
  onCapture,
  onSaveSet,
  onClearCapture,
  editedPrompt = null,
  onEditPrompt,
  onClearAllLanes,
}: WorkspacePageProps) {
  const [wallComposerOpen, setWallComposerOpen] = useState(false);
  const [saveSetOpen, setSaveSetOpen] = useState(false);
  const [setName, setSetName] = useState('');
  const [savedSetMessage, setSavedSetMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [dynamicsAnnounced, setDynamicsAnnounced] = useState(false);
  const prevCharCountRef = useRef(activeCharacterItems.length);

  useEffect(() => {
    const prev = prevCharCountRef.current;
    const curr = activeCharacterItems.length;
    prevCharCountRef.current = curr;
    if (prev < 2 && curr >= 2) {
      const seen = localStorage.getItem('morpbase:dynamics:announced');
      if (!seen) {
        localStorage.setItem('morpbase:dynamics:announced', 'true');
        setDynamicsAnnounced(true);
        setTimeout(() => setDynamicsAnnounced(false), 4000);
      }
    }
  }, [activeCharacterItems.length]);

  const displayPrompt = editedPrompt ?? assembledPrompt;
  const isEdited = editedPrompt !== null && editedPrompt !== undefined;

  const handleStartEdit = useCallback(() => {
    setEditValue(displayPrompt);
    setIsEditing(true);
  }, [displayPrompt]);

  const handleDoneEdit = useCallback(() => {
    onEditPrompt?.(editValue);
    setIsEditing(false);
  }, [editValue, onEditPrompt]);

  const handleResetEdit = useCallback(() => {
    onEditPrompt?.(null);
    setIsEditing(false);
  }, [onEditPrompt]);

  const handleCopy = useCallback(() => {
    if (!displayPrompt) return;
    void navigator.clipboard.writeText(displayPrompt);
  }, [displayPrompt]);

  const handleCopyNegative = useCallback(() => {
    if (!assembledNegativePrompt) return;
    void navigator.clipboard.writeText(assembledNegativePrompt);
  }, [assembledNegativePrompt]);

  const activeCharacterName = activeCharacterItems[0]?.name ?? null;

  const hasAnyActiveLane =
    activeCharacterItems.length > 0 ||
    activeInteractionPhrase !== null ||
    activeEnvironmentItems.length > 0 ||
    activeOutfitItems.length > 0 ||
    activeStyleItems.length > 0 ||
    activeLightingItems.length > 0 ||
    activeCompositionItems.length > 0 ||
    activeMoodItems.length > 0 ||
    activeNegativeItems.length > 0 ||
    activeObjectItems.length > 0 ||
    activeWorldName !== null;

  return (
    <div className="workspace-page">
      <div className="workspace-body">

        {/* Left column: output */}
        <div className="workspace-main">
          <div className="workspace-main-inner">
          <div className="workspace-field workspace-field-grow">
            <div className="workspace-field-label">
              Assembled Prompt
              {isEdited && !isEditing && <span className="ws-edited-badge">edited</span>}
            </div>
            <div className={`workspace-output${isEditing ? ' workspace-output--editing' : ''}`}>
              {isEditing ? (
                <textarea
                  className="workspace-edit-textarea"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  autoFocus
                />
              ) : displayPrompt ? (
                <p className="workspace-output-text">{displayPrompt}</p>
              ) : (
                <p className="workspace-output-empty">
                  Select starting points or activate an identity lane to build your prompt.
                </p>
              )}
            </div>
            <div className="workspace-output-actions">
              {isEditing ? (
                <>
                  <button type="button" className="workspace-action-primary" onClick={handleDoneEdit}>
                    Done
                  </button>
                  <button type="button" className="workspace-action-secondary" onClick={handleResetEdit}>
                    Reset to Generated
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="workspace-action-primary"
                    onClick={handleCopy}
                    disabled={!displayPrompt}
                  >
                    Copy Prompt
                  </button>
                  {onSavePrompt && (
                    <button
                      type="button"
                      className="workspace-action-secondary"
                      onClick={onSavePrompt}
                      disabled={!displayPrompt}
                    >
                      Save to Memory
                    </button>
                  )}
                  {authUid && userId && userName && displayPrompt && !wallComposerOpen && (
                    <button
                      type="button"
                      className="workspace-action-wall"
                      onClick={() => setWallComposerOpen(true)}
                    >
                      Post to Wall
                    </button>
                  )}
                  {onEditPrompt && (
                    <button
                      type="button"
                      className="workspace-action-edit"
                      onClick={handleStartEdit}
                      disabled={!displayPrompt}
                      title="Free-edit the prompt"
                    >
                      ✎ Edit
                    </button>
                  )}
                </>
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
            <div className="ws-panel-header-top">
              <span className="workspace-panel-title">Identities</span>
              <div className="ws-panel-header-pickers">
                {onOpenLaneSets && (
                  <button type="button" className="ws-lane-sets-btn" onClick={onOpenLaneSets} title="Browse Lane Sets">
                    ☰ Sets
                  </button>
                )}
                {onOpenUniverses && (
                  <button
                    type="button"
                    className={`ws-universes-btn${activeUniverseName ? ' ws-universes-btn-active' : ''}`}
                    onClick={onOpenUniverses}
                    title="Browse Universes"
                  >
                    ◈ Universes
                  </button>
                )}
              </div>
            </div>
            {(onClearAllLanes || onRandomize || onCapture) && (
              <div className="ws-panel-header-bottom">
                <div className="ws-panel-header-actions">
                  {onClearAllLanes && (
                    <button
                      type="button"
                      className="ws-clear-lanes-btn"
                      onClick={onClearAllLanes}
                      disabled={!hasAnyActiveLane}
                      title="Clear all lanes"
                    >
                      Clear All
                    </button>
                  )}
                  {onCapture && (
                    <button
                      type="button"
                      className="ws-capture-btn"
                      onClick={onCapture}
                      disabled={!displayPrompt}
                      title="Capture the current prompt into a Set"
                    >
                      {captureCount > 0 ? `+ Capture (${captureCount})` : '+ Capture'}
                    </button>
                  )}
                </div>
                {onRandomize && (
                  <div className="ws-randomize-wrap">
                    <button
                      type="button"
                      className="ws-randomize-btn"
                      onClick={onRandomize}
                      title={lockedLanes && lockedLanes.size > 0 ? `Rolling ${lockedLanes.size} targeted lane${lockedLanes.size === 1 ? '' : 's'}` : 'Click any lane to target it for rolling'}
                    >
                      {lockedLanes && lockedLanes.size > 0
                        ? `⚄ Roll ${lockedLanes.size} Lane${lockedLanes.size === 1 ? '' : 's'}`
                        : '⚄ Roll All'}
                    </button>
                    <div className="ws-roll-hint">
                      {lockedLanes && lockedLanes.size > 0
                        ? `${lockedLanes.size} lane${lockedLanes.size === 1 ? '' : 's'} targeted`
                        : 'click a lane to target it'}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {activeUniverseName && (
            <div className="ws-universe-indicator">
              <span className="ws-universe-indicator-dot" />
              <span className="ws-universe-indicator-name">{activeUniverseName}</span>
              {onDeactivateUniverse && (
                <button
                  type="button"
                  className="ws-universe-indicator-exit"
                  onClick={onDeactivateUniverse}
                  title="Deactivate universe"
                >
                  ×
                </button>
              )}
            </div>
          )}

          <div className="workspace-lane-list">
            <LaneSlot
              label="Character"
              activeItems={activeCharacterItems}
              variant="character"
              onRemoveItem={onRemoveCharacter}
              onChoose={onChooseCharacter}
              locked={lockedLanes?.has('character')}
              onToggleLock={onToggleLaneLock ? () => onToggleLaneLock('character') : undefined}
              entryPoint={!hasAnyActiveLane}
              pinnedItems={pinnedItems}
              onTogglePin={onTogglePin}
            />
            {(() => {
              const needsMoreChars = activeCharacterItems.length < 2;
              return (
                <div
                  className={`ws-lane-slot ws-lane-slot-interaction${activeInteractionPhrase && !needsMoreChars ? ' ws-lane-slot-active' : ''}${needsMoreChars ? ' ws-lane-slot-inactive' : ''}${lockedLanes?.has('dynamics') ? ' ws-lane-slot-locked' : ''}${onToggleLaneLock && !needsMoreChars ? ' ws-lane-slot-lockable' : ''}${dynamicsAnnounced ? ' ws-lane-slot-dynamics-announced' : ''}`}
                  onClick={onToggleLaneLock && !needsMoreChars ? () => onToggleLaneLock('dynamics') : undefined}
                  role={onToggleLaneLock && !needsMoreChars ? 'button' : undefined}
                  title={onToggleLaneLock && !needsMoreChars ? (lockedLanes?.has('dynamics') ? 'Click to remove from roll' : 'Click to include in roll') : undefined}
                >
                  <div className="ws-lane-label">
                    Dynamics
                    {dynamicsAnnounced && (
                      <span className="ws-dynamics-unlocked-badge">unlocked</span>
                    )}
                  </div>
                  {needsMoreChars ? (
                    <div className="ws-lane-name"><span className="ws-lane-name-empty">Needs 2+ characters</span></div>
                  ) : activeInteractionPhrase ? (
                    <div className="ws-lane-name ws-interaction-phrase-preview">{activeInteractionPhrase.text}</div>
                  ) : (
                    <div className="ws-lane-name"><span className="ws-lane-name-empty">None</span></div>
                  )}
                  {!needsMoreChars && (
                    <div className="ws-lane-actions" onClick={onToggleLaneLock ? e => e.stopPropagation() : undefined}>
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
                  )}
                </div>
              );
            })()}
            <div
              className={`ws-lane-slot ws-lane-slot-environment${activeEnvironmentItems.length > 0 ? ' ws-lane-slot-active' : ''}${lockedLanes?.has('environment') ? ' ws-lane-slot-locked' : ''}${onToggleLaneLock ? ' ws-lane-slot-lockable' : ''}`}
              onClick={onToggleLaneLock ? () => onToggleLaneLock('environment') : undefined}
              title={onToggleLaneLock ? (lockedLanes?.has('environment') ? 'Click to remove from roll' : 'Click to include in roll') : undefined}
              role={onToggleLaneLock ? 'button' : undefined}
            >
              <div className="ws-lane-label">Environment</div>
              <div className="ws-multi-tags">
                {activeEnvironmentItems.map(item => (
                  <span key={item.id} className={`ws-multi-tag${pinnedItems?.has(item.id) ? ' ws-multi-tag--pinned' : ''}`}>
                    {onTogglePin && (
                      <button
                        type="button"
                        className="ws-multi-tag-pin"
                        onClick={e => { e.stopPropagation(); onTogglePin(item.id); }}
                        title={pinnedItems?.has(item.id) ? 'Unpin — allow this to be rolled' : 'Pin — keep this when rolling'}
                      >{pinnedItems?.has(item.id) ? '●' : '○'}</button>
                    )}
                    {item.name}
                    <button
                      type="button"
                      className="ws-multi-tag-remove"
                      onClick={e => { e.stopPropagation(); onRemoveEnvironment(item.id); }}
                    >×</button>
                  </span>
                ))}
                <button
                  type="button"
                  className={`ws-multi-tag-add${activeEnvironmentItems.length === 0 ? ' ws-multi-tag-add-empty' : ''}`}
                  onClick={e => { e.stopPropagation(); onChooseEnvironment(); }}
                  title={activeEnvironmentItems.length > 0 ? 'Add another' : 'Choose'}
                >
                  {activeEnvironmentItems.length > 0 ? '+' : '+ Add'}
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
              pinnedItems={pinnedItems}
              onTogglePin={onTogglePin}
            />
            <LaneSlot
              label="Style"
              activeItems={activeStyleItems}
              variant="style"
              onRemoveItem={onRemoveStyle}
              onChoose={onChooseStyle}
              locked={lockedLanes?.has('style')}
              onToggleLock={onToggleLaneLock ? () => onToggleLaneLock('style') : undefined}
              pinnedItems={pinnedItems}
              onTogglePin={onTogglePin}
            />
            <LaneSlot
              label="Lighting"
              activeItems={activeLightingItems}
              variant="lighting"
              onRemoveItem={onRemoveLighting}
              onChoose={onChooseLighting}
              locked={lockedLanes?.has('lighting')}
              onToggleLock={onToggleLaneLock ? () => onToggleLaneLock('lighting') : undefined}
              pinnedItems={pinnedItems}
              onTogglePin={onTogglePin}
            />
            <LaneSlot
              label="Composition"
              activeItems={activeCompositionItems}
              variant="composition"
              onRemoveItem={onRemoveComposition}
              onChoose={onChooseComposition}
              locked={lockedLanes?.has('composition')}
              onToggleLock={onToggleLaneLock ? () => onToggleLaneLock('composition') : undefined}
              pinnedItems={pinnedItems}
              onTogglePin={onTogglePin}
            />
            <LaneSlot
              label="Mood"
              activeItems={activeMoodItems}
              variant="mood"
              onRemoveItem={onRemoveMood}
              onChoose={onChooseMood}
              locked={lockedLanes?.has('mood')}
              onToggleLock={onToggleLaneLock ? () => onToggleLaneLock('mood') : undefined}
              pinnedItems={pinnedItems}
              onTogglePin={onTogglePin}
            />
            <div className="ws-lane-divider" />
            <MultiLaneSlot
              label="Objects"
              variant="object"
              items={activeObjectItems}
              onChoose={onChooseObject}
              onRemove={onRemoveObject}
              pinnedItems={pinnedItems}
              onTogglePin={onTogglePin}
            />
            <MultiLaneSlot
              label="Negative"
              variant="negative"
              items={activeNegativeItems}
              onChoose={onChooseNegative}
              onRemove={onRemoveNegative}
            />
            <div className="ws-lane-divider" />
            <div
              className={`ws-lane-slot ws-lane-slot-aura${activeWorldName ? ' ws-lane-slot-active' : ''}${lockedLanes?.has('aura') ? ' ws-lane-slot-locked' : ''}${onToggleLaneLock ? ' ws-lane-slot-lockable' : ''}`}
              onClick={onToggleLaneLock ? () => onToggleLaneLock('aura') : undefined}
              role={onToggleLaneLock ? 'button' : undefined}
              title={onToggleLaneLock ? (lockedLanes?.has('aura') ? 'Click to remove from roll' : 'Click to include in roll') : undefined}
            >
              <div className="ws-lane-label">Aura</div>
              <div className="ws-lane-name">{activeWorldName ?? <span className="ws-lane-name-empty">None</span>}</div>
              <div className="ws-lane-actions" onClick={onToggleLaneLock ? e => e.stopPropagation() : undefined}>
                {activeWorldName && onDeactivateWorld && (
                  <button type="button" className="ws-lane-btn ws-lane-btn-remove" onClick={onDeactivateWorld}>Off</button>
                )}
                <button type="button" className="ws-lane-btn ws-lane-btn-choose" onClick={onChooseWorld}>
                  {activeWorldName ? 'Change' : 'Choose'}
                </button>
              </div>
              {activeWorldName && activeWorldPhraseCount >= 2 && onAuraVariationToggle && (
                <div className="ws-aura-variation" onClick={onToggleLaneLock ? e => e.stopPropagation() : undefined}>
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
