import type { ComponentType } from 'react';

import DashboardPage from '../pages/DashboardPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';

export type RouteAccess = 'public' | 'guest' | 'private';

export type AppRoute = {
  Page: ComponentType;
  access: RouteAccess;
};

export const routeConfig: Record<string, AppRoute> = {
  '/': {
    Page: HomePage,
    access: 'guest'
  },
  '/dashboard': {
    Page: DashboardPage,
    access: 'private'
  },
  '/login': {
    Page: LoginPage,
    access: 'guest'
  },
  '/register': {
    Page: RegisterPage,
    access: 'guest'
  }
};
