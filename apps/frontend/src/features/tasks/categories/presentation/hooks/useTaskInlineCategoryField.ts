import { useCallback, useMemo } from 'react';
import type { TaskCategoryOption } from '../../../shared/types';
import {
  buildTaskInlineCategoryFieldState,
} from '../state/taskInlineCategoryFieldState';
import {
  useTaskInlineCategoryFieldEffects
} from './useTaskInlineCategoryFieldEffects';
import {
  useTaskInlineCategoryPopoverState
} from './useTaskInlineCategoryPopoverState';
import {
  useTaskInlineCategorySelectionActions
} from './useTaskInlineCategorySelectionActions';

export type UseTaskInlineCategoryFieldArgs = {
  categoryOptions: TaskCategoryOption[];
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onSelectCategory: (categoryId: string) => void;
  value: string;
};

export type UseTaskInlineCategoryFieldResult = {
  categoryErrorMessage: string | null;
  canCreateCategory: boolean;
  createLabel: string | null;
  filteredCategoryOptions: TaskCategoryOption[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  isCreatingCategory: boolean;
  isOpen: boolean;
  listboxId: string;
  query: string;
  rootRef: React.RefObject<HTMLDivElement | null>;
  selectedCategory: TaskCategoryOption | null;
  triggerLabel: string;
  clearSelectedCategory: () => void;
  closeField: () => void;
  createCategory: () => Promise<void>;
  handleFieldClick: () => void;
  handleInputChange: (value: string) => void;
  openField: () => void;
  selectCategory: (categoryId: string) => void;
};

/** Manages local selection and creation state for the inline task-category picker. */
export function useTaskInlineCategoryField({
  categoryOptions,
  onCreateCategory,
  onSelectCategory,
  value
}: UseTaskInlineCategoryFieldArgs): UseTaskInlineCategoryFieldResult {
  const {
    inputRef,
    isOpen,
    listboxId,
    query,
    rootRef,
    closeField,
    handleFieldClick,
    handleInputChange,
    openField,
    resetField
  } = useTaskInlineCategoryPopoverState();

  const {
    canCreateCategory,
    createLabel,
    filteredCategoryOptions,
    selectedCategory,
    triggerLabel
  } = useMemo(
    () => buildTaskInlineCategoryFieldState(categoryOptions, query, value),
    [categoryOptions, query, value]
  );

  const {
    categoryErrorMessage,
    clearSelectedCategory,
    createCategory,
    isCreatingCategory,
    selectCategory
  } =
    useTaskInlineCategorySelectionActions({
      onCreateCategory,
      onSelectCategory,
      query,
      resetField
    });

  const handlePointerDownOutside = useCallback((): void => {
    resetField();
  }, [resetField]);

  useTaskInlineCategoryFieldEffects({
    inputRef,
    isOpen,
    onPointerDownOutside: handlePointerDownOutside,
    rootRef
  });

  return {
    categoryErrorMessage,
    canCreateCategory,
    createLabel,
    filteredCategoryOptions,
    inputRef,
    isCreatingCategory,
    isOpen,
    listboxId,
    query,
    rootRef,
    selectedCategory,
    triggerLabel,
    clearSelectedCategory,
    closeField,
    createCategory,
    handleFieldClick,
    handleInputChange,
    openField,
    selectCategory
  };
}
