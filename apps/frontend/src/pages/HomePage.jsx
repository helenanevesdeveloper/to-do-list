import { Box, Button, Container, HStack, Heading, Link } from '@chakra-ui/react';

export default function HomePage() {
  return (
    <Container maxW="4xl" py={{ base: 10, md: 14 }}>
      <Box borderWidth="1px" borderRadius="lg" p={{ base: 6, md: 8 }}>
        <Heading size="lg" mb={4}>
          Dropbox Practice
        </Heading>
        <HStack spacing={3}>
          <Button as={Link} href="/login" colorScheme="blue">
            Go to Login
          </Button>
          <Button as={Link} href="/register" variant="outline">
            Go to Register
          </Button>
        </HStack>
      </Box>
    </Container>
  );
}
