import { Box, Td } from '@chakra-ui/react';
import TaskItemActionsMenu from './TaskItemActionsMenu';

export interface TaskTableRowActionsCellProps {
  canDeleteTask: boolean;
  isDeleting?: boolean;
  onDeleteTask: () => Promise<void> | void;
  onShareTask: () => void;
  taskTitle: string;
}

/** Renders the sticky actions cell displayed on the right side of one desktop row. */
export default function TaskTableRowActionsCell({
  canDeleteTask,
  isDeleting = false,
  onDeleteTask,
  onShareTask,
  taskTitle
}: TaskTableRowActionsCellProps) {
  return (
    <Td
      bg="white"
      position="sticky"
      px={2}
      right={0}
      width="56px"
      zIndex={1}
      _groupHover={{ bg: 'gray.50' }}
    >
      <Box display="flex" justifyContent="flex-end">
        <TaskItemActionsMenu
          canDeleteTask={canDeleteTask}
          hideUntilHover
          isDeleting={isDeleting}
          onDeleteTask={onDeleteTask}
          onShareTask={onShareTask}
          taskTitle={taskTitle}
        />
      </Box>
    </Td>
  );
}
