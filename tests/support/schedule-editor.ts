import { expect, type FrameLocator, type Locator, type Page } from '@playwright/test';
import { openEditor } from './editor';

/**
 * The Schedule, driven the way the Site Owner drives it: they open the page from
 * the site, change a time in the table, and press update.
 *
 * Selectors are WordPress's own class names, never button labels — see ADR-0004.
 */

export const schedulePath = '/edzeseink/';

/**
 * Opens the Schedule in the block editor. The identifier comes from the public
 * page's own body class, so the test never has to know which post WordPress gave
 * the Schedule.
 */
export async function openSchedule(page: Page): Promise<void> {
  await page.goto(schedulePath);

  const classes = (await page.locator('body').getAttribute('class')) ?? '';
  const id = /\bpage-id-(\d+)\b/.exec(classes)?.[1];

  if (id === undefined) {
    throw new Error(`No page is published at ${schedulePath}.`);
  }

  await openEditor(page, `post.php?post=${id}&action=edit`);
}

/**
 * One cell of the Schedule table, addressed the way the Site Owner reads it: the
 * group the row opens with, and the day heading above the column.
 */
export async function cellFor(table: FrameLocator | Page, group: string, day: string): Promise<Locator> {
  const headings = await table.locator('.wp-block-table thead th').allInnerTexts();
  const column = headings.findIndex((heading) => heading.trim() === day);

  if (column < 0) {
    throw new Error(`The Schedule has no ${day} column. It has: ${headings.join(', ')}.`);
  }

  const row = table.locator('.wp-block-table tbody tr').filter({ hasText: group });

  await expect(row).toHaveCount(1);

  return row.locator('td').nth(column);
}

/**
 * Replaces what a table cell holds. Typed rather than filled, because the cell is
 * a rich text field that only notices real keystrokes.
 */
export async function retime(cell: Locator, time: string): Promise<void> {
  await cell.click();
  await cell.press('ControlOrMeta+a');
  await cell.page().keyboard.type(time);
  await expect(cell).toHaveText(time);
}

/** Saves the Schedule, which is already published, so there is no panel to confirm. */
export async function update(page: Page): Promise<void> {
  await page.locator('.editor-post-publish-button__button').click();

  // The snackbar is what the Site Owner sees, and the only signal the editor
  // gives that an update of an already-published page went through.
  await expect(page.locator('.components-snackbar')).toBeVisible();
}
