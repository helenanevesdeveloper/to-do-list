import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList
} from '@chakra-ui/react';
import { FiChevronDown, FiTrash2 } from 'react-icons/fi';
import type { TaskSharePermission } from '../../domain/taskSharePermission';
import { getTaskSharePermissionLabel } from '../mappers/getTaskSharePermissionLabel';

/** Props for the future permission menu shown per shared user. */
export interface TaskSharePermissionMenuProps {
  isRemovingShare?: boolean;
  onRemoveShare?: () => void;
  permission: TaskSharePermission;
  canManageShare: boolean;
}

/** Renders the permission box shown beside each shared user in the modal. */
export default function TaskSharePermissionMenu(
  {
    isRemovingShare = false,
    onRemoveShare,
    permission,
    canManageShare
  }: TaskSharePermissionMenuProps
) {
  const label = getTaskSharePermissionLabel(permission);

  if (!canManageShare) {
    return (
      <Button variant="outline" size="sm" isDisabled>
        {label}
      </Button>
    );
  }

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        rightIcon={<FiChevronDown />}
        size="sm"
        variant="outline"
        isDisabled={isRemovingShare}
        isLoading={isRemovingShare}
      >
        {label}
      </MenuButton>
      <MenuList>
        <MenuItem isDisabled>{getTaskSharePermissionLabel('reader')}</MenuItem>
        <MenuItem isDisabled>Editor (em breve)</MenuItem>
        <MenuDivider />
        <MenuItem
          color="red.600"
          icon={<FiTrash2 />}
          isDisabled={isRemovingShare}
          onClick={() => {
            onRemoveShare?.();
          }}
        >
          Remover acesso
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
