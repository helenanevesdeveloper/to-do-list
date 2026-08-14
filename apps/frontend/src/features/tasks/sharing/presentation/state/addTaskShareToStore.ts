import type { TaskShare } from '../../domain/taskShare';
import { sortTaskShares } from './sortTaskShares';
import type { TaskShareStore } from './taskShareStore';

export interface AddTaskShareToStoreInput {
  share: TaskShare;
  store: TaskShareStore;
  taskId: string;
}

/** Returns the next local share store after appending one share to one task. */
export function addTaskShareToStore({
  share,
  store,
  taskId
}: AddTaskShareToStoreInput): TaskShareStore {
  return {
    ...store,
    [taskId]: sortTaskShares([...(store[taskId] ?? []), share])
  };
}
