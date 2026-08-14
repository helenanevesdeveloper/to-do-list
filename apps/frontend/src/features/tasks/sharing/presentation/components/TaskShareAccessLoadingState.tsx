import { Center, Spinner, Stack, Text } from '@chakra-ui/react';

/** Renders the loading placeholder shown while the share access list is being fetched. */
export default function TaskShareAccessLoadingState() {
  return (
    <Center borderWidth="1px" borderRadius="lg" p={6}>
      <Stack align="center" spacing={3}>
        <Spinner />
        <Text color="gray.600">Carregando pessoas com acesso...</Text>
      </Stack>
    </Center>
  );
}
