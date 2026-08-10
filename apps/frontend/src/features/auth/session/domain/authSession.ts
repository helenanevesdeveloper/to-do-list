import type { AuthSession, AuthSessionLike } from '../types.js';

const DEFAULT_TOKEN_TYPE = 'Bearer';

/**
 * Normalizes auth payloads into the frontend session contract.
 */
export function normalizeAuthSession(value: AuthSessionLike): AuthSession | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const accessToken = readNonEmptyString(
    value.accessToken ?? value.access_token
  );

  if (!accessToken) {
    return null;
  }

  return {
    accessToken,
    tokenType: normalizeTokenType(value.tokenType ?? value.token_type),
    expiresAt: normalizeExpiresAt(value.expiresAt ?? value.expires_at),
    email: readOptionalString(value.email)
  };
}

function normalizeTokenType(value: unknown): string {
  const tokenType = readOptionalString(value);

  if (!tokenType) {
    return DEFAULT_TOKEN_TYPE;
  }

  return tokenType.toLowerCase() === 'bearer' ? DEFAULT_TOKEN_TYPE : tokenType;
}

function normalizeExpiresAt(value: unknown): string | null {
  if (value == null || value === '') {
    return null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return null;
  }

  return new Date(timestamp).toISOString();
}

function readNonEmptyString(value: unknown): string {
  const normalizedValue = readOptionalString(value).trim();
  return normalizedValue || '';
}

function readOptionalString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}
