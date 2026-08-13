import { useCallback } from 'react';
import type { TaskListFilters, TaskListPage } from '../../../shared/types';
import { listTasksApi } from '../../infrastructure/listTasksApi';
import {
  useTaskListQueryState
} from './useTaskListQueryState';
import {
  useTaskListQueryRequest,
  type TaskListLoader
} from './useTaskListQueryRequest';

/** Loads the remote task list and exposes loading, error, and retry state. */
export function useTaskListQuery(
  filters: TaskListFilters,
  loader: TaskListLoader = listTasksApi
): {
  errorMessage: string | null;
  isLoading: boolean;
  page: TaskListPage;
  reload: () => void;
} {
  const {
    reloadToken,
    state,
    reload,
    setErrorState,
    setLoadingState,
    setSuccessState
  } = useTaskListQueryState();

  const handleError = useCallback((): void => {
    setErrorState();
  }, [setErrorState]);

  const handleLoading = useCallback((): void => {
    setLoadingState();
  }, [setLoadingState]);

  const handleSuccess = useCallback(
    (page: TaskListPage): void => {
      setSuccessState(page);
    },
    [setSuccessState]
  );

  useTaskListQueryRequest({
    filters,
    loader,
    reloadToken,
    onError: handleError,
    onLoading: handleLoading,
    onSuccess: handleSuccess
  });

  return {
    errorMessage: state.errorMessage,
    isLoading: state.isLoading,
    page: state.page,
    reload
  };
}
