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
  deletingTaskId?: string | null;
  items: TaskListItem[];
  onTaskDelete: (task: TaskListItem) => Promise<void> | void;
  onTaskClick: (task: TaskListItem) => void;
};

/** Renders the desktop table variant of the task results area. */
export default function TaskTableDesktop({
  deletingTaskId = null,
  items,
  onTaskDelete,
  onTaskClick,
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
            <Th>Criada em</Th>
            <Th>Atualizada em</Th>
            <Th bg="white" position="sticky" right={0} width="56px" zIndex={1} />
          </Tr>
        </Thead>
        <Tbody>
          {items.map((task) => (
            <TaskTableRow
              key={task.id}
              isDeleting={deletingTaskId === task.id}
              onClick={onTaskClick}
              onDeleteTask={onTaskDelete}
              task={task}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
