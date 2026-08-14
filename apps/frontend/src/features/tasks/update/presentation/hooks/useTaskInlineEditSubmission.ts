import { useCallback, useState } from 'react';
import { mapUpdateTaskError } from '../../application/mapUpdateTaskError';
import {
  normalizeTaskInlineEditDraft,
  validateTaskInlineEditDraft
} from '../state/taskInlineEditState';
import type {
  TaskInlineEditDraft,
  TaskInlineEditInput
} from '../state/taskInlineEditTypes';

export type UseTaskInlineEditSubmissionArgs = {
  draft: TaskInlineEditDraft;
  onUpdateTask: (input: TaskInlineEditInput) => Promise<void>;
  setErrorMessage: (value: string | null) => void;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
};

export type UseTaskInlineEditSubmissionResult = {
  isSubmitting: boolean;
  submitUpdate: () => Promise<void>;
};

function focusTitleInput(
  titleInputRef: React.RefObject<HTMLInputElement | null>
): void {
  titleInputRef.current?.focus();
}

/** Owns the async submit lifecycle triggered when the inline edit row loses focus. */
export function useTaskInlineEditSubmission({
  draft,
  onUpdateTask,
  setErrorMessage,
  titleInputRef
}: UseTaskInlineEditSubmissionArgs): UseTaskInlineEditSubmissionResult {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitUpdate = useCallback(async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }

    const validationError = validateTaskInlineEditDraft(draft);

    if (validationError) {
      setErrorMessage(validationError);
      focusTitleInput(titleInputRef);
      return;
    }

    const input = normalizeTaskInlineEditDraft(draft);
    setIsSubmitting(true);

    try {
      await onUpdateTask(input);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(mapUpdateTaskError(error));
      focusTitleInput(titleInputRef);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    draft,
    isSubmitting,
    onUpdateTask,
    setErrorMessage,
    titleInputRef
  ]);

  return {
    isSubmitting,
    submitUpdate
  };
}
