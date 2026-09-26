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
| `tests/support/` | Signing in as the Site Owner, and driving the block editor |

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

## The theme

`web/app/themes/base` is a classic PHP-template theme. `theme.json` defines the palette and the type scale,
which is how the block editor and the published page stay identical; Tailwind, compiled by Vite, handles
layout and the header, footer and page chrome. See `docs/adr/0003-theme-json-owns-typography-and-colour.md`.

Built assets live in `web/app/themes/base/build/` and are **not** in version control, so every deploy must
run the build step before the site is served.
