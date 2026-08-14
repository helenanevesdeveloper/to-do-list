import { useCallback, useEffect, useState } from 'react';
import type { TaskCategoryOption } from '../../../shared/types';
import { mapUpdateTaskCategoryError } from '../../application/mapUpdateTaskCategoryError';
import { normalizeTaskInlineCategoryQuery } from '../state/taskInlineCategoryFieldState';
import type { ActiveTaskInlineCategoryAction } from './useTaskInlineCategoryActionsPopoverState';

export interface UseTaskInlineCategoryUpdateActionsArgs {
  activeCategoryAction: ActiveTaskInlineCategoryAction | null;
  closeCategoryActions: () => void;
  draftName: string;
  onUpdateCategory: (categoryId: string, name: string) => Promise<TaskCategoryOption>;
  setDraftName: (value: string) => void;
}

export interface UseTaskInlineCategoryUpdateActionsResult {
  actionErrorMessage: string | null;
  clearActionErrorMessage: () => void;
  handleDraftNameChange: (value: string) => void;
  isUpdatingCategory: boolean;
  submitCategoryUpdateIfNeeded: () => Promise<boolean>;
}

function shouldSkipCategoryUpdate(args: {
  draftName: string;
  originalName: string;
}): boolean {
  const normalizedDraftName = normalizeTaskInlineCategoryQuery(args.draftName);
  const normalizedOriginalName = normalizeTaskInlineCategoryQuery(args.originalName);

  return (
    normalizedDraftName.length === 0 ||
    normalizedDraftName === normalizedOriginalName
  );
}

/** Owns category rename submission, validation, and user-facing error state. */
export function useTaskInlineCategoryUpdateActions({
  activeCategoryAction,
  closeCategoryActions,
  draftName,
  onUpdateCategory,
  setDraftName
}: UseTaskInlineCategoryUpdateActionsArgs): UseTaskInlineCategoryUpdateActionsResult {
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
  const clearActionErrorMessage = useCallback((): void => {
    setActionErrorMessage(null);
  }, []);

  const handleDraftNameChange = useCallback(
    (value: string): void => {
      clearActionErrorMessage();
      setDraftName(value);
    },
    [clearActionErrorMessage, setDraftName]
  );

  const submitCategoryUpdateIfNeeded = useCallback(async (): Promise<boolean> => {
    if (!activeCategoryAction) {
      return true;
    }

    if (shouldSkipCategoryUpdate({ draftName, originalName: activeCategoryAction.categoryName })) {
      closeCategoryActions();
      return true;
    }

    setIsUpdatingCategory(true);

    try {
      await onUpdateCategory(activeCategoryAction.categoryId, draftName.trim());
      setActionErrorMessage(null);
      closeCategoryActions();
      return true;
    } catch (error) {
      setActionErrorMessage(mapUpdateTaskCategoryError(error));
      return false;
    } finally {
      setIsUpdatingCategory(false);
    }
  }, [
    activeCategoryAction,
    closeCategoryActions,
    draftName,
    onUpdateCategory
  ]);

  useEffect(() => {
    setActionErrorMessage(null);
  }, [activeCategoryAction?.categoryId]);

  return {
    actionErrorMessage,
    clearActionErrorMessage,
    handleDraftNameChange,
    isUpdatingCategory,
    submitCategoryUpdateIfNeeded
  };
}
