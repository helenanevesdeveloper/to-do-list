import { useCallback, useMemo, useState } from 'react';
import { createTaskCategoryApi } from '../../../categories/infrastructure/createTaskCategoryApi';
import { deleteTaskCategoryApi } from '../../../categories/infrastructure/deleteTaskCategoryApi';
import { updateTaskCategoryApi } from '../../../categories/infrastructure/updateTaskCategoryApi';
import { useTaskCategories } from '../../../categories/presentation/hooks/useTaskCategories';
import type { TaskCategoryOption } from '../../../shared/types';

export interface UseTaskDashboardCategoriesResult {
  categoryErrorMessage: string | null;
  categoryOptions: TaskCategoryOption[];
  handleCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  handleDeleteCategory: (categoryId: string) => Promise<void>;
  handleUpdateCategory: (categoryId: string, name: string) => Promise<TaskCategoryOption>;
  isLoadingCategories: boolean;
}

export interface UseTaskDashboardCategoriesArgs {
  reloadTasks: () => void;
}

function mergeTaskCategoryOptions(
  remoteCategoryOptions: TaskCategoryOption[],
  localCategoryOptions: TaskCategoryOption[]
): TaskCategoryOption[] {
  const mergedCategoryOptions = new Map<string, TaskCategoryOption>();

  remoteCategoryOptions.forEach((categoryOption) => {
    mergedCategoryOptions.set(categoryOption.id, categoryOption);
  });

  localCategoryOptions.forEach((categoryOption) => {
    mergedCategoryOptions.set(categoryOption.id, categoryOption);
  });

  return [...mergedCategoryOptions.values()];
}

function removeLocalTaskCategoryOption(
  current: TaskCategoryOption[],
  categoryId: string
): TaskCategoryOption[] {
  return current.filter((categoryOption) => categoryOption.id !== categoryId);
}

/** Owns remote category loading plus local optimistic additions for the dashboard. */
export function useTaskDashboardCategories({
  reloadTasks
}: UseTaskDashboardCategoriesArgs): UseTaskDashboardCategoriesResult {
  const [localCategoryOptions, setLocalCategoryOptions] = useState<TaskCategoryOption[]>(
    []
  );
  const {
    errorMessage: categoryErrorMessage,
    isLoading: isLoadingCategories,
    options: remoteCategoryOptions,
    reload: reloadCategories
  } = useTaskCategories();

  const applyLocalCategoryOption = useCallback((nextCategoryOption: TaskCategoryOption): void => {
    setLocalCategoryOptions((current) => {
      const currentWithoutCategory = current.filter(
        (categoryOption) => categoryOption.id !== nextCategoryOption.id
      );

      return [...currentWithoutCategory, nextCategoryOption];
    });
  }, []);

  const handleCreateCategory = useCallback(async (name: string): Promise<TaskCategoryOption> => {
    const createdCategory = await createTaskCategoryApi({ name });

    applyLocalCategoryOption(createdCategory);
    return createdCategory;
  }, [applyLocalCategoryOption]);

  const handleUpdateCategory = useCallback(
    async (categoryId: string, name: string): Promise<TaskCategoryOption> => {
      const updatedCategory = await updateTaskCategoryApi({
        categoryId,
        name
      });

      applyLocalCategoryOption(updatedCategory);
      reloadCategories();
      reloadTasks();
      return updatedCategory;
    },
    [applyLocalCategoryOption, reloadCategories, reloadTasks]
  );

  const handleDeleteCategory = useCallback(async (categoryId: string): Promise<void> => {
    await deleteTaskCategoryApi({
      categoryId
    });

    setLocalCategoryOptions((current) =>
      removeLocalTaskCategoryOption(current, categoryId)
    );
    reloadCategories();
    reloadTasks();
  }, [reloadCategories, reloadTasks]);

  const categoryOptions = useMemo(
    () => mergeTaskCategoryOptions(remoteCategoryOptions, localCategoryOptions),
    [localCategoryOptions, remoteCategoryOptions]
  );

  return {
    categoryErrorMessage,
    categoryOptions,
    handleCreateCategory,
    handleDeleteCategory,
    handleUpdateCategory,
    isLoadingCategories
  };
}
