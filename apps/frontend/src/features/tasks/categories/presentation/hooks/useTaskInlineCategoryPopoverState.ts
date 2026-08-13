import { useId, useRef, useState } from 'react';

export type UseTaskInlineCategoryPopoverStateResult = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  isOpen: boolean;
  listboxId: string;
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
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const listboxId = useId();

  function resetField(): void {
    setIsOpen(false);
    setQuery('');
  }

  function openField(): void {
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

  return {
    inputRef,
    isOpen,
    listboxId,
    query,
    rootRef,
    closeField,
    handleFieldClick,
    handleInputChange,
    openField,
    resetField
  };
}
