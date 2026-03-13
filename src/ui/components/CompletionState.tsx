/**
 * Completion State Component
 * 
 * Responsibilities:
 * - Display completion message when the Builder flow is finished
 * - Show summary of selections made
 * - Provide option to start over or review
 * 
 * Must NOT:
 * - Store completion state internally
 * - Compute completion logic
 * - Modify selections
 */

import './CompletionState.css';

interface CompletionStateProps {
  /** Total number of questions answered */
  totalSteps: number;
  
  /** Handler for starting over (optional) */
  onStartOver?: () => void;
  
  /** Handler for going back to review (optional) */
  onReview?: () => void;
}

/**
 * Completion State Component
 * 
 * Displays when the Builder flow is complete.
 */
export function CompletionState({
  totalSteps,
  onStartOver,
  onReview,
}: CompletionStateProps) {
  return (
    <div className="completion-state">
      <div className="completion-state-icon">{'\u2713'}</div>
      <h2 className="completion-state-title">Prompt Complete</h2>
      <p className="completion-state-message">
        You've reached the end of this Builder flow after {totalSteps} steps. Your prompt is ready to review or copy.
      </p>
      <div className="completion-state-actions">
        {onReview && (
          <button
            className="completion-state-button completion-state-button-secondary"
            onClick={onReview}
          >
            Review Selections
          </button>
        )}
        {onStartOver && (
          <button
            className="completion-state-button completion-state-button-primary"
            onClick={onStartOver}
          >
            Restart Builder
          </button>
        )}
      </div>
    </div>
  );
}
