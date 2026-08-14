import { createTasksApi } from '../../../create/infrastructure/createTasksApi';
import type { TaskInlineCreateInput } from '../../../create/presentation/hooks/useTaskInlineCreate';
import { resolveTaskDeleteNextPage } from '../../../delete/application/resolveTaskDeleteNextPage';
import { useTaskDeleteAction } from '../../../delete/presentation/hooks/useTaskDeleteAction';
import type { TaskListItem } from '../../../shared/types';
import { useTaskUpdate } from '../../../update/presentation/hooks/useTaskUpdate';
import type { TaskInlineEditInput } from '../../../update/presentation/hooks/useTaskInlineEdit';

export interface UseTaskDashboardTaskActionsInput {
  currentPage: number;
  reloadTasks: () => void;
  setPage: (value: number) => void;
  visibleItemCount: number;
}

export interface UseTaskDashboardTaskActionsResult {
  cancelTaskEdit: () => void;
  clearDeleteTaskError: () => void;
  deleteTaskErrorMessage: string | null;
  deletingTaskId: string | null;
  editingTaskId: string | null;
  handleCreateTask: (input: TaskInlineCreateInput) => Promise<void>;
  handleTaskClick: (task: TaskListItem) => void;
  handleTaskDelete: (task: TaskListItem) => Promise<void>;
  handleTaskUpdate: (taskId: string, input: TaskInlineEditInput) => Promise<void>;
}

/** Owns dashboard task actions such as create, delete, and inline edit. */
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
  const {
    cancelTaskEdit,
    editingTaskId,
    startTaskEdit,
    submitTaskUpdate
  } = useTaskUpdate({ reloadTasks });

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

  function handleTaskClick(task: TaskListItem): void {
    startTaskEdit(task);
  }

  async function handleTaskUpdate(
    taskId: string,
    input: TaskInlineEditInput
  ): Promise<void> {
    await submitTaskUpdate(taskId, input);
  }

  return {
    cancelTaskEdit,
    clearDeleteTaskError: resetTaskDeleteError,
    deleteTaskErrorMessage,
    deletingTaskId,
    editingTaskId,
    handleCreateTask,
    handleTaskClick,
    handleTaskDelete,
    handleTaskUpdate
  };
}
