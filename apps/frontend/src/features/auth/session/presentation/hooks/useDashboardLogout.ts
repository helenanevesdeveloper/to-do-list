import type { AuthContextValue } from '../../types.js';
import { useState } from 'react';

export function useDashboardLogout(logout: AuthContextValue['logout']): { // hook customizado
  isLoggingOut: boolean; //estado
  handleLogout: () => Promise<void>; //comportamento
} {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout(): Promise<void> {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return { isLoggingOut, handleLogout };
}