import { describe, expect, it } from 'vitest';
import { normalizeAuthSession } from './authSession.js';

describe('normalizeAuthSession', () => {
  it('normalizes the backend login payload into the frontend session contract', () => {
    expect(
      normalizeAuthSession({
        access_token: 'jwt-token',
        token_type: 'bearer',
        expires_at: '2030-01-01T00:00:00.000Z',
        email: 'user@example.com'
      })
    ).toEqual({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresAt: '2030-01-01T00:00:00.000Z',
      email: 'user@example.com'
    });
  });

  it('returns null when no access token is present', () => {
    expect(
      normalizeAuthSession({
        token_type: 'bearer'
      })
    ).toBeNull();
  });

  it('falls back to default values for optional fields', () => {
    expect(
      normalizeAuthSession({
        accessToken: 'jwt-token'
      })
    ).toEqual({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresAt: null,
      email: ''
    });
  });

  it('drops invalid expiresAt values instead of keeping malformed data', () => {
    expect(
      normalizeAuthSession({
        accessToken: 'jwt-token',
        expiresAt: 'not-a-date'
      })
    ).toEqual({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresAt: null,
      email: ''
    });
  });
});
