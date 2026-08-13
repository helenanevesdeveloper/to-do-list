import { useEffect, useState } from 'react';
import { createTaskCategoryApi } from '../../../categories/infrastructure/createTaskCategoryApi';
import { useTaskCategories } from '../../../categories/presentation/hooks/useTaskCategories';
import { createTasksApi } from '../../../create/infrastructure/createTasksApi';
import type { TaskInlineCreateInput } from '../../../create/presentation/hooks/useTaskInlineCreate';
import { useTaskListFilters } from '../../../list/presentation/hooks/useTaskListFilters';
import { useTaskListQuery } from '../../../list/presentation/hooks/useTaskListQuery';
import type { TaskCategoryOption } from '../../../shared/types';

/** Orchestrates dashboard state while reads and category/task creation use the backend. */
export function useTaskDashboard() {
  const [localCategoryOptions, setLocalCategoryOptions] = useState<TaskCategoryOption[]>(
    []
  );
  const {
    errorMessage: categoryErrorMessage,
    isLoading: isLoadingCategories,
    options: remoteCategoryOptions
  } = useTaskCategories();
  const { filters, actions } = useTaskListFilters();
  const { errorMessage, isLoading, page, reload } = useTaskListQuery(filters);
  const categoryOptions = [...remoteCategoryOptions, ...localCategoryOptions];
  const paginatedTasks = page;

  useEffect(() => {
    if (paginatedTasks.currentPage !== filters.page) {
      actions.setPage(paginatedTasks.currentPage);
    }
  }, [actions, filters.page, paginatedTasks.currentPage]);

  async function handleCreateTask(input: TaskInlineCreateInput): Promise<void> {
    await createTasksApi(input);

    if (filters.page === 1) {
      reload();
      return;
    }

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
