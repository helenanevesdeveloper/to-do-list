import { Center, Spinner, Stack, Text } from '@chakra-ui/react';

/** Renders the loading placeholder shown while the task list is being fetched. */
export default function TaskTableLoadingState() {
  return (
    <Center borderWidth="1px" borderRadius="lg" p={{ base: 8, md: 10 }}>
      <Stack spacing={3} align="center" textAlign="center">
        <Spinner size="lg" />
        <Text color="gray.600">Carregando tarefas...</Text>
      </Stack>
    </Center>
  );
}
