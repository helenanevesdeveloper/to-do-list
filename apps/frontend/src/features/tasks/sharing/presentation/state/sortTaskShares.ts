import type { TaskShare } from '../../domain/taskShare';

/** Sorts task shares with the owner first and the remaining emails alphabetically. */
export function sortTaskShares(shares: readonly TaskShare[]): TaskShare[] {
  return [...shares].sort((left, right) => {
    if (left.isOwner !== right.isOwner) {
      return left.isOwner ? -1 : 1;
    }

    return left.email.localeCompare(right.email, 'pt-BR', {
      sensitivity: 'base'
    });
  });
}
