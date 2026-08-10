import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const docsScreenshotDir = fileURLToPath(
  new URL('../../../docs/assets/rf01_auth/', import.meta.url)
);

async function captureDocsScreenshot(page, filename) {
  await mkdir(docsScreenshotDir, { recursive: true });
  await page.screenshot({
    path: join(docsScreenshotDir, filename),
    fullPage: true
  });
}

test.describe('Register e2e journey', () => {
  test('creates account with valid data', async ({ page }) => {
    await page.route('**/register', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-123',
          email: 'user@example.com',
          created_at: '2026-03-05T00:00:00+00:00',
          is_active: true
        })
      });
    });

    await page.goto('/register');

    await page.getByLabel('Email').fill('user@example.com');
    await page.locator('#password').fill('StrongPass1');
    await page.locator('#confirmPassword').fill('StrongPass1');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(
      page.getByRole('heading', { name: 'Account created' })
    ).toBeVisible();
    await expect(page.getByText('user@example.com is now registered.')).toBeVisible();
    await captureDocsScreenshot(page, 'rf01-01-register-success.png');
  });

  test('shows duplicate email feedback', async ({ page }) => {
    await page.route('**/register', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: 'user with this email already exists'
        })
      });
    });

    await page.goto('/register');

    await page.getByLabel('Email').fill('duplicate@example.com');
    await page.locator('#password').fill('StrongPass1');
    await page.locator('#confirmPassword').fill('StrongPass1');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('This email is already registered.')).toBeVisible();
    await captureDocsScreenshot(page, 'rf01-02-register-duplicate-email.png');
  });

  test('shows client-side validation messages and does not submit', async ({ page }) => {
    let registerWasCalled = false;
    await page.route('**/register', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }
      registerWasCalled = true;
      await route.abort();
    });

    await page.goto('/register');

    await page.getByLabel('Email').fill('invalid-email');
    await page.locator('#password').fill('weak');
    await page.locator('#confirmPassword').fill('different');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Enter a valid email address.')).toBeVisible();
    await expect(
      page.getByText('Password must be at least 8 characters long.')
    ).toBeVisible();
    await expect(
      page.getByText('Password must contain at least one uppercase letter.')
    ).toBeVisible();
    await expect(
      page.getByText('Password must contain at least one digit.')
    ).toBeVisible();
    await expect(page.getByText('Passwords do not match.')).toBeVisible();
    expect(registerWasCalled).toBe(false);
    await captureDocsScreenshot(page, 'rf01-03-register-validation-errors.png');
  });
});
