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

- Site: <http://localhost:8080>
- Admin: <http://localhost:8080/wp/wp-admin> — `admin` / `admin`

Run WP-CLI (WordPress Command Line Interface) against the local site with:

```sh
docker compose exec php wp <command>
```

## Layout

| Path | Contains |
| --- | --- |
| `config/` | WordPress configuration, outside the document root |
| `web/` | The document root |
| `web/wp/` | WordPress core, installed by Composer, not in version control |
| `web/app/` | Themes, plugins, uploads (`wp-content` by another name) |
| `docker/` | Container definitions for the local environment |

## Dependencies

WordPress core and every plugin are pinned to explicit versions in `composer.json` and updated by pull
request. The admin's own install and update screens are removed, because anything installed through them
would be discarded by the next deploy. Core *minor* releases still auto-update, since those are security
releases; the pin is then raised to match.
