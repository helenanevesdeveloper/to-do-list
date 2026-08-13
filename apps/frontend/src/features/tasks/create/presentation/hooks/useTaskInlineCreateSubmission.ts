import { useCallback, useState } from 'react';
import { mapCreateTaskError } from '../../application/mapCreateTaskError';
import { resolveTaskInlineCreateAttempt } from '../state/taskInlineCreateState';
import type {
  TaskInlineCreateDraft,
  TaskInlineCreateInput
} from '../state/taskInlineCreateTypes';

export type UseTaskInlineCreateSubmissionArgs = {
  draftRef: React.RefObject<TaskInlineCreateDraft>;
  onCreateTaskRef: React.RefObject<(input: TaskInlineCreateInput) => Promise<void>>;
  resetDraft: () => void;
  setErrorMessage: (value: string | null) => void;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
};

export type UseTaskInlineCreateSubmissionResult = {
  handlePointerDownOutside: (event: MouseEvent) => Promise<void>;
  isSubmitting: boolean;
};

function focusTitleInput(
  titleInputRef: React.RefObject<HTMLInputElement | null>
): void {
  titleInputRef.current?.focus();
}

/** Owns the async submit lifecycle triggered when the inline create row loses focus. */
export function useTaskInlineCreateSubmission({
  draftRef,
  onCreateTaskRef,
  resetDraft,
  setErrorMessage,
  titleInputRef
}: UseTaskInlineCreateSubmissionArgs): UseTaskInlineCreateSubmissionResult {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePointerDownOutside = useCallback(async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }

    const attempt = resolveTaskInlineCreateAttempt(draftRef.current);

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
      await onCreateTaskRef.current(attempt.input);
      resetDraft();
      setErrorMessage(null);
      window.setTimeout(() => {
        focusTitleInput(titleInputRef);
      }, 0);
    } catch (error) {
      setErrorMessage(mapCreateTaskError(error));
      focusTitleInput(titleInputRef);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    draftRef,
    isSubmitting,
    onCreateTaskRef,
    resetDraft,
    setErrorMessage,
    titleInputRef
  ]);

  return {
    handlePointerDownOutside,
    isSubmitting
  };
}
