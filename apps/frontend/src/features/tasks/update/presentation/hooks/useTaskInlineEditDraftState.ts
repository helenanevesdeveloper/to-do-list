import { useCallback, useEffect, useMemo, useState } from 'react';
import type { TaskListItem } from '../../../shared/types';
import { buildTaskInlineEditDraft } from '../state/taskInlineEditState';
import type { TaskInlineEditDraft } from '../state/taskInlineEditTypes';

export type UseTaskInlineEditDraftStateResult = {
  draft: TaskInlineEditDraft;
  errorMessage: string | null;
  initialDraft: TaskInlineEditDraft;
  setCategoryId: (value: string) => void;
  setDescription: (value: string) => void;
  setErrorMessage: (value: string | null) => void;
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setDraft(initialDraft);
    setErrorMessage(null);
  }, [initialDraft]);

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
    initialDraft,
    setCategoryId,
    setDescription,
    setErrorMessage,
    setTitle
  };
}
