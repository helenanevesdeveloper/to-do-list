import { Badge, Td } from '@chakra-ui/react';
import type { TaskListItemDisplay } from '../mappers/buildTaskListItemDisplay';

export interface TaskTableRowMetadataCellsProps {
  display: TaskListItemDisplay;
}

/** Renders the non-interactive metadata cells for one desktop task row. */
export default function TaskTableRowMetadataCells({
  display
}: TaskTableRowMetadataCellsProps) {
  return (
    <>
      <Td>{display.categoryLabel}</Td>
      <Td>
        <Badge colorScheme={display.statusColorScheme}>{display.statusLabel}</Badge>
      </Td>
      <Td>{display.sharingLabel}</Td>
      <Td>{display.createdAtLabel}</Td>
      <Td>{display.updatedAtLabel}</Td>
    </>
  );
}
