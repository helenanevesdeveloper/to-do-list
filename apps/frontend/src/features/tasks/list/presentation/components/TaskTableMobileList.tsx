import { Stack } from '@chakra-ui/react';
import type { TaskCategoryOption, TaskListItem } from '../../../shared/types';
import TaskTableCard from './TaskTableCard';
import type { TaskInlineEditInput } from '../../../update/presentation/hooks/useTaskInlineEdit';

export type TaskTableMobileListProps = {
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

/** Renders the mobile card-list variant of the task results area. */
export default function TaskTableMobileList({
  categoryOptions,
  deletingTaskId = null,
  editingTaskId = null,
  items,
  onCreateCategory,
  onTaskCancelEdit,
  onTaskDelete,
  onTaskClick,
  onTaskUpdate,
}: TaskTableMobileListProps) {
  return (
    <Stack spacing={3} display={{ base: 'flex', md: 'none' }}>
      {items.map((task) => (
        <TaskTableCard
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
    </Stack>
  );
}
