import type { TaskListItem, TaskListPage } from '../../shared/types';

export type BuildTaskListPageArgs = {
  items: TaskListItem[];
  page: number;
  pageSize: number;
  totalItems: number;
};

/** Builds the pagination metadata expected by the dashboard from one page of tasks. */
export function buildTaskListPage({
  items,
  page,
  pageSize,
  totalItems
}: BuildTaskListPageArgs): TaskListPage {
  const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / pageSize);
  const currentPage = page > totalPages ? totalPages : page;
  const startOffset = (currentPage - 1) * pageSize;
  const startItem = items.length === 0 ? 0 : startOffset + 1;
  const endItem = items.length === 0 ? 0 : startOffset + items.length;

  return {
    currentPage,
    endItem,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    items,
    startItem,
    totalItems,
    totalPages
  };
}
