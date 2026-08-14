import { useEffect } from 'react';

type UsePointerDownOutsideArgs = {
  additionalRefs?: Array<React.RefObject<HTMLElement | null>>;
  onPointerDownOutside: (event: MouseEvent) => void;
  rootRef: React.RefObject<HTMLElement | null>;
};

/** Calls the provided callback whenever a pointer down happens outside the root element. */
export function usePointerDownOutside({
  additionalRefs = [],
  onPointerDownOutside,
  rootRef
}: UsePointerDownOutsideArgs): void {
  useEffect(() => {
    function handlePointerDown(event: MouseEvent): void {
      const rootElement = rootRef.current;

      if (!rootElement) {
        return;
      }

      if (rootElement.contains(event.target as Node)) {
        return;
      }

      if (
        additionalRefs.some((ref) => {
          const extraElement = ref.current;
          return extraElement?.contains(event.target as Node) ?? false;
        })
      ) {
        return;
      }

      onPointerDownOutside(event);
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [additionalRefs, onPointerDownOutside, rootRef]);
}
