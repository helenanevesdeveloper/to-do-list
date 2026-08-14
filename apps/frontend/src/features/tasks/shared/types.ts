/** Shared frontend types for the tasks feature. */
export type TaskScopeFilter = 'owned' | 'shared' | 'all';

/** Supported completion-status filters for the task list. */
export type TaskStatusFilter = 'all' | 'pending' | 'completed';

/** Minimal category shape required by the dashboard filter controls. */
export type TaskCategoryOption = {
  id: string;
  name: string;
};

/** Minimal category payload rendered inside task list items. */
export type TaskCategorySummary = {
  id: string;
  name: string;
  color: string | null;
};

/** Sharing summary rendered in task list rows and cards. */
export type TaskSharingSummary = {
  isOwner: boolean;
  permission: string | null;
  isShared: boolean;
  sharedCount: number;
};

/** Frontend task-list item shape aligned with the current backend contract. */
export type TaskListItem = {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  category: TaskCategorySummary | null;
  sharing: TaskSharingSummary;
};

/** Paginated task-list state consumed by the dashboard results and pagination UI. */
export type TaskListPage = {
  currentPage: number;
  endItem: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: TaskListItem[];
  startItem: number;
  totalItems: number;
  totalPages: number;
};

/** Filter state used by the task list controls on the dashboard. */
export type TaskListFilters = {
  page: number;
  scope: TaskScopeFilter;
  status: TaskStatusFilter;
  categoryId: string;
  pageSize: number;
};

/** Default filter state for the initial dashboard render. */
export const DEFAULT_TASK_LIST_FILTERS: TaskListFilters = {
  page: 1,
  scope: 'all',
  status: 'all',
  categoryId: '',
  pageSize: 20
};

/** Allowed task-list page size options exposed by the toolbar. */
export const TASK_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
