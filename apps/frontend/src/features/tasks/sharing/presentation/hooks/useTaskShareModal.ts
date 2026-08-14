import { useCallback, useState } from 'react';
import type { TaskListItem } from '../../../shared/types';
import { buildTaskShareOwnerEmail } from '../state/buildTaskShareOwnerEmail';
import type { ActiveTaskShareModal } from '../state/taskShareDraft';

/** State returned by the hook that owns the active task selected for the share modal. */
export interface UseTaskShareModalResult {
  activeTask: ActiveTaskShareModal | null;
  closeModal: () => void;
  isOpen: boolean;
  openModal: (task: TaskListItem, currentUserEmail: string | null) => void;
}

/** Owns only the open/close session metadata for the dashboard share modal. */
export function useTaskShareModal(): UseTaskShareModalResult {
  const [activeTask, setActiveTask] = useState<ActiveTaskShareModal | null>(null);

  const closeModal = useCallback((): void => {
    setActiveTask(null);
  }, []);

  const openModal = useCallback(
    (task: TaskListItem, currentUserEmail: string | null): void => {
      setActiveTask({
        canManageShares: task.sharing.isOwner,
        ownerEmail: buildTaskShareOwnerEmail(task, currentUserEmail),
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
    openModal
  };
}
