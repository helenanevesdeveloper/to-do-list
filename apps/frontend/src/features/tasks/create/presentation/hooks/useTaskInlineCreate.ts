import { useCallback, useEffect, useRef, useState } from 'react';
import {
  EMPTY_TASK_INLINE_CREATE_DRAFT,
  resolveTaskInlineCreateAttempt
} from '../state/taskInlineCreateState';
import { useLatestRef } from './useLatestRef';
import { usePointerDownOutside } from './usePointerDownOutside';

export type TaskInlineCreateDraft = {
  categoryId: string;
  description: string;
  title: string;
};

export type TaskInlineCreateInput = {
  categoryId: string | null;
  description: string | null;
  title: string;
};

export type UseTaskInlineCreateArgs = {
  onCreateTask: (input: TaskInlineCreateInput) => void;
};

export type UseTaskInlineCreateResult = {
  draft: TaskInlineCreateDraft;
  errorMessage: string | null;
  rootRef: React.RefObject<HTMLDivElement | null>;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
  setCategoryId: (value: string) => void;
  setDescription: (value: string) => void;
  setTitle: (value: string) => void;
};

/** Manages the inline task-create row, including autofocus and outside-click save. */
export function useTaskInlineCreate({
  onCreateTask
}: UseTaskInlineCreateArgs): UseTaskInlineCreateResult {
  const [draft, setDraft] = useState<TaskInlineCreateDraft>(
    EMPTY_TASK_INLINE_CREATE_DRAFT
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const draftRef = useLatestRef(draft);
  const onCreateTaskRef = useLatestRef(onCreateTask);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handlePointerDownOutside = useCallback((): void => {
    const attempt = resolveTaskInlineCreateAttempt(draftRef.current);

    if (attempt.type === 'ignore') {
      setErrorMessage(null);
      return;
    }

    if (attempt.type === 'invalid') {
      setErrorMessage(attempt.errorMessage);
      titleInputRef.current?.focus();
      return;
    }

    onCreateTaskRef.current(attempt.input);
    setDraft(EMPTY_TASK_INLINE_CREATE_DRAFT);
    setErrorMessage(null);
    window.setTimeout(() => {
      titleInputRef.current?.focus();
    }, 0);
  }, [draftRef, onCreateTaskRef]);

  usePointerDownOutside({
    onPointerDownOutside: handlePointerDownOutside,
    rootRef
  });

  function setTitle(value: string): void {
    setDraft((current) => ({ ...current, title: value }));
    setErrorMessage(null);
  }

  function setDescription(value: string): void {
    setDraft((current) => ({ ...current, description: value }));
  }

  function setCategoryId(value: string): void {
    setDraft((current) => ({ ...current, categoryId: value }));
  }

  return {
    draft,
    errorMessage,
    rootRef,
    titleInputRef,
    setCategoryId,
    setDescription,
    setTitle
  };
}
