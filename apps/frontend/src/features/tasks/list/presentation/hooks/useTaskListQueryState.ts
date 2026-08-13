import { useCallback, useState } from 'react';
import type { TaskListPage } from '../../../shared/types';
import {
  buildErrorTaskListQueryState,
  buildInitialTaskListQueryState,
  buildLoadingTaskListQueryState,
  buildSuccessTaskListQueryState,
  type TaskListQueryState
} from '../state/taskListQueryState';

export type UseTaskListQueryStateResult = {
  reloadToken: number;
  state: TaskListQueryState;
  reload: () => void;
  setErrorState: () => void;
  setLoadingState: () => void;
  setSuccessState: (page: TaskListPage) => void;
};

/** Owns the local state transitions used by the remote task-list query. */
export function useTaskListQueryState(): UseTaskListQueryStateResult {
  const [reloadToken, setReloadToken] = useState(0);
  const [state, setState] = useState<TaskListQueryState>(
    buildInitialTaskListQueryState
  );

  const reload = useCallback((): void => {
    setReloadToken((current) => current + 1);
  }, []);

  const setLoadingState = useCallback((): void => {
    setState((current) => buildLoadingTaskListQueryState(current));
  }, []);

  const setSuccessState = useCallback((page: TaskListPage): void => {
    setState(buildSuccessTaskListQueryState(page));
  }, []);

  const setErrorState = useCallback((): void => {
    setState((current) => buildErrorTaskListQueryState(current));
  }, []);

  return {
    reloadToken,
    state,
    reload,
    setErrorState,
    setLoadingState,
    setSuccessState
  };
}
