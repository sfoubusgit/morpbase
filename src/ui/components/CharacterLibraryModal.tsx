import type { CharacterIdentity, CharacterIdentityInput } from '../../types';
import { Modal } from './Modal';
import { CharacterLibrarySurface } from './CharacterLibrarySurface';

type CharacterLibraryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  characters: CharacterIdentity[];
  activeCharacterId: string | null;
  isLoading?: boolean;
  onSelectCharacter: (characterId: string) => void;
  onCreateCharacter: (input: CharacterIdentityInput) => Promise<CharacterIdentity>;
  onUpdateCharacter: (characterId: string, input: CharacterIdentityInput) => Promise<CharacterIdentity>;
  onDeleteCharacter: (characterId: string) => Promise<void>;
};

export function CharacterLibraryModal({
  isOpen,
  onClose,
  characters,
  activeCharacterId,
  isLoading = false,
  onSelectCharacter,
  onCreateCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
}: CharacterLibraryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Characters"
      className="character-library-modal"
    >
      <CharacterLibrarySurface
        characters={characters}
        activeCharacterId={activeCharacterId}
        isLoading={isLoading}
        onSelectCharacter={onSelectCharacter}
        onCreateCharacter={onCreateCharacter}
        onUpdateCharacter={onUpdateCharacter}
        onDeleteCharacter={onDeleteCharacter}
        onApplied={onClose}
      />
    </Modal>
  );
}
