import {
  Box,
  HStack,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  Text
} from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import type { TaskCategoryOption } from '../../../shared/types';

export type TaskInlineCategoryPopoverSearchHeaderProps = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  query: string;
  selectedCategory: TaskCategoryOption | null;
  onClearSelectedCategory: () => void;
  onQueryChange: (value: string) => void;
};

/** Renders the fixed search area shown at the top of the category picker popover. */
export default function TaskInlineCategoryPopoverSearchHeader({
  inputRef,
  query,
  selectedCategory,
  onClearSelectedCategory,
  onQueryChange
}: TaskInlineCategoryPopoverSearchHeaderProps) {
  function handleClearMouseDown(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
  }

  return (
    <Box px={4} py={3} borderBottomWidth="1px" bg="white">
      <Text mb={2} fontSize="xs" fontWeight="semibold" color="gray.500">
        Buscar uma opcao
      </Text>
      <HStack
        minH="44px"
        borderWidth="1px"
        borderRadius="lg"
        px={3}
        py={2}
        spacing={2}
        align="center"
      >
        {selectedCategory ? (
          <Tag size="md" borderRadius="full" colorScheme="blue" flexShrink={0}>
            <TagLabel>{selectedCategory.name}</TagLabel>
            <TagCloseButton
              onMouseDown={handleClearMouseDown}
              onClick={onClearSelectedCategory}
            />
          </Tag>
        ) : null}

        <Input
          ref={inputRef}
          aria-label="Buscar categoria"
          variant="unstyled"
          placeholder="Digite para filtrar categorias"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </HStack>
    </Box>
  );
}
