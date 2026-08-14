import { useCallback, useState } from 'react';
import { mapDeleteTaskError } from '../../application/mapDeleteTaskError';
import { deleteTaskApi } from '../../infrastructure/deleteTaskApi';
import {
  initialTaskDeleteState,
  type TaskDeleteState
} from '../state/taskDeleteState';

/** State returned by the future task-deletion action hook. */
export interface UseTaskDeleteActionResult {
  deletingTaskId: string | null;
  errorMessage: string | null;
  requestTaskDelete: (taskId: string) => Promise<boolean>;
  resetTaskDeleteError: () => void;
}

export interface UseTaskDeleteActionOptions {
  deleteTask?: typeof deleteTaskApi;
  mapError?: typeof mapDeleteTaskError;
}

/** Owns the async state transitions for task deletion from the dashboard list. */
export function useTaskDeleteAction({
  deleteTask = deleteTaskApi,
  mapError = mapDeleteTaskError
}: UseTaskDeleteActionOptions = {}): UseTaskDeleteActionResult {
  const [state, setState] = useState<TaskDeleteState>(initialTaskDeleteState);

  const resetTaskDeleteError = useCallback((): void => {
    setState((current) => ({
      ...current,
      errorMessage: null
    }));
  }, []);

  const requestTaskDelete = useCallback(
    async (taskId: string): Promise<boolean> => {
      setState({
        deletingTaskId: taskId,
        errorMessage: null
      });

      try {
        await deleteTask({ taskId });
        setState(initialTaskDeleteState);
        return true;
      } catch (error) {
        setState({
          deletingTaskId: null,
          errorMessage: mapError(error)
        });
        return false;
      }
    },
    [deleteTask, mapError]
  );

  return {
    deletingTaskId: state.deletingTaskId,
    errorMessage: state.errorMessage,
    requestTaskDelete,
    resetTaskDeleteError
  };
}
