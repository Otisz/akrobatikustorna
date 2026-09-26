import { expect, type Page } from '@playwright/test';
import { chooseImage, type Fixture } from './media-library';
import { openAdmin } from './site-owner';

/**
 * The Slide editing screen, driven the way the Site Owner drives it. A Slide has
 * no body, so WordPress opens its classic editing screen rather than the block
 * editor — a short form of a title, an image, an order and a link.
 *
 * Selectors are WordPress's own element ids, never button labels — see ADR-0004.
 */

export async function openNewSlide(page: Page): Promise<void> {
  await openAdmin(page, 'post-new.php?post_type=slide');
  await page.locator('#title').waitFor();
}

/** The Slide's caption, which is its title. */
export async function setCaption(page: Page, caption: string): Promise<void> {
  await page.locator('#title').fill(caption);
}

/** Attaches the Slide's image, replacing whatever it already carries. */
export async function setImage(page: Page, fixture: Fixture): Promise<void> {
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

/** Saves the Slide, whether it is being published or edited afterwards. */
export async function saveSlide(page: Page): Promise<void> {
  await page.locator('#publish').click();
  await expect(page.locator('#message.notice-success')).toBeVisible();
}

/** Publishes the Slide and hands back its numeric identifier. */
export async function publishSlide(page: Page): Promise<number> {
  await saveSlide(page);

  const id = new URL(page.url()).searchParams.get('post');

  if (id === null) {
    throw new Error('WordPress published the Slide without leaving its identifier in the address.');
  }

  return Number(id);
}

/** Moves the Slide open in the editor to the trash, so a run leaves none behind. */
export async function trashSlide(page: Page): Promise<void> {
  await page.locator('#delete-action a').click();
  await page.waitForURL(/edit\.php/);
}
