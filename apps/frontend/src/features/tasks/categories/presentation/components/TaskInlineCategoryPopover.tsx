import { Box, Portal, Stack } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import type { TaskCategoryOption } from '../../../shared/types';
import type { TaskInlineCategoryPopoverPosition } from '../hooks/useTaskInlineCategoryPopoverState';
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
  popoverRef: React.RefObject<HTMLDivElement | null>;
  position: TaskInlineCategoryPopoverPosition | null;
  search: TaskInlineCategoryPopoverSearchProps;
};

/** Renders the anchored category picker with fixed header/footer and a scrollable list. */
export default function TaskInlineCategoryPopover({
  create,
  list,
  popoverRef,
  position,
  search
}: TaskInlineCategoryPopoverProps) {
  function handleMouseDown(event: MouseEvent<HTMLDivElement>): void {
    event.stopPropagation();
  }

  if (!position) {
    return null;
  }

  return (
    <Portal>
      <Box
        ref={popoverRef}
        position="fixed"
        top={`${position.top}px`}
        left={`${position.left}px`}
        width={`${position.width}px`}
        zIndex="popover"
        borderWidth="1px"
        borderRadius="xl"
        bg="white"
        shadow="xl"
        overflow="hidden"
        onMouseDown={handleMouseDown}
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
    </Portal>
  );
}
