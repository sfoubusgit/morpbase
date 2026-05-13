import type { LightingSetup, LightingSetupInput } from '../../types';
import { Modal } from './Modal';
import { IdentityLaneSurface, type LaneItem, type LaneItemInput } from './IdentityLaneSurface';

const LIGHTING_CONFIG = {
  kickerText: 'Global Lighting',
  description: 'Lighting setups define the light source and shadow character. Activate one and its phrases are injected into every prompt.',
  entityLabel: 'Lighting Setup',
  entityLabelPlural: 'Lighting Setups',
  phrasesPlaceholder: 'golden hour warm backlight\nglowing rim light along hair and shoulders\nlong soft shadows, amber warmth',
  variant: 'lighting' as const,
};

type LightingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  items: LightingSetup[];
  activeItemIds: string[];
  isLoading?: boolean;
  onSelectItem: (id: string) => void;
  onCreateItem: (input: LightingSetupInput) => Promise<LightingSetup>;
  onUpdateItem: (id: string, input: LightingSetupInput) => Promise<LightingSetup>;
  onDeleteItem: (id: string) => Promise<void>;
};

export function LightingModal({
  isOpen,
  onClose,
  items,
  activeItemIds,
  isLoading = false,
  onSelectItem,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
}: LightingModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lighting" className="identity-lane-modal">
      <IdentityLaneSurface
        config={LIGHTING_CONFIG}
        items={items as LaneItem[]}
        activeItemIds={activeItemIds}
        isLoading={isLoading}
        onSelectItem={onSelectItem}
        onCreateItem={onCreateItem as (input: LaneItemInput) => Promise<LaneItem>}
        onUpdateItem={onUpdateItem as (id: string, input: LaneItemInput) => Promise<LaneItem>}
        onDeleteItem={onDeleteItem}
        onApplied={onClose}
      />
    </Modal>
  );
}
