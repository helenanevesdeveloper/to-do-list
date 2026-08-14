import type { TaskShare } from '../../domain/taskShare';
import { sortTaskShares } from './sortTaskShares';
import type { TaskShareStore } from './taskShareStore';

export interface ReplaceTaskSharesInStoreInput {
  shares: readonly TaskShare[];
  store: TaskShareStore;
  taskId: string;
}

/** Replaces one task share collection with the latest loaded server payload. */
export function replaceTaskSharesInStore({
  shares,
  store,
  taskId
}: ReplaceTaskSharesInStoreInput): TaskShareStore {
  return {
    ...store,
    [taskId]: sortTaskShares(shares)
  };
}
