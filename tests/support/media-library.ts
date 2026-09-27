import { expect, type Locator, type Page } from '@playwright/test';

/**
 * The media modal, shared by every screen that attaches an image or a file.
 * Selectors are WordPress's own class names, never button labels — see ADR-0004.
 *
 * The library is the developer's own and is never emptied, so uploads are looked
 * up by name and uploaded only when it does not already hold them. Repeated runs
 * therefore reuse the same few fixtures rather than filling the library up.
 */

/** Fixture images, named so that the file each one produced is recognisable in a URL (Uniform Resource Locator). */
export type ImageFixture = 'featured-image' | 'carousel-first' | 'carousel-second';

/** Fixture documents, named the same way, and the same shape a club form has. */
export type FileFixture = 'document-first' | 'document-second';

type Fixture = ImageFixture | FileFixture;

/**
 * The fixture's own entry in the library, identified by the title WordPress
 * gives an upload — its file name. Never the first result, which would be
 * whichever upload the developer made most recently.
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
 * Chooses a fixture in the open media modal and inserts it, uploading the
 * fixture first if the library does not hold it yet.
 */
async function choose(page: Page, fixture: Fixture, file: string): Promise<void> {
  const modal = page.locator('.media-modal');

  await modal.waitFor();
  await modal.locator('#menu-item-browse').click();
  await modal.locator('.attachments-browser').waitFor();

  if (await libraryHas(page, fixture)) {
    await entry(page, fixture).first().click();
  } else {
    // The search that proved the fixture absent is cleared first. WordPress adds
    // an upload to the results the modal is already showing, and one filtered
    // out of them counts as nothing chosen — which leaves the insert button dead
    // and the modal open on a file that did upload.
    await modal.locator('#media-search-input').fill('');
    await modal.locator('#menu-item-upload').click();
    await modal.locator('.moxie-shim input[type="file"]').setInputFiles(file);
    await expect(entry(page, fixture).first()).toBeVisible();
  }

  const insert = modal.locator('.media-button-select');

  await expect(insert).toBeEnabled();
  await insert.click();
  await expect(modal).toBeHidden();
}

/** Chooses a fixture image — a portrait, a picture or a carousel photograph. */
export async function chooseImage(page: Page, fixture: ImageFixture): Promise<void> {
  await choose(page, fixture, `fixtures/${fixture}.jpg`);
}

/** Chooses a fixture document — the file a Document is. */
export async function chooseFile(page: Page, fixture: FileFixture): Promise<void> {
  await choose(page, fixture, `fixtures/${fixture}.pdf`);
}
