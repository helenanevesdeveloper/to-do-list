import DashboardPage from './pages/DashboardPage.jsx';
import { Center, Container, Heading, Text } from '@chakra-ui/react';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import { useEffect } from 'react';
import { useAuth } from './features/auth/session/presentation/hooks/useAuth';
import { navigateTo } from './features/auth/shared/presentation/platform/browserApi';

const routes = {
  '/': HomePage,
  '/dashboard': DashboardPage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/upload': UploadPage
};

const authenticatedRoutes = new Set(['/dashboard', '/upload']);
const protectedRoutes = new Set(['/dashboard', '/upload']);

export default function App() {
  const { isAuthenticated, isHydrated } = useAuth();
  const pathname = window.location.pathname;
  const Page = routes[pathname];
  const isAuthenticatedRoute = authenticatedRoutes.has(pathname);
  const isProtectedRoute = protectedRoutes.has(pathname);
  const shouldWaitForAuthHydration =
    !isHydrated && (!isAuthenticatedRoute || isProtectedRoute);
  const shouldRedirectAuthenticatedUser =
    isHydrated && isAuthenticated && !isAuthenticatedRoute;
  const shouldRedirectAnonymousUser =
    isHydrated && !isAuthenticated && isProtectedRoute;

  useEffect(() => {
    if (shouldRedirectAuthenticatedUser) {
      navigateTo('/dashboard');
      return;
    }

    if (shouldRedirectAnonymousUser) {
      navigateTo('/login');
    }
  }, [shouldRedirectAnonymousUser, shouldRedirectAuthenticatedUser]);

  if (
    shouldWaitForAuthHydration ||
    shouldRedirectAuthenticatedUser ||
    shouldRedirectAnonymousUser
  ) {
    return null;
  }

  if (Page) {
    return <Page />;
  }

  return (
    <Container maxW="3xl" py={14}>
      <Center flexDirection="column" gap={3}>
        <Heading size="md">Page not found</Heading>
        <Text color="gray.600">Use /login or /register to access the authentication pages.</Text>
      </Center>
    </Container>
  );
}
