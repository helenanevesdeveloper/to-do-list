import { Box, Flex } from '@chakra-ui/react';
import type { TaskListItem } from '../../../shared/types';
import { useTaskShareModalContext } from '../../../sharing/presentation/context/TaskShareModalContext';
import { useTaskListEditingContext } from '../context/TaskListEditingContext';
import TaskInlineEditRow from '../../../update/presentation/components/TaskInlineEditRow';
import { buildTaskListItemDisplay } from '../mappers/buildTaskListItemDisplay';
import TaskItemActionsMenu from './TaskItemActionsMenu';
import TaskTableCardContent from './TaskTableCardContent';

export type TaskTableCardProps = {
  isDeleting?: boolean;
  onDeleteTask: (task: TaskListItem) => Promise<void> | void;
  task: TaskListItem;
};

/** Renders a single mobile card inside the task results list. */
export default function TaskTableCard({
  isDeleting = false,
  task,
  onDeleteTask
}: TaskTableCardProps) {
  const { openTaskShareModal } = useTaskShareModalContext();
  const {
    categoryOptions,
    createCategory,
    updateCategory,
    editingTaskId,
    cancelTaskEdit,
    startTaskEdit,
    submitTaskEdit
  } = useTaskListEditingContext();
  const display = buildTaskListItemDisplay(task);
  const canDeleteTask = task.sharing.isOwner;
  const canEditTask = task.sharing.isOwner;

  if (editingTaskId === task.id) {
    return (
      <TaskInlineEditRow
        categoryOptions={categoryOptions}
        onCancel={cancelTaskEdit}
        onCreateCategory={createCategory}
        onUpdateCategory={updateCategory}
        onUpdateTask={(input) => submitTaskEdit(task.id, input)}
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
      onClick={() => startTaskEdit(task)}
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
