import { forwardRef } from 'react';
import { IconButton, type IconButtonProps } from '@chakra-ui/react';
import { FiMoreVertical } from 'react-icons/fi';

export interface TaskItemActionsMenuButtonProps
  extends Omit<IconButtonProps, 'aria-label' | 'icon'> {
  hideUntilHover?: boolean;
  taskTitle: string;
}

function buildHoverVisibilityProps(hideUntilHover: boolean): Pick<
  IconButtonProps,
  '_groupHover' | 'opacity' | 'pointerEvents'
> {
  if (!hideUntilHover) {
    return {
      _groupHover: undefined,
      opacity: 1,
      pointerEvents: 'auto'
    };
  }

  return {
    _groupHover: { opacity: 1, pointerEvents: 'auto' },
    opacity: 0,
    pointerEvents: 'none'
  };
}

/** Renders the trigger button used by the task item actions menu. */
const TaskItemActionsMenuButton = forwardRef<
  HTMLButtonElement,
  TaskItemActionsMenuButtonProps
>(function TaskItemActionsMenuButton(
  { hideUntilHover = false, taskTitle, ...buttonProps },
  ref
) {
  const visibilityProps = buildHoverVisibilityProps(hideUntilHover);

  return (
    <IconButton
      ref={ref}
      aria-label={`Abrir acoes da tarefa ${taskTitle}`}
      icon={<FiMoreVertical />}
      size="sm"
      variant="ghost"
      {...visibilityProps}
      {...buttonProps}
    />
  );
});

export default TaskItemActionsMenuButton;
