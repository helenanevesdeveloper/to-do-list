import { Center, Stack, Text } from '@chakra-ui/react';

/** Renders the empty state shown when no tasks match the active filters. */
export default function TaskTableEmptyState() {
  return (
    <Center borderWidth="1px" borderRadius="lg" p={{ base: 8, md: 10 }}>
      <Stack spacing={2} textAlign="center" maxW="md">
        <Text fontWeight="semibold">Nenhuma tarefa encontrada</Text>
        <Text color="gray.600">
          Ajuste os filtros atuais ou crie uma nova tarefa para começar a listar resultados.
        </Text>
      </Stack>
    </Center>
  );
}
