import type { TaskListItem } from '../../../shared/types';
import TaskTable from './TaskTable';
import TaskTableEmptyState from './TaskTableEmptyState';
import TaskTableErrorState from './TaskTableErrorState';
import TaskTableLoadingState from './TaskTableLoadingState';

export type TaskResultsPanelProps = {
  deletingTaskId?: string | null;
  errorMessage?: string | null;
  items: TaskListItem[];
  isLoading?: boolean;
  onTaskDelete: (task: TaskListItem) => Promise<void> | void;
  onTaskClick: (task: TaskListItem) => void;
  onRetry?: () => void;
};

/** Chooses between loading, error, empty, and success states for the task results area. */
export default function TaskResultsPanel({
  deletingTaskId = null,
  errorMessage = null,
  items,
  isLoading = false,
  onTaskDelete,
  onTaskClick,
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
      deletingTaskId={deletingTaskId}
      items={items}
      onTaskDelete={onTaskDelete}
      onTaskClick={onTaskClick}
    />
  );
}
