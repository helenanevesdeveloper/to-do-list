import { useEffect } from 'react';

export type UseTaskInlineEditEffectsArgs = {
  titleInputRef: React.RefObject<HTMLInputElement | null>;
};

/** Applies autofocus behavior for the inline task-edit row. */
export function useTaskInlineEditEffects({
  titleInputRef
}: UseTaskInlineEditEffectsArgs): void {
  useEffect(() => {
    titleInputRef.current?.focus();
  }, [titleInputRef]);
}
