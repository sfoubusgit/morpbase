/**
 * Question Card Component
 * 
 * Responsibilities:
 * - Display current question
 * - Show question description (if available)
 * - Render attribute selector
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

  /** Territory source fragments relevant to the current Builder step */
  territoryItems?: Array<{
    id: string;
    text: string;
    poolName: string;
    section: string;
    note?: string;
    tags?: string[];
  }>;

  /** Add a Territory item directly into the prompt */
  onAddTerritoryItem?: (text: string) => void;
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
  territoryItems = [],
  onAddTerritoryItem,
}: QuestionCardProps) {
  const questionText = node?.question || 'Select attributes';
  const questionDescription = node?.description || null;

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
        <h2 className="question-card-title">{questionText}</h2>
        {questionDescription && (
          <p className="question-card-description">{questionDescription}</p>
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
        {territoryContext?.isRelevant && territoryItems.length > 0 && (
          <div className="question-card-territory-items">
            <div className="question-card-territory-items-header">
              <div className="question-card-territory-items-title">Territory Source Material</div>
              <div className="question-card-territory-items-meta">
                {territoryItems.length} suggestion{territoryItems.length === 1 ? '' : 's'}
              </div>
            </div>
            <div className="question-card-territory-items-list">
              {territoryItems.map(item => (
                <div key={item.id} className="question-card-territory-item">
                  <div className="question-card-territory-item-text">{item.text}</div>
                  <div className="question-card-territory-item-meta">
                    <span>{item.section}</span>
                    <span>{item.poolName}</span>
                  </div>
                  {item.note && <div className="question-card-territory-item-note">{item.note}</div>}
                  <div className="question-card-territory-item-actions">
                    <button type="button" onClick={() => onAddTerritoryItem?.(item.text)}>
                      Add to Prompt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="question-card-help">
          Select an element to add it, then use the inline controls inside the selected card to edit the output text or adjust its weight.
        </div>
        
        <div className="question-card-options">
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
          
          {/* Custom extension inputs for selected options */}
          {attributeDefinitions.map((attr: any) => {
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

