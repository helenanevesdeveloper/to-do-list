import { useEffect } from 'react';

export type UseTaskInlineCategoryFieldEffectsArgs = {
  actionsPopoverRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isOpen: boolean;
  onActionsPointerDownOutside: () => void;
  onPointerDownOutside: () => void;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  rootRef: React.RefObject<HTMLDivElement | null>;
};

type TaskInlineCategoryPointerDownArea =
  | 'actions-popover'
  | 'main-field'
  | 'outside';

function isNodeInsideElement(
  element: HTMLElement | null,
  targetNode: Node
): boolean {
  return element?.contains(targetNode) ?? false;
}

function resolveTaskInlineCategoryPointerDownArea(args: {
  actionsPopoverElement: HTMLDivElement | null;
  popoverElement: HTMLDivElement | null;
  rootElement: HTMLDivElement | null;
  targetNode: Node;
}): TaskInlineCategoryPointerDownArea {
  if (isNodeInsideElement(args.actionsPopoverElement, args.targetNode)) {
    return 'actions-popover';
  }

  if (
    isNodeInsideElement(args.rootElement, args.targetNode) ||
    isNodeInsideElement(args.popoverElement, args.targetNode)
  ) {
    return 'main-field';
  }

  return 'outside';
}

function handleTaskInlineCategoryPointerDown(args: {
  actionsPopoverElement: HTMLDivElement | null;
  onActionsPointerDownOutside: () => void;
  onPointerDownOutside: () => void;
  pointerDownArea: TaskInlineCategoryPointerDownArea;
}): void {
  if (args.pointerDownArea === 'actions-popover') {
    return;
  }

  if (
    args.actionsPopoverElement &&
    args.pointerDownArea === 'main-field'
  ) {
    args.onActionsPointerDownOutside();
    return;
  }

  if (args.pointerDownArea === 'main-field') {
    return;
  }

  args.onPointerDownOutside();
}

/** Applies focus and outside-click effects required by the inline category picker. */
export function useTaskInlineCategoryFieldEffects({
  actionsPopoverRef,
  inputRef,
  isOpen,
  onActionsPointerDownOutside,
  onPointerDownOutside,
  popoverRef,
  rootRef
}: UseTaskInlineCategoryFieldEffectsArgs): void {
  useEffect(() => {
    function handlePointerDown(event: MouseEvent): void {
      if (!isOpen) {
        return;
      }

      const targetNode = event.target as Node;
      const actionsPopoverElement = actionsPopoverRef.current;
      const pointerDownArea = resolveTaskInlineCategoryPointerDownArea({
        actionsPopoverElement,
        popoverElement: popoverRef.current,
        rootElement: rootRef.current,
        targetNode
      });

      handleTaskInlineCategoryPointerDown({
        actionsPopoverElement,
        onActionsPointerDownOutside,
        onPointerDownOutside,
        pointerDownArea
      });
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [
    actionsPopoverRef,
    isOpen,
    onActionsPointerDownOutside,
    onPointerDownOutside,
    popoverRef,
    rootRef
  ]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    inputRef.current?.focus();
  }, [inputRef, isOpen]);
}
