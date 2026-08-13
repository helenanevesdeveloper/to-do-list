import { Stack } from '@chakra-ui/react';
import type { TaskListItem } from '../../../shared/types';
import TaskTableCard from './TaskTableCard';

export type TaskTableMobileListProps = {
  items: TaskListItem[];
  onTaskClick: (task: TaskListItem) => void;
};

/** Renders the mobile card-list variant of the task results area. */
export default function TaskTableMobileList({
  items,
  onTaskClick
}: TaskTableMobileListProps) {
  return (
    <Stack spacing={3} display={{ base: 'flex', md: 'none' }}>
      {items.map((task) => (
        <TaskTableCard key={task.id} task={task} onClick={onTaskClick} />
      ))}
    </Stack>
  );
}
