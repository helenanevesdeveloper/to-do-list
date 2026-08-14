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
    email: normalizeEmail(value.email, accessToken)
  };
}

/**
 * Reads the current-user email from the explicit payload first and falls back
 * to a non-authoritative JWT claim when available.
 */
function normalizeEmail(value: unknown, accessToken: string): string {
  const explicitEmail = readOptionalString(value).trim();

  if (explicitEmail) {
    return explicitEmail;
  }

  return readEmailFromJwt(accessToken);
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

/**
 * Extracts display-only identity claims from a JWT without treating them as an
 * authorization source. The backend remains the source of truth for access.
 */
function readEmailFromJwt(accessToken: string): string {
  const payloadSegment = accessToken.split('.')[1];

  if (!payloadSegment) {
    return '';
  }

  try {
    const payload = JSON.parse(decodeBase64Url(payloadSegment)) as {
      email?: unknown;
      preferred_username?: unknown;
      upn?: unknown;
    };

    return (
      readOptionalString(payload.email).trim() ||
      readOptionalString(payload.preferred_username).trim() ||
      readOptionalString(payload.upn).trim()
    );
  } catch {
    return '';
  }
}

function decodeBase64Url(value: string): string {
  const normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/');
  const paddedValue = normalizedValue.padEnd(
    normalizedValue.length + ((4 - (normalizedValue.length % 4)) % 4),
    '='
  );

  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(paddedValue);
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(paddedValue, 'base64').toString('utf-8');
  }

  throw new Error('No base64 decoder available.');
}
