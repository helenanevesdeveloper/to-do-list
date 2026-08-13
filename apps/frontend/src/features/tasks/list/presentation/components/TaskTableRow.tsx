import { Badge, Td, Text, Tr } from '@chakra-ui/react';
import type { TaskListItem } from '../../../shared/types';
import { buildTaskListItemDisplay } from '../mappers/buildTaskListItemDisplay';

export type TaskTableRowProps = {
  task: TaskListItem;
  onClick: (task: TaskListItem) => void;
};

/** Renders a single desktop row inside the task results table. */
export default function TaskTableRow({ task, onClick }: TaskTableRowProps) {
  const display = buildTaskListItemDisplay(task);

  return (
    <Tr key={task.id} cursor="pointer" onClick={() => onClick(task)} _hover={{ bg: 'gray.50' }}>
      <Td>
        <Text fontWeight="semibold" mb={1}>
          {task.title}
        </Text>
        <Text fontSize="sm" color="gray.600" noOfLines={1}>
          {display.descriptionLabel}
        </Text>
      </Td>
      <Td>{display.categoryLabel}</Td>
      <Td>
        <Badge colorScheme={display.statusColorScheme}>{display.statusLabel}</Badge>
      </Td>
      <Td>{display.sharingLabel}</Td>
      <Td>{display.updatedAtLabel}</Td>
    </Tr>
  );
}
