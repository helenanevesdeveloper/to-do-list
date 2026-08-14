import { useCallback, useState } from 'react';
import { mapTaskShareError } from '../../application/mapTaskShareError';
import { listTaskSharesApi } from '../../infrastructure/listTaskSharesApi';
import type { TaskShare } from '../../domain/taskShare';

export interface UseTaskShareListQueryOptions {
  listShares?: typeof listTaskSharesApi;
  mapError?: typeof mapTaskShareError;
  replaceShares: (taskId: string, shares: readonly TaskShare[]) => void;
}

export interface UseTaskShareListQueryResult {
  errorMessage: string | null;
  isLoadingShares: boolean;
  loadTaskShares: (taskId: string) => Promise<void>;
  resetError: () => void;
}

/** Loads one task access list from the backend and stores the latest result locally. */
export function useTaskShareListQuery({
  listShares = listTaskSharesApi,
  mapError = mapTaskShareError,
  replaceShares
}: UseTaskShareListQueryOptions): UseTaskShareListQueryResult {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingShares, setIsLoadingShares] = useState(false);

  const resetError = useCallback((): void => {
    setErrorMessage(null);
  }, []);

  const loadTaskShares = useCallback(
    async (taskId: string): Promise<void> => {
      setIsLoadingShares(true);
      setErrorMessage(null);

      try {
        const shares = await listShares({ taskId });
        replaceShares(taskId, shares);
      } catch (error) {
        setErrorMessage(mapError(error));
      } finally {
        setIsLoadingShares(false);
      }
    },
    [listShares, mapError, replaceShares]
  );

  return {
    errorMessage,
    isLoadingShares,
    loadTaskShares,
    resetError
  };
}
