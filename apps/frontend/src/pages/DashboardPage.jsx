import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack
} from '@chakra-ui/react';
import { useAuth } from '../features/auth/session/presentation/hooks/useAuth';
import { useDashboardLogout } from '../features/auth/session/presentation/hooks/useDashboardLogout';

export default function DashboardPage() {
  const { currentUserEmail, logout } = useAuth();
  const { isLoggingOut, handleLogout } = useDashboardLogout(logout);

  return (
    <Container maxW="3xl" py={{ base: 10, md: 14 }}>
      <Box borderWidth="1px" borderRadius="lg" p={{ base: 6, md: 8 }}>
        <VStack align="start" spacing={4}>
          <Heading size="lg">Authentication Dashboard</Heading>
          <Text color="gray.600">
            Signed in as {currentUserEmail ?? 'an authenticated user'}.
          </Text>
          <Button
            colorScheme="red"
            isLoading={isLoggingOut}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}
