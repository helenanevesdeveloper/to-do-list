import { useCallback, useState } from 'react';
import { EMPTY_TASK_INLINE_CREATE_DRAFT } from '../state/taskInlineCreateState';
import type { TaskInlineCreateDraft } from '../state/taskInlineCreateTypes';

export type UseTaskInlineCreateDraftStateResult = {
  draft: TaskInlineCreateDraft;
  errorMessage: string | null;
  resetDraft: () => void;
  setCategoryId: (value: string) => void;
  setDescription: (value: string) => void;
  setErrorMessage: (value: string | null) => void;
  setTitle: (value: string) => void;
};

/** Owns only the local draft and inline error state for task creation. */
export function useTaskInlineCreateDraftState(): UseTaskInlineCreateDraftStateResult {
  const [draft, setDraft] = useState<TaskInlineCreateDraft>(
    EMPTY_TASK_INLINE_CREATE_DRAFT
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetDraft = useCallback((): void => {
    setDraft(EMPTY_TASK_INLINE_CREATE_DRAFT);
  }, []);

  const setTitle = useCallback((value: string): void => {
    setDraft((current) => ({ ...current, title: value }));
    setErrorMessage(null);
  }, []);

  const setDescription = useCallback((value: string): void => {
    setDraft((current) => ({ ...current, description: value }));
  }, []);

  const setCategoryId = useCallback((value: string): void => {
    setDraft((current) => ({ ...current, categoryId: value }));
  }, []);

  return {
    draft,
    errorMessage,
    resetDraft,
    setCategoryId,
    setDescription,
    setErrorMessage,
    setTitle
  };
}
