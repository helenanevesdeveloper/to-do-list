import type { TaskCategoryOption } from '../../../shared/types';

export type UseTaskInlineCategorySelectionActionsArgs = {
  onCreateCategory: (name: string) => TaskCategoryOption;
  onSelectCategory: (categoryId: string) => void;
  query: string;
  resetField: () => void;
};

export type UseTaskInlineCategorySelectionActionsResult = {
  clearSelectedCategory: () => void;
  createCategory: () => void;
  selectCategory: (categoryId: string) => void;
};

/** Creates the selection and category-creation commands used by the inline picker. */
export function useTaskInlineCategorySelectionActions({
  onCreateCategory,
  onSelectCategory,
  query,
  resetField
}: UseTaskInlineCategorySelectionActionsArgs): UseTaskInlineCategorySelectionActionsResult {
  function selectCategory(categoryId: string): void {
    onSelectCategory(categoryId);
    resetField();
  }

  function clearSelectedCategory(): void {
    onSelectCategory('');
  }

  function createCategory(): void {
    const categoryName = query.trim();

    if (!categoryName) {
      return;
    }

    const createdCategory = onCreateCategory(categoryName);
    onSelectCategory(createdCategory.id);
    resetField();
  }

  return {
    clearSelectedCategory,
    createCategory,
    selectCategory
  };
}
