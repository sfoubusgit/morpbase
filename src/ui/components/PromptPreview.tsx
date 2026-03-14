import { useEffect, useMemo, useRef, useState } from 'react';
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
  customAdditions?: string[];
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

function joinNonEmpty(parts: string[], separator: string): string {
  return parts.map(part => part.trim()).filter(Boolean).join(separator);
}

function formatStructuredPrompt(prompt: any, additionsText: string): string | null {
  if (!prompt?.sections || Object.keys(prompt.sections).length === 0) {
    return null;
  }

  const lines: string[] = ['POSITIVE PROMPT:', ''];

  for (const sectionKey of SECTION_ORDER) {
    const sectionContent = prompt.sections[sectionKey];
    if (sectionContent && sectionContent.trim()) {
      const header = SECTION_HEADER_MAP[sectionKey];
      lines.push(`${header}:`);
      lines.push(sectionContent);
      lines.push('');
    }
  }

  if (lines[lines.length - 1] === '') {
    lines.pop();
  }

  if (additionsText) {
    lines.push('');
    lines.push('Custom:');
    lines.push(additionsText);
  }

  return lines.join('\n');
}

export function PromptPreview({
  prompt,
  onCopy,
  customAdditions = [],
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

  const displayPositive = prompt && 'positiveTokens' in prompt ? prompt.positiveTokens : '';
  const displayNegative = prompt && 'negativeTokens' in prompt ? prompt.negativeTokens : '';
  const additionsText = customAdditions.filter(Boolean).join(', ');
  const mergedPositive = joinNonEmpty([displayPositive, additionsText], ', ');
  const cleanedPositive = cleanPromptText(mergedPositive);
  const cleanedNegative = cleanPromptText(displayNegative);
  const structuredPositive = formatStructuredPrompt(prompt, additionsText) || mergedPositive;

  const generatedPositiveForMode = exportMode === 'clean' ? cleanedPositive : structuredPositive;
  const generatedNegativeForMode = exportMode === 'clean' ? cleanedNegative : displayNegative;
  const hasEditedOutput = editedPositive !== null || editedNegative !== null;
  const currentPositive = editedPositive ?? generatedPositiveForMode;
  const currentNegative = editedNegative ?? generatedNegativeForMode;
  const shouldIncludeNegativeInCopy = exportMode === 'structured_with_negative';
  const sourceSignature = useMemo(
    () => JSON.stringify([displayPositive, displayNegative, additionsText, exportMode, structuredPositive, cleanedPositive, cleanedNegative]),
    [displayPositive, displayNegative, additionsText, exportMode, structuredPositive, cleanedPositive, cleanedNegative]
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

  const handleEnterEditMode = () => {
    setEditSnapshot({
      positive: editedPositive,
      negative: editedNegative,
    });
    setDraftPositive(currentPositive);
    setDraftNegative(currentNegative);
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

  const showStructuredSections = !hasEditedOutput && !isEditMode && exportMode !== 'clean' && prompt && 'sections' in prompt && prompt.sections && Object.keys(prompt.sections).length > 0;

  return (
    <div className="prompt-preview">
      <div className="prompt-preview-header">
        <div className="prompt-preview-heading">
          <h3 className="prompt-preview-title">Prompt Preview</h3>
          <p className="prompt-preview-subtitle">Build first, then edit the final output if you want to refine it manually.</p>
        </div>
        <div className="prompt-preview-header-controls">
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
          {!isEditMode && (
            <button
              type="button"
              className="prompt-preview-action-button prompt-preview-action-button-primary"
              onClick={handleEnterEditMode}
              disabled={!currentPositive && !currentNegative}
            >
              Edit Output
            </button>
          )}
          {(onClear || onUndoClear) && (
            <div className="prompt-preview-action-buttons">
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
          )}
          {prompt && 'tokenCount' in prompt && (
            <div className="prompt-preview-metadata">
              <span className="prompt-preview-token-count">
                <span className="prompt-preview-token-count-value">{prompt.tokenCount}</span>
                <span className="prompt-preview-token-limit">{' / 77'}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="prompt-preview-export-note">
        {exportMode === 'structured'
          ? 'Structured keeps the prompt grouped by section.'
          : exportMode === 'clean'
            ? 'Clean removes obvious duplicates and keeps the export compact.'
            : 'Structured + Negative copies both the positive and negative prompt together.'}
      </div>

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
            {SECTION_ORDER.map(sectionKey => {
              const sectionValue = prompt.sections?.[sectionKey as keyof typeof prompt.sections];
              if (!sectionValue) return null;
              return (
                <div key={sectionKey} className="prompt-preview-section">
                  <label className="prompt-preview-section-label">{SECTION_HEADER_MAP[sectionKey]}:</label>
                  <div className="prompt-preview-section-text">{sectionValue}</div>
                </div>
              );
            })}
            {additionsText && (
              <div className="prompt-preview-section">
                <label className="prompt-preview-section-label">Custom</label>
                <div className="prompt-preview-section-text">{additionsText}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="prompt-preview-section">
            <label className="prompt-preview-label">Prompt</label>
            <div className="prompt-preview-text">
              {currentPositive || 'Select prompt elements to start building your prompt.'}
            </div>
          </div>
        )}

        {currentNegative && (
          <div className="prompt-preview-section prompt-preview-section-negative">
            <div className="prompt-preview-negative-header">
              <label className="prompt-preview-label">Negative Prompt</label>
              <span className="prompt-preview-negative-pill">Export companion</span>
            </div>
            <div className="prompt-preview-text prompt-preview-text-negative">{currentNegative}</div>
          </div>
        )}
      </div>

      {(currentPositive || currentNegative) && !isEditMode && (
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="prompt-preview-copy-button" onClick={handleCopy} type="button">
            {shouldIncludeNegativeInCopy ? 'Copy Prompt + Negative' : 'Copy Prompt'}
          </button>
        </div>
      )}
    </div>
  );
}
