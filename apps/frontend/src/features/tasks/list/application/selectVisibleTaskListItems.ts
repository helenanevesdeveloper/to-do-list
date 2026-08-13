import type { TaskListFilters, TaskListItem, TaskListPage } from '../../shared/types';
import { buildTaskListPage } from './buildTaskListPage';

type SelectVisibleTaskListItemsArgs = {
  items: TaskListItem[];
  filters: TaskListFilters;
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

/** Returns only the task items that match the active dashboard filters. */
export function filterTaskListItemsByFilters(
  items: TaskListItem[],
  filters: TaskListFilters
): TaskListItem[] {
  return items
    .filter((item) => matchesScope(item, filters))
    .filter((item) => matchesStatus(item, filters))
    .filter((item) => matchesCategory(item, filters));
}

/** Applies filters and local pagination to dashboard task-list items. */
export function selectVisibleTaskListItems({
  items,
  filters
}: SelectVisibleTaskListItemsArgs): TaskListPage {
  const visibleItems = filterTaskListItemsByFilters(items, filters);
  const pageItems = visibleItems.slice(
    (filters.page - 1) * filters.pageSize,
    filters.page * filters.pageSize
  );

  return buildTaskListPage({
    items: pageItems,
    page: filters.page,
    pageSize: filters.pageSize,
    totalItems: visibleItems.length
  });
}
