import { Box, HStack, Icon, Text } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export type TaskInlineCategoryTriggerProps = {
  isOpen: boolean;
  label: string;
  onClick: () => void;
};

/** Renders the stable clickable trigger that opens the inline category picker. */
export default function TaskInlineCategoryTrigger({
  isOpen,
  label,
  onClick
}: TaskInlineCategoryTriggerProps) {
  function handleMouseDown(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
  }

  return (
    <Box
      as="button"
      type="button"
      width="100%"
      minH="44px"
      borderWidth="1px"
      borderRadius="md"
      bg="white"
      px={3}
      py={2.5}
      textAlign="left"
      onMouseDown={handleMouseDown}
      onClick={onClick}
      _hover={{ borderColor: 'gray.300' }}
      _focusVisible={{
        borderColor: 'blue.400',
        boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)'
      }}
    >
      <HStack justify="space-between" spacing={3}>
        <Text
          color={label === 'Categoria' ? 'gray.500' : 'gray.800'}
          noOfLines={1}
        >
          {label}
        </Text>
        <Icon
          as={FiChevronDown}
          color="gray.500"
          transition="transform 0.2s ease"
          transform={isOpen ? 'rotate(180deg)' : undefined}
        />
      </HStack>
    </Box>
  );
}
