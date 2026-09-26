import { expect, type Page } from '@playwright/test';
import { canvas, openEditor } from './editor';
import { openAdmin } from './site-owner';

/**
 * The Trainer editing screen, driven the way the Site Owner drives it. A Trainer
 * has a biography, so WordPress opens the block editor: a portrait in the
 * sidebar, a role beside it, an order, and the biography in the canvas.
 *
 * Selectors are WordPress's own class names, never button labels — see ADR-0004.
 */

export const trainersPath = '/edzok/';

export async function openNewTrainer(page: Page): Promise<void> {
  await openEditor(page, 'post-new.php?post_type=trainer');
}

/** What the Trainer does at the club, shown under their name. */
export async function setRole(page: Page, role: string): Promise<void> {
  await page.locator('.acf-field[data-name="trainer_role"] input').fill(role);
}

/**
 * The biography, typed into the first block of the canvas. Typed rather than
 * filled, because a block is a rich text field that only notices real keystrokes.
 */
export async function setBiography(page: Page, biography: string): Promise<void> {
  const appender = canvas(page).locator('.block-editor-default-block-appender__content');

  await appender.click();
  await page.keyboard.type(biography);

  await expect(canvas(page).locator('p[data-type="core/paragraph"]').first()).toHaveText(biography);
}

/** The identifier WordPress gave the Trainer open in the editor. */
function trainerId(page: Page): number {
  const id = new URL(page.url()).searchParams.get('post');

  if (id === null) {
    throw new Error('WordPress saved the Trainer without leaving its identifier in the address.');
  }

  return Number(id);
}

/**
 * The position the Trainer takes in the listing, counting from the top, changed
 * where the Site Owner sees one Trainer's position against the others: the admin
 * list, through Quick Edit. The block editor's sidebar offers no order field.
 */
export async function setOrder(page: Page, order: number): Promise<void> {
  const id = trainerId(page);

  await openAdmin(page, 'edit.php?post_type=trainer');

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
