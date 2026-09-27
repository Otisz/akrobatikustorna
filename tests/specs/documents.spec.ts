import { test, expect, type Page } from '@playwright/test';
import { documentsPath, openNewDocument, setFile, setName } from '../support/document-editor';
import { permalink, save, trash } from '../support/classic-editor';
import { asVisitor } from '../support/visitor';

/**
 * Putting a form where parents can find it is a task the Site Owner does alone.
 * These tests follow that journey: the file is uploaded in the admin, and a
 * parent downloads it from one page to fill in offline.
 */

/** The Documents on the listing, in the order a parent reads down them. */
function listing(page: Page) {
  return page.locator('[data-documents] a');
}

test('a Document the Site Owner uploads is one a parent downloads', async ({ page, browser }) => {
  const name = `Házirend ${Date.now()}`;

  await openNewDocument(page);
  await setName(page, name);
  await setFile(page, 'document-first');

  await save(page);

  const editorUrl = page.url();
  const url = await permalink(page);

  // Cleaned up even when an assertion fails, so a run leaves no Document behind.
  try {
    // Signed out, because what matters is that a parent reaches the file, not
    // what the editing screen shows back to the Site Owner.
    const visitor = await asVisitor(browser);

    try {
      const documents = await visitor.newPage();

      await documents.goto(documentsPath);

      const document = listing(documents).filter({ hasText: name });

      // No further steps between the upload and the listing: publishing is all
      // the Site Owner did.
      await expect(document).toHaveCount(1);

      const [download] = await Promise.all([
        documents.waitForEvent('download'),
        document.click(),
      ]);

      // The file itself, saved to disk rather than opened in a viewer the parent
      // would then have to save from.
      expect(download.suggestedFilename()).toContain('document-first');
      expect(await download.failure()).toBeNull();

      // A Document has one public address, so its own URL (Uniform Resource
      // Locator) carries a parent to the listing rather than to a page holding
      // nothing the listing does not already offer.
      await documents.goto(url);
      expect(new URL(documents.url()).pathname).toBe(documentsPath);
    } finally {
      await visitor.close();
    }
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});

test('a file the Site Owner replaces is the version a parent then downloads', async ({
  page,
  browser,
}) => {
  const name = `Jelentkezési lap ${Date.now()}`;

  await openNewDocument(page);
  await setName(page, name);
  await setFile(page, 'document-first');

  await save(page);

  const editorUrl = page.url();

  try {
    // Signed out, because what matters is which version a parent is served.
    const visitor = await asVisitor(browser);

    try {
      const documents = await visitor.newPage();

      await documents.goto(documentsPath);

      const document = listing(documents).filter({ hasText: name });
      const outdated = await document.getAttribute('href');

      expect(outdated).toMatch(/document-first/);

      await page.goto(editorUrl);
      await setFile(page, 'document-second');
      await save(page);

      await documents.reload();

      // The outdated version stops circulating: the listing serves a different
      // file from the one it served a moment ago, and that file is the newer
      // upload rather than the one it replaced.
      await expect(document).toHaveAttribute('href', /document-second/);
      expect(await document.getAttribute('href')).not.toBe(outdated);
    } finally {
      await visitor.close();
    }
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});

test('Documents are listed by name, so a parent can find the form they came for', async ({
  page,
}) => {
  const run = Date.now();
  const first = `Adatlap ${run}`;
  const second = `Zárónyilatkozat ${run}`;
  const editorUrls: string[] = [];

  try {
    // Uploaded in the wrong order on purpose: a parent looks a form up by name,
    // so the listing is alphabetical rather than newest-first, and the Site
    // Owner is given no order to maintain.
    for (const name of [second, first]) {
      await openNewDocument(page);
      await setName(page, name);
      await setFile(page, 'document-first');
      await save(page);
      editorUrls.push(page.url());
    }

    await page.goto(documentsPath);

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
