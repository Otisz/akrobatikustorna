import { type Page } from '@playwright/test';
import { openEditor, setBody, setOrder as setPostOrder } from './editor';

/**
 * The Trainer editing screen, driven the way the Site Owner drives it. A Trainer
 * has a biography, so WordPress opens the block editor: a portrait in the
 * sidebar, a role beside it, an order, and the biography in the canvas.
 *
 * Selectors are WordPress's own class names, never button labels — see ADR-0004.
 */

export const trainersPath = '/edzok/';

const trainerPostType = 'trainer';

export async function openNewTrainer(page: Page): Promise<void> {
  await openEditor(page, `post-new.php?post_type=${trainerPostType}`);
}

/** What the Trainer does at the club, shown under their name. */
export async function setRole(page: Page, role: string): Promise<void> {
  await page.locator('.acf-field[data-name="trainer_role"] input').fill(role);
}

/** The biography, which is the Trainer's body. */
export async function setBiography(page: Page, ...paragraphs: string[]): Promise<void> {
  await setBody(page, ...paragraphs);
}

/** The position the Trainer takes in the listing, counting from the top. */
export async function setOrder(page: Page, order: number): Promise<void> {
  await setPostOrder(page, trainerPostType, order);
}
