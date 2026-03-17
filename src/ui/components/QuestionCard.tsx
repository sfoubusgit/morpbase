/**
 * Question Card Component
 *
 * Responsibilities:
 * - Display current Builder area
 * - Show supporting context for the current step
 * - Render attribute selector or Territory-focused options
 * - Render modifier controls
 * - Render navigation buttons
 * - Display custom extension inputs
 *
 * Must NOT:
 * - Determine which question to show
 * - Compute available attributes
 * - Validate selections
 * - Store question state internally
 */

import { useEffect, useMemo, useState } from 'react';
import './QuestionCard.css';
import { AttributeSelector } from './AttributeSelector';
import { ModifierControls } from './ModifierControls';
import { NavigationButtons } from './NavigationButtons';

// TODO: Import types when ready
// import { InterviewNode } from '../types';

interface QuestionCardProps {
  /** Current question node */
  node: any; // TODO: InterviewNode
  
  /** Current step number */
  currentStep: number;
  
  /** Current selections for this question */
  selections: Map<string, { isEnabled: boolean; customExtension: string | null }>;
  
  /** Current modifier values */
  modifierValues: Map<string, number>;
  
  /** Available attribute definitions for this question */
  attributeDefinitions: any[];
  
  /** Available modifiers for this question */
  modifiers: any[];
  
  /** Handler for attribute selection */
  onSelect: (attributeId: string) => void;
  
  /** Handler for attribute deselection */
  onDeselect: (attributeId: string) => void;
  
  /** Handler for custom extension changes */
  onCustomExtensionChange: (attributeId: string, extension: string) => void;
  
  /** Handler for weight changes */
  onWeightChange: (attributeId: string, value: number) => void;

  /** Global weight enabled toggle */
  weightsEnabledGlobal: boolean;

  /** Handler for global weight toggle */
  onToggleGlobalWeights: (enabled: boolean) => void;

  /** Output override values for prompt generation */
  selectionOutputOverrides?: Map<string, string>;

  /** Handler for output override changes */
  onSetSelectionOutputOverride?: (attributeId: string, value: string | null) => void;
  
  /** Handler for back navigation */
  onNavigateBack: () => void;
  
  /** Handler for next navigation */
  onNavigateNext: () => void;
  
  /** Handler for skip navigation (optional) */
  onNavigateSkip?: () => void;
  
  /** Whether back button should be enabled */
  canGoBack: boolean;
  
  /** Whether next button should be enabled */
  canGoNext: boolean;

  /** Territory context for the current Builder step */
  territoryContext?: {
    territoryName: string;
    isRelevant: boolean;
    matchingSections: string[];
  } | null;

  /** Visible Builder area label */
  sectionTitle?: string;

  /** Current Builder flow explanation */
  flowHint?: string;

  /** Territory source fragments relevant to the current Builder step */
  territoryItems?: Array<{
    id: string;
    text: string;
    poolName: string;
    section: string;
    note?: string;
    tags?: string[];
    isSelected?: boolean;
    weight?: number;
    outputText?: string;
  }>;

  /** Toggle a Territory item in the prompt */
  onToggleTerritoryItem?: (itemId: string) => void;

  /** Edit a Territory item output */
  onSetTerritoryItemOutputOverride?: (itemId: string, value: string | null) => void;

  /** Change a Territory item weight */
  onSetTerritoryItemWeight?: (itemId: string, value: number) => void;
}

/**
 * Question Card Component
 * 
 * Displays current question and all related controls.
 */
export function QuestionCard({
  node,
  currentStep,
  selections,
  modifierValues,
  attributeDefinitions,
  modifiers,
  onSelect,
  onDeselect,
  onCustomExtensionChange,
  onWeightChange,
  weightsEnabledGlobal,
  onToggleGlobalWeights,
  selectionOutputOverrides,
  onSetSelectionOutputOverride,
  onNavigateBack,
  onNavigateNext,
  onNavigateSkip,
  canGoBack,
  canGoNext,
  territoryContext = null,
  sectionTitle,
  flowHint,
  territoryItems = [],
  onToggleTerritoryItem,
  onSetTerritoryItemOutputOverride,
  onSetTerritoryItemWeight,
}: QuestionCardProps) {
  const questionText = node?.question || 'Select attributes';
  const questionDescription = node?.description || null;
  const titleText = sectionTitle || 'Builder';
  const helperQuestion = questionDescription || questionText;
  const territoryModeAvailable = Boolean(territoryContext?.isRelevant && territoryItems.length > 0);
  const [optionsMode, setOptionsMode] = useState<'territory' | 'base'>(() =>
    territoryModeAvailable ? 'territory' : 'base'
  );
  const [editingTerritoryItemId, setEditingTerritoryItemId] = useState<string | null>(null);
  const [editingTerritoryValue, setEditingTerritoryValue] = useState('');
  const territorySourceSummary = useMemo(() => {
    if (territoryItems.length === 0) return null;
    const sections = [...new Set(territoryItems.map(item => item.section))];
    const pools = [...new Set(territoryItems.map(item => item.poolName))];
    return {
      isSingleSource: sections.length === 1 && pools.length === 1,
      label: `${sections.join(', ')}${pools.length > 0 ? ` · ${pools.join(', ')}` : ''}`,
    };
  }, [territoryItems]);

  useEffect(() => {
    setOptionsMode(territoryModeAvailable ? 'territory' : 'base');
    setEditingTerritoryItemId(null);
    setEditingTerritoryValue('');
  }, [territoryModeAvailable, node?.id]);

  const clampWeight = (value: number) => Math.max(0, Math.min(2, value));

  const handleTerritoryWeightAdjust = (itemId: string, currentWeight: number | undefined, delta: number) => {
    const next = clampWeight(parseFloat(((currentWeight ?? 1.0) + delta).toFixed(1)));
    onSetTerritoryItemWeight?.(itemId, next);
  };

  const handleTerritoryItemClick = (itemId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    if (target.closest('.question-card-territory-item-editor')) {
      return;
    }
    if (target.closest('.question-card-territory-item-actions')) {
      return;
    }

    onToggleTerritoryItem?.(itemId);
  };

  const handleTerritoryControlClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div className="question-card">
      <div className="question-card-header">
        <div className="question-card-step">Step {currentStep}</div>
        <label className="question-card-weight-toggle">
          <input
            type="checkbox"
            checked={weightsEnabledGlobal}
            onChange={(e) => onToggleGlobalWeights(e.target.checked)}
          />
          Weights
        </label>
      </div>
      
      <div className="question-card-content">
        <h2 className="question-card-title">{titleText}</h2>
        {helperQuestion && (
          <p className="question-card-description">{helperQuestion}</p>
        )}
        {flowHint && (
          <div className="question-card-flow-hint">
            {flowHint}
          </div>
        )}
        {territoryContext && (
          <div className={`question-card-territory ${territoryContext.isRelevant ? 'relevant' : 'outside'}`}>
            <div className="question-card-territory-title">
              {territoryContext.isRelevant
                ? `Inside ${territoryContext.territoryName}`
                : `Outside ${territoryContext.territoryName}`}
            </div>
            <div className="question-card-territory-text">
              {territoryContext.isRelevant
                ? territoryContext.matchingSections.length > 0
                  ? `This step aligns with the Territory focus through ${territoryContext.matchingSections.join(', ')}.`
                  : 'This step aligns with the current Territory focus.'
                : 'This step is still available, but it is outside the current Territory focus.'}
            </div>
          </div>
        )}
        {territoryModeAvailable && (
          <div className="question-card-mode-switch">
            <button
              type="button"
              className={optionsMode === 'territory' ? 'active' : ''}
              onClick={() => setOptionsMode('territory')}
            >
              Territory Options
            </button>
            <button
              type="button"
              className={optionsMode === 'base' ? 'active' : ''}
              onClick={() => setOptionsMode('base')}
            >
              Base Builder Options
            </button>
          </div>
        )}
        {territoryModeAvailable && optionsMode === 'territory' && (
          <div className="question-card-territory-items">
            <div className="question-card-territory-items-header">
              <div className="question-card-territory-items-header-main">
                <div className="question-card-territory-items-title">Territory Source Material</div>
                {territorySourceSummary && (
                  <div className="question-card-territory-items-source">
                    {territorySourceSummary.label}
                  </div>
                )}
              </div>
              <div className="question-card-territory-items-meta">
                {territoryItems.length} suggestion{territoryItems.length === 1 ? '' : 's'}
              </div>
            </div>
            <div className="question-card-territory-items-list">
              {territoryItems.map(item => (
                <div
                  key={item.id}
                  className={`question-card-territory-item ${item.isSelected ? 'selected' : ''}`}
                  onClick={event => handleTerritoryItemClick(item.id, event)}
                >
                  <div className="question-card-territory-item-text">{item.text}</div>
                  {!territorySourceSummary?.isSingleSource && (
                    <div className="question-card-territory-item-meta">
                      <span>{item.section}</span>
                      <span>{item.poolName}</span>
                    </div>
                  )}
                  {item.note && <div className="question-card-territory-item-note">{item.note}</div>}
                  {item.isSelected && (
                  <div className="question-card-territory-item-actions" onClick={handleTerritoryControlClick}>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTerritoryItemId(item.id);
                        setEditingTerritoryValue(item.outputText ?? item.text);
                      }}
                    >
                      Edit Text
                    </button>
                    <div className="question-card-territory-item-weight">
                      <span className="question-card-territory-item-weight-label">Weight</span>
                      <button
                        type="button"
                        onClick={() => handleTerritoryWeightAdjust(item.id, item.weight, -0.1)}
                      >
                        -
                      </button>
                      <span className="question-card-territory-item-weight-value">
                        {(item.weight ?? 1).toFixed(1)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTerritoryWeightAdjust(item.id, item.weight, 0.1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  )}
                  {editingTerritoryItemId === item.id && (
                    <div className="question-card-territory-item-editor" onClick={handleTerritoryControlClick}>
                      <input
                        type="text"
                        value={editingTerritoryValue}
                        onChange={event => setEditingTerritoryValue(event.target.value)}
                      />
                      <div className="question-card-territory-item-editor-actions">
                        <button
                          type="button"
                          onClick={() => {
                            onSetTerritoryItemOutputOverride?.(item.id, editingTerritoryValue.trim() || null);
                            setEditingTerritoryItemId(null);
                            setEditingTerritoryValue('');
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTerritoryItemId(null);
                            setEditingTerritoryValue('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="question-card-help">
          Select an element to add it, then use the inline controls inside the selected card to edit the output text or adjust its weight.
        </div>
        
        <div className="question-card-options">
          {(!territoryModeAvailable || optionsMode === 'base') && (
            <AttributeSelector
              attributeDefinitions={attributeDefinitions}
              selections={selections}
              weightValues={modifierValues}
              onSelect={onSelect}
              onDeselect={onDeselect}
              onCustomExtensionChange={onCustomExtensionChange}
              onWeightChange={onWeightChange}
              weightsEnabledGlobal={weightsEnabledGlobal}
              selectionOutputOverrides={selectionOutputOverrides}
              onSetSelectionOutputOverride={onSetSelectionOutputOverride}
            />
          )}
          
          {/* Custom extension inputs for selected options */}
          {(!territoryModeAvailable || optionsMode === 'base') && attributeDefinitions.map((attr: any) => {
            const selection = selections.get(attr.id);
            const isSelected = selection?.isEnabled ?? false;
            const allowCustomExtension = attr.allowCustomExtension ?? false;
            
            if (!isSelected || !allowCustomExtension) {
              return null;
            }
            
            const currentExtension = selection?.customExtension || '';
            
            return (
              <div key={`extension-${attr.id}`} className="question-card-extension">
                <label className="question-card-extension-label">
                  Additional details for "{attr.baseText || attr.id}"
                </label>
                <input
                  type="text"
                  className="question-card-extension-input"
                  value={currentExtension}
                  onChange={(e) => onCustomExtensionChange(attr.id, e.target.value)}
                  placeholder="Add custom details..."
                />
              </div>
            );
          })}
        </div>
        
        {/* 
          NOTE: ModifierControls component is NOT rendered.
          
          GLOBAL UI REQUIREMENT: All weight controls are INLINE within attribute elements.
          There are NO external, floating, or global slider controls.
          The inline weight slider in AttributeSelector is the ONLY weight control mechanism.
        */}
      </div>
      
      <div className="question-card-navigation">
        <NavigationButtons
          canGoBack={canGoBack}
          canGoNext={canGoNext}
          currentStep={currentStep}
          totalSteps={null}
          onNavigateBack={onNavigateBack}
          onNavigateNext={onNavigateNext}
          onNavigateSkip={onNavigateSkip}
        />
      </div>
    </div>
  );
}

