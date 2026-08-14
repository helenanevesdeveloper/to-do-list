/** Permission options exposed by the task-sharing UI. */
export type TaskSharePermission = 'owner' | 'reader' | 'editor';

/** Ordered permission options used by future selectors and menus. */
export const taskSharePermissionOptions: readonly TaskSharePermission[] = [
  'owner',
  'reader',
  'editor',
];
