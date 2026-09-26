import { test, expect } from '@playwright/test';
import {
  openNewPost,
  previewInNewTab,
  publish,
  saveDraft,
  scheduleFor,
  setFeaturedImage,
  setTitle,
  trash,
} from '../support/editor';
import { asVisitor } from '../support/visitor';

/**
 * News is the content the Site Owner touches most often, and the round trip these
 * tests follow — change something in the admin, see it as a visitor does — is the
 * one every later ticket reuses.
 */

test('a Post the Site Owner publishes reaches the home page, the listing and its own URL', async ({ page }) => {
  const title = `Edzőtábor ${Date.now()}`;

  await openNewPost(page);
  await setTitle(page, title);
  await setFeaturedImage(page);

  const url = await publish(page);
  const editorUrl = page.url();

  // Cleaned up even when an assertion fails, so a run leaves no Post behind.
  try {
    // The path search engines already hold for the club's news.
    expect(new URL(url).pathname).toMatch(/^\/hirek\/[^/]+\/$/);

    await page.goto(url);
    await expect(page.locator('h1')).toHaveText(title);
    await expect(page.locator('main article img')).toHaveCount(1);

    for (const listing of ['/', '/hirek/']) {
      await page.goto(listing);

      const card = page.locator('main article').filter({ hasText: title });

      await expect(card).toBeVisible();
      await expect(card.locator('img')).toBeVisible();
      await expect(card.locator('a').first()).toHaveAttribute('href', url);
    }
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});

test('a Post scheduled for a future date stays hidden until that date', async ({ page, browser }) => {
  const title = `Téli verseny ${Date.now()}`;

  await openNewPost(page);
  await setTitle(page, title);
  await scheduleFor(page, new Date().getFullYear() + 1);

  const url = await publish(page);
  const editorUrl = page.url();

  try {
    // Signed out, because what matters is what a visitor can reach.
    const visitor = await asVisitor(browser);

    try {
      const response = await visitor.request.get(url);

      expect(response.status()).toBe(404);

      const home = await visitor.newPage();

      await home.goto('/');
      await expect(home.locator('main article').filter({ hasText: title })).toHaveCount(0);
    } finally {
      await visitor.close();
    }
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});

test('the Site Owner can preview a Post before publishing it', async ({ page }) => {
  const title = `Előnézet ${Date.now()}`;

  await openNewPost(page);
  await setTitle(page, title);
  await saveDraft(page);

  try {
    const preview = await previewInNewTab(page);

    await expect(preview.locator('h1')).toHaveText(title);
    await preview.close();
  } finally {
    await trash(page);
  }
});
