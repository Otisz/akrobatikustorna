# 04: News Posts at `/hirek/{slug}`

**What to build:** The Site Owner writes, edits, and deletes news Posts, attaches a featured image, and
schedules a Post to publish at a future date. Visitors read a Post at `/hirek/{slug}` — the same URL a search
engine already gave them — and see the most recent Posts on the home page, so a parent can judge whether the
club is active and well run.

**Blocked by:** 02, 03.

**Status:** ready-for-agent

- [ ] Posts use a permalink structure that resolves at `/hirek/{slug}`, matching the existing news path
      exactly
- [ ] A Post accepts a featured image, shown in listings and on the home page
- [ ] A Post can be scheduled for a future date and appears publicly only once that date passes
- [ ] The Site Owner can preview a Post before publishing it
- [ ] The home page shows recent Posts
- [ ] Owner journey test: sign in as the Site Owner, publish a Post with a featured image, see it on the home
      page and at its own URL
