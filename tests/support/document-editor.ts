import { expect, type Page } from '@playwright/test';
import { openNewOfType, setTitle } from './classic-editor';
import { chooseFile, type FileFixture } from './media-library';

/**
 * The Document editing screen, driven the way the Site Owner drives it. A
 * Document is a name and a file, so WordPress opens its classic editing screen
 * rather than the block editor — a short form of exactly those two things, and
 * `classic-editor.ts` holds everything about that screen which is not a
 * Document's own.
 *
 * Selectors are the fields plugin's own class names, never button labels — see
 * ADR-0004.
 */

export const documentsPath = '/dokumentumok/';

export async function openNewDocument(page: Page): Promise<void> {
  await openNewOfType(page, 'document');
}

/** What a parent reads on the listing, which is the Document's title. */
export async function setName(page: Page, name: string): Promise<void> {
  await setTitle(page, name);
}

/**
 * Attaches the Document's file, replacing whatever it already carries: the field
 * offers a button to add one and, once it holds a file, one to take it away, so
 * a newer version is a removal followed by a choice — the same two clicks the
 * Site Owner makes.
 */
export async function setFile(page: Page, fixture: FileFixture): Promise<void> {
  const field = page.locator('.acf-field[data-name="document_file"] .acf-file-uploader');

  if (await field.evaluate((element) => element.classList.contains('has-value'))) {
    // The actions are hidden until the pointer is on the field, which is how the
    // Site Owner reaches them too.
    await field.hover();
    await field.locator('a[data-name="remove"]').click();
  }

  await field.locator('a[data-name="add"]').click();
  await chooseFile(page, fixture);

  await expect(field.locator('a[data-name="filename"]')).toContainText(`${fixture}.pdf`);
}
