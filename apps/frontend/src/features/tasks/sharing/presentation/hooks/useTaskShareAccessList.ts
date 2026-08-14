import { useCallback, useState } from 'react';
import type { TaskShare } from '../../domain/taskShare';
import { addTaskShareToStore } from '../state/addTaskShareToStore';
import { readTaskSharesFromStore } from '../state/readTaskSharesFromStore';
import { removeTaskShareFromStore } from '../state/removeTaskShareFromStore';
import { replaceTaskSharesInStore } from '../state/replaceTaskSharesInStore';
import type { TaskShareStore } from '../state/taskShareStore';

/** State returned by the hook that owns the share store keyed by task. */
export interface UseTaskShareAccessListResult {
  addShare: (taskId: string, share: TaskShare) => void;
  getShares: (taskId: string | null) => readonly TaskShare[];
  removeShare: (taskId: string, shareId: string) => void;
  replaceShares: (taskId: string, shares: readonly TaskShare[]) => void;
}

/** Owns the in-memory task share collections consumed by the dashboard modal. */
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

  const replaceShares = useCallback(
    (taskId: string, shares: readonly TaskShare[]): void => {
      setShareStore((current) =>
        replaceTaskSharesInStore({
          shares,
          store: current,
          taskId
        })
      );
    },
    []
  );

  return {
    addShare,
    getShares,
    removeShare,
    replaceShares
  };
}
