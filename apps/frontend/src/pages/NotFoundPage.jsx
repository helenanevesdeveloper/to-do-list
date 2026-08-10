import { Center, Container, Heading, Text } from '@chakra-ui/react';

export default function NotFoundPage() {
  return (
    <Container maxW="3xl" py={14}>
      <Center flexDirection="column" gap={3}>
        <Heading size="md">Page not found</Heading>
        <Text color="gray.600">
          Use /login or /register to access the authentication pages.
        </Text>
      </Center>
    </Container>
  );
}
