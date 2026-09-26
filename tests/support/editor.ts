import { expect, type FrameLocator, type Page } from '@playwright/test';
import { openAdmin } from './site-owner';

/**
 * The block editor, driven the way the Site Owner drives it. Selectors are
 * WordPress's own class names, never button labels — see ADR-0004.
 */

/** The editor renders its content in an iframe, so blocks live behind a frame. */
export function canvas(page: Page): FrameLocator {
  return page.frameLocator('iframe[name="editor-canvas"]');
}

export async function openNewPost(page: Page): Promise<void> {
  await openAdmin(page, 'post-new.php');

  // The welcome guide mounts with the editor and covers it, so waiting for the
  // title means the guide too has had its chance to appear.
  const welcomeGuide = page.locator('.components-modal__screen-overlay');

  await canvas(page).locator('.editor-post-title__input').waitFor();

  if (await welcomeGuide.isVisible()) {
    await page.keyboard.press('Escape');
    await expect(welcomeGuide).toBeHidden();
  }
}

export async function setTitle(page: Page, title: string): Promise<void> {
  await canvas(page).locator('.editor-post-title__input').fill(title);
}

/** Publishes what is in the editor and hands back its public URL. */
export async function publish(page: Page): Promise<string> {
  await page.locator('.editor-post-publish-button__button').click();
  await page.locator('.editor-post-publish-panel .editor-post-publish-button').click();

  const link = page.locator('.post-publish-panel__postpublish-header a');

  await expect(link).toBeVisible();

  const url = await link.getAttribute('href');

  if (url === null) {
    throw new Error('WordPress published the post without offering a link to it.');
  }

  return url;
}

/** Moves the post open in the editor to the trash. */
export async function trash(page: Page): Promise<void> {
  await page.locator('.editor-post-trash').click();

  const confirmation = page.locator('.components-confirm-dialog');

  if (await confirmation.isVisible()) {
    await confirmation.locator('button.is-primary').click();
  }

  await page.waitForURL(/edit\.php/);
}
