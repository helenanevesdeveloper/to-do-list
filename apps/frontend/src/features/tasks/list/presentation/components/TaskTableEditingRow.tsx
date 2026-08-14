import { Td, Tr } from '@chakra-ui/react';
import type { TaskCategoryOption, TaskListItem } from '../../../shared/types';
import TaskInlineEditRow from '../../../update/presentation/components/TaskInlineEditRow';
import type { TaskInlineEditInput } from '../../../update/presentation/hooks/useTaskInlineEdit';

export interface TaskTableEditingRowProps {
  categoryOptions: TaskCategoryOption[];
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  onUpdateCategory: (categoryId: string, name: string) => Promise<TaskCategoryOption>;
  onUpdateTask: (taskId: string, input: TaskInlineEditInput) => Promise<void>;
  task: TaskListItem;
}

/** Renders the desktop table row while one task is being edited inline. */
export default function TaskTableEditingRow({
  categoryOptions,
  onCreateCategory,
  onDeleteCategory,
  onUpdateCategory,
  onUpdateTask,
  task
}: TaskTableEditingRowProps) {
  return (
    <Tr>
      <Td colSpan={7} px={3} py={3}>
        <TaskInlineEditRow
          categoryOptions={categoryOptions}
          onCreateCategory={onCreateCategory}
          onDeleteCategory={onDeleteCategory}
          onUpdateCategory={onUpdateCategory}
          onUpdateTask={(input) => onUpdateTask(task.id, input)}
          task={task}
        />
      </Td>
    </Tr>
  );
}
