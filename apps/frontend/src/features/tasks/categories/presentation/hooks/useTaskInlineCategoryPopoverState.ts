import { useCallback, useEffect, useId, useRef, useState } from 'react';

export type TaskInlineCategoryPopoverPosition = {
  left: number;
  top: number;
  width: number;
};

export type UseTaskInlineCategoryPopoverStateResult = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  isOpen: boolean;
  listboxId: string;
  popoverPosition: TaskInlineCategoryPopoverPosition | null;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  query: string;
  rootRef: React.RefObject<HTMLDivElement | null>;
  closeField: () => void;
  handleFieldClick: () => void;
  handleInputChange: (value: string) => void;
  openField: () => void;
  resetField: () => void;
};

/** Manages only the local popover state and refs of the inline category picker. */
export function useTaskInlineCategoryPopoverState(): UseTaskInlineCategoryPopoverStateResult {
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] =
    useState<TaskInlineCategoryPopoverPosition | null>(null);
  const [query, setQuery] = useState('');
  const listboxId = useId();

  const updatePopoverPosition = useCallback((): void => {
    const rootElement = rootRef.current;

    if (!rootElement) {
      setPopoverPosition(null);
      return;
    }

    const rect = rootElement.getBoundingClientRect();
    setPopoverPosition({
      left: rect.left,
      top: rect.bottom + 8,
      width: rect.width
    });
  }, []);

  function resetField(): void {
    setIsOpen(false);
    setQuery('');
  }

  function openField(): void {
    updatePopoverPosition();
    setIsOpen(true);
  }

  function closeField(): void {
    resetField();
  }

  function handleFieldClick(): void {
    openField();
    inputRef.current?.focus();
  }

  function handleInputChange(value: string): void {
    setQuery(value);
    setIsOpen(true);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updatePopoverPosition();

    function handleViewportChange(): void {
      updatePopoverPosition();
    }

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [isOpen, updatePopoverPosition]);

  return {
    inputRef,
    isOpen,
    listboxId,
    popoverPosition,
    popoverRef,
    query,
    rootRef,
    closeField,
    handleFieldClick,
    handleInputChange,
    openField,
    resetField
  };
}
