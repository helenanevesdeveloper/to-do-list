import {
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import type { TaskListItem } from '../../../shared/types';
import TaskTableRow from './TaskTableRow';

export type TaskTableDesktopProps = {
  items: TaskListItem[];
  onTaskClick: (task: TaskListItem) => void;
};

/** Renders the desktop table variant of the task results area. */
export default function TaskTableDesktop({
  items,
  onTaskClick
}: TaskTableDesktopProps) {
  return (
    <TableContainer display={{ base: 'none', md: 'block' }}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Título</Th>
            <Th>Categoria</Th>
            <Th>Status</Th>
            <Th>Compartilhamento</Th>
            <Th>Atualizada em</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((task) => (
            <TaskTableRow key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
