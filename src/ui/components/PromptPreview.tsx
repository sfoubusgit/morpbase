import { useEffect, useMemo, useRef, useState } from 'react';
import type { PoolIdpSet, PromptAdditionEntry } from '../../types';
import { composePromptWithAdditions, composeStructuredAdditionSections } from '../promptAdditions';
import './PromptPreview.css';

const SECTION_HEADER_MAP: Record<string, string> = {
  characters: 'Subject & Characters',
  actions: 'Actions',
  scene: 'Environment',
  style: 'Style & Medium',
  lighting: 'Lighting',
  camera: 'Camera',
  effects: 'Atmosphere & Effects',
  quality: 'Quality',
  'post-processing': 'Post-Processing',
};

const SECTION_ORDER: Array<keyof typeof SECTION_HEADER_MAP> = [
  'characters',
  'actions',
  'scene',
  'style',
  'lighting',
  'camera',
  'effects',
  'quality',
  'post-processing',
];

export type PromptExportMode = 'structured' | 'clean' | 'structured_with_negative';

interface PromptPreviewProps {
  prompt: any | null;
  onCopy?: () => void;
  onSavePrompt?: () => void;
  onOpenSavedPrompts?: () => void;
  customAdditions?: string[];
  positionedAdditions?: PromptAdditionEntry[];
  activeModeLabel?: string | null;
  activeTerritoryName?: string | null;
  territoryFocusMode?: 'biased' | 'full' | null;
  activePoolNames?: string[];
  activeCharacterName?: string | null;
  activeCharacterSummary?: string | null;
  activeOutfitName?: string | null;
  characterInPrompt?: boolean;
  onChooseCharacter?: () => void;
  onChooseWardrobe?: () => void;
  activeStyleName?: string | null;
  onChooseStyle?: () => void;
  activeLightingName?: string | null;
  onChooseLighting?: () => void;
  activeCompositionName?: string | null;
  onChooseComposition?: () => void;
  activeMoodName?: string | null;
  onChooseMood?: () => void;
  onAddCharacterToPrompt?: () => void;
  onRemoveCharacter?: () => void;
  poseFraming?: string | null;
  poseOrientation?: string | null;
  poseEnergy?: string | null;
  poseGaze?: string | null;
  onPoseChange?: (dimension: 'framing' | 'orientation' | 'energy' | 'gaze', value: string | null) => void;
  activeEnvironmentName?: string | null;
  activeEnvironmentSummary?: string | null;
  environmentInPrompt?: boolean;
  onChooseEnvironment?: () => void;
  onAddEnvironmentToPrompt?: () => void;
  onRemoveEnvironment?: () => void;
  envTime?: string | null;
  envWeather?: string | null;
  envScale?: string | null;
  envCondition?: string | null;
  onEnvironmentLightChange?: (dimension: 'time' | 'weather' | 'scale' | 'condition', value: string | null) => void;
  availableIdpSets?: PoolIdpSet[];
  activeIdpSetId?: string | null;
  onSelectIdpSet?: (setId: string) => void;
  exportMode?: PromptExportMode;
  onExportModeChange?: (mode: PromptExportMode) => void;
  onEditedOutputChange?: (positive: string | null, negative: string | null) => void;
  onClear?: () => void;
  onUndoClear?: () => void;
  canUndoClear?: boolean;
}

interface ParsedFragment {
  normalized: string;
  text: string;
  weight: number | null;
}

interface StructuredPromptSection {
  key: string;
  label: string;
  text: string;
}

type PromptSourceSummary = {
  id: string;
  label: string;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function splitPromptFragments(text: string): string[] {
  const fragments: string[] = [];
  let current = '';
  let depth = 0;

  for (const char of text) {
    if (char === '(') depth += 1;
    if (char === ')') depth = Math.max(0, depth - 1);

    if (char === ',' && depth === 0) {
      if (current.trim()) {
        fragments.push(current.trim());
      }
      current = '';
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    fragments.push(current.trim());
  }

  return fragments;
}

function parseFragment(fragment: string): ParsedFragment {
  const trimmed = fragment.trim();
  const attentionMatch = trimmed.match(/^\((.+):([0-9]*\.?[0-9]+)\)$/);

  if (attentionMatch) {
    const text = attentionMatch[1].trim();
    const weight = Number.parseFloat(attentionMatch[2]);
    return {
      normalized: text.toLowerCase().replace(/\s+/g, ' '),
      text,
      weight: Number.isFinite(weight) ? weight : null,
    };
  }

  return {
    normalized: trimmed.toLowerCase().replace(/\s+/g, ' '),
    text: trimmed,
    weight: null,
  };
}

function formatFragment(fragment: ParsedFragment): string {
  if (fragment.weight !== null) {
    return `(${fragment.text}:${fragment.weight.toFixed(2)})`;
  }
  return fragment.text;
}

function cleanPromptText(text: string): string {
  const fragments = splitPromptFragments(text);
  const deduped = new Map<string, ParsedFragment>();
  const order: string[] = [];

  for (const fragmentText of fragments) {
    const fragment = parseFragment(fragmentText);
    if (!fragment.normalized) continue;

    const existing = deduped.get(fragment.normalized);
    if (!existing) {
      deduped.set(fragment.normalized, fragment);
      order.push(fragment.normalized);
      continue;
    }

    if (existing.weight === null && fragment.weight !== null) {
      deduped.set(fragment.normalized, fragment);
      continue;
    }

    if (existing.weight !== null && fragment.weight !== null && fragment.weight > existing.weight) {
      deduped.set(fragment.normalized, fragment);
    }
  }

  return order.map(key => formatFragment(deduped.get(key)!)).join(', ');
}

function getPromptSourceMeta(sourceType?: PromptAdditionEntry['sourceType']): PromptSourceSummary {
  switch (sourceType) {
    case 'idp-set':
      return {
        id: 'idp-set',
        label: 'IDP Baseline',
      };
    case 'pool-default':
      return {
        id: 'pool-default',
        label: 'Pool Defaults',
      };
    case 'fragment':
      return {
        id: 'fragment',
        label: 'Global Phrases',
      };
    case 'territory':
      return {
        id: 'territory',
        label: 'Territory',
      };
    case 'pool':
      return {
        id: 'pool',
        label: 'Pool Additions',
      };
    case 'character':
      return {
        id: 'character',
        label: 'Character Identity',
      };
    case 'environment':
      return {
        id: 'environment',
        label: 'Environment Identity',
      };
    case 'outfit':
      return { id: 'outfit', label: 'Wardrobe' };
    case 'style':
      return { id: 'style', label: 'Style' };
    case 'lighting':
      return { id: 'lighting', label: 'Lighting' };
    case 'composition':
      return { id: 'composition', label: 'Composition' };
    case 'mood':
      return { id: 'mood', label: 'Mood' };
    default:
      return {
        id: 'other',
        label: 'Other',
      };
  }
}

function renderHighlightedText(text: string, phrases: string[]) {
  if (!text.trim() || phrases.length === 0) {
    return text;
  }

  const uniquePhrases = [...new Set(phrases.map(phrase => phrase.trim()).filter(Boolean))]
    .sort((a, b) => b.length - a.length);

  if (uniquePhrases.length === 0) {
    return text;
  }

  const pattern = uniquePhrases.map(escapeRegExp).join('|');
  if (!pattern) {
    return text;
  }

  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    const isMatch = uniquePhrases.some(phrase => phrase.toLowerCase() === part.toLowerCase());
    if (!isMatch) return part;

    return (
      <mark key={`${part}-${index}`} className="prompt-preview-source-highlight">
        {part}
      </mark>
    );
  });
}

function buildStructuredSections(
  prompt: any,
  basePromptText: string,
  additionsText: string,
  positionedAdditions: PromptAdditionEntry[]
): StructuredPromptSection[] {
  const sections: StructuredPromptSection[] = [];

  for (const sectionKey of SECTION_ORDER) {
    const sectionContent = prompt?.sections?.[sectionKey];
    if (!sectionContent || !sectionContent.trim()) continue;

    sections.push({
      key: sectionKey,
      label: SECTION_HEADER_MAP[sectionKey],
      text: sectionContent.trim(),
    });
  }

  if (sections.length === 0 && basePromptText.trim()) {
    sections.push({
      key: 'prompt',
      label: 'Prompt',
      text: basePromptText.trim(),
    });
  }

  const additionSections = composeStructuredAdditionSections(positionedAdditions);
  additionSections.forEach((section, index) => {
    sections.push({
      key: `addition-${index}-${section.label}`,
      label: section.label,
      text: section.text,
    });
  });

  if (additionSections.length === 0 && additionsText) {
    sections.push({
      key: 'custom',
      label: 'Custom',
      text: additionsText,
    });
  }

  return sections;
}

function formatStructuredPrompt(sections: StructuredPromptSection[]): string | null {
  if (sections.length === 0) {
    return null;
  }

  const lines: string[] = ['POSITIVE PROMPT:', ''];

  sections.forEach((section, index) => {
    if (index > 0) {
      lines.push('');
    }
    lines.push(`${section.label}:`);
    lines.push(section.text);
  });

  return lines.join('\n');
}

export function PromptPreview({
  prompt,
  onCopy,
  onSavePrompt,
  onOpenSavedPrompts,
  customAdditions = [],
  positionedAdditions = [],
  activeModeLabel = null,
  activeTerritoryName = null,
  territoryFocusMode = null,
  activePoolNames = [],
  activeCharacterName = null,
  activeCharacterSummary = null,
  activeOutfitName = null,
  characterInPrompt = false,
  onChooseCharacter,
  onChooseWardrobe,
  activeStyleName = null,
  onChooseStyle,
  activeLightingName = null,
  onChooseLighting,
  activeCompositionName = null,
  onChooseComposition,
  activeMoodName = null,
  onChooseMood,
  onAddCharacterToPrompt,
  onRemoveCharacter,
  poseFraming = null,
  poseOrientation = null,
  poseEnergy = null,
  poseGaze = null,
  onPoseChange,
  activeEnvironmentName = null,
  activeEnvironmentSummary = null,
  environmentInPrompt = false,
  onChooseEnvironment,
  onAddEnvironmentToPrompt,
  onRemoveEnvironment,
  envTime = null,
  envWeather = null,
  envScale = null,
  envCondition = null,
  onEnvironmentLightChange,
  availableIdpSets = [],
  activeIdpSetId = null,
  onSelectIdpSet,
  exportMode = 'clean',
  onExportModeChange,
  onEditedOutputChange,
  onClear,
  onUndoClear,
  canUndoClear = false,
}: PromptPreviewProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPositive, setEditedPositive] = useState<string | null>(null);
  const [editedNegative, setEditedNegative] = useState<string | null>(null);
  const [draftPositive, setDraftPositive] = useState('');
  const [draftNegative, setDraftNegative] = useState('');
  const [editNotice, setEditNotice] = useState<string | null>(null);
  const [editSnapshot, setEditSnapshot] = useState<{ positive: string | null; negative: string | null }>({
    positive: null,
    negative: null,
  });
  const [highlightedSourceId, setHighlightedSourceId] = useState<string | null>(null);

  const displayPositive = prompt && 'positiveTokens' in prompt ? prompt.positiveTokens : '';
  const displayNegative = prompt && 'negativeTokens' in prompt ? prompt.negativeTokens : '';
  const additionsText = customAdditions.filter(Boolean).join(', ');
  const normalizedAdditions: PromptAdditionEntry[] = positionedAdditions.length > 0
    ? positionedAdditions
    : customAdditions.filter(Boolean).map((text, index) => ({
        id: `legacy_addition_${index}`,
        text,
        position: 'end' as const,
      }));
  // editedPositive overrides the base text (attribute selections); additions always compose on top
  const baseText = editedPositive ?? displayPositive;
  const mergedPositive = composePromptWithAdditions(baseText, normalizedAdditions);
  const cleanedPositive = cleanPromptText(mergedPositive);
  const cleanedNegative = cleanPromptText(displayNegative);
  const structuredSections = useMemo(
    () => buildStructuredSections(prompt, baseText, additionsText, normalizedAdditions),
    [prompt, baseText, additionsText, normalizedAdditions]
  );
  const structuredPositive = formatStructuredPrompt(structuredSections) || mergedPositive;

  const generatedPositiveForMode = exportMode === 'clean' ? cleanedPositive : structuredPositive;
  const generatedNegativeForMode = exportMode === 'clean' ? cleanedNegative : displayNegative;
  const activeIdpSet = useMemo(
    () => availableIdpSets.find(set => set.id === activeIdpSetId) ?? availableIdpSets[0] ?? null,
    [availableIdpSets, activeIdpSetId]
  );
  const promptSourceSummaries = useMemo<PromptSourceSummary[]>(() => {
    const groups = new Map<string, PromptSourceSummary>();

    normalizedAdditions.forEach(entry => {
      const meta = getPromptSourceMeta(entry.sourceType);
      if (!groups.has(meta.id)) groups.set(meta.id, meta);
    });

    return Array.from(groups.values());
  }, [normalizedAdditions]);
  const highlightedSourceTexts = useMemo(() => {
    if (!highlightedSourceId) return [];
    return normalizedAdditions
      .filter(entry => getPromptSourceMeta(entry.sourceType).id === highlightedSourceId)
      .map(entry => entry.text);
  }, [highlightedSourceId, normalizedAdditions]);
  const hasEditedOutput = editedPositive !== null || editedNegative !== null;
  const currentPositive = generatedPositiveForMode;
  const currentNegative = editedNegative ?? generatedNegativeForMode;
  const shouldIncludeNegativeInCopy = exportMode === 'structured_with_negative';
  const canCopyPrompt = Boolean(currentPositive || currentNegative);
  // Only wipe manual edits when the base prompt itself changes, not when additions (character, pools) change
  const sourceSignature = useMemo(
    () => JSON.stringify([displayPositive, displayNegative, exportMode]),
    [displayPositive, displayNegative, exportMode]
  );
  const previousSourceSignature = useRef(sourceSignature);

  useEffect(() => {
    if (previousSourceSignature.current === sourceSignature) {
      return;
    }

    const hadManualEdits = isEditMode || hasEditedOutput;
    previousSourceSignature.current = sourceSignature;

    if (hadManualEdits) {
      setIsEditMode(false);
      setEditedPositive(null);
      setEditedNegative(null);
      setDraftPositive('');
      setDraftNegative('');
      setEditNotice('Edited output was reset because the prompt changed.');
      onEditedOutputChange?.(null, null);
    }
  }, [sourceSignature, isEditMode, hasEditedOutput, onEditedOutputChange]);

  useEffect(() => {
    if (!highlightedSourceId) return;

    const timeout = window.setTimeout(() => {
      setHighlightedSourceId(null);
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [highlightedSourceId]);

  const handleEnterEditMode = () => {
    setEditSnapshot({
      positive: editedPositive,
      negative: editedNegative,
    });
    setDraftPositive(editedPositive ?? displayPositive);
    setDraftNegative(editedNegative ?? displayNegative);
    setEditNotice(null);
    setIsEditMode(true);
  };

  const handleApplyEdits = () => {
    const nextPositive = draftPositive.trim();
    const nextNegative = draftNegative.trim();
    setEditedPositive(nextPositive);
    setEditedNegative(nextNegative);
    onEditedOutputChange?.(nextPositive, nextNegative);
    setIsEditMode(false);
  };

  const handleCancelEdits = () => {
    setEditedPositive(editSnapshot.positive);
    setEditedNegative(editSnapshot.negative);
    onEditedOutputChange?.(editSnapshot.positive, editSnapshot.negative);
    setDraftPositive('');
    setDraftNegative('');
    setIsEditMode(false);
  };

  const handleResetEditedOutput = () => {
    setEditedPositive(null);
    setEditedNegative(null);
    setDraftPositive('');
    setDraftNegative('');
    setIsEditMode(false);
    setEditNotice(null);
    onEditedOutputChange?.(null, null);
  };

  const handleDraftPositiveChange = (value: string) => {
    setDraftPositive(value);
    const nextPositive = value.trim();
    const nextNegative = draftNegative.trim();
    setEditedPositive(nextPositive);
    setEditedNegative(nextNegative);
    onEditedOutputChange?.(nextPositive, nextNegative);
  };

  const handleDraftNegativeChange = (value: string) => {
    setDraftNegative(value);
    const nextPositive = draftPositive.trim();
    const nextNegative = value.trim();
    setEditedPositive(nextPositive);
    setEditedNegative(nextNegative);
    onEditedOutputChange?.(nextPositive, nextNegative);
  };

  const handleCopy = () => {
    const hasPositive = Boolean(currentPositive.trim());
    const hasNegative = Boolean(currentNegative.trim());
    if (!hasPositive && !hasNegative) return;

    const exportText = shouldIncludeNegativeInCopy && hasNegative
      ? `${currentPositive}\n\nNEGATIVE PROMPT:\n${currentNegative}`
      : currentPositive;

    navigator.clipboard.writeText(exportText).catch(() => {
      // Silent fail
    });
    onCopy?.();
  };

  const showStructuredSections = !hasEditedOutput && !isEditMode && exportMode !== 'clean' && structuredSections.length > 0;
  const hasWorkflowContext = Boolean(
    activeModeLabel
    || activePoolNames.length > 0
    || activeIdpSet
    || activeTerritoryName
  );
  const hasIdentityContext = Boolean(onChooseCharacter || onChooseEnvironment);
  const territoryFocusLabel = territoryFocusMode === 'biased'
    ? 'Focused Builder'
    : 'Whole Builder';

  return (
    <div className="prompt-preview-stack">
      <div className="prompt-preview">
        <div className="prompt-preview-header">
          <div className="prompt-preview-heading">
            <h3 className="prompt-preview-title">Prompt Preview</h3>
            <p className="prompt-preview-subtitle">Build first, then edit the final output if you want to refine it manually.</p>
          </div>
          <div className="prompt-preview-header-actions">
            {prompt && 'tokenCount' in prompt && (
              <div className="prompt-preview-metadata">
                <span className="prompt-preview-token-count">
                  <span className="prompt-preview-token-count-value">{prompt.tokenCount}</span>
                  <span className="prompt-preview-token-limit">{' / 77'}</span>
                </span>
              </div>
            )}
            <button
              type="button"
              className="prompt-preview-copy-icon"
              onClick={handleCopy}
              disabled={!canCopyPrompt}
              aria-label={shouldIncludeNegativeInCopy ? 'Copy prompt and negative prompt' : 'Copy prompt'}
              title={shouldIncludeNegativeInCopy ? 'Copy prompt and negative prompt' : 'Copy prompt'}
            >
              <svg
                className="prompt-preview-copy-icon-svg"
                viewBox="0 0 20 20"
                aria-hidden="true"
                focusable="false"
              >
                <rect x="7" y="4" width="9" height="9" rx="2.2" />
                <rect x="4" y="7" width="9" height="9" rx="2.2" />
              </svg>
            </button>
          </div>
        </div>

        <div className="prompt-preview-export-note">
          {exportMode === 'structured'
            ? 'Structured keeps the prompt grouped by section.'
            : exportMode === 'clean'
              ? 'Clean removes obvious duplicates and keeps the export compact.'
              : 'Structured + Negative copies both the positive and negative prompt together.'}
        </div>

        {promptSourceSummaries.length > 0 && (
          <div className="prompt-preview-sources-block">
            <div className="prompt-preview-sources-title">Prompt Sources</div>
            <div className="prompt-preview-sources-chips">
              {promptSourceSummaries.map(source => (
                <button
                  key={source.id}
                  type="button"
                  className={`prompt-preview-source-chip ${highlightedSourceId === source.id ? 'active' : ''}`}
                  onClick={() => setHighlightedSourceId(source.id)}
                >
                  {source.label}
                </button>
              ))}
            </div>
            {highlightedSourceTexts.length > 0 && (
              <div className="prompt-preview-source-reveal">
                {highlightedSourceTexts.map((text, index) => (
                  <span key={`${text}-${index}`} className="prompt-preview-source-reveal-item">
                    {text}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {editNotice && <div className="prompt-preview-edit-notice">{editNotice}</div>}
        {hasEditedOutput && !isEditMode && (
          <div className="prompt-preview-edited-badge">Edited Output</div>
        )}

        <div className="prompt-preview-content">
          {isEditMode ? (
            <div className="prompt-preview-edit-mode">
              <div className="prompt-preview-section">
                <label className="prompt-preview-label">Prompt</label>
                <textarea
                  className="prompt-preview-textarea"
                  rows={7}
                  value={draftPositive}
                  onChange={event => handleDraftPositiveChange(event.target.value)}
                />
              </div>
              <div className="prompt-preview-section prompt-preview-section-negative">
                <label className="prompt-preview-label">Negative Prompt</label>
                <textarea
                  className="prompt-preview-textarea prompt-preview-textarea-negative"
                  rows={5}
                  value={draftNegative}
                  onChange={event => handleDraftNegativeChange(event.target.value)}
                />
              </div>
              <div className="prompt-preview-edit-actions">
                <button type="button" className="prompt-preview-action-button prompt-preview-action-button-primary" onClick={handleApplyEdits}>
                  Apply Edits
                </button>
                <button type="button" className="prompt-preview-action-button" onClick={handleCancelEdits}>
                  Cancel
                </button>
                <button type="button" className="prompt-preview-action-button" onClick={handleResetEditedOutput}>
                  Reset to Generated
                </button>
              </div>
            </div>
          ) : showStructuredSections ? (
            <div className="prompt-preview-sections">
              {structuredSections.map(section => (
                <div key={section.key} className="prompt-preview-section">
                  <label className="prompt-preview-section-label">{section.label}:</label>
                  <div className="prompt-preview-section-text">{section.text}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="prompt-preview-section">
              <label className="prompt-preview-label">Prompt</label>
              <div className="prompt-preview-text">
                {currentPositive
                  ? renderHighlightedText(currentPositive, highlightedSourceTexts)
                  : 'Select prompt elements to start building your prompt.'}
              </div>
            </div>
          )}

          {currentNegative && (
            <div className="prompt-preview-section prompt-preview-section-negative">
              <div className="prompt-preview-negative-header">
                <label className="prompt-preview-label">Negative Prompt</label>
                <span className="prompt-preview-negative-pill">Export companion</span>
              </div>
              <div className="prompt-preview-text prompt-preview-text-negative">
                {renderHighlightedText(currentNegative, highlightedSourceTexts)}
              </div>
            </div>
          )}
        </div>

        {!isEditMode && (
          <div className="prompt-preview-controls-block">
            <div className="prompt-preview-controls-top">
              <div className="prompt-preview-mode">
                <label htmlFor="prompt-export-mode" className="prompt-preview-mode-label">
                  Export Mode
                </label>
                <select
                  id="prompt-export-mode"
                  className="prompt-preview-mode-select"
                  value={exportMode}
                  onChange={event => onExportModeChange?.(event.target.value as PromptExportMode)}
                >
                  <option value="structured">Structured</option>
                  <option value="clean">Clean</option>
                  <option value="structured_with_negative">Structured + Negative</option>
                </select>
              </div>
              <div className="prompt-preview-action-buttons">
                <button
                  type="button"
                  className="prompt-preview-action-button"
                  onClick={handleEnterEditMode}
                  disabled={!currentPositive && !currentNegative}
                >
                  Edit Output
                </button>
                {onUndoClear && (
                  <button
                    type="button"
                    className="prompt-preview-action-button"
                    onClick={onUndoClear}
                    disabled={!canUndoClear}
                  >
                    Undo
                  </button>
                )}
                {onClear && (
                  <button
                    type="button"
                    className="prompt-preview-action-button prompt-preview-action-button-danger"
                    onClick={onClear}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {(currentPositive || currentNegative) && !isEditMode && (
          <div className="prompt-preview-bottom-actions">
            {(onSavePrompt || onOpenSavedPrompts) && (
              <div className="prompt-preview-secondary-actions">
                {onSavePrompt && (
                  <button
                    className="prompt-preview-save-button"
                    onClick={onSavePrompt}
                    type="button"
                  >
                    Keep to Memory
                  </button>
                )}
                {onOpenSavedPrompts && (
                  <button
                    className="prompt-preview-library-button"
                    onClick={onOpenSavedPrompts}
                    type="button"
                  >
                    Open Memory
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {hasIdentityContext && (
        <div className="prompt-identity-panel">
          <div className="prompt-identity-panel-header">
            <span className="prompt-identity-panel-title">Identities</span>
            <span className="prompt-identity-panel-caption">Phrases inject into the prompt when active.</span>
          </div>
          <div className="prompt-identity-slots">

            {/* Character slot */}
            {onChooseCharacter && (
              <div className={`prompt-identity-slot prompt-identity-slot-character${characterInPrompt ? ' prompt-identity-slot-active' : ''}`}>
                <div className="prompt-identity-slot-row">
                  <div className="prompt-identity-slot-info">
                    <div className="prompt-identity-slot-type">Character</div>
                    <div className={`prompt-identity-slot-name${!activeCharacterName ? ' prompt-identity-slot-name-empty' : ''}`}>
                      {activeCharacterName ?? 'None'}
                    </div>
                    {activeCharacterName && (
                      <div className="prompt-identity-slot-status">
                        {characterInPrompt ? 'Active — phrases in prompt' : 'Selected — not in prompt yet'}
                        {activeOutfitName && <span className="prompt-identity-outfit-name"> · {activeOutfitName}</span>}
                      </div>
                    )}
                  </div>
                  <div className="prompt-identity-slot-actions">
                    {activeCharacterName ? (
                      <>
                        {onAddCharacterToPrompt && (
                          <button type="button" className="prompt-identity-action prompt-identity-action-add" onClick={onAddCharacterToPrompt}>
                            Add
                          </button>
                        )}
                        {characterInPrompt && (
                          <span className="prompt-identity-active-badge">Active</span>
                        )}
                        {characterInPrompt && onChooseWardrobe && (
                          <button type="button" className="prompt-identity-action prompt-identity-action-secondary" onClick={onChooseWardrobe}>
                            Wardrobe
                          </button>
                        )}
                        {onRemoveCharacter && (
                          <button type="button" className="prompt-identity-action prompt-identity-action-remove" onClick={onRemoveCharacter}>
                            Remove
                          </button>
                        )}
                        <button type="button" className="prompt-identity-action prompt-identity-action-secondary" onClick={onChooseCharacter}>
                          Change
                        </button>
                      </>
                    ) : (
                      <button type="button" className="prompt-identity-action prompt-identity-action-choose" onClick={onChooseCharacter}>
                        Choose
                      </button>
                    )}
                  </div>
                </div>
                {characterInPrompt && onPoseChange && (
                  <div className="prompt-identity-controls">
                    {([
                      { key: 'framing' as const, label: 'Framing', current: poseFraming, options: [
                        { value: 'portrait', label: 'Portrait' },
                        { value: 'half-body shot', label: 'Half-body' },
                        { value: 'full body', label: 'Full body' },
                        { value: 'wide environmental shot', label: 'Wide' },
                      ]},
                      { key: 'orientation' as const, label: 'Orientation', current: poseOrientation, options: [
                        { value: 'facing viewer', label: 'Facing viewer' },
                        { value: 'three-quarter view', label: 'Three-quarter' },
                        { value: 'profile view', label: 'Profile' },
                        { value: 'facing away', label: 'Facing away' },
                      ]},
                      { key: 'energy' as const, label: 'Energy', current: poseEnergy, options: [
                        { value: 'standing still', label: 'Still' },
                        { value: 'casual relaxed pose', label: 'Casual' },
                        { value: 'mid-movement', label: 'Active' },
                        { value: 'dynamic pose', label: 'Dynamic' },
                      ]},
                      { key: 'gaze' as const, label: 'Gaze', current: poseGaze, options: [
                        { value: 'direct gaze', label: 'Direct' },
                        { value: 'looking off-frame', label: 'Off-frame' },
                        { value: 'eyes downcast', label: 'Downward' },
                        { value: 'eyes closed', label: 'Closed' },
                      ]},
                    ]).map(({ key, label, current, options }) => (
                      <div key={key} className="prompt-identity-control-row">
                        <div className="prompt-identity-control-label">{label}</div>
                        <div className="prompt-identity-control-options">
                          {options.map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              className={`prompt-identity-control-option${current === opt.value ? ' prompt-identity-control-option-active' : ''}`}
                              onClick={() => onPoseChange(key, current === opt.value ? null : opt.value)}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Environment slot */}
            {onChooseEnvironment && (
              <div className={`prompt-identity-slot prompt-identity-slot-environment${environmentInPrompt ? ' prompt-identity-slot-active' : ''}`}>
                <div className="prompt-identity-slot-row">
                  <div className="prompt-identity-slot-info">
                    <div className="prompt-identity-slot-type">Environment</div>
                    <div className={`prompt-identity-slot-name${!activeEnvironmentName ? ' prompt-identity-slot-name-empty' : ''}`}>
                      {activeEnvironmentName ?? 'None'}
                    </div>
                    {activeEnvironmentName && (
                      <div className="prompt-identity-slot-status">
                        {environmentInPrompt ? 'Active — phrases in prompt' : 'Selected — not in prompt yet'}
                      </div>
                    )}
                  </div>
                  <div className="prompt-identity-slot-actions">
                    {activeEnvironmentName ? (
                      <>
                        {onAddEnvironmentToPrompt && (
                          <button type="button" className="prompt-identity-action prompt-identity-action-add" onClick={onAddEnvironmentToPrompt}>
                            Add
                          </button>
                        )}
                        {environmentInPrompt && (
                          <span className="prompt-identity-active-badge">Active</span>
                        )}
                        {onRemoveEnvironment && (
                          <button type="button" className="prompt-identity-action prompt-identity-action-remove" onClick={onRemoveEnvironment}>
                            Remove
                          </button>
                        )}
                        <button type="button" className="prompt-identity-action prompt-identity-action-secondary" onClick={onChooseEnvironment}>
                          Change
                        </button>
                      </>
                    ) : (
                      <button type="button" className="prompt-identity-action prompt-identity-action-choose" onClick={onChooseEnvironment}>
                        Choose
                      </button>
                    )}
                  </div>
                </div>
                {environmentInPrompt && onEnvironmentLightChange && (
                  <div className="prompt-identity-controls">
                    {([
                      { key: 'time' as const, label: 'Time', current: envTime, options: [
                        { value: 'golden hour', label: 'Golden hour' },
                        { value: 'midday sun', label: 'Midday' },
                        { value: 'blue hour dusk', label: 'Dusk' },
                        { value: 'deep night', label: 'Night' },
                      ]},
                      { key: 'weather' as const, label: 'Weather', current: envWeather, options: [
                        { value: 'clear sky', label: 'Clear' },
                        { value: 'overcast', label: 'Overcast' },
                        { value: 'light rain', label: 'Rain' },
                        { value: 'heavy fog', label: 'Fog' },
                      ]},
                      { key: 'scale' as const, label: 'Scale', current: envScale, options: [
                        { value: 'intimate close quarters', label: 'Intimate' },
                        { value: 'room-scale interior', label: 'Room' },
                        { value: 'open courtyard', label: 'Courtyard' },
                        { value: 'vast open landscape', label: 'Vast' },
                      ]},
                      { key: 'condition' as const, label: 'Condition', current: envCondition, options: [
                        { value: 'pristine', label: 'Pristine' },
                        { value: 'worn and aged', label: 'Aged' },
                        { value: 'ruined', label: 'Ruined' },
                        { value: 'overgrown', label: 'Overgrown' },
                      ]},
                    ]).map(({ key, label, current, options }) => (
                      <div key={key} className="prompt-identity-control-row">
                        <div className="prompt-identity-control-label">{label}</div>
                        <div className="prompt-identity-control-options">
                          {options.map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              className={`prompt-identity-control-option${current === opt.value ? ' prompt-identity-control-option-active' : ''}`}
                              onClick={() => onEnvironmentLightChange(key, current === opt.value ? null : opt.value)}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Aesthetic lane slots */}
            {(onChooseStyle || onChooseLighting || onChooseComposition || onChooseMood) && (
              <div className="prompt-lane-slots">
                {onChooseStyle && (
                  <div className={`prompt-lane-slot prompt-lane-slot-style${activeStyleName ? ' prompt-lane-slot-active' : ''}`}>
                    <div className="prompt-lane-slot-label">Style</div>
                    <div className="prompt-lane-slot-name">{activeStyleName ?? 'None'}</div>
                    <button type="button" className="prompt-lane-slot-action" onClick={onChooseStyle}>
                      {activeStyleName ? 'Change' : 'Choose'}
                    </button>
                  </div>
                )}
                {onChooseLighting && (
                  <div className={`prompt-lane-slot prompt-lane-slot-lighting${activeLightingName ? ' prompt-lane-slot-active' : ''}`}>
                    <div className="prompt-lane-slot-label">Lighting</div>
                    <div className="prompt-lane-slot-name">{activeLightingName ?? 'None'}</div>
                    <button type="button" className="prompt-lane-slot-action" onClick={onChooseLighting}>
                      {activeLightingName ? 'Change' : 'Choose'}
                    </button>
                  </div>
                )}
                {onChooseComposition && (
                  <div className={`prompt-lane-slot prompt-lane-slot-composition${activeCompositionName ? ' prompt-lane-slot-active' : ''}`}>
                    <div className="prompt-lane-slot-label">Composition</div>
                    <div className="prompt-lane-slot-name">{activeCompositionName ?? 'None'}</div>
                    <button type="button" className="prompt-lane-slot-action" onClick={onChooseComposition}>
                      {activeCompositionName ? 'Change' : 'Choose'}
                    </button>
                  </div>
                )}
                {onChooseMood && (
                  <div className={`prompt-lane-slot prompt-lane-slot-mood${activeMoodName ? ' prompt-lane-slot-active' : ''}`}>
                    <div className="prompt-lane-slot-label">Mood</div>
                    <div className="prompt-lane-slot-name">{activeMoodName ?? 'None'}</div>
                    <button type="button" className="prompt-lane-slot-action" onClick={onChooseMood}>
                      {activeMoodName ? 'Change' : 'Choose'}
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {hasWorkflowContext && (
        <div className="prompt-workflow-panel">
          <div className="prompt-workflow-panel-title">Workspace Loop</div>
          <div className="prompt-preview-workflow-block">
            <div className="prompt-preview-workflow-title">Workspace</div>
            <div className="prompt-preview-workflow-summary">
              Workspace is the main place where the current prompt workflow takes shape.
            </div>
            {activeModeLabel && (
              <div className="prompt-preview-workflow-chips">
                <span className="prompt-preview-workflow-chip">
                  Mode: <strong>{activeModeLabel}</strong>
                </span>
              </div>
            )}
          </div>

          {(activeTerritoryName || activePoolNames.length > 0) && (
            <div className="prompt-preview-workflow-block">
              <div className="prompt-preview-workflow-title">Context Layers</div>
              <div className="prompt-preview-workflow-rows">
                {activeTerritoryName && (
                  <div className="prompt-preview-workflow-row">
                    <span className="prompt-preview-workflow-row-label">Territory Context</span>
                    <span className="prompt-preview-workflow-row-value">{activeTerritoryName}</span>
                  </div>
                )}
                {activeTerritoryName && territoryFocusMode && (
                  <div className="prompt-preview-workflow-row">
                    <span className="prompt-preview-workflow-row-label">Workspace Focus</span>
                    <span className="prompt-preview-workflow-row-value">{territoryFocusLabel}</span>
                  </div>
                )}
                {activePoolNames.length > 0 && (
                  <div className="prompt-preview-workflow-row">
                    <span className="prompt-preview-workflow-row-label">Source Pools</span>
                    <span className="prompt-preview-workflow-row-value">{activePoolNames.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {(activeTerritoryName || activePoolNames.length > 0) && (
            <div className="prompt-preview-workflow-note">
              Territories shape the workflow. Pools supply the reusable source material behind it.
            </div>
          )}

          {availableIdpSets.length > 0 && (
            <div className="prompt-preview-idp-block">
              <div className="prompt-preview-idp-header">
                <div>
                  <div className="prompt-preview-idp-title">Identity Baseline</div>
                  <div className="prompt-preview-idp-subtitle">Choose the current reusable baseline layered onto this workflow.</div>
                </div>
                <select
                  className="prompt-preview-idp-select"
                  value={activeIdpSet?.id ?? ''}
                  onChange={event => onSelectIdpSet?.(event.target.value)}
                >
                  {availableIdpSets.map(set => (
                    <option key={set.id} value={set.id}>
                      {set.name}
                    </option>
                  ))}
                </select>
              </div>
              {activeIdpSet && (
                <div className="prompt-preview-idp-phrases">
                  {activeIdpSet.phrases.map(phrase => (
                    <div key={phrase.id} className="prompt-preview-idp-phrase">{phrase.text}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
