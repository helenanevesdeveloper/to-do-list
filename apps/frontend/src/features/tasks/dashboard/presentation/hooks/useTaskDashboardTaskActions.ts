import { createTasksApi } from '../../../create/infrastructure/createTasksApi';
import type { TaskInlineCreateInput } from '../../../create/presentation/hooks/useTaskInlineCreate';
import { resolveTaskDeleteNextPage } from '../../../delete/application/resolveTaskDeleteNextPage';
import { useTaskDeleteAction } from '../../../delete/presentation/hooks/useTaskDeleteAction';
import type { TaskListItem } from '../../../shared/types';

export interface UseTaskDashboardTaskActionsInput {
  currentPage: number;
  reloadTasks: () => void;
  setPage: (value: number) => void;
  visibleItemCount: number;
}

export interface UseTaskDashboardTaskActionsResult {
  clearDeleteTaskError: () => void;
  deleteTaskErrorMessage: string | null;
  deletingTaskId: string | null;
  handleCreateTask: (input: TaskInlineCreateInput) => Promise<void>;
  handleTaskClick: (task: TaskListItem) => void;
  handleTaskDelete: (task: TaskListItem) => Promise<void>;
}

/** Owns dashboard task actions such as delete, and share. */
export function useTaskDashboardTaskActions({
  currentPage,
  reloadTasks,
  setPage,
  visibleItemCount
}: UseTaskDashboardTaskActionsInput): UseTaskDashboardTaskActionsResult {
  const {
    deletingTaskId,
    errorMessage: deleteTaskErrorMessage,
    requestTaskDelete,
    resetTaskDeleteError
  } = useTaskDeleteAction();

  async function handleCreateTask(input: TaskInlineCreateInput): Promise<void> {
    await createTasksApi(input);

    if (currentPage === 1) {
      reloadTasks();
      return;
    }

    setPage(1);
  }

  async function handleTaskDelete(task: TaskListItem): Promise<void> {
    const didDelete = await requestTaskDelete(task.id);

    if (!didDelete) {
      return;
    }

    const nextPage = resolveTaskDeleteNextPage({
      currentPage,
      visibleItemCount
    });

    if (nextPage !== null) {
      setPage(nextPage);
      return;
    }

    reloadTasks();
  }

  function handleTaskClick(_task: TaskListItem): void {}


  return {
    clearDeleteTaskError: resetTaskDeleteError,
    deleteTaskErrorMessage,
    deletingTaskId,
    handleCreateTask,
    handleTaskClick,
    handleTaskDelete,
  };
}
