import type { TaskListItem } from '../../../shared/types';
import { useTaskListEditingContext } from '../context/TaskListEditingContext';
import TaskTableEditingRow from './TaskTableEditingRow';
import TaskTableReadOnlyRow from './TaskTableReadOnlyRow';

export type TaskTableRowProps = {
  isDeleting?: boolean;
  onDeleteTask: (task: TaskListItem) => Promise<void> | void;
  task: TaskListItem;
};

/** Renders a single desktop row inside the task results table. */
export default function TaskTableRow({
  isDeleting = false,
  task,
  onDeleteTask
}: TaskTableRowProps) {
  const {
    categoryOptions,
    createCategory,
    deleteCategory,
    updateCategory,
    editingTaskId,
    cancelTaskEdit,
    startTaskEdit,
    submitTaskEdit
  } = useTaskListEditingContext();

  if (editingTaskId === task.id) {
    return (
      <TaskTableEditingRow
        categoryOptions={categoryOptions}
        onCancelEdit={cancelTaskEdit}
        onCreateCategory={createCategory}
        onDeleteCategory={deleteCategory}
        onUpdateCategory={updateCategory}
        onUpdateTask={submitTaskEdit}
        task={task}
      />
    );
  }

  return (
    <TaskTableReadOnlyRow
      isDeleting={isDeleting}
      onClick={startTaskEdit}
      onDeleteTask={onDeleteTask}
      task={task}
    />
  );
}
