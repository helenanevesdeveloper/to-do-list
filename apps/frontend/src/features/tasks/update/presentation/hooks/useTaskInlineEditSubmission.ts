import { useCallback, useState } from 'react';
import { mapUpdateTaskError } from '../../application/mapUpdateTaskError';
import {
  resolveTaskInlineEditAttempt
} from '../state/taskInlineEditState';
import type {
  TaskInlineEditDraft,
  TaskInlineEditInput
} from '../state/taskInlineEditTypes';

export type UseTaskInlineEditSubmissionArgs = {
  draft: TaskInlineEditDraft;
  initialDraft: TaskInlineEditDraft;
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
  initialDraft,
  onUpdateTask,
  setErrorMessage,
  titleInputRef
}: UseTaskInlineEditSubmissionArgs): UseTaskInlineEditSubmissionResult {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitUpdate = useCallback(async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }

    const attempt = resolveTaskInlineEditAttempt({
      draft,
      initialDraft
    });

    if (attempt.type === 'ignore') {
      setErrorMessage(null);
      return;
    }

    if (attempt.type === 'invalid') {
      setErrorMessage(attempt.errorMessage);
      focusTitleInput(titleInputRef);
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpdateTask(attempt.input);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(mapUpdateTaskError(error));
      focusTitleInput(titleInputRef);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    draft,
    initialDraft,
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
