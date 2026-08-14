import { Tr } from '@chakra-ui/react';
import type { TaskListItem } from '../../../shared/types';
import { useTaskShareModalContext } from '../../../sharing/presentation/context/TaskShareModalContext';
import { buildTaskListItemDisplay } from '../mappers/buildTaskListItemDisplay';
import TaskTableRowActionsCell from './TaskTableRowActionsCell';
import TaskTableRowContentCell from './TaskTableRowContentCell';
import TaskTableRowMetadataCells from './TaskTableRowMetadataCells';

export type TaskTableRowProps = {
  isDeleting?: boolean;
  task: TaskListItem;
  onClick: (task: TaskListItem) => void;
  onDeleteTask: (task: TaskListItem) => Promise<void> | void;
};

/** Renders a single desktop row inside the task results table. */
export default function TaskTableRow({
  isDeleting = false,
  task,
  onClick,
  onDeleteTask,
}: TaskTableRowProps) {
  const { openTaskShareModal } = useTaskShareModalContext();
  const display = buildTaskListItemDisplay(task);
  const canDeleteTask = task.sharing.isOwner;

  function handleRowClick(): void {
    onClick(task);
  }

  function handleDeleteTask(): Promise<void> | void {
    return onDeleteTask(task);
  }

  function handleShareTask(): void {
    openTaskShareModal(task);
  }

  return (
    <Tr
      key={task.id}
      cursor="pointer"
      onClick={handleRowClick}
      role="group"
      _hover={{ bg: 'gray.50' }}
    >
      <TaskTableRowContentCell
        descriptionLabel={display.descriptionLabel}
        title={task.title}
      />
      <TaskTableRowMetadataCells display={display} />
      <TaskTableRowActionsCell
        canDeleteTask={canDeleteTask}
        isDeleting={isDeleting}
        onDeleteTask={handleDeleteTask}
        onShareTask={handleShareTask}
        taskTitle={task.title}
      />
    </Tr>
  );
}
