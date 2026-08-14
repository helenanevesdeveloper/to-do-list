import { useRef } from 'react';
import type {
  TaskCompletionStatus,
  TaskListItem
} from '../../../shared/types';
import { useTaskInlineEditDraftState } from './useTaskInlineEditDraftState';
import { useTaskInlineEditEffects } from './useTaskInlineEditEffects';
import { useTaskInlineEditSubmission } from './useTaskInlineEditSubmission';
import type {
  TaskInlineEditDraft,
  TaskInlineEditInput
} from '../state/taskInlineEditTypes';

export type { TaskInlineEditDraft, TaskInlineEditInput } from '../state/taskInlineEditTypes';

export type UseTaskInlineEditArgs = {
  onUpdateTask: (input: TaskInlineEditInput) => Promise<void>;
  task: TaskListItem;
};

export type UseTaskInlineEditResult = {
  draft: TaskInlineEditDraft;
  errorMessage: string | null;
  isSubmitting: boolean;
  submitUpdate: () => Promise<void>;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
  setCategoryId: (value: string) => void;
  setDescription: (value: string) => void;
  setStatus: (value: TaskCompletionStatus) => void;
  setTitle: (value: string) => void;
};

/** Manages one inline task-edit row, including autofocus and outside-click save. */
export function useTaskInlineEdit({
  onUpdateTask,
  task
}: UseTaskInlineEditArgs): UseTaskInlineEditResult {
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const {
    draft,
    errorMessage,
    setCategoryId,
    setDescription,
    setErrorMessage,
    setStatus,
    setTitle
  } = useTaskInlineEditDraftState(task);
  const { isSubmitting, submitUpdate } = useTaskInlineEditSubmission({
    draft,
    onUpdateTask,
    setErrorMessage,
    titleInputRef
  });

  useTaskInlineEditEffects({
    titleInputRef
  });

  return {
    draft,
    errorMessage,
    isSubmitting,
    submitUpdate,
    titleInputRef,
    setCategoryId,
    setDescription,
    setStatus,
    setTitle
  };
}
