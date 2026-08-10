import axios, { AxiosHeaders } from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  handleAuthFailure,
  readCurrentAccessToken
} from '../../../features/auth/session/infrastructure/authSessionRuntime.js';

const DEFAULT_API_BASE_URL = 'http://localhost:8000';
const AUTHORIZATION_HEADER = 'Authorization';
const PUBLIC_ROUTES = new Set(['/login', '/register']);

export function resolveApiBaseUrl(): string {
  const configuredBaseUrl = import.meta.env.VITE_API_URL;

  if (typeof configuredBaseUrl !== 'string') {
    return DEFAULT_API_BASE_URL;
  }

  const normalizedBaseUrl = configuredBaseUrl.trim();
  return normalizedBaseUrl || DEFAULT_API_BASE_URL;
}

export function applyAuthorizationHeader(
  requestConfig: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  if (isPublicRouteRequest(requestConfig.url)) {
    return requestConfig;
  }

  const accessToken = readCurrentAccessToken();

  if (!accessToken) {
    return requestConfig;
  }

  const headers = AxiosHeaders.from(requestConfig.headers);

  if (headers.has(AUTHORIZATION_HEADER)) {
    requestConfig.headers = headers;
    return requestConfig;
  }

  headers.set(AUTHORIZATION_HEADER, `Bearer ${accessToken}`);
  requestConfig.headers = headers;
  return requestConfig;
}

export function isPublicRouteRequest(url: string | undefined): boolean {
  if (typeof url !== 'string') {
    return false;
  }

  const normalizedUrl = url.trim();

  if (!normalizedUrl) {
    return false;
  }

  const pathname = extractRequestPathname(normalizedUrl);
  return PUBLIC_ROUTES.has(pathname);
}

function extractRequestPathname(url: string): string {
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return new URL(url).pathname;
    }
  } catch {
    return url;
  }

  const [pathname] = url.split(/[?#]/, 1);
  return pathname || url;
}

export function createHttpClient() {
  const client = axios.create({
    baseURL: resolveApiBaseUrl(),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });

  client.interceptors.request.use((requestConfig) =>
    applyAuthorizationHeader(requestConfig)
  );
  client.interceptors.response.use(
    (response) => response,
    (error) => handleResponseError(error)
  );

  return client;
}

export async function handleResponseError(error: AxiosError): Promise<never> {
  if (shouldLogoutAfterResponseError(error)) {
    await handleAuthFailure();
  }

  return Promise.reject(error);
}

export function shouldLogoutAfterResponseError(error: AxiosError): boolean {
  if (error.response?.status !== 401) {
    return false;
  }

  return !isPublicRouteRequest(error.config?.url);
}

/**
 * Shared Axios instance for frontend API calls.
 * Auth concerns are added through interceptors on top of this client.
 */
export const httpClient = createHttpClient();
