import { useEffect, useRef } from 'react';

/** Keeps the latest value available to effect callbacks without re-subscribing them. */
export function useLatestRef<T>(value: T) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
