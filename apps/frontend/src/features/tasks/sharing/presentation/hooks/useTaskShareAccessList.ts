import { useCallback, useState } from 'react';
import type { TaskListItem } from '../../../shared/types';
import type { TaskShare } from '../../domain/taskShare';
import { addTaskShareToStore } from '../state/addTaskShareToStore';
import { ensureTaskSharesInStore } from '../state/ensureTaskSharesInStore';
import { readTaskSharesFromStore } from '../state/readTaskSharesFromStore';
import { removeTaskShareFromStore } from '../state/removeTaskShareFromStore';
import type { TaskShareStore } from '../state/taskShareStore';

/** State returned by the hook that owns the local share store keyed by task. */
export interface UseTaskShareAccessListResult {
  addShare: (taskId: string, share: TaskShare) => void;
  ensureTaskShares: (task: TaskListItem, currentUserEmail: string | null) => void;
  getShares: (taskId: string | null) => readonly TaskShare[];
  removeShare: (taskId: string, shareId: string) => void;
}

/** Owns the local-only share collections used before the real API integration. */
export function useTaskShareAccessList(): UseTaskShareAccessListResult {
  const [shareStore, setShareStore] = useState<TaskShareStore>({});

  const addShare = useCallback((taskId: string, share: TaskShare): void => {
    setShareStore((current) =>
      addTaskShareToStore({
        share,
        store: current,
        taskId
      })
    );
  }, []);

  const ensureTaskShares = useCallback(
    (task: TaskListItem, currentUserEmail: string | null): void => {
      setShareStore((current) =>
        ensureTaskSharesInStore({
          currentUserEmail,
          store: current,
          task
        })
      );
    },
    []
  );

  const getShares = useCallback(
    (taskId: string | null): readonly TaskShare[] =>
      readTaskSharesFromStore(shareStore, taskId),
    [shareStore]
  );

  const removeShare = useCallback((taskId: string, shareId: string): void => {
    setShareStore((current) =>
      removeTaskShareFromStore({
        shareId,
        store: current,
        taskId
      })
    );
  }, []);

  return {
    addShare,
    ensureTaskShares,
    getShares,
    removeShare
  };
}
