import type { CharacterIdentity, CharacterIdentityInput } from '../../types';
import { Modal } from './Modal';
import { CharacterLibrarySurface } from './CharacterLibrarySurface';

type CharacterLibraryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  characters: CharacterIdentity[];
  activeCharacterIds: string[];
  isLoading?: boolean;
  onSelectCharacter: (characterId: string) => void;
  onCreateCharacter: (input: CharacterIdentityInput) => Promise<CharacterIdentity>;
  onUpdateCharacter: (characterId: string, input: CharacterIdentityInput) => Promise<CharacterIdentity>;
  onDeleteCharacter: (characterId: string) => Promise<void>;
  universeFilter?: string[];
  universeName?: string;
};

export function CharacterLibraryModal({
  isOpen,
  onClose,
  characters,
  activeCharacterIds,
  isLoading = false,
  onSelectCharacter,
  onCreateCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
  universeFilter,
  universeName,
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
        activeCharacterIds={activeCharacterIds}
        isLoading={isLoading}
        onSelectCharacter={onSelectCharacter}
        onCreateCharacter={onCreateCharacter}
        onUpdateCharacter={onUpdateCharacter}
        onDeleteCharacter={onDeleteCharacter}
        universeFilter={universeFilter}
        universeName={universeName}
      />
    </Modal>
  );
}
