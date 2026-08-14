import type { TaskShare } from '../../domain/taskShare';

/** Props for the future access-list section inside the sharing modal. */
export interface TaskShareAccessListProps {
  shares: readonly TaskShare[];
  canManageShares: boolean;
}

/** Placeholder access-list component for future task-sharing flows. */
export default function TaskShareAccessList(
  _props: TaskShareAccessListProps,
): null {
  return null;
}
