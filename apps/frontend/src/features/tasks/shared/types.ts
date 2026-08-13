/** Shared frontend types for the tasks feature. */
export type TaskScopeFilter = 'owned' | 'shared' | 'all';

/** Supported completion-status filters for the task list. */
export type TaskStatusFilter = 'all' | 'pending' | 'completed';

/** Minimal category shape required by the dashboard filter controls. */
export type TaskCategoryOption = {
  id: string;
  name: string;
};

/** Filter state used by the task list controls on the dashboard. */
export type TaskListFilters = {
  scope: TaskScopeFilter;
  status: TaskStatusFilter;
  categoryId: string;
  pageSize: number;
};

/** Default filter state for the initial dashboard render. */
export const DEFAULT_TASK_LIST_FILTERS: TaskListFilters = {
  scope: 'owned',
  status: 'all',
  categoryId: '',
  pageSize: 20
};

/** Allowed task-list page size options exposed by the toolbar. */
export const TASK_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
