import { useContext } from 'react';
import type { AuthContextValue } from '../../types.js';
import { AuthContext } from '../providers/AuthContext.js';

/**
 * Reads the shared auth context for session-aware UI and auth actions.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
