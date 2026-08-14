import { Stack, Text } from '@chakra-ui/react';
import type { TaskShare } from '../../domain/taskShare';
import TaskShareAccessRow from './TaskShareAccessRow';

/** Props for the future access-list section inside the sharing modal. */
export interface TaskShareAccessListProps {
  currentUserEmail: string | null;
  onRemoveShare?: (shareId: string) => void;
  shares: readonly TaskShare[];
  canManageShares: boolean;
}

/** Renders the people-with-access section inside the local share modal. */
export default function TaskShareAccessList(
  {
    currentUserEmail,
    onRemoveShare,
    shares,
    canManageShares
  }: TaskShareAccessListProps
) {
  return (
    <Stack spacing={4}>
      <Text fontSize="lg" fontWeight="semibold">
        Pessoas com acesso
      </Text>

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
    </Stack>
  );
}
