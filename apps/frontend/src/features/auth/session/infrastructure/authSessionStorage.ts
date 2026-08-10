import type { AuthSession, AuthSessionLike } from '../types.js';
import { normalizeAuthSession } from '../domain/authSession.js';

export const AUTH_SESSION_STORAGE_KEY = 'auth_session';

function getStorage(): Storage | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  return window.localStorage;
}

function removeStoredSession(storage: Storage): void {
  storage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export function saveSession(session: AuthSessionLike): AuthSession | null {
  const storage = getStorage();
  const normalizedSession = normalizeAuthSession(session);

  if (!storage || !normalizedSession) {
    return null;
  }

  storage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(normalizedSession));
  return normalizedSession;
}

export function loadSession(): AuthSession | null {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const rawSession = storage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    const session = normalizeAuthSession(JSON.parse(rawSession));

    if (!session) {
      removeStoredSession(storage);
      return null;
    }

    return session;
  } catch {
    removeStoredSession(storage);
    return null;
  }
}

export function clearSession(): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  removeStoredSession(storage);
}
