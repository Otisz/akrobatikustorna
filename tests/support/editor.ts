import { expect, type FrameLocator, type Page } from '@playwright/test';
import { chooseImage } from './media-library';
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

/** Attaches a featured image, chosen from the media library by `chooseImage`. */
export async function setFeaturedImage(page: Page): Promise<void> {
  await page.locator('.editor-post-featured-image__toggle').click();
  await chooseImage(page, 'featured-image');

  await expect(page.locator('.editor-post-featured-image__preview')).toBeVisible();
}

/**
 * Moves the publish date to the start of a later year, which is the one field a
 * Site Owner preparing an announcement in advance has to change.
 */
export async function scheduleFor(page: Page, year: number): Promise<void> {
  await page.locator('.editor-post-schedule__dialog-toggle').click();

  const picker = page.locator('.block-editor-publish-date-time-picker');

  await picker.waitFor();
  await picker.locator('.components-datetime__time-field-year input').fill(String(year));
  await picker.locator('.components-datetime__time-field-year input').blur();

  await expect(page.locator('.editor-post-schedule__dialog-toggle')).toContainText(String(year));
  await page.keyboard.press('Escape');
  await expect(picker).toBeHidden();
}

/** Saves the post as a draft, so that it has a URL (Uniform Resource Locator) to preview. */
export async function saveDraft(page: Page): Promise<void> {
  await page.locator('.editor-post-save-draft').click();

  // The editor rewrites the address bar only eventually; the trash button is the
  // signal that the draft has become a post with an identifier of its own.
  await expect(page.locator('.editor-post-saved-state')).toBeVisible();
  await expect(page.locator('.editor-post-trash')).toBeVisible();
}

/** Opens the editor's own preview in a new tab and hands back that tab. */
export async function previewInNewTab(page: Page): Promise<Page> {
  await page.locator('.editor-preview-dropdown__toggle').click();
  await page.locator('.editor-preview-dropdown__button-external').waitFor();

  const [preview] = await Promise.all([
    page.context().waitForEvent('page'),
    page.locator('.editor-preview-dropdown__button-external').click(),
  ]);

  await preview.waitForLoadState();

  return preview;
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

  // Waited for rather than checked: the dialog mounts a moment after the click,
  // and dismissing it too early leaves the post behind.
  await confirmation.waitFor();
  await confirmation.locator('button.is-primary').click();

  await page.waitForURL(/edit\.php/);
}
