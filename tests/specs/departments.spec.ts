import { test, expect, type Page } from '@playwright/test';
import { openPost, postId, publish, setFeaturedImage, setTitle, trash, update } from '../support/editor';
import {
  departmentsPath,
  openNewDepartment,
  setDescription,
  setOrder,
} from '../support/department-editor';
import { asVisitor } from '../support/visitor';

/**
 * Keeping each Department's own description accurate is a task the Site Owner
 * does alone. These tests follow that journey: the Department is written in the
 * admin, and a parent weighing up the club reads it on one page.
 */

/** The Departments on the listing, in the order a parent reads down them. */
function listing(page: Page) {
  return page.locator('[data-departments] article');
}

test('a Department the Site Owner publishes is read in full on the listing', async ({ page }) => {
  const name = `Akrobatikus torna ${Date.now()}`;
  const description = 'Párokban és csoportokban végzett akrobatikus gyakorlatok, hat éves kortól.';

  await openNewDepartment(page);
  await setTitle(page, name);
  await setDescription(page, description);
  await setFeaturedImage(page);

  const url = await publish(page);
  const editorUrl = page.url();

  // Cleaned up even when an assertion fails, so a run leaves no Department behind.
  try {
    await page.goto(departmentsPath);

    const department = listing(page).filter({ hasText: name });

    // The description is read here rather than behind a link: the club has few
    // Departments and a parent compares them one after another.
    await expect(department).toHaveCount(1);
    await expect(department).toContainText(description);
    await expect(department.locator('img')).toBeVisible();

    // A Department has one public address, so its own URL carries a parent to
    // its place on the listing rather than to a second copy of the same words.
    await page.goto(url);
    expect(new URL(page.url()).pathname).toBe(departmentsPath);
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});

test('a description the Site Owner rewrites is what a parent then reads', async ({
  page,
  browser,
}) => {
  const name = `Akrobatikus tánc ${Date.now()}`;
  // Two paragraphs, which is the shape the club's own descriptions have, so the
  // rewrite has to replace a whole description rather than a first line.
  const wrong = ['Ez a leírás elavult.', 'Ez a bekezdés is elavult.'];
  const rewritten = 'Koreográfiára épülő gyakorlatok, amelyekben a torna elemei zenére egészülnek ki.';

  await openNewDepartment(page);
  await setTitle(page, name);
  await setDescription(page, ...wrong);

  await publish(page);

  const id = postId(page);
  const editorUrl = page.url();

  try {
    await openPost(page, id);
    await setDescription(page, rewritten);
    await update(page);

    // Signed out, because what matters is what a parent reads, not what the
    // editing screen shows back to the Site Owner.
    const visitor = await asVisitor(browser);

    try {
      const departments = await visitor.newPage();

      await departments.goto(departmentsPath);

      const department = listing(departments).filter({ hasText: name });

      await expect(department).toContainText(rewritten);

      for (const stale of wrong) {
        await expect(department).not.toContainText(stale);
      }
    } finally {
      await visitor.close();
    }
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});

test('the Site Owner controls the order Departments are listed in', async ({ page }) => {
  const run = Date.now();
  const second = `Második szakosztály ${run}`;
  const first = `Első szakosztály ${run}`;
  const editorUrls: string[] = [];

  // Trashed even when publishing the second Department fails, so a run leaves
  // none behind either way.
  try {
    // Published in the wrong order on purpose: what decides the listing is which
    // Department the club puts first, not which was written first.
    for (const [name, order] of [
      [second, 2],
      [first, 1],
    ] as const) {
      await openNewDepartment(page);
      await setTitle(page, name);
      await publish(page);
      editorUrls.push(page.url());

      await setOrder(page, order);
    }

    await page.goto(departmentsPath);

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
