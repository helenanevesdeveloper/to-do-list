import type { AuthSession } from '../types.js';

type AuthSessionReader = () => AuthSession | null;
type AuthFailureHandler = () => void | Promise<void>;

let authSessionReader: AuthSessionReader = () => null;
let authFailureHandler: AuthFailureHandler = () => undefined;

export function registerAuthSessionReader(
  reader: AuthSessionReader | null | undefined
): void {
  authSessionReader = reader ?? (() => null);
}

export function readCurrentAuthSession(): AuthSession | null {
  return authSessionReader();
}

export function readCurrentAccessToken(): string | null {
  const accessToken = readCurrentAuthSession()?.accessToken;

  if (typeof accessToken !== 'string') {
    return null;
  }

  const normalizedAccessToken = accessToken.trim();
  return normalizedAccessToken || null;
}

export function registerAuthFailureHandler(
  handler: AuthFailureHandler | null | undefined
): void {
  authFailureHandler = handler ?? (() => undefined);
}

export async function handleAuthFailure(): Promise<void> {
  await authFailureHandler();
}
