import { Box, Flex } from '@chakra-ui/react';
import type { TaskListItem } from '../../../shared/types';
import { useTaskShareModalContext } from '../../../sharing/presentation/context/TaskShareModalContext';
import { buildTaskListItemDisplay } from '../mappers/buildTaskListItemDisplay';
import TaskItemActionsMenu from './TaskItemActionsMenu';
import TaskTableCardContent from './TaskTableCardContent';

export type TaskTableCardProps = {
  isDeleting?: boolean;
  task: TaskListItem;
  onClick: (task: TaskListItem) => void;
  onDeleteTask: (task: TaskListItem) => Promise<void> | void;
};

/** Renders a single mobile card inside the task results list. */
export default function TaskTableCard({
  isDeleting = false,
  task,
  onClick,
  onDeleteTask,
}: TaskTableCardProps) {
  const { openTaskShareModal } = useTaskShareModalContext();
  const display = buildTaskListItemDisplay(task);
  const canDeleteTask = task.sharing.isOwner;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      cursor="pointer"
      p={4}
      onClick={() => onClick(task)}
      role="group"
    >
      <Flex align="flex-start" gap={3}>
        <TaskTableCardContent display={display} title={task.title} />

        <Box flexShrink={0} onClick={(event) => event.stopPropagation()}>
          <TaskItemActionsMenu
            canDeleteTask={canDeleteTask}
            isDeleting={isDeleting}
            onDeleteTask={() => onDeleteTask(task)}
            onShareTask={() => openTaskShareModal(task)}
            taskTitle={task.title}
          />
        </Box>
      </Flex>
    </Box>
  );
}
