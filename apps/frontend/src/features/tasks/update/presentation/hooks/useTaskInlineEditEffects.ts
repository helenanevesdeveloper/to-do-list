import { useEffect } from 'react';
import { usePointerDownOutside } from '../../../create/presentation/hooks/usePointerDownOutside';

export type UseTaskInlineEditEffectsArgs = {
  onPointerDownOutside: () => void;
  rootRef: React.RefObject<HTMLDivElement | null>;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
};

/** Applies autofocus and outside-click behavior for the inline task-edit row. */
export function useTaskInlineEditEffects({
  onPointerDownOutside,
  rootRef,
  titleInputRef
}: UseTaskInlineEditEffectsArgs): void {
  useEffect(() => {
    titleInputRef.current?.focus();
  }, [titleInputRef]);

  usePointerDownOutside({
    onPointerDownOutside,
    rootRef
  });
}
