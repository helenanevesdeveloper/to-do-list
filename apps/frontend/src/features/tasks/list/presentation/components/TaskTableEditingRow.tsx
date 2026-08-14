import { Td, Tr } from '@chakra-ui/react';
import type { TaskCategoryOption, TaskListItem } from '../../../shared/types';
import TaskInlineEditRow from '../../../update/presentation/components/TaskInlineEditRow';
import type { TaskInlineEditInput } from '../../../update/presentation/hooks/useTaskInlineEdit';

export interface TaskTableEditingRowProps {
  categoryOptions: TaskCategoryOption[];
  onCancelEdit: () => void;
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onUpdateTask: (taskId: string, input: TaskInlineEditInput) => Promise<void>;
  task: TaskListItem;
}

/** Renders the desktop table row while one task is being edited inline. */
export default function TaskTableEditingRow({
  categoryOptions,
  onCancelEdit,
  onCreateCategory,
  onUpdateTask,
  task
}: TaskTableEditingRowProps) {
  return (
    <Tr>
      <Td colSpan={7} px={3} py={3}>
        <TaskInlineEditRow
          categoryOptions={categoryOptions}
          onCancel={onCancelEdit}
          onCreateCategory={onCreateCategory}
          onUpdateTask={(input) => onUpdateTask(task.id, input)}
          task={task}
        />
      </Td>
    </Tr>
  );
}
