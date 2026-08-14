import { useCallback, useState } from 'react';
import { mapUpdateTaskError } from '../../application/mapUpdateTaskError';
import { resolveTaskInlineEditAttempt } from '../state/taskInlineEditState';
import type {
  TaskInlineEditDraft,
  TaskInlineEditInput
} from '../state/taskInlineEditTypes';

export type UseTaskInlineEditSubmissionArgs = {
  draftRef: React.RefObject<TaskInlineEditDraft>;
  initialDraftRef: React.RefObject<TaskInlineEditDraft>;
  isCategoryFieldOpenRef: React.RefObject<boolean>;
  onCancelRef: React.RefObject<() => void>;
  onUpdateTaskRef: React.RefObject<(input: TaskInlineEditInput) => Promise<void>>;
  setErrorMessage: (value: string | null) => void;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
};

export type UseTaskInlineEditSubmissionResult = {
  handlePointerDownOutside: () => Promise<void>;
  isSubmitting: boolean;
};

function focusTitleInput(
  titleInputRef: React.RefObject<HTMLInputElement | null>
): void {
  titleInputRef.current?.focus();
}

/** Owns the async submit lifecycle triggered when the inline edit row loses focus. */
export function useTaskInlineEditSubmission({
  draftRef,
  initialDraftRef,
  isCategoryFieldOpenRef,
  onCancelRef,
  onUpdateTaskRef,
  setErrorMessage,
  titleInputRef
}: UseTaskInlineEditSubmissionArgs): UseTaskInlineEditSubmissionResult {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePointerDownOutside = useCallback(async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }

    if (isCategoryFieldOpenRef.current) {
      return;
    }

    const attempt = resolveTaskInlineEditAttempt({
      draft: draftRef.current,
      initialDraft: initialDraftRef.current
    });

    if (attempt.type === 'ignore') {
      setErrorMessage(null);
      onCancelRef.current();
      return;
    }

    if (attempt.type === 'invalid') {
      setErrorMessage(attempt.errorMessage);
      focusTitleInput(titleInputRef);
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpdateTaskRef.current(attempt.input);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(mapUpdateTaskError(error));
      focusTitleInput(titleInputRef);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    draftRef,
    initialDraftRef,
    isCategoryFieldOpenRef,
    isSubmitting,
    onCancelRef,
    onUpdateTaskRef,
    setErrorMessage,
    titleInputRef
  ]);

  return {
    handlePointerDownOutside,
    isSubmitting
  };
}
