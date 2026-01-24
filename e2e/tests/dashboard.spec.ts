import { test, expect } from '@playwright/test';

test.describe('Merchant Dashboard', () => {
  test('should load login page', async ({ page }) => {
    // DASHBOARD_URL is assumed to be reachable from the test runner container
    const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:4173';
    await page.goto(dashboardUrl + '/login');

    // Updated text based on the new LoginPage design
    await expect(page.getByText('Welcome back')).toBeVisible();
    await expect(page.getByText('Sign in to your ReturnShield dashboard')).toBeVisible();
  });

  test('public marketing site loads', async ({ page }) => {
     // BASE_URL is the marketing site
     await page.goto('/');
     
     // Updated text based on the new App.tsx redesign
     // "Turn Returns into Revenue & Loyalty"
     await expect(page.getByText('Turn Returns into')).toBeVisible();
     await expect(page.getByText('Revenue & Loyalty')).toBeVisible();
     
     // Check for the "Start Preventing Returns" button
     await expect(page.getByRole('button', { name: 'Start Preventing Returns' })).toBeVisible();
  });
});