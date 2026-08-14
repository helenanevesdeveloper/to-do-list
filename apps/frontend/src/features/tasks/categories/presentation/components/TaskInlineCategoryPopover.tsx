import { Box, Portal, Stack } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import {
  TASK_INLINE_OVERLAY_ATTRIBUTE
} from '../../../shared/presentation/constants/taskInlineOverlay';
import {
  useTaskInlineCategoryFieldContext
} from '../context/TaskInlineCategoryFieldContext';
import TaskInlineCategoryPopoverCreateFooter from './TaskInlineCategoryPopoverCreateFooter';
import TaskInlineCategoryPopoverListSection from './TaskInlineCategoryPopoverListSection';
import TaskInlineCategoryPopoverSearchHeader from './TaskInlineCategoryPopoverSearchHeader';

/** Renders the anchored category picker with fixed header/footer and a scrollable list. */
export default function TaskInlineCategoryPopover() {
  const {
    canCreateCategory,
    createLabel,
    popoverPosition,
    popoverRef
  } = useTaskInlineCategoryFieldContext();

  function handleMouseDown(event: MouseEvent<HTMLDivElement>): void {
    event.stopPropagation();
  }

  if (!popoverPosition) {
    return null;
  }

  return (
    <Portal>
      <Box
        ref={popoverRef}
        {...{ [TASK_INLINE_OVERLAY_ATTRIBUTE]: '' }}
        position="fixed"
        top={`${popoverPosition.top}px`}
        left={`${popoverPosition.left}px`}
        width={`${popoverPosition.width}px`}
        zIndex="popover"
        borderWidth="1px"
        borderRadius="xl"
        bg="white"
        shadow="xl"
        overflow="hidden"
        onMouseDown={handleMouseDown}
      >
        <Stack spacing={0}>
          <TaskInlineCategoryPopoverSearchHeader />
          <TaskInlineCategoryPopoverListSection />
          {canCreateCategory && createLabel ? <TaskInlineCategoryPopoverCreateFooter /> : null}
        </Stack>
      </Box>
    </Portal>
  );
}
