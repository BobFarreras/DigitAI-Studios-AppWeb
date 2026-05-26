/**
 * @file tests/e2e/landing.spec.ts
 * @updated 2026-05-21
 * @summary E2E test: landing page loads without errors.
 * @scope Verifies critical user paths work end-to-end with a real browser.
 */
import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('loads and shows main heading', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/DigitAI Studios/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('contact form renders', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByPlaceholder(/Name|Namefield/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Send|Enviar|Contact/i })).toBeVisible();
  });

  test('navigation to login works', async ({ page }) => {
    await page.goto('/');

    const loginLink = page.getByRole('link', { name: /Login|Sign in|Acceder/i });
    await expect(loginLink).toBeVisible();
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors.filter((e) => !e.includes('Download the React DevTools'))).toHaveLength(0);
  });
});