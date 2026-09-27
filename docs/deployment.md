# Deploying

The site runs on the club's existing VPS (Virtual Private Server), managed by **Laravel Forge**, as a new
site alongside the outgoing Laravel one. A deploy is Forge pulling the `wordpress` branch and running
[`deploy.sh`](../deploy.sh), which installs the pinned dependencies, builds the theme's assets and settles
the handful of facts that live in the database rather than in the checkout.

Why deploys update one directory in place rather than building into a release, and why WP-CLI (WordPress
Command Line Interface) is a production dependency, is in
[ADR-0011](adr/0011-deploys-are-in-place-so-the-uploads-directory-is-left-alone.md). Read it before changing
anything on this page: one of the settings below destroys the club's media if it is turned on.

## What the server needs

| | |
| --- | --- |
| PHP | 8.4, with the `gd`, `zip`, `intl`, `exif`, `mysqli`, `pdo_mysql` and `opcache` extensions |
| MySQL | 8.x, matching `compose.yaml` |
| Node | 22, for the theme's asset build |

`upload_max_filesize` and `post_max_size` are raised to **64M** in Forge's PHP settings, and
`client_max_body_size 64M` added to the site's nginx configuration, matching `docker/php/php.ini` and
`docker/nginx/default.conf`. Without both, the Site Owner uploading a scanned form gets an error no page
explains.

## Creating the site in Forge

1. **New site.** Domain: a temporary one, `uj.akrobatikustorna.hu` say — the club's own domain belongs to
   the Laravel site until the cutover, and two Forge sites cannot hold one domain. **Web directory: `/web`**
   — Bedrock serves from `web/`, and a site rooted at the project instead publishes `.env`, `composer.json`
   and `config/` to anyone who asks for them.
2. **Repository.** `akrobatikustorna`, branch **`wordpress`**. Leave "Install Composer Dependencies"
   unchecked: `deploy.sh` runs the install itself, with `--no-dev`.
3. **Zero-downtime deploys: off.** This is the setting ADR-0011 is about. Turning it on without first
   symlinking `web/app/uploads` to a shared directory outside the release deletes the Site Owner's media on
   the second deploy afterwards.
4. **Quick deploy: on**, so a push to `wordpress` deploys. Forge deploys once as soon as the site is
   installed, and that first deploy fails on the missing `.env` — which is the guard working. Write the
   environment file below, then deploy again.
5. **Deploy script.** Replace Forge's default with:

   ```sh
   cd /home/forge/uj.akrobatikustorna.hu
   git pull origin $FORGE_SITE_BRANCH
   bash deploy.sh
   ( flock -w 10 9 || exit 1; sudo -S service $FORGE_PHP_FPM reload ) 9>/tmp/fpmlock
   ```

   Keep whatever path Forge's own default `cd`s to rather than the one written here: it is the site's
   directory, which is named after the domain the site was created with and does not follow a later rename.
   Everything else belongs in `deploy.sh`, where it is reviewed with the code. The PHP-FPM (FastCGI Process
   Manager) reload stays here because only Forge knows which service this server runs; it clears the
   opcache, without which the previous deploy's PHP is served for a while after this one.
6. **Database.** A database and user of its own — not the Laravel site's.
7. **SSL (Secure Sockets Layer).** A Let's Encrypt certificate for the temporary address, and another for
   the club's domain at the cutover, once DNS (Domain Name System) points here.

## The environment file

`.env` is not in version control and is written by hand, in Forge's own environment editor. Start from
`.env.example` and set:

```dotenv
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
DB_HOST=localhost
DB_PREFIX=wp_

WP_ENV=production
# The address the site believes it is at, which WordPress redirects to. Until the
# cutover this is the temporary Forge address, because the club's own domain still
# belongs to the Laravel site and pointing this one at it would send every visitor
# there. Changing it at the cutover is step 3 below.
WP_HOME=https://uj.akrobatikustorna.hu
WP_SITEURL=${WP_HOME}/wp

# The club's Gmail mailbox, over SMTP (Simple Mail Transfer Protocol).
# SMTP_PASSWORD is an app password generated for this site, never the account's
# own; SMTP_USER and MAIL_FROM must both be the club's address, because Gmail
# refuses to send as anyone else.
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_ENCRYPTION=tls
SMTP_USER=akrobatikustorna@gmail.com
SMTP_PASSWORD=...
MAIL_FROM=akrobatikustorna@gmail.com

# The club's existing PostHog property, the one the outgoing site reported to, so
# the figures either side of the cutover can be compared. Both or neither.
POSTHOG_KEY=...
POSTHOG_HOST=...
```

Then eight fresh salts from <https://roots.io/salts.html>. The `WP_ADMIN_*` and `WP_OWNER_*` lines are
local-only and belong nowhere near this file: deployed accounts are created by hand, below.

Without `SMTP_HOST` the site falls back to the server's own mail transport and a password reset disappears
silently — see
[ADR-0010](adr/0010-mail-goes-over-smtp-because-a-lost-password-reset-is-a-lockout.md).

## Installing WordPress, once

The first deploy lands before there is a database to deploy into; `deploy.sh` says so and stops short of its
database steps. Over SSH, from the site's directory:

```sh
vendor/bin/wp core install \
  --url="$(grep '^WP_HOME=' .env | cut -d= -f2-)" \
  --title="Budai Akrobatikus Sport Egyesület" \
  --admin_user=... --admin_password=... --admin_email=... \
  --skip-email

vendor/bin/wp user create <owner> <owner-email> --role=editor
```

Then deploy again — the plugins, the Hungarian translation and the permalinks are settled by the script.

The administrator account is the developer's. The Site Owner gets the **Editor** role and nothing more, which
is the access the whole site is designed around: it can edit every kind of content but cannot reach
templates, plugins or configuration.

The pages, the Departments and the Schedule's times publish themselves on the first request after a deploy
that has never had them, so the site comes up with content rather than empty. The club's Documents, Sponsors
and Recommended Pages do not: their files and logos are transferred by hand into the media library.

## Database backups

Configured at the **server** level in Forge — Server → Backups — not by a plugin, so that a backup does not
depend on WordPress being able to run. Daily, to off-server storage, before the site takes any real content.

A deploy can be rolled back by reverting the branch; the database cannot. Applying a core schema change is
one-way, which is what these backups are for.

## Cutover and rollback

The outgoing Laravel site stays exactly as it is — its own Forge site, its own database, its own directory —
until this one is proven. Nothing in this setup touches it.

1. Build and populate this site at the temporary address Forge gives it, while the Laravel site keeps the
   domain. `WP_HOME` is that temporary address until step 3.
2. Rehearse the handover on staging (ticket 17).
3. Cut over. Two Forge sites cannot hold one domain, so the order matters: change the Laravel site's domain
   to an address of its own (`regi.akrobatikustorna.hu`, say) so it stays deployable and reachable for
   checking; move `akrobatikustorna.hu` onto this site; set `WP_HOME` to it, run
   `vendor/bin/wp search-replace <temporary-address> https://akrobatikustorna.hu --skip-columns=guid` so the
   content's own links follow; issue the certificate.
4. Leave the Laravel site in place for roughly two weeks, deployable at its own address. Rolling back is
   moving the domain back and setting `WP_HOME` back with it — nothing about this site is deleted.
5. Archive the Laravel branch.

## After the first deploy to a new environment

- Request a password reset from `/wp/wp-login.php` and confirm it arrives in the club's mailbox. This is the
  one thing local Mailpit cannot prove: that Gmail accepts these credentials from this server.
- Ask for a few of the preserved addresses from `tests/support/preserved-urls.ts` and confirm they resolve.
- Check that the site is styled — an unstyled page means the theme's asset build did not run.
