import type { OutfitIdentity, OutfitIdentityInput } from '../../types';
import { Modal } from './Modal';
import { WardrobeSurface } from './WardrobeSurface';

type WardrobeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  outfits: OutfitIdentity[];
  activeOutfitId: string | null;
  isLoading?: boolean;
  onSelectOutfit: (outfitId: string | null) => void;
  onCreateOutfit: (input: OutfitIdentityInput) => Promise<OutfitIdentity>;
  onUpdateOutfit: (outfitId: string, input: OutfitIdentityInput) => Promise<OutfitIdentity>;
  onDeleteOutfit: (outfitId: string) => Promise<void>;
};

export function WardrobeModal({
  isOpen,
  onClose,
  outfits,
  activeOutfitId,
  isLoading = false,
  onSelectOutfit,
  onCreateOutfit,
  onUpdateOutfit,
  onDeleteOutfit,
}: WardrobeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Wardrobe"
      className="wardrobe-modal"
    >
      <WardrobeSurface
        outfits={outfits}
        activeOutfitId={activeOutfitId}
        isLoading={isLoading}
        onSelectOutfit={onSelectOutfit}
        onCreateOutfit={onCreateOutfit}
        onUpdateOutfit={onUpdateOutfit}
        onDeleteOutfit={onDeleteOutfit}
        onApplied={onClose}
      />
    </Modal>
  );
}
