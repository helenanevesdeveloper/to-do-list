import { useEffect } from 'react';

type UsePointerDownOutsideArgs = {
  onPointerDownOutside: (event: MouseEvent) => void;
  rootRef: React.RefObject<HTMLElement | null>;
};

/** Calls the provided callback whenever a pointer down happens outside the root element. */
export function usePointerDownOutside({
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

      onPointerDownOutside(event);
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [onPointerDownOutside, rootRef]);
}
