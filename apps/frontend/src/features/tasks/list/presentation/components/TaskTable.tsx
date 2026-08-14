import { Box } from '@chakra-ui/react';
import type { TaskListItem } from '../../../shared/types';
import TaskTableDesktop from './TaskTableDesktop';
import TaskTableMobileList from './TaskTableMobileList';

export type TaskTableProps = {
  deletingTaskId?: string | null;
  items: TaskListItem[];
  onTaskDelete: (task: TaskListItem) => Promise<void> | void;
  onTaskClick: (task: TaskListItem) => void;
};

/** Renders only the success state of the task results area. */
export default function TaskTable({
  deletingTaskId = null,
  items,
  onTaskDelete,
  onTaskClick,
}: TaskTableProps) {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      <TaskTableDesktop
        deletingTaskId={deletingTaskId}
        items={items}
        onTaskDelete={onTaskDelete}
        onTaskClick={onTaskClick}
      />
      <Box p={{ base: 4, md: 0 }}>
        <TaskTableMobileList
          deletingTaskId={deletingTaskId}
          items={items}
          onTaskDelete={onTaskDelete}
          onTaskClick={onTaskClick}
        />
      </Box>
    </Box>
  );
}
