import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Stack
} from '@chakra-ui/react';
import type { TaskSharePermission } from '../../domain/taskSharePermission';
import TaskShareComposerActions from './TaskShareComposerActions';

/** Props for the future share-composer row shown at the top of the modal. */
export interface TaskShareComposerProps {
  email: string;
  errorMessage?: string | null;
  onEmailChange: (value: string) => void;
  onPermissionChange: (value: Exclude<TaskSharePermission, 'owner'>) => void;
  onSubmit: () => void;
  permission: Exclude<TaskSharePermission, 'owner'>;
  canManageShares: boolean;
}

/** Renders the local-only share composer shown at the top of the modal. */
export default function TaskShareComposer(
  {
    email,
    errorMessage = null,
    onEmailChange,
    onPermissionChange,
    onSubmit,
    permission,
    canManageShares
  }: TaskShareComposerProps
) {
  return (
    <FormControl isInvalid={Boolean(errorMessage)}>
      <Stack spacing={3}>
        <TaskShareComposerActions
          canManageShares={canManageShares}
          email={email}
          onEmailChange={onEmailChange}
          onPermissionChange={onPermissionChange}
          onSubmit={onSubmit}
          permission={permission}
        />

        {errorMessage ? <FormErrorMessage>{errorMessage}</FormErrorMessage> : null}

        {!canManageShares ? (
          <FormHelperText>
            Apenas o proprietário pode adicionar ou remover pessoas com acesso.
          </FormHelperText>
        ) : null}
      </Stack>
    </FormControl>
  );
}
