import { Box, FormControl } from '@chakra-ui/react';
import type { TaskCategoryOption } from '../../../shared/types';
import { useTaskInlineCategoryField } from '../hooks/useTaskInlineCategoryField';
import TaskInlineCategoryPopover from './TaskInlineCategoryPopover';
import TaskInlineCategoryTrigger from './TaskInlineCategoryTrigger';

export type TaskInlineCategoryFieldProps = {
  categoryOptions: TaskCategoryOption[];
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onSelectCategory: (categoryId: string) => void;
  value: string;
};

/** Composes the clickable category trigger and its anchored local picker popover. */
export default function TaskInlineCategoryField({
  categoryOptions,
  onCreateCategory,
  onSelectCategory,
  value
}: TaskInlineCategoryFieldProps) {
  const {
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

  return (
    <FormControl flex={{ md: '1.2' }} position="relative">
      <Box ref={rootRef}>
        <TaskInlineCategoryTrigger
          isOpen={isOpen}
          label={triggerLabel}
          onClick={handleFieldClick}
        />

        {isOpen ? (
          <TaskInlineCategoryPopover
            create={{
              categoryErrorMessage,
              canCreateCategory,
              createLabel,
              isCreatingCategory,
              onCreateCategory: createCategory
            }}
            list={{
              categoryOptions: filteredCategoryOptions,
              listboxId,
              selectedCategoryId: value,
              onSelectCategory: selectCategory
            }}
            search={{
              inputRef,
              query,
              selectedCategory,
              onClearSelectedCategory: clearSelectedCategory,
              onQueryChange: handleInputChange
            }}
          />
        ) : null}
      </Box>
    </FormControl>
  );
}
