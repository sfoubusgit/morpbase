import { INTERACTION_PHRASES, type InteractionPhrase } from '../../data/interactionPhrases';
import { Modal } from './Modal';
import './InteractionModal.css';

type InteractionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  activeId: string | null;
  onSelect: (id: string | null) => void;
};

export function InteractionModal({ isOpen, onClose, activeId, onSelect }: InteractionModalProps) {
  const handleToggle = (phrase: InteractionPhrase) => {
    onSelect(activeId === phrase.id ? null : phrase.id);
  };

  const handleRandomize = () => {
    const others = INTERACTION_PHRASES.filter(p => p.id !== activeId);
    const pool = others.length > 0 ? others : INTERACTION_PHRASES;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    onSelect(picked.id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Character Dynamics" className="interaction-modal">
      <div className="interaction-modal-header">
        <div className="interaction-modal-kicker">Relational layer</div>
        <p className="interaction-modal-description">
          Sets the spatial and emotional relationship between active characters. Injects before character descriptions — frames the scene before the model reads who each character is.
        </p>
        <button type="button" className="interaction-randomize-btn" onClick={handleRandomize}>
          ⚄ Randomize
        </button>
      </div>

      <div className="interaction-phrase-list">
        {INTERACTION_PHRASES.map(phrase => {
          const isActive = phrase.id === activeId;
          return (
            <div
              key={phrase.id}
              role="button"
              tabIndex={0}
              className={`interaction-phrase-item${isActive ? ' interaction-phrase-item-active' : ''}`}
              onClick={() => handleToggle(phrase)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(phrase); } }}
            >
              <div className="interaction-phrase-text">{phrase.text}</div>
              <button
                type="button"
                className={`interaction-phrase-toggle${isActive ? ' interaction-phrase-toggle-on' : ''}`}
                onClick={e => { e.stopPropagation(); handleToggle(phrase); }}
                title={isActive ? 'Remove' : 'Set as dynamic'}
              >
                {isActive ? '✓' : '+'}
              </button>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
