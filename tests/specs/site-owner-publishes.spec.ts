import { test, expect } from '@playwright/test';
import { openNewPost, publish, setTitle, trash } from '../support/editor';

/**
 * The round trip this project's tests are built on: the Site Owner changes
 * something in the admin, and a visitor sees it on the public page. Later tickets
 * assert their own content this way.
 */
test('a Post the Site Owner publishes appears on the public site', async ({ page }) => {
  const title = `Edzőtábor ${Date.now()}`;

  await openNewPost(page);
  await setTitle(page, title);

  const url = await publish(page);
  const editorUrl = page.url();

  // Cleaned up even when the assertion fails, so a run leaves no Post behind.
  try {
    await page.goto(url);

    await expect(page.locator('h1')).toHaveText(title);
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});
