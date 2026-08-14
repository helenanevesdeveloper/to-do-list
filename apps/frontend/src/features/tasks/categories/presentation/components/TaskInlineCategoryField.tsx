import { Box, FormControl } from '@chakra-ui/react';
import type { TaskCategoryOption } from '../../../shared/types';
import {
  TaskInlineCategoryFieldProvider
} from '../context/TaskInlineCategoryFieldContext';
import { useTaskInlineCategoryField } from '../hooks/useTaskInlineCategoryField';
import { useTaskInlineCategoryFieldContextValue } from '../hooks/useTaskInlineCategoryFieldContextValue';
import TaskInlineCategoryOptionActionsPopover from './TaskInlineCategoryOptionActionsPopover';
import TaskInlineCategoryPopover from './TaskInlineCategoryPopover';
import TaskInlineCategoryTrigger from './TaskInlineCategoryTrigger';

export type TaskInlineCategoryFieldProps = {
  categoryOptions: TaskCategoryOption[];
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
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
  onDeleteCategory,
  onOpenChange,
  onSelectCategory,
  onUpdateCategory,
  showCategoryActions = false,
  value
}: TaskInlineCategoryFieldProps) {
  const field = useTaskInlineCategoryField({
    categoryOptions,
    onCreateCategory,
    onDeleteCategory,
    onSelectCategory,
    onUpdateCategory,
    value
  });
  const { contextValue, showActionsPopover } =
    useTaskInlineCategoryFieldContextValue({
      field,
      onOpenChange,
      showCategoryActions,
      value
    });

  return (
    <TaskInlineCategoryFieldProvider value={contextValue}>
      <FormControl flex={{ md: '1.2' }} position="relative">
        <Box ref={field.rootRef}>
          <TaskInlineCategoryTrigger />
          {field.isOpen ? <TaskInlineCategoryPopover /> : null}
          {showActionsPopover ? (
            <TaskInlineCategoryOptionActionsPopover />
          ) : null}
        </Box>
      </FormControl>
    </TaskInlineCategoryFieldProvider>
  );
}
