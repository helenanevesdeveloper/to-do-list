import { Box, Button, Input, Portal, Stack, Text } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import {
  useTaskInlineCategoryFieldContext
} from '../context/TaskInlineCategoryFieldContext';
import {
  buildTaskInlineCategoryOptionActionsPopoverState
} from '../state/taskInlineCategoryOptionActionsPopoverState';

export interface TaskInlineCategoryOptionActionsPopoverContentProps {
  errorMessage: string | null;
  inputPlaceholder: string;
  isUpdating: boolean;
  statusMessage: string | null;
  value: string;
  onValueChange: (value: string) => void;
}

/** Renders only the body content of the category-actions secondary popover. */
function TaskInlineCategoryOptionActionsPopoverContent({
  errorMessage,
  inputPlaceholder,
  isUpdating,
  statusMessage,
  value,
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
        isDisabled
      >
        Deletar
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
    handleActionsDraftNameChange,
    isUpdatingCategory
  } = useTaskInlineCategoryFieldContext();
  const state = buildTaskInlineCategoryOptionActionsPopoverState({
    activeCategoryAction,
    draftName: actionsDraftName,
    errorMessage: actionsErrorMessage,
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
          errorMessage={state.errorMessage}
          inputPlaceholder={state.inputPlaceholder}
          isUpdating={state.isUpdating}
          statusMessage={state.statusMessage}
          value={state.value}
          onValueChange={handleActionsDraftNameChange}
        />
      </Box>
    </Portal>
  );
}
