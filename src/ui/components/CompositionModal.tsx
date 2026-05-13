import type { CompositionFrame, CompositionFrameInput } from '../../types';
import { Modal } from './Modal';
import { IdentityLaneSurface, type LaneItem, type LaneItemInput } from './IdentityLaneSurface';

const COMPOSITION_CONFIG = {
  kickerText: 'Global Composition',
  description: 'Composition frames define the shot type and camera angle. Activate one and its phrases are injected into every prompt.',
  entityLabel: 'Composition Frame',
  entityLabelPlural: 'Composition Frames',
  phrasesPlaceholder: 'tight bust portrait crop\nrule of thirds, slight off-center\nshallow depth of field, face in sharp focus',
  variant: 'composition' as const,
};

type CompositionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  items: CompositionFrame[];
  activeItemIds: string[];
  isLoading?: boolean;
  onSelectItem: (id: string) => void;
  onCreateItem: (input: CompositionFrameInput) => Promise<CompositionFrame>;
  onUpdateItem: (id: string, input: CompositionFrameInput) => Promise<CompositionFrame>;
  onDeleteItem: (id: string) => Promise<void>;
};

export function CompositionModal({
  isOpen,
  onClose,
  items,
  activeItemIds,
  isLoading = false,
  onSelectItem,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
}: CompositionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Composition" className="identity-lane-modal">
      <IdentityLaneSurface
        config={COMPOSITION_CONFIG}
        items={items as LaneItem[]}
        activeItemIds={activeItemIds}
        isLoading={isLoading}
        onSelectItem={onSelectItem}
        onCreateItem={onCreateItem as (input: LaneItemInput) => Promise<LaneItem>}
        onUpdateItem={onUpdateItem as (id: string, input: LaneItemInput) => Promise<LaneItem>}
        onDeleteItem={onDeleteItem}
      />
    </Modal>
  );
}
