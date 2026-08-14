import type { TaskCategoryOption, TaskListItem } from '../../../shared/types';
import TaskTable from './TaskTable';
import TaskTableEmptyState from './TaskTableEmptyState';
import TaskTableErrorState from './TaskTableErrorState';
import TaskTableLoadingState from './TaskTableLoadingState';
import type { TaskInlineEditInput } from '../../../update/presentation/hooks/useTaskInlineEdit';

export type TaskResultsPanelProps = {
  categoryOptions: TaskCategoryOption[];
  deletingTaskId?: string | null;
  editingTaskId?: string | null;
  errorMessage?: string | null;
  items: TaskListItem[];
  isLoading?: boolean;
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onTaskCancelEdit: () => void;
  onTaskDelete: (task: TaskListItem) => Promise<void> | void;
  onTaskClick: (task: TaskListItem) => void;
  onTaskUpdate: (taskId: string, input: TaskInlineEditInput) => Promise<void>;
  onRetry?: () => void;
};

/** Chooses between loading, error, empty, and success states for the task results area. */
export default function TaskResultsPanel({
  categoryOptions,
  deletingTaskId = null,
  editingTaskId = null,
  errorMessage = null,
  items,
  isLoading = false,
  onCreateCategory,
  onTaskCancelEdit,
  onTaskDelete,
  onTaskClick,
  onTaskUpdate,
  onRetry
}: TaskResultsPanelProps) {
  if (isLoading && items.length === 0) {
    return <TaskTableLoadingState />;
  }

  if (errorMessage && items.length === 0) {
    return <TaskTableErrorState errorMessage={errorMessage} onRetry={onRetry} />;
  }

  if (items.length === 0) {
    return <TaskTableEmptyState />;
  }

  return (
    <TaskTable
      categoryOptions={categoryOptions}
      deletingTaskId={deletingTaskId}
      editingTaskId={editingTaskId}
      items={items}
      onCreateCategory={onCreateCategory}
      onTaskCancelEdit={onTaskCancelEdit}
      onTaskDelete={onTaskDelete}
      onTaskClick={onTaskClick}
      onTaskUpdate={onTaskUpdate}
    />
  );
}
