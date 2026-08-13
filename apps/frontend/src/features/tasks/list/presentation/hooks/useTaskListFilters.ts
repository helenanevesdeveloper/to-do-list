import { useState } from 'react';
import {
  DEFAULT_TASK_LIST_FILTERS,
  type TaskListFilters,
  type TaskScopeFilter,
  type TaskStatusFilter
} from '../../../shared/types.js';

/** Write actions supported by the dashboard task-list filters. */
export type TaskListFilterActions = {
  setPage: (value: number) => void;
  setScope: (value: TaskScopeFilter) => void;
  setStatus: (value: TaskStatusFilter) => void;
  setCategoryId: (value: string) => void;
  setPageSize: (value: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  resetScope: () => void;
  resetStatus: () => void;
  resetCategory: () => void;
  resetAll: () => void;
};

/** Owns dashboard task-list filter state and reset actions. */
export function useTaskListFilters(): {
  filters: TaskListFilters;
  actions: TaskListFilterActions;
} {
  const [filters, setFilters] = useState<TaskListFilters>(DEFAULT_TASK_LIST_FILTERS);

  function setPage(value: number): void {
    setFilters((current) => ({
      ...current,
      page: value < 1 ? 1 : value
    }));
  }

  function setScope(value: TaskScopeFilter): void {
    setFilters((current) => ({ ...current, page: 1, scope: value }));
  }

  function setStatus(value: TaskStatusFilter): void {
    setFilters((current) => ({ ...current, page: 1, status: value }));
  }

  function setCategoryId(value: string): void {
    setFilters((current) => ({ ...current, categoryId: value, page: 1 }));
  }

  function setPageSize(value: number): void {
    setFilters((current) => ({ ...current, page: 1, pageSize: value }));
  }

  function goToPreviousPage(): void {
    setFilters((current) => ({
      ...current,
      page: current.page > 1 ? current.page - 1 : 1
    }));
  }

  function goToNextPage(): void {
    setFilters((current) => ({
      ...current,
      page: current.page + 1
    }));
  }

  function resetScope(): void {
    setFilters((current) => ({
      ...current,
      page: 1,
      scope: DEFAULT_TASK_LIST_FILTERS.scope
    }));
  }

  function resetStatus(): void {
    setFilters((current) => ({
      ...current,
      page: 1,
      status: DEFAULT_TASK_LIST_FILTERS.status
    }));
  }

  function resetCategory(): void {
    setFilters((current) => ({
      ...current,
      page: 1,
      categoryId: DEFAULT_TASK_LIST_FILTERS.categoryId
    }));
  }

  function resetAll(): void {
    setFilters(DEFAULT_TASK_LIST_FILTERS);
  }

  return {
    filters,
    actions: {
      setPage,
      setScope,
      setStatus,
      setCategoryId,
      setPageSize,
      goToPreviousPage,
      goToNextPage,
      resetScope,
      resetStatus,
      resetCategory,
      resetAll
    }
  };
}
