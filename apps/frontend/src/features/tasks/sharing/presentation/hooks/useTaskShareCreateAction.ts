import { useCallback, useState } from 'react';
import { mapCreateTaskShareError } from '../../application/mapCreateTaskShareError';
import {
  createTaskShareApi,
  type CreateTaskShareApiInput
} from '../../infrastructure/createTaskShareApi';

export interface UseTaskShareCreateActionOptions {
  createShare?: typeof createTaskShareApi;
  mapError?: typeof mapCreateTaskShareError;
}

export interface UseTaskShareCreateActionResult {
  isSubmittingShare: boolean;
  requestTaskShareCreate: (input: CreateTaskShareApiInput) => Promise<string | null>;
}

/** Owns the async state transitions for creating a task share from the modal. */
export function useTaskShareCreateAction({
  createShare = createTaskShareApi,
  mapError = mapCreateTaskShareError
}: UseTaskShareCreateActionOptions = {}): UseTaskShareCreateActionResult {
  const [isSubmittingShare, setIsSubmittingShare] = useState(false);

  const requestTaskShareCreate = useCallback(
    async (input: CreateTaskShareApiInput): Promise<string | null> => {
      setIsSubmittingShare(true);

      try {
        await createShare(input);
        return null;
      } catch (error) {
        return mapError(error);
      } finally {
        setIsSubmittingShare(false);
      }
    },
    [createShare, mapError]
  );

  return {
    isSubmittingShare,
    requestTaskShareCreate
  };
}
