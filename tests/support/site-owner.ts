import { expect, type Page, type Response } from '@playwright/test';

/**
 * The Site Owner's local account, created with the Editor role on first
 * container start — see `docker/php/entrypoint.sh`. Tests only ever run against
 * the local environment, so these are the only credentials they need.
 */
export const siteOwner = { user: 'owner', password: 'owner' };

/** Where the one signed-in session is kept. See ADR-0004 for why there is one. */
export const sessionFile = 'playwright/.auth/site-owner.json';

/** Signs in through the same login form the Site Owner uses. */
export async function signIn(page: Page): Promise<void> {
  await page.goto('/wp/wp-login.php');
  await page.locator('#user_login').fill(siteOwner.user);
  await page.locator('#user_pass').fill(siteOwner.password);
  await page.locator('#wp-submit').click();
  await expect(page.locator('#adminmenu')).toBeVisible();
}

/**
 * Opens an admin screen by its WordPress file name and hands back the response,
 * whose status says whether the Site Owner's role allows the screen at all.
 */
export async function openAdmin(page: Page, screen: string): Promise<Response> {
  const response = await page.goto(`/wp/wp-admin/${screen}`);

  if (response === null) {
    throw new Error(`No response for admin screen ${screen}.`);
  }

  return response;
}
