import { Stack, Text } from '@chakra-ui/react';
import type { TaskCategoryOption } from '../../../shared/types';
import { buildTaskInlineCategoryOptionListState } from '../state/taskInlineCategoryFieldState';
import TaskInlineCategoryOptionButton from './TaskInlineCategoryOptionButton';

export type TaskInlineCategoryOptionListProps = {
  categoryOptions: TaskCategoryOption[];
  listboxId: string;
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
};

/** Renders the scrollable list of existing categories inside the picker popover. */
export default function TaskInlineCategoryOptionList({
  categoryOptions,
  listboxId,
  selectedCategoryId,
  onSelectCategory
}: TaskInlineCategoryOptionListProps) {
  const { hasResults, optionItems } = buildTaskInlineCategoryOptionListState({
    categoryOptions,
    selectedCategoryId
  });

  return (
    <Stack id={listboxId} role="listbox" spacing={1}>
      {optionItems.map((optionItem) => (
        <TaskInlineCategoryOptionButton
          key={optionItem.id}
          id={optionItem.id}
          isSelected={optionItem.isSelected}
          label={optionItem.name}
          onSelect={onSelectCategory}
        />
      ))}

      {!hasResults ? (
        <Text px={3} py={2} fontSize="sm" color="gray.500">
          Nenhuma categoria encontrada.
        </Text>
      ) : null}
    </Stack>
  );
}
