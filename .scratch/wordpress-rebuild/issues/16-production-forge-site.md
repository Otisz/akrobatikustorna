# 16: Production Forge site

**What to build:** Deploying from the `wordpress` branch produces a fully working site on the club's existing
VPS, with no half-applied deploys and no destroyed media. The outgoing Laravel site remains deployable as a
rollback.

Hosting is Laravel Forge as a new site on the existing VPS. Forge's git deploy runs the dependency install
step, which is what Bedrock requires. Database backups are handled at the server level, not by a plugin.

**Blocked by:** 01.

**Status:** ready-for-human

- [ ] The Forge site's web directory is Bedrock's `web/`, not the project root
- [ ] The deploy script runs the dependency install step automatically, so a deploy is never half-applied
- [ ] The uploads directory persists across deploys and is never destroyed by one
- [ ] Zero-downtime deploys are used only if uploads are symlinked outside the release directory
- [ ] Database backups are configured at the server level
- [ ] Every plugin the site depends on is active on the deployed site, and stays active after a deploy
- [ ] The Laravel site remains intact and deployable as a rollback

## Comments

**From 02 (theme foundation):** the theme's CSS and JavaScript are built by Vite into
`web/app/themes/base/build/`, which is gitignored. The Forge deploy script must run the asset build
(`npm ci && npm run build` in `web/app/themes/base`) alongside `composer install`, or the deployed site
will render unstyled.

**From 05 (carousel Slides):** whether a plugin is *active* is a row in the database, not a file, so
`composer install` alone leaves Advanced Custom Fields (ACF) installed but switched off — and a content type
whose field group never loads gives the Site Owner no way to enter the field. Locally
`docker/php/entrypoint.sh` activates it on container start; the deploy script needs the same step
(`wp plugin activate advanced-custom-fields`, guarded by `wp plugin is-active` so it is idempotent). The list
grows as the SEO, redirection, SMTP (Simple Mail Transfer Protocol) and cookie-consent plugins arrive.

**From 15 (SMTP and password reset):** the deployed `.env` must carry `SMTP_HOST`, `SMTP_PORT`,
`SMTP_ENCRYPTION`, `SMTP_USER`, `SMTP_PASSWORD` and `MAIL_FROM` for the club's Gmail account —
`smtp.gmail.com`, port 587, `tls`, with an app password rather than the account's own. Without `SMTP_HOST` the
site falls back to the server's own mail transport, which is the lockout ticket 15 exists to avoid, and nothing
visible says so outside the admin. `wp-mail-smtp` joins the plugins the deploy script activates. Ticket 15's
last acceptance criterion is left for this one: request a password reset from the deployed login screen, confirm
it arrives in the club's mailbox, and tick it there.

**From the implementation pass (2026-09-27):** the repository side of this ticket is done and the Forge side
is not — creating the site, writing `.env`, installing WordPress and configuring backups need the panel and
the server, which an agent has no access to. None of the criteria are ticked, because every one of them is a
statement about the deployed site and there is no deployed site yet; each is a step in the runbook, and is
ticked when it has been done for real.

What the branch now carries:

- `deploy.sh` at the repo root — everything a deploy does once the branch is pulled: `composer install
  --no-dev`, the theme's Vite build, `mkdir -p web/app/uploads`, `wp core update-db`, activating the four
  plugins if they are off, the Hungarian core and Slim SEO translations, and a rewrite and cache flush. It
  runs under `set -euo pipefail`, refuses to start without `.env`, and stops short of the database steps with
  a message on the first deploy to a server where `wp core install` has not been run yet. Four things it does
  deliberately, each answering one of the criteria above:
  - it **refuses to run from a path under `releases/`**, which is what Forge's zero-downtime deploys look
    like from inside the script — the criterion about symlinking uploads is the one worth failing a deploy
    over rather than documenting;
  - it builds the theme's assets into `build.new` and **moves them into place when the build finishes**,
    because `vite.config.js` empties its output directory first and that directory is the one being served,
    so building in place would leave every visitor unstyled for the length of the build;
  - it **tells a database that cannot be reached from one that is merely empty** (`wp db query 'SELECT 1'`
    before `wp core is-installed`); without that, a wrong `DB_PASSWORD` would exit 0, Forge would report
    success, and the plugin activation would have been silently skipped;
  - it forces `NODE_ENV=development` for `npm ci`, because Vite and Tailwind are the theme's
    `devDependencies` and a server whose environment already says production would install neither —
    reproduced in the `node` container, where the build fails with `vite: not found`.

  Verified against the local environment: the WP-CLI half run in the `php` container, the build and swap in
  the `node` container under a hostile `NODE_ENV=production`, the swap's behaviour on both a first and a
  repeat deploy, and shellcheck clean.
- `docs/deployment.md` — the Forge runbook: web directory `/web`, zero-downtime off, the deploy-script field
  (git pull, `bash deploy.sh`, FPM reload), the production `.env` including the Gmail SMTP block ticket 15
  specified, the one-off `wp core install` and the Editor account, server-level backups, and the cutover that
  leaves the Laravel site deployable as a rollback.
- `docs/adr/0011-deploys-are-in-place-so-the-uploads-directory-is-left-alone.md` — why the deploy is in place
  rather than zero-downtime, and what that buys.
- `wp-cli/wp-cli-bundle` moved from `require-dev` to `require`, so `composer install --no-dev` still leaves
  `vendor/bin/wp` for the deploy script and for the developer over SSH, pinned rather than installed on the
  server by hand.

Ticket 15's last criterion — request a password reset from the deployed login screen and confirm it arrives —
stays open here, as the last item of the runbook's post-deploy checks.
