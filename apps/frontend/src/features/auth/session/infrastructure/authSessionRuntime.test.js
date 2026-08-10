import { describe, expect, it } from 'vitest';
import {
  readCurrentAccessToken,
  readCurrentAuthSession,
  registerAuthSessionReader
} from './authSessionRuntime.js';

describe('authSessionRuntime', () => {
  it('reads the current session from the registered source', () => {
    registerAuthSessionReader(() => ({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresAt: null,
      email: 'user@example.com'
    }));

    expect(readCurrentAuthSession()).toEqual({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresAt: null,
      email: 'user@example.com'
    });
  });

  it('returns the normalized access token from the current session', () => {
    registerAuthSessionReader(() => ({
      accessToken: ' jwt-token ',
      tokenType: 'Bearer',
      expiresAt: null,
      email: 'user@example.com'
    }));

    expect(readCurrentAccessToken()).toBe('jwt-token');
  });

  it('returns null when there is no current session reader', () => {
    registerAuthSessionReader(null);

    expect(readCurrentAuthSession()).toBeNull();
    expect(readCurrentAccessToken()).toBeNull();
  });
});
