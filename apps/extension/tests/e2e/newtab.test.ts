import { test, expect } from './fixtures';

test('should render the new tab page and take a screenshot', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/index.html`);

  // The title in index.html is "New Tab"
  await expect(page).toHaveTitle(/New Tab/);

  // Take a screenshot
  await page.screenshot({ path: 'tests/e2e/screenshots/newtab.png', fullPage: true });
});
