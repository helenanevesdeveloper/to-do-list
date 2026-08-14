import type { TaskListItem } from '../../../shared/types';
import { buildLocalTaskShares } from './buildLocalTaskShares';
import type { TaskShareStore } from './taskShareStore';

export interface EnsureTaskSharesInStoreInput {
  currentUserEmail: string | null;
  store: TaskShareStore;
  task: TaskListItem;
}

/** Returns the same store or seeds one task entry when it is still missing. */
export function ensureTaskSharesInStore({
  currentUserEmail,
  store,
  task
}: EnsureTaskSharesInStoreInput): TaskShareStore {
  if (store[task.id]) {
    return store;
  }

  return {
    ...store,
    [task.id]: buildLocalTaskShares({
      currentUserEmail,
      task
    })
  };
}
