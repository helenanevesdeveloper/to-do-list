import type { ActiveTaskInlineCategoryAction } from '../hooks/useTaskInlineCategoryActionsPopoverState';

export type TaskInlineCategoryOptionActionsPopoverState = {
  errorMessage: string | null;
  inputPlaceholder: string;
  isUpdating: boolean;
  statusMessage: string | null;
  value: string;
};

export type BuildTaskInlineCategoryOptionActionsPopoverStateArgs = {
  activeCategoryAction: ActiveTaskInlineCategoryAction | null;
  draftName: string;
  errorMessage: string | null;
  isUpdating: boolean;
};

/** Builds the derived render state for the category-actions secondary popover. */
export function buildTaskInlineCategoryOptionActionsPopoverState({
  activeCategoryAction,
  draftName,
  errorMessage,
  isUpdating
}: BuildTaskInlineCategoryOptionActionsPopoverStateArgs): TaskInlineCategoryOptionActionsPopoverState {
  return {
    errorMessage,
    inputPlaceholder:
      activeCategoryAction?.categoryName ?? 'Nome da categoria',
    isUpdating,
    statusMessage: isUpdating ? 'Atualizando categoria...' : null,
    value: draftName
  };
}
