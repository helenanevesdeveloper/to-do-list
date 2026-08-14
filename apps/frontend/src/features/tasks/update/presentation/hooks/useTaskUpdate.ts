import { useCallback, useState } from 'react';
import { updateTaskApi, type UpdateTaskApiInput } from '../../infrastructure/updateTaskApi';
import type { TaskListItem } from '../../../shared/types';
import type { TaskInlineEditInput } from './useTaskInlineEdit';

export interface UseTaskUpdateArgs {
  reloadTasks: () => void;
  updateTask?: typeof updateTaskApi;
}

export interface UseTaskUpdateResult {
  cancelTaskEdit: () => void;
  editingTaskId: string | null;
  startTaskEdit: (task: TaskListItem) => void;
  submitTaskUpdate: (taskId: string, input: TaskInlineEditInput) => Promise<void>;
}

/** Owns the active inline-edit row and the backend update lifecycle. */
export function useTaskUpdate({
  reloadTasks,
  updateTask = updateTaskApi
}: UseTaskUpdateArgs): UseTaskUpdateResult {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const cancelTaskEdit = useCallback((): void => {
    setEditingTaskId(null);
  }, []);

  const startTaskEdit = useCallback((task: TaskListItem): void => {
    if (!task.sharing.isOwner) {
      return;
    }

    setEditingTaskId(task.id);
  }, []);

  const submitTaskUpdate = useCallback(
    async (taskId: string, input: TaskInlineEditInput): Promise<void> => {
      await updateTask({
        ...input,
        taskId
      } as UpdateTaskApiInput);

      setEditingTaskId(null);
      reloadTasks();
    },
    [reloadTasks, updateTask]
  );

  return {
    cancelTaskEdit,
    editingTaskId,
    startTaskEdit,
    submitTaskUpdate
  };
}
