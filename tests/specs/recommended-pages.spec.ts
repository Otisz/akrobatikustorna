import { test, expect, type Page } from '@playwright/test';
import {
  openNewRecommendedPage,
  recommendedPagesPath,
  setName,
  setUrl,
} from '../support/recommended-page-editor';
import { permalink, save, trash } from '../support/classic-editor';
import { asVisitor } from '../support/visitor';

/**
 * Keeping the club's outbound links current is a task the Site Owner does alone:
 * an organisation's name, and its address. These tests follow that journey, and
 * end where a visitor follows the link.
 */

/** The Recommended Pages on the listing, in the order a visitor reads them. */
function listing(page: Page) {
  return page.locator('[data-recommended-pages] a');
}

test('a Recommended Page the Site Owner adds is one a visitor can follow', async ({
  page,
  browser,
}) => {
  const name = `Magyar Torna Szövetség ${Date.now()}`;
  const url = 'https://torna.example/';

  await openNewRecommendedPage(page);
  await setName(page, name);
  await setUrl(page, url);

  await save(page);

  const editorUrl = page.url();
  const own = await permalink(page);

  // Cleaned up even when an assertion fails, so a run leaves nothing behind.
  try {
    // Signed out, because what matters is where a visitor is sent.
    const visitor = await asVisitor(browser);

    try {
      const recommended = await visitor.newPage();

      await recommended.goto(recommendedPagesPath);

      const entry = listing(recommended).filter({ hasText: name });

      // No further steps between filling the two fields and the listing:
      // publishing is all the Site Owner did.
      await expect(entry).toHaveCount(1);
      await expect(entry).toHaveAttribute('href', url);

      // A Recommended Page has one public address, so its own URL (Uniform
      // Resource Locator) carries a visitor to the listing rather than to a page
      // holding nothing the listing does not already offer.
      await recommended.goto(own);
      expect(new URL(recommended.url()).pathname).toBe(recommendedPagesPath);
    } finally {
      await visitor.close();
    }
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});

test('a Recommended Page the Site Owner removes drops off the listing', async ({
  page,
  browser,
}) => {
  const name = `Megszűnt oldal ${Date.now()}`;

  await openNewRecommendedPage(page);
  await setName(page, name);
  await setUrl(page, 'https://megszunt.example/');

  await save(page);

  const visitor = await asVisitor(browser);

  try {
    const recommended = await visitor.newPage();

    await recommended.goto(recommendedPagesPath);
    await expect(listing(recommended).filter({ hasText: name })).toHaveCount(1);

    // The organisation moved on, so the link goes — with no developer involved.
    await trash(page);

    await recommended.reload();
    await expect(listing(recommended).filter({ hasText: name })).toHaveCount(0);
  } finally {
    await visitor.close();
  }
});

test('Recommended Pages are listed by name, so a visitor can scan them', async ({ page }) => {
  const run = Date.now();
  const first = `Aquincum Sportkör ${run}`;
  const second = `Zugló Diáksport ${run}`;
  const editorUrls: string[] = [];

  try {
    // Added in the wrong order on purpose: the listing is alphabetical, so the
    // Site Owner is given no order to maintain.
    for (const name of [second, first]) {
      await openNewRecommendedPage(page);
      await setName(page, name);
      await setUrl(page, 'https://scan.example/');
      await save(page);
      editorUrls.push(page.url());
    }

    await page.goto(recommendedPagesPath);

    const names = await listing(page)
      .filter({ hasText: String(run) })
      .locator('[data-name]')
      .allInnerTexts();

    expect(names.map((text) => text.trim())).toEqual([first, second]);
  } finally {
    for (const url of editorUrls) {
      await page.goto(url);
      await trash(page);
    }
  }
});
