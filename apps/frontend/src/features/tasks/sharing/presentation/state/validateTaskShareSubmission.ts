import type { TaskShare } from '../../domain/taskShare';
import { TASK_SHARE_EDITOR_UNAVAILABLE_MESSAGE } from './taskShareDraft';
import type { ShareComposerPermission } from './taskShareDraft';
import { validateTaskShareDraft } from './validateTaskShareDraft';

export interface ValidateTaskShareSubmissionInput {
  email: string;
  ownerEmail: string;
  permission: ShareComposerPermission;
  shares: readonly TaskShare[];
}

/** Validates the current share draft against the MVP permission and access rules. */
export function validateTaskShareSubmission({
  email,
  ownerEmail,
  permission,
  shares
}: ValidateTaskShareSubmissionInput): string | null {
  if (permission === 'editor') {
    return TASK_SHARE_EDITOR_UNAVAILABLE_MESSAGE;
  }

  return validateTaskShareDraft({
    email,
    ownerEmail,
    shares
  });
}
