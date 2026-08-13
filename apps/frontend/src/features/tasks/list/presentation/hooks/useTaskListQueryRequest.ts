import { useEffect } from 'react';
import type { TaskListFilters, TaskListPage } from '../../../shared/types';

export type TaskListLoader = (filters: TaskListFilters) => Promise<TaskListPage>;

export type UseTaskListQueryRequestArgs = {
  filters: TaskListFilters;
  loader: TaskListLoader;
  reloadToken: number;
  onError: () => void;
  onLoading: () => void;
  onSuccess: (page: TaskListPage) => void;
};

/** Executes the remote request lifecycle for the task-list query. */
export function useTaskListQueryRequest({
  filters,
  loader,
  reloadToken,
  onError,
  onLoading,
  onSuccess
}: UseTaskListQueryRequestArgs): void {
  useEffect(() => {
    let isActive = true;

    onLoading();

    loader(filters)
      .then((page) => {
        if (!isActive) {
          return;
        }

        onSuccess(page);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        onError();
      });

    return () => {
      isActive = false;
    };
  }, [
    filters.categoryId,
    filters.page,
    filters.pageSize,
    filters.scope,
    filters.status,
    loader,
    onError,
    onLoading,
    onSuccess,
    reloadToken
  ]);
}
