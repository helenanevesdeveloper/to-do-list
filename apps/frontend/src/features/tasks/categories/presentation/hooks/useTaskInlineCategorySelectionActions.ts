import { useCallback, useState } from 'react';
import { mapCreateTaskCategoryError } from '../../application/mapCreateTaskCategoryError';
import type { TaskCategoryOption } from '../../../shared/types';

export type UseTaskInlineCategorySelectionActionsArgs = {
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onSelectCategory: (categoryId: string) => void;
  query: string;
  resetField: () => void;
};

export type UseTaskInlineCategorySelectionActionsResult = {
  categoryErrorMessage: string | null;
  isCreatingCategory: boolean;
  clearSelectedCategory: () => void;
  createCategory: () => Promise<void>;
  selectCategory: (categoryId: string) => void;
};

/** Creates the selection and category-creation commands used by the inline picker. */
export function useTaskInlineCategorySelectionActions({
  onCreateCategory,
  onSelectCategory,
  query,
  resetField
}: UseTaskInlineCategorySelectionActionsArgs): UseTaskInlineCategorySelectionActionsResult {
  const [categoryErrorMessage, setCategoryErrorMessage] = useState<string | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const selectCategory = useCallback((categoryId: string): void => {
    onSelectCategory(categoryId);
    resetField();
  }, [onSelectCategory, resetField]);

  const clearSelectedCategory = useCallback((): void => {
    onSelectCategory('');
  }, [onSelectCategory]);

  const createCategory = useCallback(async (): Promise<void> => {
    const categoryName = query.trim();

    if (!categoryName) {
      return;
    }

    setCategoryErrorMessage(null);
    setIsCreatingCategory(true);

    try {
      const createdCategory = await onCreateCategory(categoryName);
      onSelectCategory(createdCategory.id);
      resetField();
    } catch (error) {
      setCategoryErrorMessage(mapCreateTaskCategoryError(error));
    } finally {
      setIsCreatingCategory(false);
    }
  }, [onCreateCategory, onSelectCategory, query, resetField]);

  return {
    categoryErrorMessage,
    isCreatingCategory,
    clearSelectedCategory,
    createCategory,
    selectCategory
  };
}
