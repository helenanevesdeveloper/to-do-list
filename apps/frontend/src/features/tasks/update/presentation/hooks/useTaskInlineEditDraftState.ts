import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  TaskCompletionStatus,
  TaskListItem
} from '../../../shared/types';
import { buildTaskInlineEditDraft } from '../state/taskInlineEditState';
import type { TaskInlineEditDraft } from '../state/taskInlineEditTypes';

export type UseTaskInlineEditDraftStateResult = {
  draft: TaskInlineEditDraft;
  draftRef: React.RefObject<TaskInlineEditDraft>;
  errorMessage: string | null;
  initialDraft: TaskInlineEditDraft;
  setCategoryId: (value: string) => void;
  setDescription: (value: string) => void;
  setErrorMessage: (value: string | null) => void;
  setStatus: (value: TaskCompletionStatus) => void;
  setTitle: (value: string) => void;
};

/** Owns only the local draft and inline error state for task editing. */
export function useTaskInlineEditDraftState(
  task: TaskListItem
): UseTaskInlineEditDraftStateResult {
  const initialDraft = useMemo(
    () => buildTaskInlineEditDraft(task),
    [task.category?.id, task.description, task.id, task.title]
  );
  const [draft, setDraft] = useState<TaskInlineEditDraft>(initialDraft);
  const draftRef = useRef<TaskInlineEditDraft>(initialDraft);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    draftRef.current = initialDraft;
    setDraft(initialDraft);
    setErrorMessage(null);
  }, [initialDraft]);

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

  const setStatus = useCallback((value: TaskCompletionStatus): void => {
    const nextDraft = {
      ...draftRef.current,
      status: value
    };
    draftRef.current = nextDraft;
    setDraft(nextDraft);
  }, []);

  return {
    draft,
    draftRef,
    errorMessage,
    initialDraft,
    setCategoryId,
    setDescription,
    setErrorMessage,
    setStatus,
    setTitle
  };
}
