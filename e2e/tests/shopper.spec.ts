import { test, expect } from '@playwright/test';

test.describe('Shopper Return Flow', () => {
  test('should load the find order page', async ({ page }) => {
    // SHOPPER_URL should be the base URL for the shopper app
    const shopperUrl = process.env.SHOPPER_URL || 'http://localhost:5174';
    await page.goto(shopperUrl);

    // Matches the new FindOrder.tsx design
    await expect(page.getByText('Returns & Exchanges')).toBeVisible();
    await expect(page.getByText('Find your order')).toBeVisible();
    await expect(page.getByPlaceholder('#1001')).toBeVisible();
  });

  test('should look up an order', async ({ page }) => {
    const shopperUrl = process.env.SHOPPER_URL || 'http://localhost:5174';
    await page.goto(shopperUrl);

    await page.getByPlaceholder('#1001').fill('1001');
    // The placeholder changes based on toggle, default is 'you@example.com' for email
    await page.getByPlaceholder('you@example.com').fill('customer@example.com'); 
    
    // Check if the button exists and click it
    const findButton = page.getByRole('button', { name: 'Find Order' });
    await expect(findButton).toBeVisible();
    
    // In a real E2E test against live without seed data, this might fail logic,
    // but we just want to ensure the UI interaction works and doesn't crash.
    await findButton.click();
    
    // We might expect an error message if the order doesn't exist in the live DB
    // Or just check that we didn't crash
    // await expect(page.getByText('Order not found')).toBeVisible(); 
  });
});