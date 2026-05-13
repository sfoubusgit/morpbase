import type { NegativePreset, NegativePresetInput } from '../../types';
import { Modal } from './Modal';
import { IdentityLaneSurface, type LaneItem, type LaneItemInput } from './IdentityLaneSurface';

const NEGATIVE_CONFIG = {
  kickerText: 'Negative Preset',
  description: 'Reusable exclusion lists. Stack multiple presets — all active phrases inject into the negative prompt.',
  entityLabel: 'Preset',
  entityLabelPlural: 'Presets',
  phrasesPlaceholder: 'bad anatomy\nextra limbs\nblurry\nwatermark',
  variant: 'negative' as const,
};

type NegativeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  items: NegativePreset[];
  activeItemIds: string[];
  onAddItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onCreateItem: (input: NegativePresetInput) => Promise<NegativePreset>;
  onUpdateItem: (id: string, input: NegativePresetInput) => Promise<NegativePreset | null>;
  onDeleteItem: (id: string) => Promise<void>;
};

export function NegativeModal({
  isOpen,
  onClose,
  items,
  activeItemIds,
  onAddItem,
  onRemoveItem,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
}: NegativeModalProps) {
  const handleSelectItem = (id: string) => {
    if (activeItemIds.includes(id)) {
      onRemoveItem(id);
    } else {
      onAddItem(id);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Negative Presets" className="identity-lane-modal">
      <IdentityLaneSurface
        config={NEGATIVE_CONFIG}
        items={items as LaneItem[]}
        activeItemIds={activeItemIds}
        onSelectItem={handleSelectItem}
        onCreateItem={onCreateItem as (input: LaneItemInput) => Promise<LaneItem>}
        onUpdateItem={onUpdateItem as (id: string, input: LaneItemInput) => Promise<LaneItem>}
        onDeleteItem={onDeleteItem}
      />
    </Modal>
  );
}
