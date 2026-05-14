import type { MoodPreset, MoodPresetInput } from '../../types';
import { Modal } from './Modal';
import { IdentityLaneSurface, type LaneItem, type LaneItemInput } from './IdentityLaneSurface';

const MOOD_CONFIG = {
  kickerText: 'Global Mood',
  description: 'Mood presets define the emotional register and atmosphere. Activate one and its phrases are injected into every prompt.',
  entityLabel: 'Mood Preset',
  entityLabelPlural: 'Mood Presets',
  phrasesPlaceholder: 'melancholic quiet mood\nsubdued color, stillness in the image\nintrospective, weight without drama',
  variant: 'mood' as const,
};

type MoodModalProps = {
  isOpen: boolean;
  onClose: () => void;
  items: MoodPreset[];
  activeItemIds: string[];
  isLoading?: boolean;
  onSelectItem: (id: string) => void;
  onCreateItem: (input: MoodPresetInput) => Promise<MoodPreset>;
  onUpdateItem: (id: string, input: MoodPresetInput) => Promise<MoodPreset>;
  onDeleteItem: (id: string) => Promise<void>;
  universeFilter?: string[];
  universeName?: string;
};

export function MoodModal({
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
}: MoodModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mood" className="identity-lane-modal">
      <IdentityLaneSurface
        config={MOOD_CONFIG}
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
