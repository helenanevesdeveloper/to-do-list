import type { TaskCategoryOption, TaskListItem, TaskListPage } from '../../../shared/types';
import TaskPagination from '../../../list/presentation/components/TaskPagination';
import TaskResultsPanel from '../../../list/presentation/components/TaskResultsPanel';
import type { TaskInlineEditInput } from '../../../update/presentation/hooks/useTaskInlineEdit';

export interface TaskDashboardResultsSectionProps {
  categoryOptions: TaskCategoryOption[];
  deletingTaskId?: string | null;
  editingTaskId?: string | null;
  errorMessage?: string | null;
  isLoading?: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  onUpdateCategory: (categoryId: string, name: string) => Promise<TaskCategoryOption>;
  onRetry?: () => void;
  onTaskCancelEdit: () => void;
  onTaskClick: (task: TaskListItem) => void;
  onTaskDelete: (task: TaskListItem) => Promise<void> | void;
  onTaskUpdate: (taskId: string, input: TaskInlineEditInput) => Promise<void>;
  page: TaskListPage;
}

/** Renders the results panel plus pagination controls for the dashboard task list. */
export default function TaskDashboardResultsSection({
  categoryOptions,
  deletingTaskId = null,
  editingTaskId = null,
  errorMessage = null,
  isLoading = false,
  onNextPage,
  onPreviousPage,
  onCreateCategory,
  onDeleteCategory,
  onUpdateCategory,
  onRetry,
  onTaskCancelEdit,
  onTaskClick,
  onTaskDelete,
  onTaskUpdate,
  page
}: TaskDashboardResultsSectionProps) {
  return (
    <>
      <TaskResultsPanel
        categoryOptions={categoryOptions}
        deletingTaskId={deletingTaskId}
        editingTaskId={editingTaskId}
        errorMessage={errorMessage}
        items={page.items}
        isLoading={isLoading}
        onCreateCategory={onCreateCategory}
        onDeleteCategory={onDeleteCategory}
        onUpdateCategory={onUpdateCategory}
        onTaskCancelEdit={onTaskCancelEdit}
        onTaskDelete={onTaskDelete}
        onTaskClick={onTaskClick}
        onTaskUpdate={onTaskUpdate}
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
