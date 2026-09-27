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

/**
 * The welcome guide mounts with the editor and covers it. Call once the editor
 * itself has rendered, so that the guide too has had its chance to appear.
 */
export async function dismissWelcomeGuide(page: Page): Promise<void> {
  const welcomeGuide = page.locator('.components-modal__screen-overlay');

  if (await welcomeGuide.isVisible()) {
    await page.keyboard.press('Escape');
    await expect(welcomeGuide).toBeHidden();
  }
}

/** Opens an editing screen and waits for the block editor to be usable. */
export async function openEditor(page: Page, screen: string): Promise<void> {
  await openAdmin(page, screen);
  await canvas(page).locator('.editor-post-title__input').waitFor();
  await dismissWelcomeGuide(page);
}

export async function openNewPost(page: Page): Promise<void> {
  await openEditor(page, 'post-new.php');
}

export async function setTitle(page: Page, title: string): Promise<void> {
  await canvas(page).locator('.editor-post-title__input').fill(title);
}

/**
 * Brings the settings sidebar back to the post's own tab. Selecting a block
 * switches the sidebar to that block, and the post's own controls — the featured
 * image among them — leave the screen with it; the Site Owner clicks back the
 * same way. The tab strip appears only once a block has been selected, so its
 * absence means the post's tab is already showing.
 */
export async function openPostTab(page: Page): Promise<void> {
  // The document tab, then the block tab: addressed by position, because the
  // admin is Hungarian — see ADR-0004.
  const tab = page.locator('.editor-sidebar__panel-tabs [role="tab"]').first();

  if (await tab.isVisible()) {
    await tab.click();
  }
}

/** Attaches a featured image, chosen from the media library by `chooseImage`. */
export async function setFeaturedImage(page: Page): Promise<void> {
  await openPostTab(page);
  await page.locator('.editor-post-featured-image__toggle').click();
  await chooseImage(page, 'featured-image');

  await expect(page.locator('.editor-post-featured-image__preview')).toBeVisible();
}

/**
 * The body, typed into the canvas as one paragraph per argument: into the empty
 * appender on a post that has no blocks yet, over everything already there on a
 * post that has. Typed rather than filled, because a block is a rich text field
 * that only notices real keystrokes.
 */
export async function setBody(page: Page, ...paragraphs: string[]): Promise<void> {
  const appender = canvas(page).locator('.block-editor-default-block-appender__content');
  const written = canvas(page).locator('p[data-type="core/paragraph"]');

  if (!(await appender.isVisible())) {
    // Whatever the body already holds, cleared first: a Site Owner rewriting a
    // description replaces it rather than adding to it. Once selects the
    // paragraph's own text, twice every block of the body.
    await written.first().click();
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.press('Backspace');
  }

  // An emptied body leaves the cursor in a block of its own, so the appender is
  // there to click only on a post that never had one.
  if (await appender.isVisible()) {
    await appender.click();
  }

  for (const [index, paragraph] of paragraphs.entries()) {
    if (index > 0) {
      await page.keyboard.press('Enter');
    }

    await page.keyboard.type(paragraph);
  }

  // The whole body, so that a rewrite is asserted to have left nothing of the
  // text it replaced.
  await expect(written).toHaveText(paragraphs);
}

/**
 * Pastes text into whatever block is being edited. The event is made here rather
 * than taken from the system clipboard, which needs the browser window to be the
 * frontmost one — not something a suite running several browsers beside each
 * other can promise.
 */
export async function paste(page: Page, text: string): Promise<void> {
  const frame = page.frames().find((candidate) => candidate.name() === 'editor-canvas');

  if (frame === undefined) {
    throw new Error('The editor is not showing its canvas.');
  }

  await frame.evaluate((pasted) => {
    const clipboardData = new DataTransfer();

    clipboardData.setData('text/plain', pasted);
    document.activeElement?.dispatchEvent(
      new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true })
    );
  }, text);
}

/** Opens an existing post in the editor. */
export async function openPost(page: Page, id: number): Promise<void> {
  await openEditor(page, `post.php?post=${id}&action=edit`);
}

/** The identifier WordPress gave the post open in the editor. */
export function postId(page: Page): number {
  const id = new URL(page.url()).searchParams.get('post');

  if (id === null) {
    throw new Error('WordPress saved the post without leaving its identifier in the address.');
  }

  return Number(id);
}

/**
 * The position the post takes in its listing, counting from the top, changed
 * where the Site Owner sees one post's position against the others: the admin
 * list, through Quick Edit. The block editor's sidebar offers no order field.
 */
export async function setOrder(page: Page, postType: string, order: number): Promise<void> {
  const id = postId(page);

  await openAdmin(page, `edit.php?post_type=${postType}`);

  const row = page.locator(`#post-${id}`);

  // The row's actions are hidden until the pointer is on the row, which is how
  // the Site Owner reaches Quick Edit too.
  await row.hover();
  await row.locator('.editinline').click();

  const form = page.locator(`#edit-${id}`);

  await form.locator('input.inline-edit-menu-order-input').fill(String(order));
  await form.locator('.save').click();

  await expect(row).toBeVisible();
  await expect(row.locator('td.menu_order')).toHaveText(String(order));
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

  // The editor rewrites the address bar to the new post's own a moment after the
  // panel appears. Waited for here, because a caller that reads the address too
  // early gets `post-new.php` back and, coming to clean up, opens a fresh empty
  // draft and trashes that instead of the post it just made.
  await page.waitForURL(/[?&]post=\d+/);

  return url;
}

/**
 * Saves a change to a post that is already published. The header button is the
 * same one that published it; a published post has no pre-publish panel, so the
 * click saves outright.
 */
export async function update(page: Page): Promise<void> {
  await page.locator('.editor-post-publish-button__button').click();

  // The snackbar is the editor's own confirmation that the change reached the
  // database, which is what the public page is then read for.
  await expect(page.locator('.components-snackbar')).toBeVisible();
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
