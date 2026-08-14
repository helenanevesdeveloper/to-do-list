import type { TaskShare } from '../../domain/taskShare';
import type { TaskShareStore } from './taskShareStore';

/** Reads one task share collection from the local store or returns an empty list. */
export function readTaskSharesFromStore(
  store: TaskShareStore,
  taskId: string | null
): readonly TaskShare[] {
  if (!taskId) {
    return [];
  }

  return store[taskId] ?? [];
}
