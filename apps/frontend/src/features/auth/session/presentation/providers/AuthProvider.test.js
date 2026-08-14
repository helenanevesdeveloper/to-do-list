// @vitest-environment jsdom

import React, { useEffect } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import { AuthProvider } from './AuthProvider.js';
import { useAuth } from '../hooks/useAuth.js';

const storageMocks = vi.hoisted(() => ({
  loadSession: vi.fn(),
  saveSession: vi.fn(),
  clearSession: vi.fn()
}));

const logoutApiMocks = vi.hoisted(() => ({
  logoutUserApi: vi.fn()
}));

const browserApiMocks = vi.hoisted(() => ({
  navigateTo: vi.fn()
}));

vi.mock('../../infrastructure/authSessionStorage.js', () => storageMocks);
vi.mock('../../infrastructure/logoutUserApi.js', () => logoutApiMocks);
vi.mock('../../../shared/presentation/platform/browserApi.js', () => browserApiMocks);

// eslint-disable-next-line react/prop-types
function AuthProbe({ onChange }) {
  const auth = useAuth();

  useEffect(() => {
    onChange(auth);
  }, [auth, onChange]);

  return null;
}

describe('AuthProvider', () => {
  let currentAuth;

  beforeEach(() => {
    currentAuth = null;
    storageMocks.loadSession.mockReset();
    storageMocks.saveSession.mockReset();
    storageMocks.clearSession.mockReset();
    logoutApiMocks.logoutUserApi.mockReset();
    browserApiMocks.navigateTo.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  function renderProvider() {
    render(
      React.createElement(
        AuthProvider,
        null,
        React.createElement(AuthProbe, {
          onChange: (value) => {
          currentAuth = value;
          }
        })
      )
    );
  }

  it('hydrates an authenticated session from persisted storage', async () => {
    storageMocks.loadSession.mockReturnValue({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresAt: null,
      email: 'user@example.com'
    });

    renderProvider();

    await waitFor(() => {
      expect(currentAuth?.isHydrated).toBe(true);
      expect(currentAuth?.isAuthenticated).toBe(true);
    });

    expect(currentAuth.session).toEqual({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresAt: null,
      email: 'user@example.com'
    });
    expect(currentAuth.currentUserEmail).toBe('user@example.com');
    expect(storageMocks.clearSession).not.toHaveBeenCalled();
  });

  it('returns to anonymous state and clears invalid persisted sessions', async () => {
    storageMocks.loadSession.mockReturnValue({
      tokenType: 'Bearer',
      email: 'user@example.com'
    });

    renderProvider();

    await waitFor(() => {
      expect(currentAuth?.isHydrated).toBe(true);
      expect(currentAuth?.isAuthenticated).toBe(false);
      expect(currentAuth?.authState.status).toBe('anonymous');
    });

    expect(storageMocks.clearSession).toHaveBeenCalledTimes(1);
    expect(currentAuth.session).toBeNull();
    expect(currentAuth.currentUserEmail).toBeNull();
  });

  it('persists the session and authenticates the user after login', async () => {
    storageMocks.loadSession.mockReturnValue(null);
    storageMocks.saveSession.mockImplementation((session) => ({
      accessToken: session.accessToken,
      tokenType: 'Bearer',
      expiresAt: null,
      email: session.email
    }));

    renderProvider();

    await waitFor(() => {
      expect(currentAuth?.isHydrated).toBe(true);
    });

    let savedSession;
    await act(async () => {
      savedSession = currentAuth.setSessionFromLogin({
        access_token: 'jwt-token',
        token_type: 'bearer',
        expires_at: null,
        email: 'user@example.com'
      });
    });

    expect(storageMocks.saveSession).toHaveBeenCalledWith({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresAt: null,
      email: 'user@example.com'
    });
    expect(savedSession).toEqual({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresAt: null,
      email: 'user@example.com'
    });
    expect(currentAuth.isAuthenticated).toBe(true);
    expect(currentAuth.session).toEqual(savedSession);
    expect(currentAuth.currentUserEmail).toBe('user@example.com');
  });

  it('logs out, clears local session state, and redirects to login', async () => {
    storageMocks.loadSession.mockReturnValue({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresAt: null,
      email: 'user@example.com'
    });
    logoutApiMocks.logoutUserApi.mockResolvedValue(undefined);

    renderProvider();

    await waitFor(() => {
      expect(currentAuth?.isAuthenticated).toBe(true);
    });

    await act(async () => {
      await currentAuth.logout();
    });

    expect(logoutApiMocks.logoutUserApi).toHaveBeenCalledTimes(1);
    expect(storageMocks.clearSession).toHaveBeenCalledTimes(1);
    expect(browserApiMocks.navigateTo).toHaveBeenCalledWith('/login');
    expect(currentAuth.isAuthenticated).toBe(false);
    expect(currentAuth.authState.status).toBe('anonymous');
    expect(currentAuth.session).toBeNull();
    expect(currentAuth.currentUserEmail).toBeNull();
  });
});
