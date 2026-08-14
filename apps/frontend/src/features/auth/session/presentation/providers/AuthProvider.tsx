import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import type {
  AuthContextValue,
  AuthProviderProps,
  AuthSession,
  AuthSessionLike,
  AuthState
} from '../../types.js';
import { normalizeAuthSession } from '../../domain/authSession.js';
import {
  clearSession as clearPersistedSession,
  loadSession,
  saveSession
} from '../../infrastructure/authSessionStorage.js';
import {
  handleAuthFailure,
  registerAuthFailureHandler,
  registerAuthSessionReader
} from '../../infrastructure/authSessionRuntime.js';
import { logoutUserApi } from '../../infrastructure/logoutUserApi.js';
import { navigateTo } from '../../../shared/presentation/platform/browserApi.js';
import { AuthContext } from './AuthContext.js';

function createAnonymousAuthState(): AuthState {
  return {
    status: 'anonymous',
    session: null
  };
}

function createAuthenticatedAuthState(session: AuthSession): AuthState {
  return {
    status: 'authenticated',
    session
  };
}

function createHydratingAuthState(): AuthState {
  return {
    status: 'hydrating',
    session: null
  };
}

function normalizeIncomingSession(
  sessionLikeValue: AuthSessionLike | unknown
): AuthSession | null {
  return normalizeAuthSession(sessionLikeValue as AuthSessionLike);
}

function validateRehydratedSession(
  sessionLikeValue: AuthSessionLike | unknown
): AuthSession | null {
  return normalizeAuthSession(sessionLikeValue as AuthSessionLike);
}

/**
 * Provides global auth session state and auth actions for the frontend app.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(createHydratingAuthState);
  const authSessionRef = useRef<AuthSession | null>(null);

  useEffect(() => {
    authSessionRef.current = authState.session;
  }, [authState.session]);

  useEffect(() => {
    registerAuthSessionReader(() => authSessionRef.current);
    registerAuthFailureHandler(() => {
      clearSession();
      navigateTo('/login');
    });

    return () => {
      registerAuthSessionReader(null);
      registerAuthFailureHandler(null);
    };
  }, []);

  useEffect(() => {
    const persistedSession = loadSession();
    const rehydratedSession = validateRehydratedSession(persistedSession);

    startTransition(() => {
      if (!rehydratedSession) {
        clearPersistedSession();
        setAuthState(createAnonymousAuthState());
        return;
      }

      setAuthState(createAuthenticatedAuthState(rehydratedSession));
    });
  }, []);

  function setSessionFromLogin(loginResult: unknown): AuthSession | null {
    const session = normalizeIncomingSession(loginResult);

    if (!session) {
      return null;
    }

    const persistedSession = saveSession(session);

    if (!persistedSession) {
      return null;
    }

    setAuthState(createAuthenticatedAuthState(persistedSession));

    return persistedSession;
  }

  function clearSession(): void {
    clearPersistedSession();
    setAuthState(createAnonymousAuthState());
  }

  async function logout(): Promise<void> {
    try {
      if (authSessionRef.current) {
        await logoutUserApi();
      }
    } catch {
      // Logout must still complete locally when remote revocation fails.
    } finally {
      await handleAuthFailure();
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      authState,
      currentUserEmail: authState.session?.email || null,
      session: authState.session,
      isAuthenticated: authState.status === 'authenticated',
      isHydrated: authState.status !== 'hydrating',
      setSessionFromLogin,
      logout
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
