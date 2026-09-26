# 08: Departments at `/szakosztalyok`

**What to build:** The Site Owner edits each Department's description and image so every sport section
describes itself accurately. A parent reads about each Department and works out which one suits their child.

**Blocked by:** 02, 03.

**Status:** done

- [x] Department is a custom post type resolving at `/szakosztalyok`, matching the existing path exactly
- [x] A Department has a name, a description, and an image
- [x] The Site Owner can edit both description and image without a developer
- [x] Content currently hardcoded in the outgoing React components is authored fresh here
- [x] Owner journey test: sign in as the Site Owner, change a Department description, see it on the public
      page

## Comments

**Implemented.** `web/app/mu-plugins/base-departments.php` registers the Department post type, and the theme
renders the listing (`archive-department.php`, `template-parts/department.php`).

- **A Department is the block editor's own shape, with nothing added.** The name is the title, the
  description is the body, the picture is the featured image, and the order is `page-attributes`' number.
  Unlike a Trainer or a Slide there is no field group at all, so the Site Owner is given nothing to fill in
  beyond the three things a Department is.
- **A Department has one public address.** The content model gives Department `/szakosztalyok` where it gives
  Post and Trainer a `{slug}` as well, so the listing reads each Department in full — picture, name and whole
  description — and a Department's own URL is a 301 to its place on that page. A page per Department would
  have been a second, thinner copy of the same words on a rebuild whose point is to keep the club's search
  rankings. `single-department.php` survives as what a *preview* renders, because a draft is the one thing
  the Site Owner cannot see anywhere else.
- **Pictures alternate sides down the listing**, so that two Departments do not read as one column of
  pictures beside one column of prose. A Department saved without a picture takes the full width rather than
  leaving half the row empty.
- **The order is the Site Owner's.** Strictly the content model names order only for Trainer, but two
  Departments have to appear in *some* order and date-of-writing is not the one the club means. It is the
  same Quick Edit mechanism as Trainers, for the same reason: the admin list is where one Department's
  position can be seen against the others.
- **The initial content is authored, not transferred.** The outgoing `/szakosztalyok` held no Department
  descriptions at all — it was a hardcoded competition-calendar table — so this is new Hungarian prose,
  grounded in the categories the outgoing page and the Schedule already describe. It is installed once, on
  the first request after a deploy that has never had it, so staging and production come up with the club's
  Departments rather than an empty page, and is never written again. **It is the Site Owner's to correct at
  handover.**

**From code review:**

- `CONTEXT.md` lists "section" among the words to avoid for a Department, and the first draft used it
  throughout — a `department-section.php` template part, a `section` variable in the tests, and "the club's
  sport sections" in nine comments. The glossary governs identifiers as much as prose; all of it now says
  Department.
- Per-Department pages were scope the content model had not taken, adding indexable URLs to an
  SEO-sensitive rebuild. They are now the redirect described above.
- The seeding marked itself done *before* doing it, so a request that died halfway would have left the site
  permanently Department-less with no retry. The flag is now written only once every Department is in the
  database, and a `wp_insert_post` failure leaves the next request to try again.
- The "already has a Department" guard used `post_status => 'any'`, which omits the trash — a Site Owner who
  threw both Departments away would have found them back. The statuses are now spelled out.
- `setBody` in the test support could only rewrite a post's *first* paragraph, so the rewrite journey passed
  only because it authored a single-paragraph Department while the shipped ones have two and three. It now
  clears the whole body first, and the test rewrites a two-paragraph description to prove it.

**Judgement calls, recorded rather than taken:**

- **The `pre_get_posts` ordering and the `menu_order` admin column are a third copy** of what
  `base-trainers.php` and `base-slides.php` already hold, and review argued for extracting them. Not done:
  mu-plugins load alphabetically, so a shared helper has to be reached through an `init` deferral that is
  harder to follow than the copies, and the four content types still to come (Document, Sponsor, Video,
  Recommended Page) are not yet known to order by `menu_order` at all. **Extract it when the third full
  copy lands** — the first of issues 09–11 that needs the same three hooks.
- The alternation index is passed to the template part through `get_template_part`'s `$args` rather than
  read from the global query or pushed into an `:nth-child` utility, so the part's one dependency stays
  visible in the call.

**Left for other issues:**

- **The outgoing page's competition calendar is not carried across here.** It was a table of six regulation
  PDFs and two external competition calendars — the PDFs are Documents and belong with issue 09, which moves
  them into the media library; where the club wants the calendar itself to live is a content decision for
  the handover.
- **Nothing links to `/szakosztalyok` yet**, as with `/edzok`. The archive is offered in the menu editor, and
  a deliberate navigation structure belongs with the pages still to come.
- `/szakosztalyok` without a trailing slash is a 301 to `/szakosztalyok/`, the same shape as `/edzok` and
  `/edzeseink`; whether that counts as parity, and the data-driven URL-parity test the spec asks for, are
  issue 13.
