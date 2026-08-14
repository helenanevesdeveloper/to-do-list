import { useRef, useState } from 'react';
import { useLatestRef } from './useLatestRef';
import { useTaskInlineCreateDraftState } from './useTaskInlineCreateDraftState';
import { useTaskInlineCreateEffects } from './useTaskInlineCreateEffects';
import { useTaskInlineCreateSubmission } from './useTaskInlineCreateSubmission';
import type {
  TaskInlineCreateDraft,
  TaskInlineCreateInput
} from '../state/taskInlineCreateTypes';

export type { TaskInlineCreateDraft, TaskInlineCreateInput } from '../state/taskInlineCreateTypes';

export type UseTaskInlineCreateArgs = {
  onCreateTask: (input: TaskInlineCreateInput) => Promise<void>;
};

export type UseTaskInlineCreateResult = {
  draft: TaskInlineCreateDraft;
  errorMessage: string | null;
  isSubmitting: boolean;
  rootRef: React.RefObject<HTMLDivElement | null>;
  setIsCategoryFieldOpen: (value: boolean) => void;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
  setCategoryId: (value: string) => void;
  setDescription: (value: string) => void;
  setTitle: (value: string) => void;
};

/** Manages the inline task-create row, including autofocus and outside-click save. */
export function useTaskInlineCreate({
  onCreateTask
}: UseTaskInlineCreateArgs): UseTaskInlineCreateResult {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const isCategoryFieldOpenRef = useRef(false);
  const [isCategoryFieldOpen, setIsCategoryFieldOpen] = useState(false);
  const {
    draft,
    draftRef,
    errorMessage,
    resetDraft,
    setCategoryId,
    setDescription,
    setErrorMessage,
    setTitle
  } = useTaskInlineCreateDraftState();
  const onCreateTaskRef = useLatestRef(onCreateTask);
  const handleCategoryFieldOpenChange = (value: boolean): void => {
    isCategoryFieldOpenRef.current = value;
    setIsCategoryFieldOpen(value);
  };
  const { handlePointerDownOutside, isSubmitting } = useTaskInlineCreateSubmission({
    draftRef,
    isCategoryFieldOpenRef,
    onCreateTaskRef,
    resetDraft,
    setErrorMessage,
    titleInputRef
  });

  useTaskInlineCreateEffects({
    onPointerDownOutside: handlePointerDownOutside,
    rootRef,
    titleInputRef
  });

  return {
    draft,
    errorMessage,
    isSubmitting,
    rootRef,
    setIsCategoryFieldOpen: handleCategoryFieldOpenChange,
    titleInputRef,
    setCategoryId,
    setDescription,
    setTitle
  };
}
