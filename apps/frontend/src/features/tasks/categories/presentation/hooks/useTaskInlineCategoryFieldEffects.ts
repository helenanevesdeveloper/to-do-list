import { useCallback, useEffect } from 'react';
import { usePointerDownOutside } from '../../../create/presentation/hooks/usePointerDownOutside';

export type UseTaskInlineCategoryFieldEffectsArgs = {
  actionsPopoverRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isOpen: boolean;
  onPointerDownOutside: () => void;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  rootRef: React.RefObject<HTMLDivElement | null>;
};

/** Applies focus and outside-click effects required by the inline category picker. */
export function useTaskInlineCategoryFieldEffects({
  actionsPopoverRef,
  inputRef,
  isOpen,
  onPointerDownOutside,
  popoverRef,
  rootRef
}: UseTaskInlineCategoryFieldEffectsArgs): void {
  const handlePointerDownOutside = useCallback((): void => {
    if (!isOpen) {
      return;
    }

    onPointerDownOutside();
  }, [isOpen, onPointerDownOutside]);

  usePointerDownOutside({
    additionalRefs: [actionsPopoverRef, popoverRef],
    onPointerDownOutside: handlePointerDownOutside,
    rootRef
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    inputRef.current?.focus();
  }, [inputRef, isOpen]);
}
