import type { TaskListItem } from '../../../shared/types';
import TaskTable from './TaskTable';
import TaskTableEmptyState from './TaskTableEmptyState';
import TaskTableErrorState from './TaskTableErrorState';
import TaskTableLoadingState from './TaskTableLoadingState';

export type TaskResultsPanelProps = {
  errorMessage?: string | null;
  items: TaskListItem[];
  isLoading?: boolean;
  onTaskClick: (task: TaskListItem) => void;
  onRetry?: () => void;
};

/** Chooses between loading, error, empty, and success states for the task results area. */
export default function TaskResultsPanel({
  errorMessage = null,
  items,
  isLoading = false,
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

  return <TaskTable items={items} onTaskClick={onTaskClick} />;
}
