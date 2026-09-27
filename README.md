# Budai Akrobatikus Sport Egyesület

The club's public website: WordPress managed as a [Roots Bedrock](https://roots.io/bedrock/) project.

See `CONTEXT.md` for the domain glossary and `docs/adr/` for the decisions behind this shape.

## Local development

Requires Docker only — nothing is installed on the host.

```sh
docker compose up
```

The first run installs dependencies, generates `.env` with fresh salts, creates the database, and
installs WordPress in Hungarian. It takes a few minutes; subsequent runs are immediate.

The `node` container rebuilds the theme's CSS (Cascading Style Sheets) and JavaScript whenever a file
changes, so `docker compose up` is all that is needed while working on the theme. To build once:

```sh
docker compose run --rm --no-deps node npm run build
```

- Site: <http://localhost:8080>
- Admin: <http://localhost:8080/wp/wp-admin> — `admin` / `admin`
- Mail: <http://localhost:8025> — everything the site sends, delivered nowhere

The admin also holds an `owner` / `owner` account with the **Editor** role, which is the Site Owner's own
access: it can edit every kind of content but cannot reach templates, plugins or site configuration. Use it
to see the admin as the Site Owner sees it.

Run WP-CLI (WordPress Command Line Interface) against the local site with:

```sh
docker compose exec php wp <command>
```

## Tests

```sh
docker compose run --rm playwright
```

The suite is Playwright browser tests run in a container, so nothing is installed on the host. Each test
signs in as the Site Owner, changes something in the admin, and asserts the outcome on the public page —
this is the project's only testing seam. See
`docs/adr/0004-browser-tests-are-the-only-testing-seam.md`.

The site must already be up (`docker compose up`). That command installs the suite's own dependencies on
first use; afterwards a single file can be run, or the tests typechecked:

```sh
docker compose run --rm playwright npx playwright test site-owner-role
docker compose run --rm playwright npm run typecheck
```

Failures leave a trace and an HTML (HyperText Markup Language) report under `tests/`, neither in version
control.

| Path | Contains |
| --- | --- |
| `tests/specs/` | One file per behaviour under test |
| `tests/support/` | Signing in as the Site Owner, and driving the editing screens |
| `tests/fixtures/` | Images the tests attach, uploaded once and then reused from the media library |

## Layout

| Path | Contains |
| --- | --- |
| `config/` | WordPress configuration, outside the document root |
| `web/` | The document root |
| `web/wp/` | WordPress core, installed by Composer, not in version control |
| `web/app/` | Themes, plugins, uploads (`wp-content` by another name) |
| `web/app/themes/base/` | The club's theme |
| `docker/` | Container definitions for the local environment |
| `tests/` | The browser test suite |

## Dependencies

WordPress core and every plugin are pinned to explicit versions in `composer.json` and updated by pull
request. The admin's own install and update screens are removed, because anything installed through them
would be discarded by the next deploy. Core *minor* releases still auto-update, since those are security
releases; the pin is then raised to match.

Whether a plugin is *active* is a database fact rather than a file, so `docker/php/entrypoint.sh` activates
the ones the site depends on on first container start.

| Plugin | Supplies |
| --- | --- |
| Advanced Custom Fields (free) | The structured fields each content type is built from |
| Slim SEO | The title and description a search engine shows, and a redirection module |
| Cookie Notice | The consent a visitor gives before analytics loads |
| WP Mail SMTP | The transport that carries a password reset to the Site Owner |

The plugin list is deliberately short: each addition is a thing the Site Owner can trip over and the
developer must maintain, so anything beyond it needs a reason written down.

## Content types

Post types and their fields are registered in `web/app/mu-plugins/`, not in the theme, so that the club's
content outlives any theme and cannot be deactivated from the admin. See
`docs/adr/0005-content-types-are-registered-in-must-use-plugins.md`.

| Post type | Admin label | Shape |
| --- | --- | --- |
| `slide` | Diák | The home page carousel: image, caption, optional link, in the Site Owner's own order |
| `trainer` | Edzők | The club's coaches at `/edzok`: portrait, role, biography, in the Site Owner's own order |
| `department` | Szakosztályok | The club's Departments at `/szakosztalyok`: picture, description, in the Site Owner's own order |
| `document` | Dokumentumok | The club's forms and regulations at `/dokumentumok`: a title and a file, listed by name |
| `video` | Galéria | The club's YouTube recordings at `/galeria`: a title and a pasted link, newest first |
| `sponsor` | Támogatók | The club's Sponsors, credited on the home page: a name, a logo and their own address |
| `recommended_page` | Ajánlott oldalak | The club's outbound links at `/ajanlott-oldalak`: a name and an address, listed by name |

A Trainer's order is changed through Quick Edit in the admin list, which prints each Trainer's number in a
column of its own: the block editor's sidebar no longer offers the order field, and the list is where one
Trainer's position can be seen against the others.

A Department's order is changed the same way, and for the same reason. Unlike a Trainer, a Department has
one public address: it is read in full on `/szakosztalyok`, and its own URL is a redirect to its place on
that page, so the rebuild adds no second copy of the same words for a search engine to choose between.
`single-department.php` is therefore only what the Site Owner previews a draft against.

The club's two Departments are written in `base-departments.php` and published on the first request after a
deploy that has never had them, so that staging and production come up with them rather than an empty page —
**initial content**, like the Schedule's times, never written again and skipped entirely where a Department
already exists. The outgoing site held no Department descriptions at all, so this text is authored rather
than transferred, and is the Site Owner's to correct.

A Document is a title and a file in the media library, and nothing else — no order to maintain, because the
listing is alphabetical and a form a parent came for is looked up by name. Its own URL redirects to the
listing for the same reason a Department's does, and no preview is exempted from that redirect: unlike a
Department's prose, a Document draft is a file the editing screen already names, sizes and links to. The
file field is required, so a Document that downloads nothing cannot be published, and one whose file is
deleted from the media library afterwards drops off the listing rather than linking to nothing. The admin
list prints each Document's file name, which is where either case becomes visible.

The club's own Documents are **not** written in code, unlike the Departments and the Schedule: their files
are real and are transferred by hand into the media library. The outgoing site's copies are on the `main`
branch under `public/documents/`. Their URLs (Uniform Resource Locators) change in the move, and the outgoing
addresses are carried across by name — see **Search engines** below.

A Video is a title and a link pasted from YouTube. The address is reduced to YouTube's own identifier where
the meta is stored, so a watch link, a `youtu.be` link, an embed, a Short or a live stream all name the same
recording, and a timestamp or tracking parameter is discarded; the editing screen shows the canonical watch
address back, so the Site Owner can see which recording the site understood. An address with no recording in
it is refused at the screen, and the admin list prints each Video's identifier as a link to it. Its own URL
redirects to the gallery for the same reason a Document's does, and the gallery is newest first — the
competition a parent came to watch is the one that just happened, so there is no order to maintain.

Nothing about embeds is asked of the Site Owner, and nothing is loaded from YouTube until a visitor presses
play: the gallery renders the recording's own thumbnail under a play control, and `resources/js/app.js`
swaps in the player in place, on the no-cookie host. Without JavaScript that control is an ordinary link to
YouTube rather than a dead button.

A Sponsor is a name, a logo and the organisation's own address. It has no public URL at all — unlike a Document
or a Video, whose own address redirects to their listing — because the only address a visitor wants here is
the Sponsor's own, and a Sponsor is seen solely among the credits that close the home page. The address field
is required, so a logo cannot be published leading nowhere; the logo is the featured image, which cannot be
required, so a Sponsor saved before its logo arrived is left out of the credits rather than shown as a blank
space with a name under it. The admin list prints each Sponsor's logo and address, which is where either case
becomes visible. Credits are alphabetical: the club credits its Sponsors as equals, which also leaves the Site
Owner no order to maintain.

A Recommended Page is a name and an address, and nothing else. The listing is alphabetical for the same
reason a Document's is — the list is scanned for a name — and each row opens in a new tab, as the outgoing
site's did, because the visitor is being sent somewhere the club does not own. Its own URL redirects to the
listing rather than to the organisation's site, which would hand this site's address to a page it does not
own.

The club's own Sponsors and Recommended Pages are **not** written in code: the logos are the Sponsors' own
property and the links are the Site Owner's to keep current. The outgoing site's copies are on the `main`
branch under `resources/js/data/sponsors.ts` and in the `recommended_pages` table.

Three *pages* are created in code too. `base-pages.php` publishes a structural page on the first request
after a deploy that has never had one and holds it at its slug, because the URLs (Uniform Resource Locators)
are part of the site's search parity and the Site Owner cannot see a retitled page silently move. What each
page opens with is **initial content**, transferred by hand from the outgoing site and written once — the
words belong to the Site Owner from then on, so the files are never read again.

| Page | Declared in | Opens with |
| --- | --- | --- |
| `/edzeseink` | `base-schedule.php` | The club's weekly training times, as a table |
| `/kapcsolat` | `base-contact.php` | A short introduction; the details themselves come from the options below |
| `/jelentkezes` | `base-apply.php` | The address of the club's Google Form, on a line of its own |

The club's contact details — two telephone numbers, two email addresses, the postal address, the venue and
its map — are **site options**, edited on one admin screen and shown both on `/kapcsolat` and in the footer
of every page, so that changing a number is never editing a page. They are options rather than a content
type or page fields, on a menu page gated on `edit_pages` rather than in the Customizer, because there is one
set of them and the Site Owner holds the Editor role. The club's real details are registered defaults, so a
fresh install comes up with them; the first save makes them the Site Owner's. See
`docs/adr/0006-contact-details-are-site-options-on-an-editor-reachable-screen.md`.

Applications go through the club's Google Form, as they always have. `base-google-forms.php` turns a Google
Form's own address, pasted on a line of its own, into the form — so the Apply page carries one, and so the
Site Owner can put a signup or a survey in a page of their own making without being asked to understand
embeds or to write an `iframe` in a Custom HTML block. Google publishes no oEmbed service for Forms, so this
handler is what there is to discover. How tall a form is cannot be measured from this page — the frame is
another origin — so a form is given a height long enough for most of one and scrolls within itself beyond
that.

What the Site Owner pastes has to be the form's own `docs.google.com/forms/…/viewform` address, which is
what Google's Send dialog offers by default; the shortened `forms.gle` link is a redirect this site cannot
resolve, and stays an ordinary link. Pasting the address rather than typing it makes the editor turn it into
an embed block, which it then shows as "could not be embedded" — the published page carries the form either
way, and both routes are covered in `tests/specs/contact-and-apply.spec.ts`.

## Search engines

**Every public address the outgoing site published resolves on this one.** That is what the rebuild spends
its URL (Uniform Resource Locator) decisions on: the permalink structure in `base-permalinks.php`, a rewrite
slug per content type, and the structural pages held at their slugs by `base-pages.php`. The list of those
addresses is `tests/support/preserved-urls.ts` — the whole of `routes/web.php` on the `main` branch, named by
the route name Laravel gave each one, which is what a reviewer checks against the outgoing site.
`tests/specs/url-parity.spec.ts` asks for every one of them, signed out and at the address as published, and
is the cheapest guard the SEO (Search Engine Optimisation) work has. The two addresses that take a slug,
`/hirek/{slug}` and `/edzok/{slug}`, cannot be listed beside the rest — there is no address until something
is published at one — so the same spec publishes a Post and a Trainer and asks for theirs.

Titles and descriptions come from **Slim SEO**, chosen because it speaks Hungarian — the better-built
alternative, The SEO Framework, has no Hungarian translation at all, and these are the two fields the Site
Owner reads every time they publish a page. See
`docs/adr/0007-the-seo-plugin-is-chosen-for-speaking-hungarian.md`. Its own translation is installed by
`entrypoint.sh` beside the core one. Nothing needs configuring: the plugin writes a title, a description, a
canonical address and the social tags from the page itself, and its settings screen asks for `manage_options`,
so the Site Owner never sees it. What they do see is a panel below the page they are writing, where a title
and a description can be typed for that page alone.

`base-seo.php` narrows the plugin to the content that has a page of its own. A Document, Video, Department and
Recommended Page each redirect from their own address to their listing, so a search engine never indexes one
on its own: those get no SEO fields, no column in their admin list, and no entry in the sitemap. Their
*listings* stay in it, and they are the site's substance.

The club's form **files** are the one address the rebuild could not preserve, because the files moved into
the media library. `base-document-redirects.php` catches a request under the outgoing site's `/documents/`
path and sends it, permanently, to whichever file a published Document now offers under that name; a form
nobody transferred 404s, which is the club retiring it. There is no list of redirects, and the SEO plugin's
own redirection module is left for the addresses nobody foresaw — see
`docs/adr/0008-moved-document-files-redirect-by-name-rather-than-by-a-list.md`.

## Mail

**The site's mail goes out over SMTP (Simple Mail Transfer Protocol) through the club's own Gmail mailbox**,
because the one email this site really sends is a password reset and the Site Owner has no other way back in.
The server's own transport fails silently at both ends. See
`docs/adr/0010-mail-goes-over-smtp-because-a-lost-password-reset-is-a-lockout.md`.

`SMTP_HOST`, `SMTP_PORT`, `SMTP_ENCRYPTION`, `SMTP_USER`, `SMTP_PASSWORD` and `MAIL_FROM` come from `.env`;
the password is a Gmail app password and is set by hand on each deployed environment. **WP Mail SMTP** reads
them as constants defined in `config/application.php` in preference to its own settings screen, so the
transport survives a fresh install with nobody opening a setup wizard. What the mail looks like — the club as
the sender, under the site's own title — is filtered over the plugin's options in `base-mail.php`, the way
`base-analytics.php` configures the consent banner.

Locally the mailbox is **Mailpit**, a `compose.yaml` service that accepts everything, delivers nothing and
shows what was sent at <http://localhost:8025>. The PHP container has no sendmail binary, so mail that arrives
there went over SMTP rather than falling back to something else.
`tests/specs/password-reset.spec.ts` walks the whole journey: ask for a reset at the login screen, read the
email out of Mailpit, follow the link, sign in with the new password.

## Analytics

The club measures its site with the **same PostHog property the outgoing site used**, so that the figures
either side of the cutover can be compared — which is what makes it possible to tell whether the rebuild
helped. `POSTHOG_KEY` and `POSTHOG_HOST` come from `.env`; without both, nothing is printed at all.

**A visitor is asked first, and declining means something.** `base-analytics.php` prints the PostHog snippet
only once **Cookie Notice** reports that the visitor agreed, so a visitor who has not answered and a visitor
who declined are served a page with no analytics code in it and make no analytics request. Deciding this on
the server rather than trusting the plugin's in-browser script blocker is the whole point — see
`docs/adr/0009-analytics-is-printed-by-the-server-only-after-consent.md`. The price is that agreeing reloads
the page, because the answer is acted on by the next response.

What the banner asks and how it behaves is filtered over the plugin's own settings in `base-analytics.php`,
not stored in the database, so it survives a fresh install and needs nobody to open a settings screen. The
footer carries a *Süti beállítások* link that reopens the banner, shown once an answer has been given.

Locally both values fall back to a property at `analytics.invalid`, which resolves nowhere, so the gate can be
exercised without a developer's clicks landing in the club's figures.
`tests/specs/consent-analytics.spec.ts` watches the network for that host: nothing before consent, nothing
after a refusal, and the request on the wire once a visitor agrees.

## The theme

`web/app/themes/base` is a classic PHP-template theme. `theme.json` defines the palette and the type scale,
which is how the block editor and the published page stay identical; Tailwind, compiled by Vite, handles
layout and the header, footer and page chrome. See `docs/adr/0003-theme-json-owns-typography-and-colour.md`.

Tables are the Schedule's shape, so the theme gives every table cell the heading of its column
(`inc/table.php`) and stacks the table into a card per row below 64rem, where seven columns of training
times would otherwise have to be scrolled sideways. The shape of a table is the one thing besides the fonts
that `editor.css` carries into the block editor, so the Site Owner composes the Schedule in what a visitor
will read.

Built assets live in `web/app/themes/base/build/` and are **not** in version control, so every deploy must
run the build step before the site is served.
