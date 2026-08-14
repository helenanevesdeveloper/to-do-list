import { useCallback, useRef, useState } from 'react';
import { EMPTY_TASK_INLINE_CREATE_DRAFT } from '../state/taskInlineCreateState';
import type { TaskInlineCreateDraft } from '../state/taskInlineCreateTypes';

export type UseTaskInlineCreateDraftStateResult = {
  draft: TaskInlineCreateDraft;
  draftRef: React.RefObject<TaskInlineCreateDraft>;
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
  const draftRef = useRef<TaskInlineCreateDraft>(EMPTY_TASK_INLINE_CREATE_DRAFT);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetDraft = useCallback((): void => {
    draftRef.current = EMPTY_TASK_INLINE_CREATE_DRAFT;
    setDraft(EMPTY_TASK_INLINE_CREATE_DRAFT);
  }, []);

  const setTitle = useCallback((value: string): void => {
    const nextDraft = {
      ...draftRef.current,
      title: value
    };
    draftRef.current = nextDraft;
    setDraft(nextDraft);
    setErrorMessage(null);
  }, []);

  const setDescription = useCallback((value: string): void => {
    const nextDraft = {
      ...draftRef.current,
      description: value
    };
    draftRef.current = nextDraft;
    setDraft(nextDraft);
  }, []);

  const setCategoryId = useCallback((value: string): void => {
    const nextDraft = {
      ...draftRef.current,
      categoryId: value
    };
    draftRef.current = nextDraft;
    setDraft(nextDraft);
  }, []);

  return {
    draft,
    draftRef,
    errorMessage,
    resetDraft,
    setCategoryId,
    setDescription,
    setErrorMessage,
    setTitle
  };
}
