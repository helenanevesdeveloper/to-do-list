import { Box } from '@chakra-ui/react';
import type { TaskCategoryOption, TaskListItem } from '../../../shared/types';
import TaskTableDesktop from './TaskTableDesktop';
import TaskTableMobileList from './TaskTableMobileList';
import type { TaskInlineEditInput } from '../../../update/presentation/hooks/useTaskInlineEdit';
import { TaskListEditingProvider } from '../context/TaskListEditingContext';

export type TaskTableProps = {
  categoryOptions: TaskCategoryOption[];
  deletingTaskId?: string | null;
  editingTaskId?: string | null;
  items: TaskListItem[];
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onTaskCancelEdit: () => void;
  onTaskDelete: (task: TaskListItem) => Promise<void> | void;
  onTaskClick: (task: TaskListItem) => void;
  onTaskUpdate: (taskId: string, input: TaskInlineEditInput) => Promise<void>;
};

/** Renders only the success state of the task results area. */
export default function TaskTable({
  categoryOptions,
  deletingTaskId = null,
  editingTaskId = null,
  items,
  onCreateCategory,
  onTaskCancelEdit,
  onTaskDelete,
  onTaskClick,
  onTaskUpdate,
}: TaskTableProps) {
  return (
    <TaskListEditingProvider
      categoryOptions={categoryOptions}
      createCategory={onCreateCategory}
      editingTaskId={editingTaskId}
      onCancelTaskEdit={onTaskCancelEdit}
      onStartTaskEdit={onTaskClick}
      onSubmitTaskEdit={onTaskUpdate}
    >
      <Box borderWidth="1px" borderRadius="lg" overflow="visible" position="relative">
        <TaskTableDesktop
          deletingTaskId={deletingTaskId}
          items={items}
          onTaskDelete={onTaskDelete}
        />
        <Box p={{ base: 4, md: 0 }}>
          <TaskTableMobileList
            deletingTaskId={deletingTaskId}
            items={items}
            onTaskDelete={onTaskDelete}
          />
        </Box>
      </Box>
    </TaskListEditingProvider>
  );
}
