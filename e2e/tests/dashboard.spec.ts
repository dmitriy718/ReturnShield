import { test, expect } from '@playwright/test';

test.describe('Merchant Dashboard', () => {
  test('should load login page', async ({ page }) => {
    const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:4173';
    await page.goto(dashboardUrl + '/login');

    await expect(page.getByText('Sign in to your dashboard')).toBeVisible();
  });

  test('public marketing site loads', async ({ page }) => {
     // Use the base URL from config (marketing site)
     await page.goto('/');
     await expect(page.getByText('Return insights that actually make sense')).toBeVisible();
  });
});
