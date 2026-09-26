import { expect, type Locator, type Page } from '@playwright/test';

/**
 * The media modal, shared by every screen that attaches an image. Selectors are
 * WordPress's own class names, never button labels — see ADR-0004.
 *
 * The library is the developer's own and is never emptied, so images are looked
 * up by name and uploaded only when it does not already hold them. Repeated runs
 * therefore reuse the same few fixtures rather than filling the library up.
 */

/** Fixture images, named so that the file each one produced is recognisable in a URL (Uniform Resource Locator). */
export type Fixture = 'featured-image' | 'carousel-first' | 'carousel-second';

/**
 * The fixture's own entry in the library, identified by the title WordPress
 * gives an upload — its file name. Never the first result, which would be
 * whichever image the developer uploaded most recently.
 */
function entry(page: Page, fixture: Fixture): Locator {
  return page.locator(`.media-modal .attachments .attachment[aria-label="${fixture}"]`);
}

/**
 * WordPress searches and renders in the background, so the absence of an entry
 * has to be waited out before it counts as absent.
 */
async function libraryHas(page: Page, fixture: Fixture): Promise<boolean> {
  await page.locator('.media-modal #media-search-input').fill(fixture);

  try {
    await entry(page, fixture).first().waitFor({ state: 'visible', timeout: 5_000 });

    return true;
  } catch {
    return false;
  }
}

/**
 * Chooses a fixture image in the open media modal and inserts it, uploading the
 * fixture first if the library does not hold it yet.
 */
export async function chooseImage(page: Page, fixture: Fixture): Promise<void> {
  const modal = page.locator('.media-modal');

  await modal.waitFor();
  await modal.locator('#menu-item-browse').click();
  await modal.locator('.attachments-browser').waitFor();

  if (await libraryHas(page, fixture)) {
    await entry(page, fixture).first().click();
  } else {
    await modal.locator('#menu-item-upload').click();
    await modal.locator('.moxie-shim input[type="file"]').setInputFiles(`fixtures/${fixture}.jpg`);
    await expect(modal.locator('.attachment.details')).toBeVisible();
  }

  await modal.locator('.media-button-select').click();
  await expect(modal).toBeHidden();
}
