import type { TaskSharePermission } from '../../domain/taskSharePermission';

/** Permission options editable from the share composer in the current MVP. */
export type ShareComposerPermission = Exclude<TaskSharePermission, 'owner'>;

/** Modal session metadata for the task currently selected for sharing. */
export interface ActiveTaskShareModal {
  canManageShares: boolean;
  ownerEmail: string;
  taskId: string;
  taskTitle: string | null;
}

/** User-facing message shown when editor access is still unavailable. */
export const TASK_SHARE_EDITOR_UNAVAILABLE_MESSAGE =
  'A permissão Editor estará disponível em uma próxima etapa.';
