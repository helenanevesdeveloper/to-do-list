import type { ActiveTaskShareModal } from './taskShareDraft';

/** Returns the active share modal task only when the current user can manage it. */
export function readManageableTaskShareModal(
  activeTask: ActiveTaskShareModal | null
): ActiveTaskShareModal | null {
  if (!activeTask?.canManageShares) {
    return null;
  }

  return activeTask;
}
