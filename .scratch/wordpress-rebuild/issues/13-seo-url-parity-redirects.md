# 13: SEO metadata, URL parity, and Document redirects

**What to build:** Every public page URL from the outgoing site resolves on the new site, so existing search
rankings, links, and bookmarks survive the change. Titles and meta descriptions carry across the existing SEO
work. Document files, whose URLs necessarily changed when they moved into the media library, redirect for the
files that analytics show receive real traffic — not for all of them.

The URL parity test is the cheapest possible guard on the SEO work and the easiest thing to break silently.

**Blocked by:** 04, 05, 06, 07, 08, 09, 10, 11, 12.

**Status:** done

- [x] An SEO plugin is installed, pinned, and the Site Owner can set a title and meta description per page —
      Slim SEO 4.10.1, pinned in `composer.json`, activated with its Hungarian translation by
      `entrypoint.sh` and narrowed by `base-seo.php` to the content that has a page of its own. Chosen over
      The SEO Framework, which is the better plugin but has no Hungarian at all. Recorded as ADR-0007
- [x] A data-driven test asserts every preserved public URL resolves successfully — `url-parity.spec.ts`,
      including the two slug routes, which it publishes a Post and a Trainer to reach
- [x] The preserved URL list is a single readable source a reviewer can check against the outgoing site —
      `tests/support/preserved-urls.ts`, the whole of `routes/web.php` on `main`, by route name
- [x] A redirection plugin is installed and pinned — Slim SEO's own redirection module, rather than a second
      plugin. Administrator-only settings, and a per-post redirect field in Hungarian beside the SEO fields
- [x] Moved Document files with real traffic, identified from analytics, redirect to their new media library
      URLs — by name rather than from a list, and not through the redirection module. A request under the
      outgoing `/documents/` path 301s to whichever file a published Document now offers under that name, so
      the files that redirect are exactly the ones the Site Owner transferred — which is the judgement
      analytics was going to inform, made by the person who has it to make. Recorded as ADR-0008

## Comments

**Deviation from the plan, for the spec owner to confirm.** The plan named a separate redirection plugin
holding a hand-written redirect per file, chosen from analytics. No analytics report was consulted: the
mechanism makes the question moot, because the Site Owner's decision to transfer a form *is* the decision a
traffic report was going to inform, and a form nobody transferred 404s. If the club would rather have the
literal list, the analytics export is the only missing input.
