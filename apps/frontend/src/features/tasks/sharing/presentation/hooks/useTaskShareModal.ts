import { useCallback, useState } from 'react';
import type { TaskListItem } from '../../../shared/types';
import { buildTaskShareOwnerEmail } from '../state/buildTaskShareOwnerEmail';
import type { ActiveTaskShareModal } from '../state/taskShareDraft';

/** State returned by the hook that owns the active task selected for the share modal. */
export interface UseTaskShareModalResult {
  activeTask: ActiveTaskShareModal | null;
  closeModal: () => boolean;
  isOpen: boolean;
  markTaskListForReload: () => void;
  openModal: (task: TaskListItem, currentUserEmail: string | null) => void;
}

/** Owns only the open/close session metadata for the dashboard share modal. */
export function useTaskShareModal(): UseTaskShareModalResult {
  const [activeTask, setActiveTask] = useState<ActiveTaskShareModal | null>(null);

  const closeModal = useCallback((): boolean => {
    const shouldReloadTasks = activeTask?.shouldReloadTasksOnClose ?? false;
    setActiveTask(null);
    return shouldReloadTasks;
  }, [activeTask]);

  const markTaskListForReload = useCallback((): void => {
    setActiveTask((current) => {
      if (!current || current.shouldReloadTasksOnClose) {
        return current;
      }

      return {
        ...current,
        shouldReloadTasksOnClose: true
      };
    });
  }, []);

  const openModal = useCallback(
    (task: TaskListItem, currentUserEmail: string | null): void => {
      setActiveTask({
        canManageShares: task.sharing.isOwner,
        ownerEmail: buildTaskShareOwnerEmail(task, currentUserEmail),
        shouldReloadTasksOnClose: false,
        taskId: task.id,
        taskTitle: task.title
      });
    },
    []
  );

  return {
    activeTask,
    closeModal,
    isOpen: activeTask !== null,
    markTaskListForReload,
    openModal
  };
}
