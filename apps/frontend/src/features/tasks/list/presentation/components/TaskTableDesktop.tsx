import {
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import type { TaskCategoryOption, TaskListItem } from '../../../shared/types';
import TaskTableRow from './TaskTableRow';
import type { TaskInlineEditInput } from '../../../update/presentation/hooks/useTaskInlineEdit';

export type TaskTableDesktopProps = {
  categoryOptions: TaskCategoryOption[];
  deletingTaskId?: string | null;
  editingTaskId?: string | null;
  items: TaskListItem[];
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onTaskCancelEdit: () => void;
  onTaskDelete: (task: TaskListItem) => Promise<void> | void;
  onTaskClick: (task: TaskListItem) => void;
  onTaskUpdate: (taskId: string, input: TaskInlineEditInput) => Promise<void>;
};

/** Renders the desktop table variant of the task results area. */
export default function TaskTableDesktop({
  categoryOptions,
  deletingTaskId = null,
  editingTaskId = null,
  items,
  onCreateCategory,
  onTaskCancelEdit,
  onTaskDelete,
  onTaskClick,
  onTaskUpdate,
}: TaskTableDesktopProps) {
  return (
    <TableContainer
      display={{ base: 'none', md: 'block' }}
      overflowX="auto"
      overflowY="visible"
      position="relative"
    >
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
              categoryOptions={categoryOptions}
              isEditing={editingTaskId === task.id}
              key={task.id}
              isDeleting={deletingTaskId === task.id}
              onCancelEdit={onTaskCancelEdit}
              onClick={onTaskClick}
              onCreateCategory={onCreateCategory}
              onDeleteTask={onTaskDelete}
              onUpdateTask={onTaskUpdate}
              task={task}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
