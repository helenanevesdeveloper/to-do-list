import { Button, Tag, Text } from '@chakra-ui/react';
import type { MouseEvent } from 'react';

export type TaskInlineCategoryOptionButtonProps = {
  id: string;
  isSelected: boolean;
  label: string;
  onSelect: (categoryId: string) => void;
};

/** Renders a single selectable category option inside the inline picker list. */
export default function TaskInlineCategoryOptionButton({
  id,
  isSelected,
  label,
  onSelect
}: TaskInlineCategoryOptionButtonProps) {
  return (
    <Button
      role="option"
      aria-selected={isSelected}
      justifyContent="space-between"
      variant="ghost"
      onClick={() => onSelect(id)}
    >
      <Text>{label}</Text>
      {isSelected ? (
        <Tag size="sm" colorScheme="green">
          Selecionada
        </Tag>
      ) : null}
    </Button>
  );
}
