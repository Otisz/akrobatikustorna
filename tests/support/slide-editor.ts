import { expect, type Page } from '@playwright/test';
import { openNewOfType, postId, save, setTitle } from './classic-editor';
import { chooseImage, type ImageFixture } from './media-library';

/**
 * The Slide editing screen, driven the way the Site Owner drives it. A Slide has
 * no body, so WordPress opens its classic editing screen rather than the block
 * editor — a short form of a title, an image, an order and a link;
 * `classic-editor.ts` holds everything about that screen which is not a Slide's
 * own.
 *
 * Selectors are WordPress's own element ids, never button labels — see ADR-0004.
 */

export async function openNewSlide(page: Page): Promise<void> {
  await openNewOfType(page, 'slide');
}

/** The Slide's caption, which is its title. */
export async function setCaption(page: Page, caption: string): Promise<void> {
  await setTitle(page, caption);
}

/** Attaches the Slide's image, replacing whatever it already carries. */
export async function setImage(page: Page, fixture: ImageFixture): Promise<void> {
  const box = page.locator('#postimagediv');

  // The same link opens the media modal whether or not an image is set: once one
  // is, the link is the thumbnail itself.
  await box.locator('#set-post-thumbnail').click();
  await chooseImage(page, fixture);

  await expect(box.locator('img')).toBeVisible();
}

/** Where the Slide sends a visitor who clicks it. Optional, so often left empty. */
export async function setLink(page: Page, url: string): Promise<void> {
  await page.locator('.acf-field[data-name="slide_link"] input').fill(url);
}

/** The position the Slide takes in the carousel, counting from the front. */
export async function setOrder(page: Page, order: number): Promise<void> {
  await page.locator('#menu_order').fill(String(order));
}

/** Publishes the Slide and hands back its numeric identifier. */
export async function publishSlide(page: Page): Promise<number> {
  await save(page);

  return postId(page);
}
