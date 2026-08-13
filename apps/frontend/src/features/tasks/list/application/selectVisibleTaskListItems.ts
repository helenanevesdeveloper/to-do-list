import type { TaskListFilters, TaskListItem } from '../../shared/types';

type SelectVisibleTaskListItemsArgs = {
  items: TaskListItem[];
  filters: TaskListFilters;
};

export type VisibleTaskListItemsResult = {
  currentPage: number;
  endItem: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: TaskListItem[];
  startItem: number;
  totalItems: number;
  totalPages: number;
};

/** Returns whether a task matches the current scope filter. */
function matchesScope(task: TaskListItem, filters: TaskListFilters): boolean {
  if (filters.scope === 'owned') {
    return task.sharing.isOwner;
  }

  if (filters.scope === 'shared') {
    return !task.sharing.isOwner;
  }

  return true;
}

/** Returns whether a task matches the current completion-status filter. */
function matchesStatus(task: TaskListItem, filters: TaskListFilters): boolean {
  if (filters.status === 'pending') {
    return !task.isCompleted;
  }

  if (filters.status === 'completed') {
    return task.isCompleted;
  }

  return true;
}

/** Returns whether a task matches the current category filter. */
function matchesCategory(task: TaskListItem, filters: TaskListFilters): boolean {
  if (!filters.categoryId) {
    return true;
  }

  return task.category?.id === filters.categoryId;
}

/** Applies filters and local pagination to dashboard task-list items. */
export function selectVisibleTaskListItems({
  items,
  filters
}: SelectVisibleTaskListItemsArgs): VisibleTaskListItemsResult {
  const visibleItems = items
    .filter((item) => matchesScope(item, filters))
    .filter((item) => matchesStatus(item, filters))
    .filter((item) => matchesCategory(item, filters));
  const totalItems = visibleItems.length;
  const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / filters.pageSize);
  const currentPage = filters.page > totalPages ? totalPages : filters.page;
  const startOffset = (currentPage - 1) * filters.pageSize;
  const pageItems = visibleItems.slice(startOffset, startOffset + filters.pageSize);
  const startItem = pageItems.length === 0 ? 0 : startOffset + 1;
  const endItem = pageItems.length === 0 ? 0 : startOffset + pageItems.length;

  return {
    currentPage,
    endItem,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    items: pageItems,
    startItem,
    totalItems,
    totalPages
  };
}
