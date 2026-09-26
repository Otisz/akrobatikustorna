# 13: SEO metadata, URL parity, and Document redirects

**What to build:** Every public page URL from the outgoing site resolves on the new site, so existing search
rankings, links, and bookmarks survive the change. Titles and meta descriptions carry across the existing SEO
work. Document files, whose URLs necessarily changed when they moved into the media library, redirect for the
files that analytics show receive real traffic — not for all of them.

The URL parity test is the cheapest possible guard on the SEO work and the easiest thing to break silently.

**Blocked by:** 04, 05, 06, 07, 08, 09, 10, 11, 12.

**Status:** ready-for-agent

- [ ] An SEO plugin is installed, pinned, and the Site Owner can set a title and meta description per page
- [ ] A data-driven test asserts every preserved public URL resolves successfully
- [ ] The preserved URL list is a single readable source a reviewer can check against the outgoing site
- [ ] A redirection plugin is installed and pinned
- [ ] Moved Document files with real traffic, identified from analytics, redirect to their new media library
      URLs
