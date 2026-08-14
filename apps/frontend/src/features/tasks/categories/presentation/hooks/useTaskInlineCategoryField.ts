import { useCallback, useMemo } from 'react';
import type { TaskCategoryOption } from '../../../shared/types';
import {
  buildTaskInlineCategoryFieldState,
} from '../state/taskInlineCategoryFieldState';
import {
  useTaskInlineCategoryFieldEffects
} from './useTaskInlineCategoryFieldEffects';
import {
  useTaskInlineCategoryActionsPopoverState
} from './useTaskInlineCategoryActionsPopoverState';
import type {
  ActiveTaskInlineCategoryAction,
  OpenTaskInlineCategoryActionsArgs,
  TaskInlineCategoryActionsPopoverPosition
} from './useTaskInlineCategoryActionsPopoverState';
import {
  useTaskInlineCategoryPopoverState
} from './useTaskInlineCategoryPopoverState';
import type {
  TaskInlineCategoryPopoverPosition
} from './useTaskInlineCategoryPopoverState';
import {
  useTaskInlineCategorySelectionActions
} from './useTaskInlineCategorySelectionActions';
import {
  useTaskInlineCategoryDeleteActions
} from './useTaskInlineCategoryDeleteActions';
import {
  useTaskInlineCategoryUpdateActions
} from './useTaskInlineCategoryUpdateActions';

export type UseTaskInlineCategoryFieldArgs = {
  categoryOptions: TaskCategoryOption[];
  interactionBoundaryRef?: React.RefObject<HTMLElement | null>;
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  onSelectCategory: (categoryId: string) => void;
  onUpdateCategory: (categoryId: string, name: string) => Promise<TaskCategoryOption>;
  value: string;
};

export type UseTaskInlineCategoryFieldResult = {
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
  actionsDraftName: string;
  actionsPopoverPosition: TaskInlineCategoryActionsPopoverPosition | null;
  actionsPopoverRef: React.RefObject<HTMLDivElement | null>;
  activeCategoryAction: ActiveTaskInlineCategoryAction | null;
  popoverPosition: TaskInlineCategoryPopoverPosition | null;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  query: string;
  rootRef: React.RefObject<HTMLDivElement | null>;
  selectedCategory: TaskCategoryOption | null;
  triggerLabel: string;
  clearSelectedCategory: () => void;
  closeCategoryActions: () => void;
  closeField: () => void;
  createCategory: () => Promise<void>;
  deleteCategory: () => Promise<void>;
  handleActionsDraftNameChange: (value: string) => void;
  handleFieldClick: () => void;
  handleInputChange: (value: string) => void;
  openCategoryActions: (args: OpenTaskInlineCategoryActionsArgs) => void;
  openField: () => void;
  submitCategoryUpdateIfNeeded: () => Promise<boolean>;
  selectCategory: (categoryId: string) => void;
};

/** Manages local selection and creation state for the inline task-category picker. */
export function useTaskInlineCategoryField({
  categoryOptions,
  interactionBoundaryRef,
  onCreateCategory,
  onDeleteCategory,
  onSelectCategory,
  onUpdateCategory,
  value
}: UseTaskInlineCategoryFieldArgs): UseTaskInlineCategoryFieldResult {
  const {
    inputRef,
    isOpen,
    listboxId,
    popoverPosition,
    popoverRef,
    query,
    rootRef,
    closeField,
    handleFieldClick,
    handleInputChange,
    openField,
    resetField
  } = useTaskInlineCategoryPopoverState();
  const {
    actions: {
      closeCategoryActions,
      openCategoryActions,
      setDraftName: handleActionsDraftNameChange
    },
    state: {
      activeAction: activeCategoryAction,
      draftName: actionsDraftName,
      popoverPosition: actionsPopoverPosition,
      popoverRef: actionsPopoverRef
    }
  } = useTaskInlineCategoryActionsPopoverState();

  const {
    canCreateCategory,
    createLabel,
    filteredCategoryOptions,
    selectedCategory,
    triggerLabel
  } = useMemo(
    () => buildTaskInlineCategoryFieldState(categoryOptions, query, value),
    [categoryOptions, query, value]
  );

  const {
    categoryErrorMessage,
    clearSelectedCategory,
    createCategory,
    isCreatingCategory,
    selectCategory
  } =
    useTaskInlineCategorySelectionActions({
      onCreateCategory,
      onSelectCategory,
      query,
      resetField
    });
  const {
    actionErrorMessage: updateActionErrorMessage,
    handleDraftNameChange,
    isUpdatingCategory,
    submitCategoryUpdateIfNeeded
  } = useTaskInlineCategoryUpdateActions({
    activeCategoryAction,
    closeCategoryActions,
    draftName: actionsDraftName,
    onUpdateCategory,
    setDraftName: handleActionsDraftNameChange
  });
  const {
    actionErrorMessage: deleteActionErrorMessage,
    deleteCategory,
    isDeletingCategory
  } = useTaskInlineCategoryDeleteActions({
    activeCategoryAction,
    clearSelectedCategory,
    closeCategoryActions,
    onDeleteCategory,
    selectedCategoryId: value
  });
  const actionErrorMessage =
    deleteActionErrorMessage ?? updateActionErrorMessage;

  const handleActionsPointerDownOutside = useCallback(async (): Promise<void> => {
    await submitCategoryUpdateIfNeeded();
  }, [submitCategoryUpdateIfNeeded]);

  const handlePointerDownOutside = useCallback(async (): Promise<void> => {
    const didCloseCategoryActions = await submitCategoryUpdateIfNeeded();

    if (!didCloseCategoryActions) {
      return;
    }

    resetField();
  }, [resetField, submitCategoryUpdateIfNeeded]);

  useTaskInlineCategoryFieldEffects({
    interactionBoundaryRef,
    actionsPopoverRef,
    inputRef,
    isOpen,
    onActionsPointerDownOutside: handleActionsPointerDownOutside,
    onPointerDownOutside: handlePointerDownOutside,
    popoverRef,
    rootRef
  });

  return {
    actionsErrorMessage: actionErrorMessage,
    actionsDraftName,
    actionsPopoverPosition,
    actionsPopoverRef,
    activeCategoryAction,
    categoryErrorMessage,
    canCreateCategory,
    createLabel,
    filteredCategoryOptions,
    inputRef,
    isCreatingCategory,
    isDeletingCategory,
    isOpen,
    isUpdatingCategory,
    listboxId,
    popoverPosition,
    popoverRef,
    query,
    rootRef,
    selectedCategory,
    triggerLabel,
    clearSelectedCategory,
    closeCategoryActions,
    closeField,
    createCategory,
    deleteCategory,
    handleActionsDraftNameChange: handleDraftNameChange,
    handleFieldClick,
    handleInputChange,
    openCategoryActions,
    openField,
    submitCategoryUpdateIfNeeded,
    selectCategory
  };
}
