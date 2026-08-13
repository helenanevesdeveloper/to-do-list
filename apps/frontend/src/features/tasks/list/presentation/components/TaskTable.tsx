import { Box } from '@chakra-ui/react';
import type { TaskListItem } from '../../../shared/types';
import TaskTableDesktop from './TaskTableDesktop';
import TaskTableMobileList from './TaskTableMobileList';

export type TaskTableProps = {
  items: TaskListItem[];
  onTaskClick: (task: TaskListItem) => void;
};

/** Renders only the success state of the task results area. */
export default function TaskTable({ items, onTaskClick }: TaskTableProps) {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      <TaskTableDesktop items={items} onTaskClick={onTaskClick} />
      <Box p={{ base: 4, md: 0 }}>
        <TaskTableMobileList items={items} onTaskClick={onTaskClick} />
      </Box>
    </Box>
  );
}
