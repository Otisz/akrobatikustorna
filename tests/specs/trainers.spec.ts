import { test, expect, type Page } from '@playwright/test';
import { publish, setFeaturedImage, setTitle, trash } from '../support/editor';
import { openNewTrainer, setBiography, setOrder, setRole, trainersPath } from '../support/trainer-editor';
import { asVisitor } from '../support/visitor';

/**
 * Adding a Trainer the day they join, and removing one who has left, are tasks
 * the Site Owner does alone. These tests follow that journey: the Trainer is
 * entered in the admin, and a parent sees who will be teaching their child.
 */

/** The Trainers in the listing, in the order a parent reads down them. */
function listing(page: Page) {
  return page.locator('[data-trainers] article');
}

test('a Trainer the Site Owner publishes appears in the listing and on a page of their own', async ({
  page,
}) => {
  const name = `Kovács Anna ${Date.now()}`;
  const role = 'vezetőedző';
  const biography = 'Tizenöt éve versenyez, nyolc éve edző.';

  await openNewTrainer(page);
  await setTitle(page, name);
  await setRole(page, role);
  await setBiography(page, biography);
  await setFeaturedImage(page);

  const url = await publish(page);
  const editorUrl = page.url();

  // Cleaned up even when an assertion fails, so a run leaves no Trainer behind.
  try {
    expect(new URL(url).pathname).toMatch(/^\/edzok\/[^/]+\/$/);

    await page.goto(url);
    await expect(page.locator('h1')).toHaveText(name);
    await expect(page.locator('main')).toContainText(role);
    await expect(page.locator('main')).toContainText(biography);
    await expect(page.locator('main img').first()).toBeVisible();

    await page.goto(trainersPath);

    const card = listing(page).filter({ hasText: name });

    await expect(card).toHaveCount(1);
    await expect(card).toContainText(role);
    await expect(card.locator('img')).toBeVisible();
    await expect(card.locator('a').first()).toHaveAttribute('href', url);
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});

test('the Site Owner controls the order Trainers are listed in', async ({ page }) => {
  const run = Date.now();
  const second = `Második edző ${run}`;
  const first = `Első edző ${run}`;
  const editorUrls: string[] = [];

  // Trashed even when publishing the second Trainer fails, so a run leaves none
  // behind either way.
  try {
    // Published in the wrong order on purpose: what decides the listing is the
    // club's own sense of seniority, not when a Trainer was entered.
    for (const [name, order] of [
      [second, 2],
      [first, 1],
    ] as const) {
      await openNewTrainer(page);
      await setTitle(page, name);
      await setFeaturedImage(page);
      await publish(page);
      editorUrls.push(page.url());

      await setOrder(page, order);
    }

    await page.goto(trainersPath);

    const names = await listing(page)
      .filter({ hasText: String(run) })
      .locator('h2')
      .allInnerTexts();

    expect(names.map((text) => text.trim())).toEqual([first, second]);
  } finally {
    for (const url of editorUrls) {
      await page.goto(url);
      await trash(page);
    }
  }
});

test('a Trainer the Site Owner removes leaves the site showing no stale staff', async ({
  page,
  browser,
}) => {
  const name = `Távozó edző ${Date.now()}`;

  await openNewTrainer(page);
  await setTitle(page, name);
  await setFeaturedImage(page);

  const url = await publish(page);
  const editorUrl = page.url();

  await page.goto(editorUrl);
  await trash(page);

  // Signed out, because what matters is what a parent can still reach.
  const visitor = await asVisitor(browser);

  try {
    expect((await visitor.request.get(url)).status()).toBe(404);

    const trainers = await visitor.newPage();

    await trainers.goto(trainersPath);
    await expect(listing(trainers).filter({ hasText: name })).toHaveCount(0);
  } finally {
    await visitor.close();
  }
});

test('the Trainer editing screen offers the Site Owner no colour picker', async ({ page }) => {
  await openNewTrainer(page);

  // The role is the Trainer's only field, asserted first so that the two counts
  // below are the absence of a colour picker rather than the absence of a form.
  await expect(page.locator('.acf-field[data-name="trainer_role"]')).toHaveCount(1);

  // See base-trainers.php on why the outgoing hex colour field is not here.
  await expect(page.locator('.acf-field[data-type="color_picker"]')).toHaveCount(0);
  await expect(page.locator('.acf-fields input[type="color"]')).toHaveCount(0);
});
