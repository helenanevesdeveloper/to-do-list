import type { TaskCategoryOption, TaskListItem } from '../../../shared/types';
import type { TaskInlineEditInput } from '../../../update/presentation/hooks/useTaskInlineEdit';
import TaskTableEditingRow from './TaskTableEditingRow';
import TaskTableReadOnlyRow from './TaskTableReadOnlyRow';

export type TaskTableRowProps = {
  categoryOptions: TaskCategoryOption[];
  isEditing?: boolean;
  isDeleting?: boolean;
  onCancelEdit: () => void;
  task: TaskListItem;
  onClick: (task: TaskListItem) => void;
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onDeleteTask: (task: TaskListItem) => Promise<void> | void;
  onUpdateTask: (taskId: string, input: TaskInlineEditInput) => Promise<void>;
};

/** Renders a single desktop row inside the task results table. */
export default function TaskTableRow({
  categoryOptions,
  isEditing = false,
  isDeleting = false,
  onCancelEdit,
  task,
  onClick,
  onCreateCategory,
  onDeleteTask,
  onUpdateTask,
}: TaskTableRowProps) {
  if (isEditing) {
    return (
      <TaskTableEditingRow
        categoryOptions={categoryOptions}
        onCancelEdit={onCancelEdit}
        onCreateCategory={onCreateCategory}
        onUpdateTask={onUpdateTask}
        task={task}
      />
    );
  }

  return (
    <TaskTableReadOnlyRow
      isDeleting={isDeleting}
      onClick={onClick}
      onDeleteTask={onDeleteTask}
      task={task}
    />
  );
}
