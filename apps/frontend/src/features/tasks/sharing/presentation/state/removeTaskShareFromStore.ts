import type { TaskShareStore } from './taskShareStore';

export interface RemoveTaskShareFromStoreInput {
  shareId: string;
  store: TaskShareStore;
  taskId: string;
}

/** Returns the next local share store after removing one non-owner share. */
export function removeTaskShareFromStore({
  shareId,
  store,
  taskId
}: RemoveTaskShareFromStoreInput): TaskShareStore {
  return {
    ...store,
    [taskId]: (store[taskId] ?? []).filter(
      (share) => share.id !== shareId || share.isOwner
    )
  };
}
