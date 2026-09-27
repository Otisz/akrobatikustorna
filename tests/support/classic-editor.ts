import { expect, type Page } from '@playwright/test';
import { openAdmin } from './site-owner';

declare global {
  interface Window {
    wp?: { autosave?: { server?: { suspend?: () => void } } };
  }
}

/**
 * WordPress's classic editing screen, driven the way the Site Owner drives it.
 * It is what a post type without a body opens — a Slide, a Document — so this is
 * the screen for content the Site Owner fills in rather than writes.
 *
 * Selectors are WordPress's own element ids, never button labels — see ADR-0004.
 */

/** Opens the screen for a new post of the type, and waits for it to be usable. */
export async function openNewOfType(page: Page, postType: string): Promise<void> {
  await openAdmin(page, `post-new.php?post_type=${postType}`);
  await page.locator('#title').waitFor();
  await stopBackgroundSaves(page);
}

/**
 * Stops WordPress saving the draft in the background while the screen is open.
 *
 * Not a convenience: core marks the publish button `disabled` with a class
 * rather than the attribute for as long as one of those saves is in flight, and
 * discards any click that lands meanwhile — see `wp-admin/js/post.js`. A browser
 * checks the attribute, so the click looks to a test like it landed, and the
 * test then waits out its timeout for a save nobody asked for. Typing a title is
 * itself what schedules the first of those saves, 200ms after the field loses
 * focus, which is exactly where a test is by then.
 *
 * `suspend()` is WordPress's own, and what core itself calls when another editor
 * takes the post over. Nothing the Site Owner can do changes: the saving this
 * stops is a timer, and every test here saves by pressing the button.
 */
async function stopBackgroundSaves(page: Page): Promise<void> {
  await page.evaluate(() => window.wp?.autosave?.server?.suspend?.());
}

export async function setTitle(page: Page, title: string): Promise<void> {
  await page.locator('#title').fill(title);
}

/**
 * Saves what is on the screen, whether publishing it or editing it afterwards.
 *
 * The notice is given longer than an assertion's usual window: the suite runs
 * in parallel against one site, whose PHP (Hypertext Preprocessor) pool holds
 * five workers, so a save that waits behind several others takes longer than any
 * of them does alone.
 */
export async function save(page: Page): Promise<void> {
  await submit(page);
  await expect(page.locator('#message.notice-success')).toBeVisible({ timeout: 20_000 });
}

/**
 * Asks the screen to save, without expecting it to: what a field refuses is
 * asserted by the test that made it refuse.
 */
export async function submit(page: Page): Promise<void> {
  const publish = page.locator('#publish');

  // Background saving is stopped when the screen opens, so this should never
  // wait. It stands as the guard for anything else that disables the button.
  await expect(publish).not.toHaveClass(/(^|\s)disabled(\s|$)/, { timeout: 20_000 });
  await publish.click();
}

/** The post's own public address, as the screen prints it under the title. */
export async function permalink(page: Page): Promise<string> {
  const url = await page.locator('#sample-permalink a').getAttribute('href');

  if (url === null) {
    throw new Error('WordPress saved the post without printing its permalink.');
  }

  return url;
}

/** The identifier WordPress gave the post on the screen. */
export function postId(page: Page): number {
  const id = new URL(page.url()).searchParams.get('post');

  if (id === null) {
    throw new Error('WordPress saved the post without leaving its identifier in the address.');
  }

  return Number(id);
}

/** Moves the post on the screen to the trash, so a run leaves none behind. */
export async function trash(page: Page): Promise<void> {
  await page.locator('#delete-action a').click();
  await page.waitForURL(/edit\.php/);
}
