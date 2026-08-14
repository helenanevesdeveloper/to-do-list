import { Stack } from '@chakra-ui/react';
import type { TaskShare } from '../../domain/taskShare';
import TaskShareAccessRow from './TaskShareAccessRow';

export interface TaskShareAccessRowsProps {
  canManageShares: boolean;
  currentUserEmail: string | null;
  onRemoveShare?: (shareId: string) => void;
  shares: readonly TaskShare[];
}

/** Renders the access rows currently available inside the sharing modal. */
export default function TaskShareAccessRows({
  canManageShares,
  currentUserEmail,
  onRemoveShare,
  shares
}: TaskShareAccessRowsProps) {
  return (
    <Stack spacing={4}>
      {shares.map((share) => (
        <TaskShareAccessRow
          key={share.id}
          canManageShare={canManageShares && !share.isOwner}
          currentUserEmail={currentUserEmail}
          onRemoveShare={onRemoveShare}
          share={share}
        />
      ))}
    </Stack>
  );
}
