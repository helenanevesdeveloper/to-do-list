import { Button, Center, Stack, Text } from '@chakra-ui/react';

export interface TaskShareAccessErrorStateProps {
  errorMessage: string;
  onRetry?: () => void;
}

/** Renders the blocking error state shown when the share access list cannot be loaded. */
export default function TaskShareAccessErrorState({
  errorMessage,
  onRetry
}: TaskShareAccessErrorStateProps) {
  return (
    <Center borderWidth="1px" borderRadius="lg" p={6}>
      <Stack align="center" maxW="md" spacing={3} textAlign="center">
        <Text fontWeight="semibold">
          Nao foi possivel carregar as pessoas com acesso
        </Text>
        <Text color="gray.600">{errorMessage}</Text>
        {onRetry ? (
          <Button onClick={onRetry} variant="outline">
            Tentar novamente
          </Button>
        ) : null}
      </Stack>
    </Center>
  );
}
