import { useCallback, useEffect } from 'react';
import { usePointerDownOutside } from '../../../create/presentation/hooks/usePointerDownOutside';

export type UseTaskInlineCategoryFieldEffectsArgs = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  isOpen: boolean;
  onPointerDownOutside: () => void;
  rootRef: React.RefObject<HTMLDivElement | null>;
};

/** Applies focus and outside-click effects required by the inline category picker. */
export function useTaskInlineCategoryFieldEffects({
  inputRef,
  isOpen,
  onPointerDownOutside,
  rootRef
}: UseTaskInlineCategoryFieldEffectsArgs): void {
  const handlePointerDownOutside = useCallback((): void => {
    if (!isOpen) {
      return;
    }

    onPointerDownOutside();
  }, [isOpen, onPointerDownOutside]);

  usePointerDownOutside({
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
