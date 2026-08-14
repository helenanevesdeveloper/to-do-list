import { Box, Flex } from '@chakra-ui/react';
import type { TaskCategoryOption, TaskListItem } from '../../../shared/types';
import { useTaskShareModalContext } from '../../../sharing/presentation/context/TaskShareModalContext';
import TaskInlineEditRow from '../../../update/presentation/components/TaskInlineEditRow';
import type { TaskInlineEditInput } from '../../../update/presentation/hooks/useTaskInlineEdit';
import { buildTaskListItemDisplay } from '../mappers/buildTaskListItemDisplay';
import TaskItemActionsMenu from './TaskItemActionsMenu';
import TaskTableCardContent from './TaskTableCardContent';

export type TaskTableCardProps = {
  categoryOptions: TaskCategoryOption[];
  isEditing?: boolean;
  isDeleting?: boolean;
  onCancelEdit: () => void;
  task: TaskListItem;
  onClick: (task: TaskListItem) => void;
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onDeleteTask: (task: TaskListItem) => Promise<void> | void;
  onUpdateTask: (taskId: string, input: TaskInlineEditInput) => Promise<void>;
};

/** Renders a single mobile card inside the task results list. */
export default function TaskTableCard({
  categoryOptions,
  isEditing = false,
  isDeleting = false,
  onCancelEdit,
  task,
  onClick,
  onCreateCategory,
  onDeleteTask,
  onUpdateTask,
}: TaskTableCardProps) {
  const { openTaskShareModal } = useTaskShareModalContext();
  const display = buildTaskListItemDisplay(task);
  const canDeleteTask = task.sharing.isOwner;
  const canEditTask = task.sharing.isOwner;

  if (isEditing) {
    return (
      <TaskInlineEditRow
        categoryOptions={categoryOptions}
        onCancel={onCancelEdit}
        onCreateCategory={onCreateCategory}
        onUpdateTask={(input) => onUpdateTask(task.id, input)}
        task={task}
      />
    );
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      cursor={canEditTask ? 'pointer' : 'default'}
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
