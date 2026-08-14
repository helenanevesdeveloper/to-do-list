import type { TaskSharePermission } from '../../domain/taskSharePermission';

/** Maps one task-sharing permission into the pt-BR label shown in the modal. */
export function getTaskSharePermissionLabel(permission: TaskSharePermission): string {
  if (permission === 'owner') {
    return 'Proprietário';
  }

  if (permission === 'editor') {
    return 'Editor';
  }

  return 'Leitor';
}
