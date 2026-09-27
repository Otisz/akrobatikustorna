import { type Page } from '@playwright/test';
import { openNewOfType, setTitle } from './classic-editor';

/**
 * The Recommended Page editing screen, driven the way the Site Owner drives it.
 * A Recommended Page is a name and an address, so WordPress opens its classic
 * editing screen rather than the block editor — a short form of exactly those two
 * things, and `classic-editor.ts` holds everything about that screen which is not
 * a Recommended Page's own.
 *
 * Selectors are the fields plugin's own class names, never button labels — see
 * ADR-0004.
 */

export const recommendedPagesPath = '/ajanlott-oldalak/';

export async function openNewRecommendedPage(page: Page): Promise<void> {
  await openNewOfType(page, 'recommended_page');
}

/** What a visitor reads on the listing, which is the title. */
export async function setName(page: Page, name: string): Promise<void> {
  await setTitle(page, name);
}

/** The organisation's own address, which is the whole point of the entry. */
export async function setUrl(page: Page, url: string): Promise<void> {
  await page.locator('.acf-field[data-name="recommended_page_url"] input').fill(url);
}
