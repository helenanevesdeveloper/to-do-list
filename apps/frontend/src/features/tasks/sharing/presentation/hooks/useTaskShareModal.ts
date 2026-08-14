import { useCallback, useState } from 'react';

/** State returned by the future hook that orchestrates the share modal. */
export interface UseTaskShareModalResult {
  isOpen: boolean;
  taskId: string | null;
  taskTitle: string | null;
  openModal: (taskId: string, taskTitle: string | null) => void;
  closeModal: () => void;
}

/** Owns the minimal open/close state for the dashboard share modal. */
export function useTaskShareModal(): UseTaskShareModalResult {
  const [isOpen, setIsOpen] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState<string | null>(null);

  const openModal = useCallback((nextTaskId: string, nextTaskTitle: string | null): void => {
    setTaskId(nextTaskId);
    setTaskTitle(nextTaskTitle);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback((): void => {
    setIsOpen(false);
    setTaskId(null);
    setTaskTitle(null);
  }, []);

  return {
    isOpen,
    taskId,
    taskTitle,
    openModal,
    closeModal
  };
}
