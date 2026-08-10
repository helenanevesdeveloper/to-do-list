import type { ComponentType } from 'react';

import { routeConfig } from './routeConfig';

type ResolveAppRouteInput = {
  pathname: string;
  isAuthenticated: boolean;
  isHydrated: boolean;
};

type PendingResult = {
  type: 'pending';
};

type RedirectResult = {
  type: 'redirect';
  to: string;
};

type RenderResult = {
  type: 'render';
  Page: ComponentType;
};

type NotFoundResult = {
  type: 'not-found';
};

export type AppRouteResolution =
  | PendingResult
  | RedirectResult
  | RenderResult
  | NotFoundResult;

export function resolveAppRoute({
  pathname,
  isAuthenticated,
  isHydrated
}: ResolveAppRouteInput): AppRouteResolution {
  const route = routeConfig[pathname];

  if (!route) {
    return { type: 'not-found' };
  }

  if (!isHydrated) {
    if (route.access === 'private') {
      return { type: 'pending' };
    }

    return { type: 'render', Page: route.Page };
  }

  if (route.access === 'private' && !isAuthenticated) {
    return { type: 'redirect', to: '/login' };
  }

  if (route.access === 'guest' && isAuthenticated) {
    return { type: 'redirect', to: '/dashboard' };
  }

  return { type: 'render', Page: route.Page };
}
