import { Box, Circle, HStack, Stack, Text } from '@chakra-ui/react';
import type { TaskShare } from '../../domain/taskShare';
import { getTaskSharePermissionLabel } from '../mappers/getTaskSharePermissionLabel';
import TaskSharePermissionMenu from './TaskSharePermissionMenu';

/** Props for one access row rendered inside the sharing modal. */
export interface TaskShareAccessRowProps {
  currentUserEmail: string | null;
  onRemoveShare?: (shareId: string) => void;
  share: TaskShare;
  canManageShare: boolean;
}

function buildInitial(value: string): string {
  return value.trim().charAt(0).toUpperCase() || '?';
}

/** Renders one person with access inside the local task-sharing modal. */
export default function TaskShareAccessRow(
  {
    currentUserEmail,
    onRemoveShare,
    share,
    canManageShare
  }: TaskShareAccessRowProps
) {
  const isCurrentUser = currentUserEmail?.toLowerCase() === share.email.toLowerCase();
  const labelSuffix = isCurrentUser ? ' (você)' : '';

  return (
    <HStack align="center" justify="space-between" spacing={4} width="full">
      <HStack align="center" spacing={3}>
        <Circle bg="gray.200" color="gray.700" size="40px">
          {buildInitial(share.email)}
        </Circle>

        <Stack spacing={0}>
          <Text fontWeight="medium">{`${share.email}${labelSuffix}`}</Text>
          <Text color="gray.500" fontSize="sm">
            {share.isOwner
              ? 'Pessoa proprietária da tarefa'
              : 'Pessoa com acesso compartilhado'}
          </Text>
        </Stack>
      </HStack>

      <Box flexShrink={0}>
        {share.isOwner ? (
          <Text color="gray.500" fontWeight="medium">
            {getTaskSharePermissionLabel('owner')}
          </Text>
        ) : (
          <TaskSharePermissionMenu
            canManageShare={canManageShare}
            onRemoveShare={
              onRemoveShare
                ? () => {
                    onRemoveShare(share.id);
                  }
                : undefined
            }
            permission={share.permission}
          />
        )}
      </Box>
    </HStack>
  );
}
