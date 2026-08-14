import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import type { TaskSharePermission } from '../../domain/taskSharePermission';
import { getTaskSharePermissionLabel } from '../mappers/getTaskSharePermissionLabel';

export interface TaskSharePermissionFieldProps {
  canManageShares: boolean;
  onChange: (value: Exclude<TaskSharePermission, 'owner'>) => void;
  permission: Exclude<TaskSharePermission, 'owner'>;
}

/** Renders the permission selector used by the local share composer. */
export default function TaskSharePermissionField({
  canManageShares,
  onChange,
  permission
}: TaskSharePermissionFieldProps) {
  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        rightIcon={<FiChevronDown />}
        variant="outline"
        isDisabled={!canManageShares}
        minW="140px"
      >
        {getTaskSharePermissionLabel(permission)}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => onChange('reader')}>
          {getTaskSharePermissionLabel('reader')}
        </MenuItem>
        <MenuItem isDisabled>Editor (em breve)</MenuItem>
      </MenuList>
    </Menu>
  );
}
