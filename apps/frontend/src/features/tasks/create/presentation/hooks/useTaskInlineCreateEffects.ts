import { useEffect } from 'react';
import { usePointerDownOutside } from './usePointerDownOutside';
import {
  TASK_INLINE_OVERLAY_SELECTOR
} from '../../../shared/presentation/constants/taskInlineOverlay';

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
    insideSelector: TASK_INLINE_OVERLAY_SELECTOR,
    onPointerDownOutside,
    rootRef
  });
}
