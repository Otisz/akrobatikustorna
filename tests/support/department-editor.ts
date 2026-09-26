import { type Page } from '@playwright/test';
import { openEditor, setBody, setOrder as setPostOrder } from './editor';

/**
 * The Department editing screen, driven the way the Site Owner drives it. A
 * Department is its name, its description and its picture and nothing else, so
 * every part of it is the block editor's own: the title, the body, and the
 * featured image in the sidebar. There is no field group to fill in.
 *
 * Selectors are WordPress's own class names, never button labels — see ADR-0004.
 */

export const departmentsPath = '/szakosztalyok/';

const departmentPostType = 'department';

export async function openNewDepartment(page: Page): Promise<void> {
  await openEditor(page, `post-new.php?post_type=${departmentPostType}`);
}

/** What the club does in this Department, which is its body. */
export async function setDescription(page: Page, ...paragraphs: string[]): Promise<void> {
  await setBody(page, ...paragraphs);
}

/** The position the Department takes in the listing, counting from the top. */
export async function setOrder(page: Page, order: number): Promise<void> {
  await setPostOrder(page, departmentPostType, order);
}
