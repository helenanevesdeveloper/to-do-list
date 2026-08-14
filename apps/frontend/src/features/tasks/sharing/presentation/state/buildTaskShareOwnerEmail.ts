import type { TaskListItem } from '../../../shared/types';

/** Builds the local-only owner email shown in the share modal before API integration. */
export function buildTaskShareOwnerEmail(
  task: TaskListItem,
  currentUserEmail: string | null
): string {
  if (task.sharing.isOwner) {
    return currentUserEmail ?? 'usuario@example.com';
  }

  return `owner+${task.id.slice(0, 8)}@example.com`;
}
