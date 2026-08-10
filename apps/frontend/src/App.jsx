import { useEffect } from 'react';
import { getCurrentPathname, navigateTo } from './features/auth/shared/presentation/platform/browserApi';
import { useAuth } from './features/auth/session/presentation/hooks/useAuth';
import { resolveAppRoute } from './app/resolveAppRoute';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  const { isAuthenticated, isHydrated } = useAuth();
  const resolution = resolveAppRoute({
    pathname: getCurrentPathname(),
    isAuthenticated,
    isHydrated
  });

  useEffect(() => {
    if (resolution.type === 'redirect') {
      navigateTo(resolution.to);
    }
  }, [resolution]);

  if (resolution.type === 'pending' || resolution.type === 'redirect') {
    return null;
  }

  if (resolution.type === 'not-found') {
    return <NotFoundPage />;
  }

  const { Page } = resolution;
  return <Page />;
}
