#!/usr/bin/env bash
#
# Everything a deploy of this site does after the new code has been fetched.
#
# It lives here rather than in the Forge panel so that it is reviewed with the
# code it deploys and so that production and staging cannot drift apart. Forge's
# own deploy script pulls the branch and then runs this file; what that script
# says, and how the site is set up around it, is in `docs/deployment.md`.
#
# Safe to run twice: every step either rebuilds from the checkout or checks the
# database before changing it.

set -euo pipefail

cd "$(dirname "$0")"

# WP-CLI (WordPress Command Line Interface) is a Composer dependency rather than
# something installed on the server, so it is on this path and nowhere else.
PATH="$PWD/vendor/bin:$PATH"
export PATH

# ADR-0011 turns zero-downtime deploys down because uploads would live inside a
# release directory that a later deploy deletes. Forge builds those under
# `releases/`, so this is what switching it on anyway looks like from in here —
# and it is worth failing a deploy over, because the alternative is discovering
# it when the media is already gone.
case "$PWD" in
  */releases/*)
    echo "ERROR: this deploy is running from a release directory, so Forge's" >&2
    echo "       zero-downtime deploys are on. Turn them off, or symlink" >&2
    echo "       web/app/uploads to a shared directory outside the release" >&2
    echo "       first. See ADR-0011 in docs/adr/." >&2
    exit 1
    ;;
esac

if [ ! -f .env ]; then
  echo "ERROR: .env is missing, so this deploy would bring the site up with no" >&2
  echo "       database, salts or mailbox. See docs/deployment.md." >&2
  exit 1
fi

# PHP dependencies, WordPress core and the plugins among them, all pinned.
composer install --no-dev --no-interaction --no-progress --prefer-dist --optimize-autoloader

# The theme's CSS (Cascading Style Sheets) and JavaScript are built by Vite and
# are not in version control, so a deploy that skips this serves an unstyled site.
# It builds into a directory of its own and is moved into place when it is
# finished, because `vite.config.js` empties its output directory first and the
# site is being served out of that one.
#
# NODE_ENV is forced because Vite and Tailwind are the theme's devDependencies,
# which `npm ci` leaves out where the environment already says production.
theme="web/app/themes/base"

NODE_ENV=development npm --prefix "$theme" ci --no-audit --no-fund
npm --prefix "$theme" run build -- --outDir build.new --emptyOutDir

rm -rf "$theme/build.previous"
if [ -d "$theme/build" ]; then
  mv "$theme/build" "$theme/build.previous"
fi
mv "$theme/build.new" "$theme/build"
rm -rf "$theme/build.previous"

# Excluded from version control, so it does not arrive with the code. Creating it
# is all that is needed: an in-place deploy never removes it. See
# docs/adr/0011-deploys-are-in-place-so-the-uploads-directory-is-left-alone.md.
mkdir -p web/app/uploads

# Every step below reads or writes the database, and there are two reasons one
# might not answer. A database that cannot be reached at all is a failure, and
# saying so is the whole point: without this the deploy cannot tell it apart from
# the case underneath, and would report success having quietly skipped activating
# the plugins.
if ! wp db query "SELECT 1" >/dev/null 2>&1; then
  echo "ERROR: the database did not answer, so the deploy cannot finish. The code" >&2
  echo "       is deployed; check DB_HOST, DB_USER and DB_PASSWORD in .env." >&2
  exit 1
fi

# The other reason: the first deploy to a new server lands before anybody has run
# `wp core install`. Saying so is more use than failing the deploy that put the
# code there in the first place.
if ! wp core is-installed >/dev/null 2>&1; then
  echo "NOTE: WordPress is not installed on this database yet, so the database" >&2
  echo "      steps are skipped. Install it and deploy again — see docs/deployment.md." >&2
  exit 0
fi

# Raising the core pin ships new schema; core applies it on an admin page load,
# which is nobody's job to trigger.
wp core update-db

# Whether a plugin is active is a row in the database rather than a file, so
# `composer install` alone leaves a new plugin installed and switched off — and a
# content type whose field group never loads gives the Site Owner no way to enter
# the field. This is the same list `docker/php/entrypoint.sh` activates locally.
for plugin in advanced-custom-fields slim-seo cookie-notice wp-mail-smtp; do
  if ! wp plugin is-active "$plugin" >/dev/null 2>&1; then
    wp plugin activate "$plugin"
  fi
done

# The Site Owner works in Hungarian, and the translation is a download rather
# than something the checkout carries; Slim SEO's own is installed beside core's,
# because its fields sit beside the content they are writing. This is the only
# step that reaches outside the server, and it runs after the code is live — a
# warning is the right outcome for a download that did not answer, not a deploy
# marked failed over a site serving perfectly well in English.
if ! wp language core is-installed hu_HU >/dev/null 2>&1; then
  wp language core install hu_HU || echo "WARNING: the Hungarian translation did not install." >&2
fi

if ! wp language plugin is-installed slim-seo hu_HU >/dev/null 2>&1; then
  wp language plugin install slim-seo hu_HU || echo "WARNING: Slim SEO's Hungarian translation did not install." >&2
fi

# Permalinks are declared in `base-permalinks.php`, and the rules a request is
# matched against are stored. A changed rewrite slug that nobody flushed is a 404
# on an address the URL parity test says must resolve.
wp rewrite flush

wp cache flush
