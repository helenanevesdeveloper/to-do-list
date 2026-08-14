import { Button, Tag, Text } from '@chakra-ui/react';
import { HStack, IconButton } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import {
  useTaskInlineCategoryFieldContext
} from '../context/TaskInlineCategoryFieldContext';

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
  const {
    activeCategoryAction,
    closeCategoryActions,
    openCategoryActions,
    showCategoryActions
  } = useTaskInlineCategoryFieldContext();
  const isActionMenuOpen = activeCategoryAction?.categoryId === id;

  function handleSelect(): void {
    closeCategoryActions();
    onSelect(id);
  }

  function handleActionMouseDown(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    event.stopPropagation();
  }

  function handleActionClick(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    event.stopPropagation();
    openCategoryActions({
      anchorElement: event.currentTarget,
      categoryId: id,
      categoryName: label
    });
  }

  if (!showCategoryActions) {
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

  return (
    <HStack
      role="option"
      aria-selected={isSelected}
      justifyContent="space-between"
      spacing={3}
      px={3}
      py={2}
      borderRadius="md"
      cursor="pointer"
      bg={isSelected ? 'gray.50' : 'transparent'}
      transition="background 0.2s ease"
      onClick={handleSelect}
      _hover={{ bg: 'gray.50' }}
      sx={{
        '&:hover .task-inline-category-actions-trigger': {
          opacity: 1
        }
      }}
    >
      <HStack minW={0} spacing={2}>
        <Text noOfLines={1}>{label}</Text>
        {isSelected ? (
          <Tag size="sm" colorScheme="green" flexShrink={0}>
            Selecionada
          </Tag>
        ) : null}
      </HStack>

      <IconButton
        aria-label={`Acoes da categoria ${label}`}
        className="task-inline-category-actions-trigger"
        icon={<FiMoreHorizontal />}
        size="sm"
        variant="ghost"
        flexShrink={0}
        opacity={isActionMenuOpen ? 1 : 0}
        onMouseDown={handleActionMouseDown}
        onClick={handleActionClick}
      />
    </HStack>
  );
}
