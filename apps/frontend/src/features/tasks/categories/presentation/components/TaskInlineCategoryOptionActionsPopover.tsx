import { Box, Button, Input, Portal, Stack, Text } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import {
  useTaskInlineCategoryFieldContext
} from '../context/TaskInlineCategoryFieldContext';

/** Renders the secondary popover used to expose actions for one existing category. */
export default function TaskInlineCategoryOptionActionsPopover() {
  const {
    actionsDraftName,
    activeCategoryAction,
    actionsPopoverPosition,
    actionsPopoverRef,
    handleActionsDraftNameChange
  } = useTaskInlineCategoryFieldContext();

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
        <Stack spacing={3}>
          <Text fontSize="xs" fontWeight="semibold" color="gray.500">
            Acoes da categoria
          </Text>
          <Input
            aria-label="Editar nome da categoria"
            placeholder={activeCategoryAction?.categoryName ?? 'Nome da categoria'}
            value={actionsDraftName}
            onChange={(event) => handleActionsDraftNameChange(event.target.value)}
          />

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
      </Box>
    </Portal>
  );
}
