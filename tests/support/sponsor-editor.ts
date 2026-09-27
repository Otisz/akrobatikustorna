import { expect, type Page } from '@playwright/test';
import { openNewOfType, setTitle } from './classic-editor';
import { chooseImage, type ImageFixture } from './media-library';

/**
 * The Sponsor editing screen, driven the way the Site Owner drives it. A Sponsor
 * is a name, a logo and the address the logo leads to, so WordPress opens its
 * classic editing screen rather than the block editor — a short form of exactly
 * those three things, and `classic-editor.ts` holds everything about that screen
 * which is not a Sponsor's own.
 *
 * Selectors are WordPress's own element ids and the fields plugin's own class
 * names, never button labels — see ADR-0004.
 */

export async function openNewSponsor(page: Page): Promise<void> {
  await openNewOfType(page, 'sponsor');
}

/** What a visitor reads under the logo, which is the Sponsor's title. */
export async function setName(page: Page, name: string): Promise<void> {
  await setTitle(page, name);
}

/** Attaches the Sponsor's logo, replacing whatever it already carries. */
export async function setLogo(page: Page, fixture: ImageFixture): Promise<void> {
  const box = page.locator('#postimagediv');

  // The same link opens the media modal whether or not a logo is set: once one
  // is, the link is the thumbnail itself.
  await box.locator('#set-post-thumbnail').click();
  await chooseImage(page, fixture);

  await expect(box.locator('img')).toBeVisible();
}

const field = (page: Page) => page.locator('.acf-field[data-name="sponsor_url"]');

/** The Sponsor's own site, which is where their logo sends a visitor. */
export async function setUrl(page: Page, url: string): Promise<void> {
  await field(page).locator('input').fill(url);
}

/** Whether the screen refused the Sponsor rather than saving it. */
export async function expectRefused(page: Page): Promise<void> {
  await expect(field(page)).toHaveClass(/(^|\s)acf-error(\s|$)/);
}
