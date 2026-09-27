import { test, expect, type Page } from '@playwright/test';
import {
  expectRefused,
  openNewSponsor,
  setLogo,
  setName,
  setUrl,
} from '../support/sponsor-editor';
import { save, submit, trash } from '../support/classic-editor';
import { asVisitor } from '../support/visitor';

/**
 * Crediting a Sponsor is a task the Site Owner does alone: the logo the organisation
 * sent, and the address it leads to. These tests follow that journey, and end on
 * the home page where a visitor sees the credit.
 */

/** The Sponsors credited on the home page, in the order a visitor reads them. */
function credits(page: Page) {
  return page.locator('[data-sponsors] [data-sponsor]');
}

test('a Sponsor the Site Owner adds is credited on the public site, linking to their own', async ({
  page,
  browser,
}) => {
  const name = `Hotel Aranysas ${Date.now()}`;
  const url = 'https://hotel-aranysas.example/';

  await openNewSponsor(page);
  await setName(page, name);
  await setLogo(page, 'featured-image');
  await setUrl(page, url);

  await save(page);

  const editorUrl = page.url();

  // Cleaned up even when an assertion fails, so a run leaves no Sponsor behind.
  try {
    // Signed out, because what matters is what a visitor sees, not what the
    // editing screen shows back to the Site Owner.
    const visitor = await asVisitor(browser);

    try {
      const home = await visitor.newPage();

      await home.goto('/');

      const credit = credits(home).filter({ hasText: name });

      // No further steps between the upload and the credit: publishing is all
      // the Site Owner did.
      await expect(credit).toHaveCount(1);

      // The logo is the credit, and it leads where the Sponsor's own site is.
      await expect(credit.locator('img')).toBeVisible();
      await expect(credit).toHaveAttribute('href', url);

      // A Sponsor is seen only here, so it has no public address of its own.
      const own = await visitor.newPage();
      const response = await own.goto(`/?p=${new URL(editorUrl).searchParams.get('post')}`);

      expect(response?.status()).toBe(404);
      await own.close();
    } finally {
      await visitor.close();
    }
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});

test('a Sponsor the Site Owner removes stops being credited', async ({ page, browser }) => {
  const name = `Elmúlt támogató ${Date.now()}`;

  await openNewSponsor(page);
  await setName(page, name);
  await setLogo(page, 'featured-image');
  await setUrl(page, 'https://elmult.example/');

  await save(page);

  const visitor = await asVisitor(browser);

  try {
    const home = await visitor.newPage();

    await home.goto('/');
    await expect(credits(home).filter({ hasText: name })).toHaveCount(1);

    // The support ended, so the credit goes — with no developer involved.
    await trash(page);

    await home.reload();
    await expect(credits(home).filter({ hasText: name })).toHaveCount(0);
  } finally {
    await visitor.close();
  }
});

test('a Sponsor with no address to lead to is refused at the editing screen', async ({ page }) => {
  await openNewSponsor(page);
  await setName(page, `Cím nélkül ${Date.now()}`);
  await setLogo(page, 'featured-image');

  await submit(page);

  // Refused where the Site Owner can still see what went wrong, rather than
  // published as a logo that leads nowhere.
  await expectRefused(page);
  await expect(page.locator('#message.notice-success')).toHaveCount(0);

  // Filling the address in is all it takes to get past the refusal — and it
  // leaves the run a saved Sponsor it can trash, so the refusal leaves no draft
  // behind on the developer's own site.
  await setUrl(page, 'https://cim-nelkul.example/');
  await save(page);
  await trash(page);
});

test('a Sponsor whose logo is still to come is not credited half-way', async ({ page, browser }) => {
  const name = `Logó nélkül ${Date.now()}`;

  await openNewSponsor(page);
  await setName(page, name);
  await setUrl(page, 'https://logo-nelkul.example/');

  await save(page);

  const editorUrl = page.url();

  try {
    const visitor = await asVisitor(browser);

    try {
      const home = await visitor.newPage();

      await home.goto('/');

      // A Sponsor is its logo, so one saved before the logo arrived is left out
      // rather than shown as a blank space with a name under it.
      await expect(credits(home).filter({ hasText: name })).toHaveCount(0);

      await page.goto(editorUrl);
      await setLogo(page, 'featured-image');
      await save(page);

      await home.reload();

      // And is credited the moment the logo is there.
      await expect(credits(home).filter({ hasText: name })).toHaveCount(1);
    } finally {
      await visitor.close();
    }
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});
