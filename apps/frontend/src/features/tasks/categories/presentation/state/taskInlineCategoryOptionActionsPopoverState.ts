import type { ActiveTaskInlineCategoryAction } from '../hooks/useTaskInlineCategoryActionsPopoverState';

export type TaskInlineCategoryOptionActionsPopoverState = {
  deleteLabel: string;
  errorMessage: string | null;
  inputPlaceholder: string;
  isDeleting: boolean;
  isUpdating: boolean;
  statusMessage: string | null;
  value: string;
};

export type BuildTaskInlineCategoryOptionActionsPopoverStateArgs = {
  activeCategoryAction: ActiveTaskInlineCategoryAction | null;
  draftName: string;
  errorMessage: string | null;
  isDeleting: boolean;
  isUpdating: boolean;
};

/** Builds the derived render state for the category-actions secondary popover. */
export function buildTaskInlineCategoryOptionActionsPopoverState({
  activeCategoryAction,
  draftName,
  errorMessage,
  isDeleting,
  isUpdating
}: BuildTaskInlineCategoryOptionActionsPopoverStateArgs): TaskInlineCategoryOptionActionsPopoverState {
  const statusMessage = isDeleting
    ? 'Deletando categoria...'
    : isUpdating
      ? 'Atualizando categoria...'
      : null;

  return {
    deleteLabel: 'Deletar',
    errorMessage,
    inputPlaceholder:
      activeCategoryAction?.categoryName ?? 'Nome da categoria',
    isDeleting,
    isUpdating,
    statusMessage,
    value: draftName
  };
}
