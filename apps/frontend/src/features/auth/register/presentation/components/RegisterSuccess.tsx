import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';

type RegisterSuccessProps = {
  redirectCountdown: number;
  successEmail: string;
  goToHome: () => void;
};

/** Renders the success state shown after a successful registration. */
export default function RegisterSuccess({
  redirectCountdown,
  successEmail,
  goToHome
}: RegisterSuccessProps) {
  return (
    <Container maxW="lg" py={{ base: 10, md: 16 }}>
      <Stack spacing={6}>
        <Box>
          <Heading size="lg" mb={2}>
            Account created
          </Heading>
          <Text color="gray.600">{successEmail} is now registered.</Text>
        </Box>

        <Box borderWidth="1px" borderRadius="lg" p={{ base: 5, md: 7 }}>
          <Stack spacing={4}>
            <Text color="green.600" role="status" aria-live="polite">
              Registration successful.
            </Text>
            <Text color="gray.600">
              Redirecting in {redirectCountdown} second
              {redirectCountdown === 1 ? '' : 's'}.
            </Text>
            <Button colorScheme="blue" onClick={goToHome} width={{ base: 'full', md: 'auto' }}>
              Go to Home now
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
