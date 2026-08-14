import { MenuItem, MenuList, Spinner } from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';

export interface TaskItemActionsMenuItemsProps {
  canDeleteTask: boolean;
  isDeleting?: boolean;
  onDeleteTask: () => Promise<void> | void;
}

function renderDeleteIcon(isDeleting: boolean) {
  return isDeleting ? <Spinner size="sm" /> : <FiTrash2 />;
}

function renderDeleteLabel(isDeleting: boolean): string {
  return isDeleting ? 'Excluindo...' : 'Excluir';
}

/** Renders the actionable items displayed inside the task actions menu. */
export default function TaskItemActionsMenuItems({
  canDeleteTask,
  isDeleting = false,
  onDeleteTask,
}: TaskItemActionsMenuItemsProps) {
  return (
    <MenuList onClick={(event) => event.stopPropagation()}>
      <MenuItem
        color="red.600"
        icon={renderDeleteIcon(isDeleting)}
        isDisabled={isDeleting || !canDeleteTask}
        onClick={() => {
          void onDeleteTask();
        }}
      >
        {renderDeleteLabel(isDeleting)}
      </MenuItem>
    </MenuList>
  );
}
