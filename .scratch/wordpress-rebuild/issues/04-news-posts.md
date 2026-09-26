# 04: News Posts at `/hirek/{slug}`

**What to build:** The Site Owner writes, edits, and deletes news Posts, attaches a featured image, and
schedules a Post to publish at a future date. Visitors read a Post at `/hirek/{slug}` — the same URL a search
engine already gave them — and see the most recent Posts on the home page, so a parent can judge whether the
club is active and well run.

**Blocked by:** 02, 03.

**Status:** done

- [x] Posts use a permalink structure that resolves at `/hirek/{slug}`, matching the existing news path
      exactly
- [x] A Post accepts a featured image, shown in listings and on the home page
- [x] A Post can be scheduled for a future date and appears publicly only once that date passes
- [x] The Site Owner can preview a Post before publishing it
- [x] The home page shows recent Posts
- [x] Owner journey test: sign in as the Site Owner, publish a Post with a featured image, see it on the home
      page and at its own URL

## Comments

Implemented on the `wordpress` branch.

- The permalink structure is declared in code (`web/app/mu-plugins/base-permalinks.php`) rather than left in
  the database, because the Site Owner cannot reach the permalink screen and a fresh install would otherwise
  come up with plain permalinks. The mu-plugin also rebuilds the cached rewrite rules whenever the declared
  structure changes, so a deploy is enough.
- The listing card moved to `template-parts/post-card.php`, shared by the news listing and the new home page
  news section.
- `tests/specs/site-owner-publishes.spec.ts` grew into `tests/specs/news-posts.spec.ts` rather than being
  duplicated — its round trip is the first of this ticket's three tests.
- The featured-image helper reuses whatever the media library already holds and uploads
  `tests/fixtures/featured-image.jpg` only when it is empty, so a run does not add an image every time.
- Code review raised two things left for later: the structure is trailing-slashed, so if the outgoing site
  served `/hirek/{slug}` without a slash the parity is a 301 rather than an identical path — that belongs to
  13; and the three tests repeat the same open-title-cleanup shape, which a Playwright fixture could carry
  once there are more of them.
