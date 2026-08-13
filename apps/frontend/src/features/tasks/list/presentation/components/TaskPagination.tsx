import { Button, HStack, Stack, Text } from '@chakra-ui/react';

export type TaskPaginationProps = {
  currentPage: number;
  endItem: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  startItem: number;
  totalItems: number;
  totalPages: number;
};

/** Renders the task-list pagination summary and previous/next navigation controls. */
export default function TaskPagination({
  currentPage,
  endItem,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
  startItem,
  totalItems,
  totalPages
}: TaskPaginationProps) {
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      spacing={4}
      justify="space-between"
      align={{ base: 'stretch', md: 'center' }}
    >
      <Stack spacing={1}>
        <Text fontSize="sm" color="gray.600">
          Mostrando {startItem}-{endItem} de {totalItems}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Página {currentPage} de {totalPages}
        </Text>
      </Stack>

      <HStack justify={{ base: 'flex-start', md: 'flex-end' }}>
        <Button
          variant="outline"
          onClick={onPreviousPage}
          isDisabled={!hasPreviousPage}
        >
          Anterior
        </Button>
        <Button variant="outline" onClick={onNextPage} isDisabled={!hasNextPage}>
          Próxima
        </Button>
      </HStack>
    </Stack>
  );
}
