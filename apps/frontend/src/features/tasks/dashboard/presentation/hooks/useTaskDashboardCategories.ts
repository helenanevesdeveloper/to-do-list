import { useState } from 'react';
import { createTaskCategoryApi } from '../../../categories/infrastructure/createTaskCategoryApi';
import { useTaskCategories } from '../../../categories/presentation/hooks/useTaskCategories';
import type { TaskCategoryOption } from '../../../shared/types';

export interface UseTaskDashboardCategoriesResult {
  categoryErrorMessage: string | null;
  categoryOptions: TaskCategoryOption[];
  handleCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  isLoadingCategories: boolean;
}

/** Owns remote category loading plus local optimistic additions for the dashboard. */
export function useTaskDashboardCategories(): UseTaskDashboardCategoriesResult {
  const [localCategoryOptions, setLocalCategoryOptions] = useState<TaskCategoryOption[]>(
    []
  );
  const {
    errorMessage: categoryErrorMessage,
    isLoading: isLoadingCategories,
    options: remoteCategoryOptions
  } = useTaskCategories();

  async function handleCreateCategory(name: string): Promise<TaskCategoryOption> {
    const createdCategory = await createTaskCategoryApi({ name });

    setLocalCategoryOptions((current) => [...current, createdCategory]);
    return createdCategory;
  }

  return {
    categoryErrorMessage,
    categoryOptions: [...remoteCategoryOptions, ...localCategoryOptions],
    handleCreateCategory,
    isLoadingCategories
  };
}
