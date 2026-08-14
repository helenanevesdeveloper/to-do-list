import type { TaskSharePermission } from './taskSharePermission';

/** Domain entity representing one task-sharing entry. */
export interface TaskShare {
  id: string;
  email: string;
  permission: TaskSharePermission;
  isOwner: boolean;
}
