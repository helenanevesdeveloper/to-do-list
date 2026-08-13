import { useEffect } from 'react';
import { usePointerDownOutside } from './usePointerDownOutside';

export type UseTaskInlineCreateEffectsArgs = {
  onPointerDownOutside: (event: MouseEvent) => void;
  rootRef: React.RefObject<HTMLDivElement | null>;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
};

/** Applies autofocus and outside-click behavior for the inline task-create row. */
export function useTaskInlineCreateEffects({
  onPointerDownOutside,
  rootRef,
  titleInputRef
}: UseTaskInlineCreateEffectsArgs): void {
  useEffect(() => {
    titleInputRef.current?.focus();
  }, [titleInputRef]);

  usePointerDownOutside({
    onPointerDownOutside,
    rootRef
  });
}
