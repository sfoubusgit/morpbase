import type { StylePreset, StylePresetInput } from '../../types';
import { Modal } from './Modal';
import { IdentityLaneSurface, type LaneItem, type LaneItemInput } from './IdentityLaneSurface';

const STYLE_CONFIG = {
  kickerText: 'Global Style',
  description: 'Style presets define the art medium and rendering aesthetic. Activate one and its phrases are injected into every prompt.',
  entityLabel: 'Style Preset',
  entityLabelPlural: 'Style Presets',
  phrasesPlaceholder: 'dark fantasy oil painting\nthick impasto brushwork, rich deep color\ndramatic chiaroscuro, painterly texture',
  variant: 'style' as const,
};

type StyleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  items: StylePreset[];
  activeItemIds: string[];
  isLoading?: boolean;
  onSelectItem: (id: string) => void;
  onCreateItem: (input: StylePresetInput) => Promise<StylePreset>;
  onUpdateItem: (id: string, input: StylePresetInput) => Promise<StylePreset>;
  onDeleteItem: (id: string) => Promise<void>;
  universeFilter?: string[];
  universeName?: string;
};

export function StyleModal({
  isOpen,
  onClose,
  items,
  activeItemIds,
  isLoading = false,
  onSelectItem,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
  universeFilter,
  universeName,
}: StyleModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Style" className="identity-lane-modal">
      <IdentityLaneSurface
        config={STYLE_CONFIG}
        items={items as LaneItem[]}
        activeItemIds={activeItemIds}
        isLoading={isLoading}
        onSelectItem={onSelectItem}
        onCreateItem={onCreateItem as (input: LaneItemInput) => Promise<LaneItem>}
        onUpdateItem={onUpdateItem as (id: string, input: LaneItemInput) => Promise<LaneItem>}
        onDeleteItem={onDeleteItem}
        universeFilter={universeFilter}
        universeName={universeName}
      />
    </Modal>
  );
}
