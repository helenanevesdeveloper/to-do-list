import type { TaskSharePermission } from '../../domain/taskSharePermission';

/** Props for the future permission menu shown per shared user. */
export interface TaskSharePermissionMenuProps {
  permission: TaskSharePermission;
  canManageShare: boolean;
}

/** Placeholder permission-menu component for future task-sharing flows. */
export default function TaskSharePermissionMenu(
  _props: TaskSharePermissionMenuProps,
): null {
  return null;
}
