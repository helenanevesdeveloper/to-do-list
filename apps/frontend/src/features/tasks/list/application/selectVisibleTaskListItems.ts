import type { TaskListFilters, TaskListItem } from '../../shared/types.js';

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

/** Applies the current dashboard filters to locally available task-list items. */
export function selectVisibleTaskListItems({
  items,
  filters
}: SelectVisibleTaskListItemsArgs): TaskListItem[] {
  return items
    .filter((item) => matchesScope(item, filters))
    .filter((item) => matchesStatus(item, filters))
    .filter((item) => matchesCategory(item, filters))
    .slice(0, filters.pageSize);
}
