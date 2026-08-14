import { useCallback, useEffect, useRef, useState } from 'react';

export type TaskInlineCategoryActionsPopoverPosition = {
  left: number;
  top: number;
};

export type ActiveTaskInlineCategoryAction = {
  categoryId: string;
  categoryName: string;
};

export interface OpenTaskInlineCategoryActionsArgs {
  anchorElement: HTMLElement;
  categoryId: string;
  categoryName: string;
}

/** Read-only state exposed by the category-actions popover hook. */
export interface TaskInlineCategoryActionsPopoverState {
  draftName: string;
  popoverPosition: TaskInlineCategoryActionsPopoverPosition | null;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  activeAction: ActiveTaskInlineCategoryAction | null;
  isOpen: boolean;
}

/** User-triggered mutations exposed by the category-actions popover hook. */
export interface TaskInlineCategoryActionsPopoverActions {
  closeCategoryActions: () => void;
  setDraftName: (value: string) => void;
  openCategoryActions: (args: OpenTaskInlineCategoryActionsArgs) => void;
}

/** Aggregates state and actions for the secondary category-actions popover. */
export interface UseTaskInlineCategoryActionsPopoverStateResult {
  actions: TaskInlineCategoryActionsPopoverActions;
  state: TaskInlineCategoryActionsPopoverState;
}

function buildActionsPopoverPosition(anchorElement: HTMLElement): TaskInlineCategoryActionsPopoverPosition {
  const rect = anchorElement.getBoundingClientRect();
  const preferredWidth = 280;
  const preferredLeft = rect.right + 8;
  const fallbackLeft = Math.max(16, rect.left - preferredWidth - 8);
  const left =
    preferredLeft + preferredWidth <= window.innerWidth - 16
      ? preferredLeft
      : fallbackLeft;

  return {
    left,
    top: rect.top
  };
}

/** Owns the local state of the secondary category-actions popover. */
export function useTaskInlineCategoryActionsPopoverState(): UseTaskInlineCategoryActionsPopoverStateResult {
  const actionsPopoverRef = useRef<HTMLDivElement | null>(null);
  const [actionsDraftName, setActionsDraftName] = useState('');
  const [actionsPopoverPosition, setActionsPopoverPosition] =
    useState<TaskInlineCategoryActionsPopoverPosition | null>(null);
  const [activeCategoryAction, setActiveCategoryAction] =
    useState<ActiveTaskInlineCategoryAction | null>(null);

  const closeCategoryActions = useCallback((): void => {
    setActionsPopoverPosition(null);
    setActiveCategoryAction(null);
  }, []);

  const setDraftName = useCallback((value: string): void => {
    setActionsDraftName(value);
  }, []);

  const openCategoryActions = useCallback(
    ({ anchorElement, categoryId, categoryName }: OpenTaskInlineCategoryActionsArgs): void => {
      if (
        activeCategoryAction?.categoryId === categoryId &&
        actionsPopoverPosition
      ) {
        closeCategoryActions();
        return;
      }

      setActiveCategoryAction({
        categoryId,
        categoryName
      });
      setActionsDraftName(categoryName);
      setActionsPopoverPosition(buildActionsPopoverPosition(anchorElement));
    },
    [activeCategoryAction, actionsPopoverPosition, closeCategoryActions]
  );

  useEffect(() => {
    if (!actionsPopoverPosition) {
      return;
    }

    function handleViewportChange(): void {
      closeCategoryActions();
    }

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [actionsPopoverPosition, closeCategoryActions]);

  return {
    actions: {
      closeCategoryActions,
      openCategoryActions,
      setDraftName
    },
    state: {
      activeAction: activeCategoryAction,
      draftName: actionsDraftName,
      isOpen: actionsPopoverPosition !== null,
      popoverPosition: actionsPopoverPosition,
      popoverRef: actionsPopoverRef
    }
  };
}
