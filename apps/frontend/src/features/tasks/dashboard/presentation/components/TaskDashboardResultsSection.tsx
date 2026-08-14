import TaskPagination from '../../../list/presentation/components/TaskPagination';
import TaskResultsPanel from '../../../list/presentation/components/TaskResultsPanel';
import type { TaskListItem, TaskListPage } from '../../../shared/types';

export interface TaskDashboardResultsSectionProps {
  deletingTaskId?: string | null;
  errorMessage?: string | null;
  isLoading?: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onRetry?: () => void;
  onTaskClick: (task: TaskListItem) => void;
  onTaskDelete: (task: TaskListItem) => Promise<void> | void;
  page: TaskListPage;
}

/** Renders the results panel plus pagination controls for the dashboard task list. */
export default function TaskDashboardResultsSection({
  deletingTaskId = null,
  errorMessage = null,
  isLoading = false,
  onNextPage,
  onPreviousPage,
  onRetry,
  onTaskClick,
  onTaskDelete,
  page
}: TaskDashboardResultsSectionProps) {
  return (
    <>
      <TaskResultsPanel
        deletingTaskId={deletingTaskId}
        errorMessage={errorMessage}
        items={page.items}
        isLoading={isLoading}
        onTaskDelete={onTaskDelete}
        onTaskClick={onTaskClick}
        onRetry={onRetry}
      />

      <TaskPagination
        currentPage={page.currentPage}
        endItem={page.endItem}
        hasNextPage={page.hasNextPage}
        hasPreviousPage={page.hasPreviousPage}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        startItem={page.startItem}
        totalItems={page.totalItems}
        totalPages={page.totalPages}
      />
    </>
  );
}
