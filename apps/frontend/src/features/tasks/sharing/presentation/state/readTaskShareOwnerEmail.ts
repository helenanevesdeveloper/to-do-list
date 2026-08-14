import type { TaskShare } from '../../domain/taskShare';

export interface ReadTaskShareOwnerEmailInput {
  fallbackOwnerEmail: string;
  shares: readonly TaskShare[];
}

/** Reads the owner email from loaded shares and falls back to the modal session data. */
export function readTaskShareOwnerEmail({
  fallbackOwnerEmail,
  shares
}: ReadTaskShareOwnerEmailInput): string {
  return shares.find((share) => share.isOwner)?.email ?? fallbackOwnerEmail;
}
