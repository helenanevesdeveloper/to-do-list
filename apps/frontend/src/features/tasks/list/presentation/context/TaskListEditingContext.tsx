import {
  createContext,
  useContext,
  useMemo,
  type ReactNode
} from 'react';
import type { TaskCategoryOption, TaskListItem } from '../../../shared/types';
import type { TaskInlineEditInput } from '../../../update/presentation/hooks/useTaskInlineEdit';

export interface TaskListEditingContextValue {
  categoryOptions: TaskCategoryOption[];
  createCategory: (name: string) => Promise<TaskCategoryOption>;
  editingTaskId: string | null;
  cancelTaskEdit: () => void;
  startTaskEdit: (task: TaskListItem) => void;
  submitTaskEdit: (taskId: string, input: TaskInlineEditInput) => Promise<void>;
}

const TaskListEditingContext = createContext<TaskListEditingContextValue | null>(null);

export interface TaskListEditingProviderProps {
  categoryOptions: TaskCategoryOption[];
  children: ReactNode;
  createCategory: (name: string) => Promise<TaskCategoryOption>;
  editingTaskId: string | null;
  onCancelTaskEdit: () => void;
  onStartTaskEdit: (task: TaskListItem) => void;
  onSubmitTaskEdit: (taskId: string, input: TaskInlineEditInput) => Promise<void>;
}

/** Provides only the inline task-editing contract for the results subtree. */
export function TaskListEditingProvider({
  categoryOptions,
  children,
  createCategory,
  editingTaskId,
  onCancelTaskEdit,
  onStartTaskEdit,
  onSubmitTaskEdit
}: TaskListEditingProviderProps) {
  const value = useMemo<TaskListEditingContextValue>(
    () => ({
      categoryOptions,
      createCategory,
      editingTaskId,
      cancelTaskEdit: onCancelTaskEdit,
      startTaskEdit: onStartTaskEdit,
      submitTaskEdit: onSubmitTaskEdit
    }),
    [
      categoryOptions,
      createCategory,
      editingTaskId,
      onCancelTaskEdit,
      onStartTaskEdit,
      onSubmitTaskEdit
    ]
  );

  return (
    <TaskListEditingContext.Provider value={value}>
      {children}
    </TaskListEditingContext.Provider>
  );
}

/** Reads the inline task-editing contract exposed to the results subtree. */
export function useTaskListEditingContext(): TaskListEditingContextValue {
  const context = useContext(TaskListEditingContext);

  if (!context) {
    throw new Error('useTaskListEditingContext must be used within TaskListEditingProvider.');
  }

  return context;
}
