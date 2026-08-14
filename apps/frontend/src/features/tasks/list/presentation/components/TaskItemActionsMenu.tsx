import { Menu, MenuButton } from '@chakra-ui/react';
import TaskItemActionsMenuButton from './TaskItemActionsMenuButton';
import TaskItemActionsMenuItems from './TaskItemActionsMenuItems';

export interface TaskItemActionsMenuProps {
  canDeleteTask?: boolean;
  hideUntilHover?: boolean;
  isDeleting?: boolean;
  onDeleteTask: () => Promise<void> | void;
  taskTitle: string;
}

/** Renders the contextual actions available for one task in the results list. */
export default function TaskItemActionsMenu({
  canDeleteTask = false,
  hideUntilHover = false,
  isDeleting = false,
  onDeleteTask,
  taskTitle
}: TaskItemActionsMenuProps) {
  return (
    <Menu isLazy placement="bottom-end">
      <MenuButton
        as={TaskItemActionsMenuButton}
        hideUntilHover={hideUntilHover}
        onClick={(event) => {
          event.stopPropagation();
        }}
        taskTitle={taskTitle}
      />
      <TaskItemActionsMenuItems
        canDeleteTask={canDeleteTask}
        isDeleting={isDeleting}
        onDeleteTask={onDeleteTask}
      />
    </Menu>
  );
}
