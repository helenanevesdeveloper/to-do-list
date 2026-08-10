import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AUTH_SESSION_STORAGE_KEY = 'auth_session';
const docsScreenshotDir = fileURLToPath(
  new URL('../../../docs/assets/rf01_auth/', import.meta.url)
);

function buildSessionPayload(overrides = {}) {
  return {
    access_token: 'jwt-token',
    token_type: 'bearer',
    expires_at: '2030-01-01T00:00:00.000Z',
    email: 'user@example.com',
    ...overrides
  };
}

async function mockSuccessfulLogin(page, overrides = {}) {
  await page.route('**/login', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildSessionPayload(overrides))
    });
  });
}

async function mockUploadedFiles(page) {
  await page.route('**/files', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ items: [] })
    });
  });
}

async function loginThroughUi(page, overrides = {}) {
  await mockSuccessfulLogin(page, overrides);
  await mockUploadedFiles(page);

  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('StrongPass1');
  await page.getByRole('button', { name: 'Sign in' }).click();
}

async function seedPersistedSession(page, overrides = {}) {
  await page.addInitScript(
    ({ storageKey, session }) => {
      window.localStorage.setItem(storageKey, JSON.stringify(session));
    },
    {
      storageKey: AUTH_SESSION_STORAGE_KEY,
      session: {
        accessToken: 'jwt-token',
        tokenType: 'Bearer',
        expiresAt: '2030-01-01T00:00:00.000Z',
        email: 'user@example.com',
        ...overrides
      }
    }
  );
}

async function expectDashboard(page) {
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByText('No uploaded files yet.')).toBeVisible();
}

async function captureDocsScreenshot(page, filename) {
  await mkdir(docsScreenshotDir, { recursive: true });
  await page.screenshot({
    path: join(docsScreenshotDir, filename),
    fullPage: true
  });
}

test.describe('Session e2e journey', () => {
  test('logs in and persists the session across page reloads', async ({ page }) => {
    await loginThroughUi(page);

    await expectDashboard(page);
    await captureDocsScreenshot(page, 'rf01-04-login-dashboard-session.png');

    await page.reload();

    await expectDashboard(page);
    await captureDocsScreenshot(page, 'rf01-05-login-session-after-reload.png');

    const persistedSession = await page.evaluate((storageKey) =>
      window.localStorage.getItem(storageKey),
      AUTH_SESSION_STORAGE_KEY
    );

    expect(JSON.parse(persistedSession)).toMatchObject({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      email: 'user@example.com'
    });
  });

  test('redirects a persisted authenticated session from home to dashboard', async ({
    page
  }) => {
    await seedPersistedSession(page);
    await mockUploadedFiles(page);

    await page.goto('/');

    await expectDashboard(page);
    await captureDocsScreenshot(page, 'rf01-06-authenticated-home-redirect.png');
  });

  test('redirects an anonymous visitor away from the dashboard route', async ({
    page
  }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await captureDocsScreenshot(page, 'rf01-07-anonymous-dashboard-redirect.png');
  });

  test('redirects an anonymous visitor away from the upload route', async ({
    page
  }) => {
    await page.goto('/upload');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await captureDocsScreenshot(page, 'rf01-08-anonymous-upload-redirect.png');
  });

  test('logs out, clears persisted session, and returns to login', async ({ page }) => {
    await loginThroughUi(page);

    await page.route('**/logout', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }

      await route.fulfill({
        status: 204,
        body: ''
      });
    });

    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await captureDocsScreenshot(page, 'rf01-09-logout-returns-login.png');

    const persistedSession = await page.evaluate((storageKey) =>
      window.localStorage.getItem(storageKey),
      AUTH_SESSION_STORAGE_KEY
    );

    expect(persistedSession).toBeNull();
  });

  test('clears an invalid persisted session during rehydration', async ({ page }) => {
    await seedPersistedSession(page, {
      accessToken: undefined
    });

    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await captureDocsScreenshot(page, 'rf01-10-invalid-session-cleared.png');

    const persistedSession = await page.evaluate((storageKey) =>
      window.localStorage.getItem(storageKey),
      AUTH_SESSION_STORAGE_KEY
    );

    expect(persistedSession).toBeNull();
  });
});
