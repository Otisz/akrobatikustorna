import { expect, type Page } from '@playwright/test';
import { openAdmin } from './site-owner';

/**
 * The Contact details screen, driven the way the Site Owner drives it: they open
 * one screen, change a number, and press save.
 *
 * Selectors are the field ids the screen prints, never button labels — the admin
 * is Hungarian, see ADR-0004.
 */

export const contactPath = '/kapcsolat/';
export const applyPath = '/jelentkezes/';

/** The one screen the club's contact details are edited on. */
export async function openContactDetails(page: Page): Promise<void> {
  await openAdmin(page, 'admin.php?page=base-contact');
  await expect(page.locator('#base_contact_phone_primary')).toBeVisible();
}

/** What the screen currently holds for the club's first telephone number. */
export async function phoneNumber(page: Page): Promise<string> {
  return page.locator('#base_contact_phone_primary').inputValue();
}

/** Changes the club's first telephone number and saves, as the Site Owner does. */
export async function setPhoneNumber(page: Page, number: string): Promise<void> {
  await page.locator('#base_contact_phone_primary').fill(number);
  await page.locator('#submit').click();

  // WordPress's own confirmation that the screen reached the database, which is
  // what the public pages are then read for.
  await expect(page.locator('.settings-error, .notice-success')).toBeVisible();
  await expect(page.locator('#base_contact_phone_primary')).toHaveValue(number);
}
