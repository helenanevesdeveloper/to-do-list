import type { TaskShare } from '../../domain/taskShare';

/** Props for one access row rendered inside the sharing modal. */
export interface TaskShareAccessRowProps {
  share: TaskShare;
  canManageShare: boolean;
}

/** Placeholder row component for future task-sharing flows. */
export default function TaskShareAccessRow(
  _props: TaskShareAccessRowProps,
): null {
  return null;
}
