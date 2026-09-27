import { expect, type Page } from '@playwright/test';
import { openNewOfType, setTitle } from './classic-editor';

/**
 * The Video editing screen, driven the way the Site Owner drives it. A Video is
 * a title and a link pasted from YouTube, so WordPress opens its classic editing
 * screen rather than the block editor — a short form of exactly those two
 * things, and `classic-editor.ts` holds everything about that screen which is
 * not a Video's own.
 *
 * Selectors are the fields plugin's own class names, never button labels — see
 * ADR-0004.
 */

export const galleryPath = '/galeria/';

export async function openNewVideo(page: Page): Promise<void> {
  await openNewOfType(page, 'video');
}

/** What a visitor reads under the Video in the gallery, which is its title. */
export async function setName(page: Page, name: string): Promise<void> {
  await setTitle(page, name);
}

const field = (page: Page) => page.locator('.acf-field[data-name="video_youtube"]');

/** Pastes a link into the one field a Video has, replacing whatever it holds. */
export async function setLink(page: Page, link: string): Promise<void> {
  await field(page).locator('input').fill(link);
}

/** The link the screen shows back, which is what the site understood. */
export async function link(page: Page): Promise<string> {
  return field(page).locator('input').inputValue();
}

/** Whether the screen refused the pasted link rather than saving it. */
export async function expectRefused(page: Page): Promise<void> {
  await expect(field(page)).toHaveClass(/(^|\s)acf-error(\s|$)/);
}
