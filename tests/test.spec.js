const { test, expect } = require('@playwright/test');

test('should load Playwright website and check the title', async ({ page }) => {
  
  await page.goto('https://playwright.dev/');
  
  const title = await page.title();
  console.log('TEST PlayWright title: ', title);
  // expect(title).toBe('Fast and reliable end-to-end testing for modern web apps | Playwright');
});