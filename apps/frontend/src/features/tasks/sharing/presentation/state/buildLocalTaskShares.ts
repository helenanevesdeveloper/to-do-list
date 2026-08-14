import type { TaskListItem } from '../../../shared/types';
import type { TaskShare } from '../../domain/taskShare';
import { sortTaskShares } from './sortTaskShares';

export interface BuildLocalTaskSharesInput {
  currentUserEmail: string | null;
  task: TaskListItem;
}

function buildOwnerEmail(task: TaskListItem, currentUserEmail: string): string {
  if (task.sharing.isOwner) {
    return currentUserEmail;
  }

  return `owner+${task.id.slice(0, 8)}@example.com`;
}

function buildSampleCollaboratorEmail(taskId: string, index: number): string {
  return `colaborador${index + 1}+${taskId.slice(0, 4)}@example.com`;
}

/** Builds local-only share entries used by the dashboard modal before API integration. */
export function buildLocalTaskShares({
  currentUserEmail,
  task
}: BuildLocalTaskSharesInput): TaskShare[] {
  const viewerEmail = currentUserEmail ?? 'usuario@example.com';
  const ownerEmail = buildOwnerEmail(task, viewerEmail);
  const shares: TaskShare[] = [
    {
      email: ownerEmail,
      id: `owner:${task.id}`,
      isOwner: true,
      permission: 'owner'
    }
  ];

  if (task.sharing.isOwner) {
    for (let index = 0; index < task.sharing.sharedCount; index += 1) {
      shares.push({
        email: buildSampleCollaboratorEmail(task.id, index),
        id: `share:${task.id}:${index}`,
        isOwner: false,
        permission: 'reader'
      });
    }
  } else {
    shares.push({
      email: viewerEmail,
      id: `self:${task.id}`,
      isOwner: false,
      permission: task.sharing.permission === 'editor' ? 'editor' : 'reader'
    });

    const additionalCollaborators = Math.max(task.sharing.sharedCount - 1, 0);

    for (let index = 0; index < additionalCollaborators; index += 1) {
      shares.push({
        email: buildSampleCollaboratorEmail(task.id, index),
        id: `share:${task.id}:${index}`,
        isOwner: false,
        permission: 'reader'
      });
    }
  }

  return sortTaskShares(shares);
}
