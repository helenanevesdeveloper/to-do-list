import { createContext, useContext, type ReactNode } from 'react';
import type { TaskCategoryOption } from '../../../shared/types';
import type {
  ActiveTaskInlineCategoryAction,
  TaskInlineCategoryActionsPopoverPosition
} from '../hooks/useTaskInlineCategoryActionsPopoverState';
import type {
  TaskInlineCategoryPopoverPosition
} from '../hooks/useTaskInlineCategoryPopoverState';

export interface TaskInlineCategoryFieldContextValue {
  actionsErrorMessage: string | null;
  categoryErrorMessage: string | null;
  canCreateCategory: boolean;
  createLabel: string | null;
  filteredCategoryOptions: TaskCategoryOption[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  isCreatingCategory: boolean;
  isDeletingCategory: boolean;
  isOpen: boolean;
  isUpdatingCategory: boolean;
  listboxId: string;
  popoverPosition: TaskInlineCategoryPopoverPosition | null;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  query: string;
  rootRef: React.RefObject<HTMLDivElement | null>;
  selectedCategory: TaskCategoryOption | null;
  selectedCategoryId: string;
  showCategoryActions: boolean;
  triggerLabel: string;
  actionsDraftName: string;
  actionsPopoverPosition: TaskInlineCategoryActionsPopoverPosition | null;
  actionsPopoverRef: React.RefObject<HTMLDivElement | null>;
  activeCategoryAction: ActiveTaskInlineCategoryAction | null;
  clearSelectedCategory: () => void;
  closeCategoryActions: () => void;
  createCategory: () => Promise<void>;
  deleteCategory: () => Promise<void>;
  handleActionsDraftNameChange: (value: string) => void;
  handleFieldClick: () => void;
  handleInputChange: (value: string) => void;
  openCategoryActions: (args: {
    anchorElement: HTMLElement;
    categoryId: string;
    categoryName: string;
  }) => void;
  submitCategoryUpdateIfNeeded: () => Promise<boolean>;
  selectCategory: (categoryId: string) => void;
}

const TaskInlineCategoryFieldContext =
  createContext<TaskInlineCategoryFieldContextValue | null>(null);

export interface TaskInlineCategoryFieldProviderProps {
  children: ReactNode;
  value: TaskInlineCategoryFieldContextValue;
}

/** Provides the local category-picker contract for the inline task form subtree. */
export function TaskInlineCategoryFieldProvider({
  children,
  value
}: TaskInlineCategoryFieldProviderProps) {
  return (
    <TaskInlineCategoryFieldContext.Provider value={value}>
      {children}
    </TaskInlineCategoryFieldContext.Provider>
  );
}

/** Reads the local category-picker contract from context. */
export function useTaskInlineCategoryFieldContext(): TaskInlineCategoryFieldContextValue {
  const context = useContext(TaskInlineCategoryFieldContext);

  if (!context) {
    throw new Error(
      'useTaskInlineCategoryFieldContext must be used within TaskInlineCategoryFieldProvider.'
    );
  }

  return context;
}
