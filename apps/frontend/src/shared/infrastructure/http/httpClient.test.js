import { describe, expect, it, vi } from 'vitest';
import {
  registerAuthFailureHandler,
  registerAuthSessionReader
} from '../../../features/auth/session/infrastructure/authSessionRuntime.js';
import {
  applyAuthorizationHeader,
  createHttpClient,
  handleResponseError,
  httpClient,
  isPublicRouteRequest,
  resolveApiBaseUrl,
  shouldLogoutAfterResponseError
} from './httpClient.js';

function readAuthorizationHeader(headers) {
  if (typeof headers?.get === 'function') {
    return headers.get('Authorization');
  }

  return headers?.Authorization;
}

describe('httpClient', () => {
  it('uses the default local backend URL when no env override is defined', () => {
    expect(resolveApiBaseUrl()).toBe('http://localhost:8000');
  });

  it('creates clients with the shared default HTTP configuration', () => {
    const client = createHttpClient();

    expect(client.defaults.baseURL).toBe('http://localhost:8000');
    expect(client.defaults.headers.Accept).toBe('application/json');
    expect(client.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('exports a reusable shared client instance', () => {
    expect(httpClient).toBeDefined();
    expect(httpClient.defaults.baseURL).toBe('http://localhost:8000');
  });

  it('injects the bearer access token into outgoing requests', () => {
    registerAuthSessionReader(() => ({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresAt: null,
      email: 'user@example.com'
    }));

    const requestConfig = applyAuthorizationHeader({
      headers: {
        Accept: 'application/json'
      }
    });

    expect(requestConfig.headers.get('Authorization')).toBe('Bearer jwt-token');
  });

  it('does not override an existing authorization header', () => {
    registerAuthSessionReader(() => ({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresAt: null,
      email: 'user@example.com'
    }));

    const requestConfig = applyAuthorizationHeader({
      headers: {
        Authorization: 'Basic abc123'
      }
    });

    expect(requestConfig.headers.get('Authorization')).toBe('Basic abc123');
  });

  it('skips the authorization header for public routes', () => {
    registerAuthSessionReader(() => ({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresAt: null,
      email: 'user@example.com'
    }));

    const requestConfig = applyAuthorizationHeader({
      url: '/login',
      headers: {
        Accept: 'application/json'
      }
    });

    expect(readAuthorizationHeader(requestConfig.headers)).toBeUndefined();
  });

  it('ignores empty tokens from the shared session source', () => {
    registerAuthSessionReader(() => ({
      accessToken: '   ',
      tokenType: 'Bearer',
      expiresAt: null,
      email: 'user@example.com'
    }));

    const requestConfig = applyAuthorizationHeader({
      headers: {
        Accept: 'application/json'
      }
    });

    expect(readAuthorizationHeader(requestConfig.headers)).toBeUndefined();
  });

  it('identifies public routes for relative and absolute URLs', () => {
    expect(isPublicRouteRequest('/login')).toBe(true);
    expect(isPublicRouteRequest('/register?next=/dashboard')).toBe(true);
    expect(isPublicRouteRequest('/api/auth/login')).toBe(true);
    expect(isPublicRouteRequest('/api/auth/register?next=/dashboard')).toBe(true);
    expect(isPublicRouteRequest('http://localhost:8000/login')).toBe(true);
    expect(isPublicRouteRequest('http://localhost:8000/api/auth/login')).toBe(true);
    expect(isPublicRouteRequest('http://localhost:8000/files')).toBe(false);
  });

  it('invalidates the session after a 401 from a protected route', async () => {
    const invalidateSession = vi.fn();
    registerAuthFailureHandler(invalidateSession);

    await expect(
      handleResponseError({
        config: { url: '/files' },
        response: { status: 401 }
      })
    ).rejects.toMatchObject({
      response: { status: 401 }
    });

    expect(invalidateSession).toHaveBeenCalledTimes(1);
  });

  it('does not invalidate the session for public-route auth errors', async () => {
    const invalidateSession = vi.fn();
    registerAuthFailureHandler(invalidateSession);

    await expect(
      handleResponseError({
        config: { url: '/api/auth/login' },
        response: { status: 401 }
      })
    ).rejects.toMatchObject({
      response: { status: 401 }
    });

    expect(invalidateSession).not.toHaveBeenCalled();
  });

  it('does not invalidate the session for non-auth failures', async () => {
    const invalidateSession = vi.fn();
    registerAuthFailureHandler(invalidateSession);

    await expect(
      handleResponseError({
        config: { url: '/files' },
        response: { status: 500 }
      })
    ).rejects.toMatchObject({
      response: { status: 500 }
    });

    expect(invalidateSession).not.toHaveBeenCalled();
  });

  it('only marks protected 401 responses for forced logout', () => {
    expect(
      shouldLogoutAfterResponseError({
        config: { url: '/files' },
        response: { status: 401 }
      })
    ).toBe(true);
    expect(
      shouldLogoutAfterResponseError({
        config: { url: '/api/auth/login' },
        response: { status: 401 }
      })
    ).toBe(false);
    expect(
      shouldLogoutAfterResponseError({
        config: { url: '/files' },
        response: { status: 500 }
      })
    ).toBe(false);
  });
});
