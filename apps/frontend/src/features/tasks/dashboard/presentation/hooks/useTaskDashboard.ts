import { useEffect, useState } from 'react';
import { createLocalTaskListItem } from '../../../create/application/createLocalTaskListItem';
import type { TaskInlineCreateInput } from '../../../create/presentation/hooks/useTaskInlineCreate';
import { useTaskListFilters } from '../../../list/presentation/hooks/useTaskListFilters';
import { useTaskListQuery } from '../../../list/presentation/hooks/useTaskListQuery';
import type { TaskListItem, TaskListPage } from '../../../shared/types';
import {
  TASK_CATEGORY_SAMPLE_OPTIONS
} from '../../../list/presentation/state/taskListSampleData';

function buildOptimisticTaskListPage(args: {
  createdTaskItem: TaskListItem;
  currentPage: TaskListPage;
  pageSize: number;
}): TaskListPage {
  if (args.currentPage.currentPage !== 1) {
    return args.currentPage;
  }

  const items = [args.createdTaskItem, ...args.currentPage.items].slice(0, args.pageSize);
  const totalItems = args.currentPage.totalItems + 1;
  const totalPages = Math.ceil(totalItems / args.pageSize);

  return {
    currentPage: 1,
    endItem: items.length,
    hasNextPage: totalPages > 1,
    hasPreviousPage: false,
    items,
    startItem: items.length === 0 ? 0 : 1,
    totalItems,
    totalPages
  };
}

/** Orchestrates dashboard state while task reads come from the backend and writes remain local. */
export function useTaskDashboard() {
  const [categoryOptions, setCategoryOptions] = useState(TASK_CATEGORY_SAMPLE_OPTIONS);
  const [optimisticPage, setOptimisticPage] = useState<TaskListPage | null>(null);
  const { filters, actions } = useTaskListFilters();
  const { errorMessage, isLoading, page, reload } = useTaskListQuery(filters);
  const paginatedTasks = optimisticPage ?? page;

  useEffect(() => {
    if (paginatedTasks.currentPage !== filters.page) {
      actions.setPage(paginatedTasks.currentPage);
    }
  }, [actions, filters.page, paginatedTasks.currentPage]);

  useEffect(() => {
    setOptimisticPage(null);
  }, [
    filters.categoryId,
    filters.page,
    filters.pageSize,
    filters.scope,
    filters.status,
    page
  ]);

  function handleCreateTask(input: TaskInlineCreateInput): void {
    const createdTaskItem = createLocalTaskListItem({
      categoryOptions,
      input
    });

    setOptimisticPage((current) =>
      buildOptimisticTaskListPage({
        createdTaskItem,
        currentPage: current ?? page,
        pageSize: filters.pageSize
      })
    );
    actions.setPage(1);
  }

  function handleCreateCategory(name: string) {
    const createdCategory = {
      id: `local-category-${Date.now()}`,
      name
    };

    setCategoryOptions((current) => [...current, createdCategory]);
    return createdCategory;
  }

  function handleTaskClick(): void {}

  return {
    actions,
    categoryOptions,
    errorMessage,
    handleCreateCategory,
    filters,
    handleCreateTask,
    handleTaskClick,
    isLoading,
    paginatedTasks,
    reloadTasks: reload
  };
}
