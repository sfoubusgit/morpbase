import type { EnvironmentIdentity, EnvironmentIdentityInput } from '../../types';
import { Modal } from './Modal';
import { EnvironmentLibrarySurface } from './EnvironmentLibrarySurface';

type EnvironmentLibraryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  environments: EnvironmentIdentity[];
  activeEnvironmentId: string | null;
  isLoading?: boolean;
  onSelectEnvironment: (environmentId: string) => void;
  onCreateEnvironment: (input: EnvironmentIdentityInput) => Promise<EnvironmentIdentity>;
  onUpdateEnvironment: (environmentId: string, input: EnvironmentIdentityInput) => Promise<EnvironmentIdentity>;
  onDeleteEnvironment: (environmentId: string) => Promise<void>;
};

export function EnvironmentLibraryModal({
  isOpen,
  onClose,
  environments,
  activeEnvironmentId,
  isLoading = false,
  onSelectEnvironment,
  onCreateEnvironment,
  onUpdateEnvironment,
  onDeleteEnvironment,
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
        activeEnvironmentId={activeEnvironmentId}
        isLoading={isLoading}
        onSelectEnvironment={onSelectEnvironment}
        onCreateEnvironment={onCreateEnvironment}
        onUpdateEnvironment={onUpdateEnvironment}
        onDeleteEnvironment={onDeleteEnvironment}
        onApplied={onClose}
      />
    </Modal>
  );
}
