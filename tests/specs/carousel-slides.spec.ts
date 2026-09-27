import { test, expect, type Page } from '@playwright/test';
import {
  openNewSlide,
  publishSlide,
  setCaption,
  setImage,
  setLink,
  setOrder,
} from '../support/slide-editor';
import { save, trash } from '../support/classic-editor';
import { asVisitor } from '../support/visitor';

/**
 * Replacing a carousel image unaided is the task the handover walkthrough is
 * judged on, so these tests follow that journey exactly: the Site Owner edits a
 * Slide in the admin, and the home page shows the result.
 */

/** The Slides on the home page, in the order a visitor scrolls through them. */
function carousel(page: Page) {
  return page.locator('[data-carousel] li');
}

test('a Slide the Site Owner publishes appears in the home page carousel with its caption and link', async ({
  page,
  browser,
}) => {
  const caption = `Nyári edzőtábor ${Date.now()}`;
  const link = 'https://example.test/edzotabor';

  await openNewSlide(page);
  await setCaption(page, caption);
  await setImage(page, 'carousel-first');
  await setLink(page, link);

  const id = await publishSlide(page);
  const editorUrl = page.url();

  // Cleaned up even when an assertion fails, so a run leaves no Slide behind.
  try {
    const visitor = await asVisitor(browser);

    try {
      const home = await visitor.newPage();

      await home.goto('/');

      const slide = carousel(home).filter({ hasText: caption });

      await expect(slide).toHaveCount(1);
      await expect(slide.locator('img')).toHaveAttribute('src', /carousel-first/);
      await expect(slide.locator('a')).toHaveAttribute('href', link);

      // A Slide is carousel furniture, not a page: it has no URL (Uniform Resource Locator) of its own.
      expect((await visitor.request.get(`/?p=${id}`)).status()).toBe(404);
      expect((await visitor.request.get(`/?post_type=slide&p=${id}`)).status()).toBe(404);
    } finally {
      await visitor.close();
    }
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});

test("the Site Owner can replace a Slide's image and see the new image on the home page", async ({ page }) => {
  const caption = `Bemutató ${Date.now()}`;

  await openNewSlide(page);
  await setCaption(page, caption);
  await setImage(page, 'carousel-first');

  await publishSlide(page);
  const editorUrl = page.url();

  try {
    await page.goto('/');
    await expect(carousel(page).filter({ hasText: caption }).locator('img')).toHaveAttribute(
      'src',
      /carousel-first/
    );

    await page.goto(editorUrl);
    await setImage(page, 'carousel-second');
    await save(page);

    await page.goto('/');

    const image = carousel(page).filter({ hasText: caption }).locator('img');

    await expect(image).toHaveAttribute('src', /carousel-second/);
    await expect(image).not.toHaveAttribute('src', /carousel-first/);
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});

test('the Site Owner controls the order Slides appear in', async ({ page }) => {
  const run = Date.now();
  const second = `Második ${run}`;
  const first = `Első ${run}`;
  const editorUrls: string[] = [];

  // Published in the wrong order on purpose: what decides the carousel is the
  // order the Site Owner gave each Slide, not when it was published.
  for (const [caption, order] of [
    [second, 2],
    [first, 1],
  ] as const) {
    await openNewSlide(page);
    await setCaption(page, caption);
    await setImage(page, 'carousel-first');
    await setOrder(page, order);
    await publishSlide(page);
    editorUrls.push(page.url());
  }

  try {
    await page.goto('/');

    const captions = await carousel(page)
      .filter({ hasText: String(run) })
      .allInnerTexts();

    expect(captions.map((text) => text.trim())).toEqual([first, second]);
  } finally {
    for (const url of editorUrls) {
      await page.goto(url);
      await trash(page);
    }
  }
});

test('a Slide saved without an image is kept out of the carousel', async ({ page }) => {
  const caption = `Kép nélkül ${Date.now()}`;

  await openNewSlide(page);
  await setCaption(page, caption);
  await publishSlide(page);

  const editorUrl = page.url();

  try {
    await page.goto('/');

    // A Slide is its image, so an unfinished one is left out rather than shown
    // to visitors as a blank panel.
    await expect(carousel(page).filter({ hasText: caption })).toHaveCount(0);
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});
