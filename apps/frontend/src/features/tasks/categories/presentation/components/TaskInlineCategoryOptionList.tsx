import { Stack, Text } from '@chakra-ui/react';
import { buildTaskInlineCategoryOptionListState } from '../state/taskInlineCategoryFieldState';
import {
  useTaskInlineCategoryFieldContext
} from '../context/TaskInlineCategoryFieldContext';
import TaskInlineCategoryOptionButton from './TaskInlineCategoryOptionButton';

/** Renders the scrollable list of existing categories inside the picker popover. */
export default function TaskInlineCategoryOptionList() {
  const { filteredCategoryOptions, listboxId, selectedCategoryId, selectCategory } =
    useTaskInlineCategoryFieldContext();
  const { hasResults, optionItems } = buildTaskInlineCategoryOptionListState({
    categoryOptions: filteredCategoryOptions,
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
          onSelect={selectCategory}
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
