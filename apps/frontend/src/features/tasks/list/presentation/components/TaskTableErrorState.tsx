import { Button, Center, Stack, Text } from '@chakra-ui/react';

export type TaskTableErrorStateProps = {
  errorMessage: string;
  onRetry?: () => void;
};

/** Renders the blocking error state shown when the task list cannot be loaded. */
export default function TaskTableErrorState({
  errorMessage,
  onRetry
}: TaskTableErrorStateProps) {
  return (
    <Center borderWidth="1px" borderRadius="lg" p={{ base: 8, md: 10 }}>
      <Stack spacing={3} align="center" textAlign="center" maxW="md">
        <Text fontWeight="semibold">Nao foi possivel carregar as tarefas</Text>
        <Text color="gray.600">{errorMessage}</Text>
        {onRetry ? (
          <Button variant="outline" onClick={onRetry}>
            Tentar novamente
          </Button>
        ) : null}
      </Stack>
    </Center>
  );
}
