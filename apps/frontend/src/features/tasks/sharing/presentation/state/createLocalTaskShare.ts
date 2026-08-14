import type { TaskShare } from '../../domain/taskShare';
import type { ShareComposerPermission } from './taskShareDraft';
import { buildLocalTaskShareId } from './buildLocalTaskShareId';

export interface CreateLocalTaskShareInput {
  email: string;
  permission: ShareComposerPermission;
  taskId: string;
}

/** Creates one local-only task-share entity from the current share draft values. */
export function createLocalTaskShare({
  email,
  permission,
  taskId
}: CreateLocalTaskShareInput): TaskShare {
  const normalizedEmail = email.trim().toLowerCase();

  return {
    email: normalizedEmail,
    id: buildLocalTaskShareId(taskId, normalizedEmail),
    isOwner: false,
    permission
  };
}
