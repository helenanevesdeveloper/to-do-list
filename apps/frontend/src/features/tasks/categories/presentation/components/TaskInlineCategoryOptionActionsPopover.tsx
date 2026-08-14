import { Box, Button, Input, Portal, Stack, Text } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import {
  TASK_INLINE_OVERLAY_ATTRIBUTE
} from '../../../shared/presentation/constants/taskInlineOverlay';
import {
  useTaskInlineCategoryFieldContext
} from '../context/TaskInlineCategoryFieldContext';
import {
  buildTaskInlineCategoryOptionActionsPopoverState
} from '../state/taskInlineCategoryOptionActionsPopoverState';

export interface TaskInlineCategoryOptionActionsPopoverContentProps {
  deleteLabel: string;
  errorMessage: string | null;
  inputPlaceholder: string;
  isDeleting: boolean;
  isUpdating: boolean;
  statusMessage: string | null;
  value: string;
  onDelete: () => void;
  onValueChange: (value: string) => void;
}

/** Renders only the body content of the category-actions secondary popover. */
function TaskInlineCategoryOptionActionsPopoverContent({
  deleteLabel,
  errorMessage,
  inputPlaceholder,
  isDeleting,
  isUpdating,
  statusMessage,
  value,
  onDelete,
  onValueChange
}: TaskInlineCategoryOptionActionsPopoverContentProps) {
  return (
    <Stack spacing={3}>
      <Text fontSize="xs" fontWeight="semibold" color="gray.500">
        Acoes da categoria
      </Text>
      <Input
        aria-label="Editar nome da categoria"
        placeholder={inputPlaceholder}
        value={value}
        isDisabled={isUpdating}
        onChange={(event) => onValueChange(event.target.value)}
      />
      {errorMessage ? (
        <Text fontSize="sm" color="red.500">
          {errorMessage}
        </Text>
      ) : null}
      {statusMessage ? (
        <Text fontSize="sm" color="gray.500">
          {statusMessage}
        </Text>
      ) : null}

      <Button
        justifyContent="flex-start"
        variant="ghost"
        colorScheme="red"
        leftIcon={<FiTrash2 />}
        isDisabled={isUpdating || isDeleting}
        isLoading={isDeleting}
        onClick={onDelete}
      >
        {deleteLabel}
      </Button>
    </Stack>
  );
}

/** Renders the secondary popover used to expose actions for one existing category. */
export default function TaskInlineCategoryOptionActionsPopover() {
  const {
    actionsErrorMessage,
    actionsDraftName,
    activeCategoryAction,
    actionsPopoverPosition,
    actionsPopoverRef,
    deleteCategory,
    handleActionsDraftNameChange,
    isDeletingCategory,
    isUpdatingCategory
  } = useTaskInlineCategoryFieldContext();
  const state = buildTaskInlineCategoryOptionActionsPopoverState({
    activeCategoryAction,
    draftName: actionsDraftName,
    errorMessage: actionsErrorMessage,
    isDeleting: isDeletingCategory,
    isUpdating: isUpdatingCategory
  });

  function handleMouseDown(event: MouseEvent<HTMLDivElement>): void {
    event.stopPropagation();
  }

  if (!actionsPopoverPosition) {
    return null;
  }

  return (
    <Portal>
      <Box
        ref={actionsPopoverRef}
        {...{ [TASK_INLINE_OVERLAY_ATTRIBUTE]: '' }}
        position="fixed"
        top={`${actionsPopoverPosition.top}px`}
        left={`${actionsPopoverPosition.left}px`}
        width="280px"
        zIndex="popover"
        borderWidth="1px"
        borderRadius="xl"
        bg="white"
        shadow="xl"
        p={3}
        onMouseDown={handleMouseDown}
      >
        <TaskInlineCategoryOptionActionsPopoverContent
          deleteLabel={state.deleteLabel}
          errorMessage={state.errorMessage}
          inputPlaceholder={state.inputPlaceholder}
          isDeleting={state.isDeleting}
          isUpdating={state.isUpdating}
          statusMessage={state.statusMessage}
          value={state.value}
          onDelete={deleteCategory}
          onValueChange={handleActionsDraftNameChange}
        />
      </Box>
    </Portal>
  );
}
