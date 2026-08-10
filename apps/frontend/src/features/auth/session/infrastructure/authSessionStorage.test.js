import { beforeEach, describe, expect, it } from 'vitest';
import {
  AUTH_SESSION_STORAGE_KEY,
  clearSession,
  loadSession,
  saveSession
} from './authSessionStorage.js';

function createLocalStorageMock() {
  const entries = new Map();

  return {
    getItem(key) {
      return entries.has(key) ? entries.get(key) : null;
    },
    removeItem(key) {
      entries.delete(key);
    },
    setItem(key, value) {
      entries.set(key, String(value));
    }
  };
}

describe('authSessionStorage', () => {
  beforeEach(() => {
    globalThis.window = {
      localStorage: createLocalStorageMock()
    };
  });

  it('saves the session using the shared auth storage key', () => {
    expect(
      saveSession({
        accessToken: 'jwt-token',
        tokenType: 'bearer',
        expiresAt: null,
        email: 'user@example.com'
      })
    ).toEqual({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresAt: null,
      email: 'user@example.com'
    });

    expect(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBe(
      JSON.stringify({
        accessToken: 'jwt-token',
        tokenType: 'Bearer',
        expiresAt: null,
        email: 'user@example.com'
      })
    );
  });

  it('loads a previously persisted session', () => {
    window.localStorage.setItem(
      AUTH_SESSION_STORAGE_KEY,
      JSON.stringify({
        accessToken: 'jwt-token',
        tokenType: 'Bearer',
        expiresAt: null,
        email: 'user@example.com'
      })
    );

    expect(loadSession()).toEqual({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresAt: null,
      email: 'user@example.com'
    });
  });

  it('returns null when persisted data is not valid JSON', () => {
    window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, '{bad-json');

    expect(loadSession()).toBeNull();
    expect(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeNull();
  });

  it('returns null when persisted data does not match the session contract', () => {
    window.localStorage.setItem(
      AUTH_SESSION_STORAGE_KEY,
      JSON.stringify({
        tokenType: 'Bearer',
        email: 'user@example.com'
      })
    );

    expect(loadSession()).toBeNull();
    expect(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeNull();
  });

  it('returns null when no persisted session exists', () => {
    expect(loadSession()).toBeNull();
  });

  it('does not persist invalid sessions', () => {
    expect(
      saveSession({
        email: 'user@example.com'
      })
    ).toBeNull();

    expect(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeNull();
  });

  it('returns null when local storage is not available while saving or loading', () => {
    globalThis.window = {};

    expect(
      saveSession({
        accessToken: 'jwt-token',
        tokenType: 'Bearer',
        expiresAt: null,
        email: 'user@example.com'
      })
    ).toBeNull();
    expect(loadSession()).toBeNull();
  });

  it('clears the persisted session', () => {
    window.localStorage.setItem(
      AUTH_SESSION_STORAGE_KEY,
      JSON.stringify({
        accessToken: 'jwt-token'
      })
    );

    clearSession();

    expect(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeNull();
  });

  it('does nothing when clearing without local storage support', () => {
    globalThis.window = {};

    expect(() => clearSession()).not.toThrow();
  });
});
