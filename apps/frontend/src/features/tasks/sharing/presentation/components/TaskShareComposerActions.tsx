import { Button, Input, Stack } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import type { TaskSharePermission } from '../../domain/taskSharePermission';
import TaskSharePermissionField from './TaskSharePermissionField';

export interface TaskShareComposerActionsProps {
  canManageShares: boolean;
  email: string;
  isSubmitting?: boolean;
  onEmailChange: (value: string) => void;
  onPermissionChange: (value: Exclude<TaskSharePermission, 'owner'>) => void;
  onSubmit: () => void;
  permission: Exclude<TaskSharePermission, 'owner'>;
}

/** Renders the interactive controls shown in the first row of the share composer. */
export default function TaskShareComposerActions({
  canManageShares,
  email,
  isSubmitting = false,
  onEmailChange,
  onPermissionChange,
  onSubmit,
  permission
}: TaskShareComposerActionsProps) {
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      align={{ base: 'stretch', md: 'start' }}
      spacing={3}
    >
      <Input
        flex={{ md: '1' }}
        placeholder="Digite o email da pessoa"
        value={email}
        onChange={(event) => onEmailChange(event.target.value)}
        isDisabled={!canManageShares || isSubmitting}
      />

      <TaskSharePermissionField
        canManageShares={canManageShares && !isSubmitting}
        isFullWidth
        onChange={onPermissionChange}
        permission={permission}
      />

      <Button
        aria-label="Adicionar acesso"
        leftIcon={<FiPlus />}
        onClick={onSubmit}
        isDisabled={!canManageShares || isSubmitting}
        isLoading={isSubmitting}
        colorScheme="blue"
        w={{ base: 'full', md: 'auto' }}
      >
        Adicionar
      </Button>
    </Stack>
  );
}
