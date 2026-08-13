import { Box, Stack } from '@chakra-ui/react';
import type { TaskCategoryOption } from '../../../shared/types';
import TaskInlineCategoryPopoverCreateFooter from './TaskInlineCategoryPopoverCreateFooter';
import TaskInlineCategoryPopoverListSection from './TaskInlineCategoryPopoverListSection';
import TaskInlineCategoryPopoverSearchHeader from './TaskInlineCategoryPopoverSearchHeader';

export type TaskInlineCategoryPopoverSearchProps = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  query: string;
  selectedCategory: TaskCategoryOption | null;
  onClearSelectedCategory: () => void;
  onQueryChange: (value: string) => void;
};

export type TaskInlineCategoryPopoverListProps = {
  categoryOptions: TaskCategoryOption[];
  listboxId: string;
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
};

export type TaskInlineCategoryPopoverCreateProps = {
  categoryErrorMessage: string | null;
  canCreateCategory: boolean;
  createLabel: string | null;
  isCreatingCategory: boolean;
  onCreateCategory: () => Promise<void>;
};

export type TaskInlineCategoryPopoverProps = {
  create: TaskInlineCategoryPopoverCreateProps;
  list: TaskInlineCategoryPopoverListProps;
  search: TaskInlineCategoryPopoverSearchProps;
};

/** Renders the anchored category picker with fixed header/footer and a scrollable list. */
export default function TaskInlineCategoryPopover({
  create,
  list,
  search
}: TaskInlineCategoryPopoverProps) {
  return (
    <Box
      position="absolute"
      top="calc(100% + 8px)"
      left={0}
      right={0}
      zIndex="dropdown"
      borderWidth="1px"
      borderRadius="xl"
      bg="white"
      shadow="xl"
      overflow="hidden"
    >
      <Stack spacing={0}>
        <TaskInlineCategoryPopoverSearchHeader {...search} />
        <TaskInlineCategoryPopoverListSection {...list} />
        {create.canCreateCategory && create.createLabel ? (
          <TaskInlineCategoryPopoverCreateFooter
            errorMessage={create.categoryErrorMessage}
            createLabel={create.createLabel}
            isLoading={create.isCreatingCategory}
            onCreateCategory={create.onCreateCategory}
          />
        ) : null}
      </Stack>
    </Box>
  );
}
