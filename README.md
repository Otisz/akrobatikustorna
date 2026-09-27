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
the ones the site depends on — currently Advanced Custom Fields — on first container start.

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
branch under `public/documents/`. Their URLs (Uniform Resource Locators) change in the move, so redirects
for the ones that receive real traffic are part of the SEO (Search Engine Optimisation) work.

One *page* is created in code too. `base-schedule.php` publishes the Schedule at `/edzeseink` on the first
request after a deploy that has never had one, and holds it at that slug, because the URL (Uniform Resource
Locator) is part of the site's search parity and the Site Owner cannot see a retitled page silently move. Its times are **initial
content**, transferred by hand from the outgoing site and written once — they belong to the Site Owner from
then on, so the file is never read again.

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
