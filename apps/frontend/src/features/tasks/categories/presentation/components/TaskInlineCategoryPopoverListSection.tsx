import { Box, Text } from '@chakra-ui/react';
import type { TaskCategoryOption } from '../../../shared/types';
import TaskInlineCategoryOptionList from './TaskInlineCategoryOptionList';

export type TaskInlineCategoryPopoverListSectionProps = {
  categoryOptions: TaskCategoryOption[];
  listboxId: string;
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
};

/** Renders the popover heading plus the scrollable list of existing categories. */
export default function TaskInlineCategoryPopoverListSection({
  categoryOptions,
  listboxId,
  selectedCategoryId,
  onSelectCategory
}: TaskInlineCategoryPopoverListSectionProps) {
  return (
    <>
      <Box px={4} pt={3} pb={2}>
        <Text fontSize="sm" fontWeight="semibold" color="gray.600">
          Selecione uma opcao ou crie uma
        </Text>
      </Box>

      <Box maxH="240px" overflowY="auto" px={2} pb={2}>
        <TaskInlineCategoryOptionList
          categoryOptions={categoryOptions}
          listboxId={listboxId}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={onSelectCategory}
        />
      </Box>
    </>
  );
}
