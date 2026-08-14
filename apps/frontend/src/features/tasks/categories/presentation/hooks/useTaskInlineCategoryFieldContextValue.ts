import { useCallback, useEffect, useMemo } from 'react';
import type {
  TaskInlineCategoryFieldContextValue
} from '../context/TaskInlineCategoryFieldContext';
import type { OpenTaskInlineCategoryActionsArgs } from './useTaskInlineCategoryActionsPopoverState';
import type { UseTaskInlineCategoryFieldResult } from './useTaskInlineCategoryField';

export interface UseTaskInlineCategoryFieldContextValueArgs {
  field: UseTaskInlineCategoryFieldResult;
  onOpenChange?: (isOpen: boolean) => void;
  showCategoryActions: boolean;
  value: string;
}

export interface UseTaskInlineCategoryFieldContextValueResult {
  contextValue: TaskInlineCategoryFieldContextValue;
  showActionsPopover: boolean;
}

/** Builds the context contract consumed by the inline category field subtree. */
export function useTaskInlineCategoryFieldContextValue({
  field,
  onOpenChange,
  showCategoryActions,
  value
}: UseTaskInlineCategoryFieldContextValueArgs): UseTaskInlineCategoryFieldContextValueResult {
  const showActionsPopover =
    showCategoryActions && field.actionsPopoverPosition !== null;
  const isAnyPopoverOpen = field.isOpen || showActionsPopover;

  const handleFieldClickWithOpenChange = useCallback((): void => {
    onOpenChange?.(true);
    field.handleFieldClick();
  }, [field, onOpenChange]);

  const openCategoryActionsWithOpenChange = useCallback(
    (args: OpenTaskInlineCategoryActionsArgs): void => {
      if (!showCategoryActions) {
        return;
      }

      onOpenChange?.(true);
      field.openCategoryActions(args);
    },
    [field, onOpenChange, showCategoryActions]
  );

  const selectCategoryWithOpenChange = useCallback((categoryId: string): void => {
    onOpenChange?.(false);
    field.selectCategory(categoryId);
  }, [field, onOpenChange]);

  const contextValue = useMemo<TaskInlineCategoryFieldContextValue>(
    () => ({
      actionsErrorMessage: field.actionsErrorMessage,
      actionsDraftName: field.actionsDraftName,
      actionsPopoverPosition: field.actionsPopoverPosition,
      actionsPopoverRef: field.actionsPopoverRef,
      activeCategoryAction: field.activeCategoryAction,
      categoryErrorMessage: field.categoryErrorMessage,
      canCreateCategory: field.canCreateCategory,
      closeCategoryActions: field.closeCategoryActions,
      createCategory: field.createCategory,
      createLabel: field.createLabel,
      deleteCategory: field.deleteCategory,
      filteredCategoryOptions: field.filteredCategoryOptions,
      handleActionsDraftNameChange: field.handleActionsDraftNameChange,
      handleFieldClick: handleFieldClickWithOpenChange,
      handleInputChange: field.handleInputChange,
      inputRef: field.inputRef,
      isCreatingCategory: field.isCreatingCategory,
      isDeletingCategory: field.isDeletingCategory,
      isOpen: field.isOpen,
      isUpdatingCategory: field.isUpdatingCategory,
      listboxId: field.listboxId,
      openCategoryActions: openCategoryActionsWithOpenChange,
      popoverPosition: field.popoverPosition,
      popoverRef: field.popoverRef,
      query: field.query,
      rootRef: field.rootRef,
      selectedCategory: field.selectedCategory,
      selectedCategoryId: value,
      showCategoryActions,
      submitCategoryUpdateIfNeeded: field.submitCategoryUpdateIfNeeded,
      triggerLabel: field.triggerLabel,
      clearSelectedCategory: field.clearSelectedCategory,
      selectCategory: selectCategoryWithOpenChange
    }),
    [
      field,
      handleFieldClickWithOpenChange,
      openCategoryActionsWithOpenChange,
      selectCategoryWithOpenChange,
      showCategoryActions,
      value
    ]
  );

  useEffect(() => {
    if (!isAnyPopoverOpen) {
      queueMicrotask(() => {
        onOpenChange?.(false);
      });
    }
  }, [isAnyPopoverOpen, onOpenChange]);

  return {
    contextValue,
    showActionsPopover
  };
}
