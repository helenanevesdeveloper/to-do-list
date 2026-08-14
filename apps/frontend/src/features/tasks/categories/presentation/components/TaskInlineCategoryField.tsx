import { Box, FormControl } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo } from 'react';
import type { TaskCategoryOption } from '../../../shared/types';
import {
  TaskInlineCategoryFieldProvider
} from '../context/TaskInlineCategoryFieldContext';
import { useTaskInlineCategoryField } from '../hooks/useTaskInlineCategoryField';
import TaskInlineCategoryOptionActionsPopover from './TaskInlineCategoryOptionActionsPopover';
import TaskInlineCategoryPopover from './TaskInlineCategoryPopover';
import TaskInlineCategoryTrigger from './TaskInlineCategoryTrigger';

export type TaskInlineCategoryFieldProps = {
  categoryOptions: TaskCategoryOption[];
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onOpenChange?: (isOpen: boolean) => void;
  onSelectCategory: (categoryId: string) => void;
  onUpdateCategory: (categoryId: string, name: string) => Promise<TaskCategoryOption>;
  showCategoryActions?: boolean;
  value: string;
};

/** Composes the clickable category trigger and its anchored local picker popover. */
export default function TaskInlineCategoryField({
  categoryOptions,
  onCreateCategory,
  onOpenChange,
  onSelectCategory,
  onUpdateCategory,
  showCategoryActions = false,
  value
}: TaskInlineCategoryFieldProps) {
  const {
    actionsErrorMessage,
    actionsDraftName,
    actionsPopoverPosition,
    actionsPopoverRef,
    activeCategoryAction,
    categoryErrorMessage,
    canCreateCategory,
    closeCategoryActions,
    createLabel,
    filteredCategoryOptions,
    handleActionsDraftNameChange,
    inputRef,
    isCreatingCategory,
    isOpen,
    isUpdatingCategory,
    listboxId,
    openCategoryActions,
    popoverPosition,
    popoverRef,
    query,
    rootRef,
    selectedCategory,
    triggerLabel,
    clearSelectedCategory,
    createCategory,
    handleFieldClick,
    handleInputChange,
    submitCategoryUpdateIfNeeded,
    selectCategory
  } = useTaskInlineCategoryField({
    categoryOptions,
    onCreateCategory,
    onSelectCategory,
    onUpdateCategory,
    value
  });
  const isAnyPopoverOpen =
    isOpen || (showCategoryActions && actionsPopoverPosition !== null);
  const handleFieldClickWithOpenChange = useCallback((): void => {
    onOpenChange?.(true);
    handleFieldClick();
  }, [handleFieldClick, onOpenChange]);
  const openCategoryActionsWithOpenChange = useCallback(
    (args: {
      anchorElement: HTMLElement;
      categoryId: string;
      categoryName: string;
    }): void => {
      if (!showCategoryActions) {
        return;
      }

      onOpenChange?.(true);
      openCategoryActions(args);
    },
    [onOpenChange, openCategoryActions, showCategoryActions]
  );
  const contextValue = useMemo(
    () => ({
      actionsErrorMessage,
      actionsDraftName,
      actionsPopoverPosition,
      actionsPopoverRef,
      activeCategoryAction,
      categoryErrorMessage,
      canCreateCategory,
      closeCategoryActions,
      createCategory,
      createLabel,
      filteredCategoryOptions,
      handleActionsDraftNameChange,
      inputRef,
      isCreatingCategory,
      isOpen,
      isUpdatingCategory,
      listboxId,
      popoverPosition,
      popoverRef,
      query,
      rootRef,
      selectedCategory,
      selectedCategoryId: value,
      showCategoryActions,
      triggerLabel,
      clearSelectedCategory,
      handleFieldClick: handleFieldClickWithOpenChange,
      handleInputChange,
      openCategoryActions: openCategoryActionsWithOpenChange,
      submitCategoryUpdateIfNeeded,
      selectCategory
    }),
    [
      actionsErrorMessage,
      actionsDraftName,
      actionsPopoverPosition,
      actionsPopoverRef,
      activeCategoryAction,
      categoryErrorMessage,
      canCreateCategory,
      closeCategoryActions,
      createCategory,
      createLabel,
      filteredCategoryOptions,
      handleActionsDraftNameChange,
      inputRef,
      isCreatingCategory,
      isOpen,
      isUpdatingCategory,
      listboxId,
      popoverPosition,
      popoverRef,
      query,
      rootRef,
      selectedCategory,
      value,
      showCategoryActions,
      triggerLabel,
      clearSelectedCategory,
      handleFieldClickWithOpenChange,
      handleInputChange,
      openCategoryActionsWithOpenChange,
      submitCategoryUpdateIfNeeded,
      selectCategory
    ]
  );

  useEffect(() => {
    if (!isAnyPopoverOpen) {
      onOpenChange?.(false);
    }
  }, [isAnyPopoverOpen, onOpenChange]);

  return (
    <TaskInlineCategoryFieldProvider value={contextValue}>
      <FormControl flex={{ md: '1.2' }} position="relative">
        <Box ref={rootRef}>
          <TaskInlineCategoryTrigger />
          {isOpen ? <TaskInlineCategoryPopover /> : null}
          {showCategoryActions && actionsPopoverPosition ? (
            <TaskInlineCategoryOptionActionsPopover />
          ) : null}
        </Box>
      </FormControl>
    </TaskInlineCategoryFieldProvider>
  );
}
