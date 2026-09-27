import { test, expect } from '@playwright/test';
import { openEditor, publish, setBody, setTitle, trash } from '../support/editor';
import { searchMetadata, setSearchDescription, setSearchTitle } from '../support/seo';
import { asVisitor } from '../support/visitor';

/**
 * What a page looks like in search results is the club's own to write, and the
 * outgoing site's wording is carried across by hand. This test follows that
 * journey: the Site Owner writes a title and a sentence beside the page itself,
 * and a search engine reads exactly those off the published page.
 */

test('the title and description the Site Owner writes are the ones a search engine reads', async ({
  page,
  browser,
}) => {
  const run = Date.now() % 100000;
  const title = `Táborok ${run}`;
  const searchTitle = `Nyári akrobatikus tábor ${run}`;
  const searchDescription = `Egyhetes nyári tábor kezdő és haladó tornászoknak ${run}.`;

  await openEditor(page, 'post-new.php?post_type=page');
  await setTitle(page, title);
  await setBody(page, 'A tábor részletei hamarosan.');

  await setSearchTitle(page, searchTitle);
  await setSearchDescription(page, searchDescription);

  const url = await publish(page);
  const editorUrl = page.url();

  // Cleaned up even when an assertion fails, so a run leaves no page behind.
  try {
    const visitor = await asVisitor(browser);

    try {
      const published = await visitor.newPage();

      await published.goto(url);

      const metadata = await searchMetadata(published);

      // The club's own wording, not the page's heading and not its first
      // sentence: both of those say something else here, so a pass means the
      // fields were read rather than guessed at.
      expect(metadata.title).toContain(searchTitle);
      expect(metadata.description).toBe(searchDescription);
    } finally {
      await visitor.close();
    }
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});
