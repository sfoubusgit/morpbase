import type { EnvironmentIdentity, EnvironmentIdentityInput } from '../../types';
import { Modal } from './Modal';
import { EnvironmentLibrarySurface } from './EnvironmentLibrarySurface';

type EnvironmentLibraryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  environments: EnvironmentIdentity[];
  activeEnvironmentIds: string[];
  isLoading?: boolean;
  onSelectEnvironment: (environmentId: string) => void;
  onCreateEnvironment: (input: EnvironmentIdentityInput) => Promise<EnvironmentIdentity>;
  onUpdateEnvironment: (environmentId: string, input: EnvironmentIdentityInput) => Promise<EnvironmentIdentity>;
  onDeleteEnvironment: (environmentId: string) => Promise<void>;
  universeFilter?: string[];
  universeName?: string;
};

export function EnvironmentLibraryModal({
  isOpen,
  onClose,
  environments,
  activeEnvironmentIds,
  isLoading = false,
  onSelectEnvironment,
  onCreateEnvironment,
  onUpdateEnvironment,
  onDeleteEnvironment,
  universeFilter,
  universeName,
}: EnvironmentLibraryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Environments"
      className="environment-library-modal"
    >
      <EnvironmentLibrarySurface
        environments={environments}
        activeEnvironmentIds={activeEnvironmentIds}
        isLoading={isLoading}
        onSelectEnvironment={onSelectEnvironment}
        onCreateEnvironment={onCreateEnvironment}
        onUpdateEnvironment={onUpdateEnvironment}
        onDeleteEnvironment={onDeleteEnvironment}
        universeFilter={universeFilter}
        universeName={universeName}
      />
    </Modal>
  );
}
