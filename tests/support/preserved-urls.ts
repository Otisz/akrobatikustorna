/**
 * Every public address the outgoing site published, which this site keeps so
 * that search rankings, links and bookmarks survive the rebuild.
 *
 * This is the list a reviewer checks against the outgoing site: it is the whole
 * of `routes/web.php` on the `main` branch, in that file's order, named by the
 * route name Laravel gave each one. Paths are written exactly as the outgoing
 * site published them — without a trailing slash — because that is the form
 * search engines hold and a parent has bookmarked.
 *
 * Two of those routes take a slug and so cannot be listed: `posts.show` at
 * /hirek/{slug} and `trainer.show` at /edzok/{slug}. There is no address until
 * something is published at one, so `url-parity.spec.ts` publishes a Post and a
 * Trainer and asks for theirs.
 */
export const preservedUrls = [
  { path: '/', route: 'home' },
  { path: '/dokumentumok', route: 'documents.index' },
  { path: '/szakosztalyok', route: 'departments.index' },
  { path: '/edzeseink', route: 'schedule.index' },
  { path: '/kapcsolat', route: 'contact.index' },
  { path: '/ajanlott-oldalak', route: 'recommended-page.index' },
  { path: '/galeria', route: 'gallery.index' },
  { path: '/hirek', route: 'posts.index' },
  { path: '/edzok', route: 'trainer.index' },
  { path: '/jelentkezes', route: 'apply.index' },
] as const;
