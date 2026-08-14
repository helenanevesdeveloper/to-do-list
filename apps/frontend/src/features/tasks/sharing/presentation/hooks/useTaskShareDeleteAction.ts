import { useCallback, useState } from 'react';
import { mapDeleteTaskShareError } from '../../application/mapDeleteTaskShareError';
import {
  deleteTaskShareApi,
  type DeleteTaskShareApiInput
} from '../../infrastructure/deleteTaskShareApi';

export interface UseTaskShareDeleteActionOptions {
  deleteShare?: typeof deleteTaskShareApi;
  mapError?: typeof mapDeleteTaskShareError;
}

export interface UseTaskShareDeleteActionResult {
  deletingShareId: string | null;
  requestTaskShareDelete: (
    input: DeleteTaskShareApiInput
  ) => Promise<string | null>;
}

/** Owns the async state transitions for removing one task share from the modal. */
export function useTaskShareDeleteAction({
  deleteShare = deleteTaskShareApi,
  mapError = mapDeleteTaskShareError
}: UseTaskShareDeleteActionOptions = {}): UseTaskShareDeleteActionResult {
  const [deletingShareId, setDeletingShareId] = useState<string | null>(null);

  const requestTaskShareDelete = useCallback(
    async (input: DeleteTaskShareApiInput): Promise<string | null> => {
      setDeletingShareId(input.shareId);

      try {
        await deleteShare(input);
        return null;
      } catch (error) {
        return mapError(error);
      } finally {
        setDeletingShareId(null);
      }
    },
    [deleteShare, mapError]
  );

  return {
    deletingShareId,
    requestTaskShareDelete
  };
}
