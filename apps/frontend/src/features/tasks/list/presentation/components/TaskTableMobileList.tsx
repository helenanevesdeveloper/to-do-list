import { Stack } from '@chakra-ui/react';
import type { TaskListItem } from '../../../shared/types';
import TaskTableCard from './TaskTableCard';

export type TaskTableMobileListProps = {
  deletingTaskId?: string | null;
  items: TaskListItem[];
  onTaskDelete: (task: TaskListItem) => Promise<void> | void;
};

/** Renders the mobile card-list variant of the task results area. */
export default function TaskTableMobileList({
  deletingTaskId = null,
  items,
  onTaskDelete
}: TaskTableMobileListProps) {
  return (
    <Stack spacing={3} display={{ base: 'flex', md: 'none' }}>
      {items.map((task) => (
        <TaskTableCard
          key={task.id}
          isDeleting={deletingTaskId === task.id}
          onDeleteTask={onTaskDelete}
          task={task}
        />
      ))}
    </Stack>
  );
}
