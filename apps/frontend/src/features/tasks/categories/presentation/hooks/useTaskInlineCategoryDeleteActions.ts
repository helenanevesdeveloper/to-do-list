import { useCallback, useEffect, useState } from 'react';
import { mapDeleteTaskCategoryError } from '../../application/mapDeleteTaskCategoryError';
import type { ActiveTaskInlineCategoryAction } from './useTaskInlineCategoryActionsPopoverState';

export interface UseTaskInlineCategoryDeleteActionsArgs {
  activeCategoryAction: ActiveTaskInlineCategoryAction | null;
  clearSelectedCategory: () => void;
  closeCategoryActions: () => void;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  selectedCategoryId: string;
}

export interface UseTaskInlineCategoryDeleteActionsResult {
  actionErrorMessage: string | null;
  clearActionErrorMessage: () => void;
  deleteCategory: () => Promise<void>;
  isDeletingCategory: boolean;
}

/** Owns category delete submission, local loading state, and user-facing errors. */
export function useTaskInlineCategoryDeleteActions({
  activeCategoryAction,
  clearSelectedCategory,
  closeCategoryActions,
  onDeleteCategory,
  selectedCategoryId
}: UseTaskInlineCategoryDeleteActionsArgs): UseTaskInlineCategoryDeleteActionsResult {
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  const clearActionErrorMessage = useCallback((): void => {
    setActionErrorMessage(null);
  }, []);

  const deleteCategory = useCallback(async (): Promise<void> => {
    if (!activeCategoryAction) {
      return;
    }

    clearActionErrorMessage();
    setIsDeletingCategory(true);

    try {
      await onDeleteCategory(activeCategoryAction.categoryId);

      if (selectedCategoryId === activeCategoryAction.categoryId) {
        clearSelectedCategory();
      }

      closeCategoryActions();
    } catch (error) {
      setActionErrorMessage(mapDeleteTaskCategoryError(error));
    } finally {
      setIsDeletingCategory(false);
    }
  }, [
    activeCategoryAction,
    clearActionErrorMessage,
    clearSelectedCategory,
    closeCategoryActions,
    onDeleteCategory,
    selectedCategoryId
  ]);

  useEffect(() => {
    setActionErrorMessage(null);
  }, [activeCategoryAction?.categoryId]);

  return {
    actionErrorMessage,
    clearActionErrorMessage,
    deleteCategory,
    isDeletingCategory
  };
}
