import { useState } from 'react';
import {
  DEFAULT_TASK_LIST_FILTERS,
  type TaskListFilters,
  type TaskScopeFilter,
  type TaskStatusFilter
} from '../../shared/types.js';

/** Write actions supported by the dashboard task-list filters. */
export type TaskListFilterActions = {
  setScope: (value: TaskScopeFilter) => void;
  setStatus: (value: TaskStatusFilter) => void;
  setCategoryId: (value: string) => void;
  setPageSize: (value: number) => void;
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

  function setScope(value: TaskScopeFilter): void {
    setFilters((current) => ({ ...current, scope: value }));
  }

  function setStatus(value: TaskStatusFilter): void {
    setFilters((current) => ({ ...current, status: value }));
  }

  function setCategoryId(value: string): void {
    setFilters((current) => ({ ...current, categoryId: value }));
  }

  function setPageSize(value: number): void {
    setFilters((current) => ({ ...current, pageSize: value }));
  }

  function resetScope(): void {
    setFilters((current) => ({
      ...current,
      scope: DEFAULT_TASK_LIST_FILTERS.scope
    }));
  }

  function resetStatus(): void {
    setFilters((current) => ({
      ...current,
      status: DEFAULT_TASK_LIST_FILTERS.status
    }));
  }

  function resetCategory(): void {
    setFilters((current) => ({
      ...current,
      categoryId: DEFAULT_TASK_LIST_FILTERS.categoryId
    }));
  }

  function resetAll(): void {
    setFilters(DEFAULT_TASK_LIST_FILTERS);
  }

  return {
    filters,
    actions: {
      setScope,
      setStatus,
      setCategoryId,
      setPageSize,
      resetScope,
      resetStatus,
      resetCategory,
      resetAll
    }
  };
}
