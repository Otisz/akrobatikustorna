import { expect, type Page } from '@playwright/test';

/**
 * The SEO (Search Engine Optimisation) fields, driven the way the Site Owner
 * drives them: the panel the plugin adds below the content, on the same editing
 * screen the page itself is written on.
 *
 * Selectors are the plugin's own field names, never button labels — see
 * ADR-0004.
 */

/**
 * Writes over one of the two fields, and checks that what is left in it is only
 * what was written.
 *
 * The description opens carrying `{{ post.auto_description }}` — the plugin's
 * own note of what it would fall back to, which the Site Owner types over — and
 * that arrives a moment after the screen does. Typing before it lands leaves
 * both, and a search engine then reads the page's first sentence with the club's
 * own tacked on the end. Written again rather than waited for, because the title
 * field beside it opens empty and there is nothing there to wait for.
 */
async function setField(page: Page, field: string, value: string): Promise<void> {
  const input = page.locator(`[name="slim_seo[${field}]"]`);

  await expect(async () => {
    await input.fill(value);
    await expect(input).toHaveValue(value);
  }).toPass();
}

/**
 * The title a search engine shows. Left as it opens, the plugin writes one from
 * the page's own title; filled, this is what is published instead.
 */
export async function setSearchTitle(page: Page, title: string): Promise<void> {
  await setField(page, 'title', title);
}

/** The sentence under it in the results, which the page's text otherwise supplies. */
export async function setSearchDescription(page: Page, description: string): Promise<void> {
  await setField(page, 'description', description);
}

/** What a search engine reads off the published page: its title and that sentence. */
export async function searchMetadata(page: Page): Promise<{ title: string; description: string }> {
  const description = page.locator('head meta[name="description"]');

  await expect(description).toHaveCount(1);

  return {
    title: await page.title(),
    description: (await description.getAttribute('content')) ?? '',
  };
}
