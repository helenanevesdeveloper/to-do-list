import { Button, HStack, Input } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import type { TaskSharePermission } from '../../domain/taskSharePermission';
import TaskSharePermissionField from './TaskSharePermissionField';

export interface TaskShareComposerActionsProps {
  canManageShares: boolean;
  email: string;
  onEmailChange: (value: string) => void;
  onPermissionChange: (value: Exclude<TaskSharePermission, 'owner'>) => void;
  onSubmit: () => void;
  permission: Exclude<TaskSharePermission, 'owner'>;
}

/** Renders the interactive controls shown in the first row of the share composer. */
export default function TaskShareComposerActions({
  canManageShares,
  email,
  onEmailChange,
  onPermissionChange,
  onSubmit,
  permission
}: TaskShareComposerActionsProps) {
  return (
    <HStack align="start" spacing={3}>
      <Input
        flex="1"
        placeholder="Digite o email da pessoa"
        value={email}
        onChange={(event) => onEmailChange(event.target.value)}
        isDisabled={!canManageShares}
      />

      <TaskSharePermissionField
        canManageShares={canManageShares}
        onChange={onPermissionChange}
        permission={permission}
      />

      <Button
        aria-label="Adicionar acesso"
        leftIcon={<FiPlus />}
        onClick={onSubmit}
        isDisabled={!canManageShares}
        colorScheme="blue"
      >
        Adicionar
      </Button>
    </HStack>
  );
}
