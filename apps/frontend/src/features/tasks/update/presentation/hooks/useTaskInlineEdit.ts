import { useRef, useState } from 'react';
import type { TaskListItem } from '../../../shared/types';
import { useTaskInlineEditDraftState } from './useTaskInlineEditDraftState';
import { useTaskInlineEditEffects } from './useTaskInlineEditEffects';
import { useTaskInlineEditSubmission } from './useTaskInlineEditSubmission';
import type {
  TaskInlineEditDraft,
  TaskInlineEditInput
} from '../state/taskInlineEditTypes';

export type { TaskInlineEditDraft, TaskInlineEditInput } from '../state/taskInlineEditTypes';

export type UseTaskInlineEditArgs = {
  onCancel: () => void;
  onUpdateTask: (input: TaskInlineEditInput) => Promise<void>;
  task: TaskListItem;
};

export type UseTaskInlineEditResult = {
  draft: TaskInlineEditDraft;
  errorMessage: string | null;
  isSubmitting: boolean;
  rootRef: React.RefObject<HTMLDivElement | null>;
  setIsCategoryFieldOpen: (value: boolean) => void;
  submitUpdate: () => Promise<void>;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
  setCategoryId: (value: string) => void;
  setDescription: (value: string) => void;
  setTitle: (value: string) => void;
};

/** Manages one inline task-edit row, including autofocus and outside-click save. */
export function useTaskInlineEdit({
  onCancel,
  onUpdateTask,
  task
}: UseTaskInlineEditArgs): UseTaskInlineEditResult {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const isCategoryFieldOpenRef = useRef(false);
  const [isCategoryFieldOpen, setIsCategoryFieldOpen] = useState(false);
  const {
    draft,
    errorMessage,
    setCategoryId,
    setDescription,
    setErrorMessage,
    setTitle
  } = useTaskInlineEditDraftState(task);
  const handleCategoryFieldOpenChange = (value: boolean): void => {
    isCategoryFieldOpenRef.current = value;
    setIsCategoryFieldOpen(value);
  };
  const { handlePointerDownOutside, isSubmitting, submitUpdate } = useTaskInlineEditSubmission({
    draft,
    isCategoryFieldOpenRef,
    onCancel,
    onUpdateTask,
    setErrorMessage,
    titleInputRef
  });

  useTaskInlineEditEffects({
    onPointerDownOutside: handlePointerDownOutside,
    rootRef,
    titleInputRef
  });

  return {
    draft,
    errorMessage,
    isSubmitting,
    rootRef,
    setIsCategoryFieldOpen: handleCategoryFieldOpenChange,
    submitUpdate,
    titleInputRef,
    setCategoryId,
    setDescription,
    setTitle
  };
}
