import type { TaskListPage } from '../../../shared/types';

export type TaskListQueryState = {
  errorMessage: string | null;
  isLoading: boolean;
  page: TaskListPage;
};

export const EMPTY_TASK_LIST_PAGE: TaskListPage = {
  currentPage: 1,
  endItem: 0,
  hasNextPage: false,
  hasPreviousPage: false,
  items: [],
  startItem: 0,
  totalItems: 0,
  totalPages: 1
};

/** Builds the initial remote-query state used before the first task fetch completes. */
export function buildInitialTaskListQueryState(): TaskListQueryState {
  return {
    errorMessage: null,
    isLoading: true,
    page: EMPTY_TASK_LIST_PAGE
  };
}

/** Builds the loading state while preserving the latest page data already shown. */
export function buildLoadingTaskListQueryState(
  current: TaskListQueryState
): TaskListQueryState {
  return {
    ...current,
    errorMessage: null,
    isLoading: true
  };
}

/** Builds the success state after a remote task-list response is received. */
export function buildSuccessTaskListQueryState(
  page: TaskListPage
): TaskListQueryState {
  return {
    errorMessage: null,
    isLoading: false,
    page
  };
}

/** Builds the error state shown when the remote task-list request fails. */
export function buildErrorTaskListQueryState(
  current: TaskListQueryState
): TaskListQueryState {
  return {
    ...current,
    errorMessage: 'Nao foi possivel carregar a lista de tarefas.',
    isLoading: false
  };
}
