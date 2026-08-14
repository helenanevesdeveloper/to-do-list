import { Stack } from '@chakra-ui/react';
import type { TaskShare } from '../../domain/taskShare';
import TaskShareAccessRow from './TaskShareAccessRow';

export interface TaskShareAccessRowsProps {
  canManageShares: boolean;
  currentUserEmail: string | null;
  deletingShareId?: string | null;
  onRemoveShare?: (shareId: string) => void;
  shares: readonly TaskShare[];
}

function canManageTaskShare(args: {
  canManageShares: boolean;
  currentUserEmail: string | null;
  share: TaskShare;
}): boolean {
  if (args.share.isOwner) {
    return false;
  }

  if (args.canManageShares) {
    return true;
  }

  if (!args.currentUserEmail) {
    return false;
  }

  return args.currentUserEmail.toLowerCase() === args.share.email.toLowerCase();
}

/** Renders the access rows currently available inside the sharing modal. */
export default function TaskShareAccessRows({
  canManageShares,
  currentUserEmail,
  deletingShareId = null,
  onRemoveShare,
  shares
}: TaskShareAccessRowsProps) {
  return (
    <Stack spacing={4}>
      {shares.map((share) => (
        <TaskShareAccessRow
          key={share.id}
          canManageShare={canManageTaskShare({
            canManageShares,
            currentUserEmail,
            share
          })}
          currentUserEmail={currentUserEmail}
          deletingShareId={deletingShareId}
          onRemoveShare={onRemoveShare}
          share={share}
        />
      ))}
    </Stack>
  );
}
