import {
  Alert,
  AlertIcon,
  Stack,
  Text
} from '@chakra-ui/react';
import type { TaskShare } from '../../domain/taskShare';
import TaskShareAccessErrorState from './TaskShareAccessErrorState';
import TaskShareAccessLoadingState from './TaskShareAccessLoadingState';
import TaskShareAccessRows from './TaskShareAccessRows';

/** Props for the future access-list section inside the sharing modal. */
export interface TaskShareAccessListProps {
  canManageShares: boolean;
  currentUserEmail: string | null;
  deletingShareId?: string | null;
  errorMessage?: string | null;
  isLoading?: boolean;
  onRemoveShare?: (shareId: string) => void;
  onRetry?: () => void;
  shares: readonly TaskShare[];
}

/** Renders the people-with-access section inside the task share modal. */
export default function TaskShareAccessList(
  {
    canManageShares,
    currentUserEmail,
    deletingShareId = null,
    errorMessage = null,
    isLoading = false,
    onRemoveShare,
    onRetry,
    shares
  }: TaskShareAccessListProps
) {
  const shouldShowBlockingError = Boolean(errorMessage) && shares.length === 0 && !isLoading;
  const shouldShowWarning = Boolean(errorMessage) && shares.length > 0;

  function renderContent() {
    if (shouldShowBlockingError && errorMessage) {
      return (
        <TaskShareAccessErrorState
          errorMessage={errorMessage}
          onRetry={onRetry}
        />
      );
    }

    if (isLoading && shares.length === 0) {
      return <TaskShareAccessLoadingState />;
    }

    return (
      <TaskShareAccessRows
        canManageShares={canManageShares}
        currentUserEmail={currentUserEmail}
        deletingShareId={deletingShareId}
        onRemoveShare={onRemoveShare}
        shares={shares}
      />
    );
  }

  return (
    <Stack spacing={4}>
      <Text fontSize="lg" fontWeight="semibold">
        Pessoas com acesso
      </Text>

      {shouldShowWarning ? (
        <Alert status="warning" borderRadius="lg">
          <AlertIcon />
          Nao foi possivel atualizar a lista de compartilhamentos. Exibindo os dados
          anteriores.
        </Alert>
      ) : null}

      {renderContent()}
    </Stack>
  );
}
