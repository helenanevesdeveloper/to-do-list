import { useEffect, useState } from 'react';
import { createTaskCategoryApi } from '../../../categories/infrastructure/createTaskCategoryApi';
import { useTaskCategories } from '../../../categories/presentation/hooks/useTaskCategories';
import { createLocalTaskListItem } from '../../../create/application/createLocalTaskListItem';
import type { TaskInlineCreateInput } from '../../../create/presentation/hooks/useTaskInlineCreate';
import { useTaskListFilters } from '../../../list/presentation/hooks/useTaskListFilters';
import { useTaskListQuery } from '../../../list/presentation/hooks/useTaskListQuery';
import type { TaskCategoryOption, TaskListItem, TaskListPage } from '../../../shared/types';

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

/** Orchestrates dashboard state while reads come from the backend and task creation remains local. */
export function useTaskDashboard() {
  const [localCategoryOptions, setLocalCategoryOptions] = useState<TaskCategoryOption[]>(
    []
  );
  const [optimisticPage, setOptimisticPage] = useState<TaskListPage | null>(null);
  const {
    errorMessage: categoryErrorMessage,
    isLoading: isLoadingCategories,
    options: remoteCategoryOptions
  } = useTaskCategories();
  const { filters, actions } = useTaskListFilters();
  const { errorMessage, isLoading, page, reload } = useTaskListQuery(filters);
  const categoryOptions = [...remoteCategoryOptions, ...localCategoryOptions];
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

  async function handleCreateCategory(name: string): Promise<TaskCategoryOption> {
    const createdCategory = await createTaskCategoryApi({ name });

    setLocalCategoryOptions((current) => [...current, createdCategory]);
    return createdCategory;
  }

  function handleTaskClick(): void {}

  return {
    actions,
    categoryErrorMessage,
    categoryOptions,
    errorMessage,
    handleCreateCategory,
    filters,
    handleCreateTask,
    handleTaskClick,
    isLoading,
    isLoadingCategories,
    paginatedTasks,
    reloadTasks: reload
  };
}
