import { describe, expect, it } from 'vitest';

import { resolveAppRoute } from './resolveAppRoute';

describe('resolveAppRoute', () => {
  it('renders guest routes before auth hydration finishes', () => {
    const result = resolveAppRoute({
      pathname: '/login',
      isAuthenticated: false,
      isHydrated: false
    });

    expect(result.type).toBe('render');
  });

  it('waits on private routes before auth hydration finishes', () => {
    const result = resolveAppRoute({
      pathname: '/dashboard',
      isAuthenticated: false,
      isHydrated: false
    });

    expect(result).toEqual({ type: 'pending' });
  });

  it('redirects anonymous users away from private routes', () => {
    const result = resolveAppRoute({
      pathname: '/dashboard',
      isAuthenticated: false,
      isHydrated: true
    });

    expect(result).toEqual({ type: 'redirect', to: '/login' });
  });

  it('redirects authenticated users away from guest routes', () => {
    const result = resolveAppRoute({
      pathname: '/login',
      isAuthenticated: true,
      isHydrated: true
    });

    expect(result).toEqual({ type: 'redirect', to: '/dashboard' });
  });

  it('renders private routes for authenticated users', () => {
    const result = resolveAppRoute({
      pathname: '/dashboard',
      isAuthenticated: true,
      isHydrated: true
    });

    expect(result.type).toBe('render');
  });

  it('returns not-found for unknown routes', () => {
    const result = resolveAppRoute({
      pathname: '/missing',
      isAuthenticated: false,
      isHydrated: true
    });

    expect(result).toEqual({ type: 'not-found' });
  });
});
