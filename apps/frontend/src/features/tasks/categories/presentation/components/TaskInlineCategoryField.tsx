import { Box, FormControl } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
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
  value: string;
};

/** Composes the clickable category trigger and its anchored local picker popover. */
export default function TaskInlineCategoryField({
  categoryOptions,
  onCreateCategory,
  onOpenChange,
  onSelectCategory,
  value
}: TaskInlineCategoryFieldProps) {
  const {
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
    selectCategory
  } = useTaskInlineCategoryField({
    categoryOptions,
    onCreateCategory,
    onSelectCategory,
    value
  });
  const isAnyPopoverOpen = isOpen || actionsPopoverPosition !== null;
  const contextValue = useMemo(
    () => ({
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
      listboxId,
      popoverPosition,
      popoverRef,
      query,
      rootRef,
      selectedCategory,
      selectedCategoryId: value,
      triggerLabel,
      clearSelectedCategory,
      handleFieldClick,
      handleInputChange,
      openCategoryActions,
      selectCategory
    }),
    [
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
      listboxId,
      popoverPosition,
      popoverRef,
      query,
      rootRef,
      selectedCategory,
      value,
      triggerLabel,
      clearSelectedCategory,
      handleFieldClick,
      handleInputChange,
      openCategoryActions,
      selectCategory
    ]
  );

  useEffect(() => {
    onOpenChange?.(isAnyPopoverOpen);
  }, [isAnyPopoverOpen, onOpenChange]);

  return (
    <TaskInlineCategoryFieldProvider value={contextValue}>
      <FormControl flex={{ md: '1.2' }} position="relative">
        <Box ref={rootRef}>
          <TaskInlineCategoryTrigger />
          {isOpen ? <TaskInlineCategoryPopover /> : null}
          {actionsPopoverPosition ? (
            <TaskInlineCategoryOptionActionsPopover />
          ) : null}
        </Box>
      </FormControl>
    </TaskInlineCategoryFieldProvider>
  );
}
