import { test, expect } from '@playwright/test';
import { permalink, save, trash } from '../support/classic-editor';
import { documentsPath, openNewDocument, setFile, setName } from '../support/document-editor';
import { openNewPost, publish, setTitle, trash as editorTrash } from '../support/editor';
import { openNewTrainer, setBiography, setRole } from '../support/trainer-editor';
import { preservedUrls } from '../support/preserved-urls';
import { asVisitor } from '../support/visitor';

/** The name the outgoing site served a form under, which is the upload's own. */
const legacyFile = 'document-first.pdf';

/**
 * The rebuild keeps every address the outgoing site published. Nothing on the
 * screen says when one stops resolving — a permalink or a rewrite slug changed
 * in passing takes a page's search ranking with it, silently — so each one is
 * asked for here, as a search engine asks: signed out, and at the address the
 * outgoing site published rather than the one this site prefers.
 */

for (const { path, route } of preservedUrls) {
  test(`${path} still resolves, as the outgoing site's ${route}`, async ({ browser }) => {
    const visitor = await asVisitor(browser);

    try {
      // Redirects are followed, because arriving at /dokumentumok/ from
      // /dokumentumok is WordPress tidying the address rather than the page
      // having moved. What must not happen is arriving nowhere.
      const response = await visitor.request.get(path);

      expect(response.status()).toBe(200);

      // And arriving at the page asked for: a redirect to the home page or to a
      // search results screen is a 200 that has still lost the page.
      expect(new URL(response.url()).pathname.replace(/\/$/, '')).toBe(path.replace(/\/$/, ''));
    } finally {
      await visitor.close();
    }
  });
}

/**
 * The club's forms are the one address the rebuild could not keep: the files
 * moved into the media library, so the outgoing site's `/documents/` path is
 * gone. What a parent who saved a link to a form arrives at instead is the file
 * itself, at wherever the Site Owner's own upload put it.
 */
test("a form's address on the outgoing site still reaches the form", async ({ page, browser }) => {
  const name = `Házirend ${Date.now()}`;

  await openNewDocument(page);
  await setName(page, name);
  await setFile(page, 'document-first');

  await save(page);

  const editorUrl = page.url();

  // Cleaned up even when an assertion fails, so a run leaves no Document behind.
  try {
    const visitor = await asVisitor(browser);

    try {
      // The address as the outgoing site published it, asked for the way a search
      // engine follows a stale result: nothing about this site's own paths.
      const moved = await visitor.request.get(`/documents/${legacyFile}`, { maxRedirects: 0 });

      // Permanent, because the file is not coming back — which is what carries
      // the club's ranking to the new address rather than splitting it.
      expect(moved.status()).toBe(301);
      expect(moved.headers().location).toContain('/app/uploads/');
      expect(moved.headers().location).toContain('document-first');

      // And the file is really served there, rather than the redirect pointing at
      // a second 404.
      const file = await visitor.request.get(`/documents/${legacyFile}`);

      expect(file.status()).toBe(200);
      expect(file.headers()['content-type']).toContain('pdf');
    } finally {
      await visitor.close();
    }
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});

test('an address under /documents/ that names no form is still a 404', async ({ browser }) => {
  const visitor = await asVisitor(browser);

  try {
    // The club had some two dozen files on the outgoing site and transferred the
    // ones still worth having. The rest are retired forms, and a retired form is
    // gone rather than redirected somewhere unhelpful.
    const response = await visitor.request.get('/documents/nincs-ilyen-urlap.pdf');

    expect(response.status()).toBe(404);
  } finally {
    await visitor.close();
  }
});

/**
 * Two of the outgoing site's addresses take a slug, so they cannot be listed
 * beside the rest: there is no address until something is published at one. Both
 * are asked for here the same way — at the form the outgoing site published,
 * without the trailing slash WordPress prefers.
 */
test('a Post and a Trainer resolve at the paths the outgoing site published them under', async ({
  page,
  browser,
}) => {
  const run = Date.now();
  const published: Array<{ url: string; editorUrl: string }> = [];

  try {
    await openNewPost(page);
    await setTitle(page, `Hír ${run}`);
    published.push({ url: await publish(page), editorUrl: page.url() });

    await openNewTrainer(page);
    await setTitle(page, `Edző ${run}`);
    await setRole(page, 'edző');
    await setBiography(page, 'Tíz éve tanít.');
    published.push({ url: await publish(page), editorUrl: page.url() });

    const visitor = await asVisitor(browser);

    try {
      for (const { url } of published) {
        const path = new URL(url).pathname;
        const response = await visitor.request.get(path.replace(/\/$/, ''));

        expect(response.status()).toBe(200);
        expect(new URL(response.url()).pathname).toBe(path);
      }

      // The paths themselves, so that a permalink structure quietly rewritten to
      // WordPress's own default fails here rather than at the club's expense.
      expect(published.map(({ url }) => new URL(url).pathname)).toEqual([
        expect.stringMatching(/^\/hirek\/[^/]+\/$/),
        expect.stringMatching(/^\/edzok\/[^/]+\/$/),
      ]);
    } finally {
      await visitor.close();
    }
  } finally {
    for (const { editorUrl } of published) {
      await page.goto(editorUrl);
      await editorTrash(page);
    }
  }
});

/**
 * What the club offers a search engine is the listings, not the entries in them.
 * A Document, Video, Department and Recommended Page each redirect from their
 * own address to their listing, so putting them in the sitemap would hand a
 * search engine a page of addresses that all answer with a redirect —
 * `base-seo.php` leaves them out, and this is where that stays true across a
 * plugin update.
 */
test('the sitemap offers the listings rather than the entries that redirect to them', async ({
  page,
  browser,
}) => {
  const name = `Szabályzat ${Date.now()}`;

  await openNewDocument(page);
  await setName(page, name);
  await setFile(page, 'document-first');

  await save(page);

  const editorUrl = page.url();
  const url = await permalink(page);

  try {
    const visitor = await asVisitor(browser);

    try {
      const index = await visitor.request.get('/sitemap.xml');

      expect(index.status()).toBe(200);

      const children = [...(await index.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
        ([, loc]) => loc
      );

      expect(children.length).toBeGreaterThan(0);

      const listed: string[] = [];

      for (const child of children) {
        const sitemap = await visitor.request.get(child);

        expect(sitemap.status()).toBe(200);
        listed.push(
          ...[...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc)
        );
      }

      const paths = listed.map((loc) => new URL(loc).pathname);

      expect(paths).toContain(documentsPath);
      expect(paths).not.toContain(new URL(url).pathname);
    } finally {
      await visitor.close();
    }
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});
