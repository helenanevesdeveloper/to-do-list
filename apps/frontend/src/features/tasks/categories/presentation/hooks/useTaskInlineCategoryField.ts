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

export type UseTaskInlineCategoryFieldArgs = {
  categoryOptions: TaskCategoryOption[];
  onCreateCategory: (name: string) => Promise<TaskCategoryOption>;
  onSelectCategory: (categoryId: string) => void;
  value: string;
};

export type UseTaskInlineCategoryFieldResult = {
  categoryErrorMessage: string | null;
  canCreateCategory: boolean;
  createLabel: string | null;
  filteredCategoryOptions: TaskCategoryOption[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  isCreatingCategory: boolean;
  isOpen: boolean;
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
  handleActionsDraftNameChange: (value: string) => void;
  handleFieldClick: () => void;
  handleInputChange: (value: string) => void;
  openCategoryActions: (args: OpenTaskInlineCategoryActionsArgs) => void;
  openField: () => void;
  selectCategory: (categoryId: string) => void;
};

/** Manages local selection and creation state for the inline task-category picker. */
export function useTaskInlineCategoryField({
  categoryOptions,
  onCreateCategory,
  onSelectCategory,
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

  const handlePointerDownOutside = useCallback((): void => {
    closeCategoryActions();
    resetField();
  }, [closeCategoryActions, resetField]);

  useTaskInlineCategoryFieldEffects({
    actionsPopoverRef,
    inputRef,
    isOpen,
    onPointerDownOutside: handlePointerDownOutside,
    popoverRef,
    rootRef
  });

  return {
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
    isOpen,
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
    handleActionsDraftNameChange,
    handleFieldClick,
    handleInputChange,
    openCategoryActions,
    openField,
    selectCategory
  };
}
