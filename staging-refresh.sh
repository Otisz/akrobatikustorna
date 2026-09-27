#!/usr/bin/env bash
#
# Replaces the staging site's content with a copy of production's: the database,
# the media library, and the addresses inside both rewritten to staging's own.
#
# Run it over SSH (Secure Shell) from the staging site's own directory, on the
# server both sites live on:
#
#   cd /home/forge/proba.akrobatikustorna.hu
#   bash staging-refresh.sh /home/forge/akrobatikustorna.hu
#
# Staging exists so the handover can be rehearsed on the pages the Site Owner
# will actually meet, which means this is run before a rehearsal rather than once
# at setup — practising against last month's content teaches the wrong site.
#
# It is one-way by design: production is only ever read. Everything that can be
# checked before the staging database is dropped is checked first, because what
# this script does to whatever it is pointed at is not undoable.

set -euo pipefail

cd "$(dirname "$0")"

staging_dir="$PWD"
production_dir="${1:-}"

PATH="$PWD/vendor/bin:$PATH"
export PATH

if [ -z "$production_dir" ]; then
  echo "usage: bash staging-refresh.sh <path to the production site>" >&2
  echo "       e.g. bash staging-refresh.sh /home/forge/akrobatikustorna.hu" >&2
  exit 1
fi

env_value() {
  sed -n "s/^$2=//p" "$1/.env" | tail -n 1 | sed "s/^['\"]//;s/['\"]\$//"
}

for dir in "$staging_dir" "$production_dir"; do
  if [ ! -f "$dir/.env" ]; then
    echo "ERROR: $dir/.env is missing, so this is not a deployed site of this project." >&2
    exit 1
  fi
done

# The check this script exists to get right. It overwrites the site it is run
# from, so being run from the wrong directory — or with the two paths the wrong
# way round — would destroy the club's live content. `WP_ENV` is the one statement
# in either environment file about which site it is.
if [ "$(env_value "$staging_dir" WP_ENV)" != "staging" ]; then
  echo "ERROR: $staging_dir is not the staging site — its .env says" >&2
  echo "       WP_ENV=$(env_value "$staging_dir" WP_ENV). This script overwrites the site it" >&2
  echo "       is run from, so it will not run anywhere else." >&2
  exit 1
fi

if [ "$(env_value "$production_dir" WP_ENV)" != "production" ]; then
  echo "ERROR: $production_dir is not the production site, so there is nothing here" >&2
  echo "       worth copying. Pass production's directory as the first argument." >&2
  exit 1
fi

staging_home="$(env_value "$staging_dir" WP_HOME)"
production_home="$(env_value "$production_dir" WP_HOME)"

# Two sites sharing a database would mean this script dropping production's
# tables. They are created separately in the runbook; this is the check that the
# runbook was followed. Host and name together, because the same name on two
# servers is two databases and the same name on one is one.
staging_db="$(env_value "$staging_dir" DB_HOST)/$(env_value "$staging_dir" DB_NAME)"
production_db="$(env_value "$production_dir" DB_HOST)/$(env_value "$production_dir" DB_NAME)"

if [ "$staging_db" = "$production_db" ]; then
  echo "ERROR: staging and production name the same database, so refreshing staging" >&2
  echo "       would drop production's tables. Give staging a database of its own." >&2
  exit 1
fi

if [ "$staging_home" = "$production_home" ]; then
  echo "ERROR: staging and production have the same WP_HOME, so there is no address" >&2
  echo "       to rewrite the content to. Give staging a subdomain of its own." >&2
  exit 1
fi

echo "About to replace everything on $staging_home with a copy of $production_home."
echo "The staging database and its uploads are destroyed. Production is only read."
read -r -p "Type 'yes' to continue: " confirmation

if [ "$confirmation" != "yes" ]; then
  echo "Nothing was changed."
  exit 1
fi

dump="$(mktemp -t staging-refresh-XXXXXX.sql)"
trap 'rm -f "$dump"' EXIT

# Read out of production with production's own WP-CLI (WordPress Command Line
# Interface) and its own environment file, so this script never has to know how
# either site reaches its database.
echo "==> Exporting production's database"
(cd "$production_dir" && vendor/bin/wp db export "$dump" --single-transaction --quiet)

echo "==> Importing it into staging"
# `db clean` rather than `db reset`: it empties the database this site's own `.env`
# points at, without a DROP DATABASE the Forge database user may not be granted
# and without recreating anything the server set up.
wp db clean --yes
wp db import "$dump"

# Production's addresses are all through the imported content — in the post
# bodies, in the media library's attachment URLs, in the options. `WP_HOME` and
# `WP_SITEURL` come from staging's own `.env` and so are already right, but
# nothing else is, and a page whose images point at production is not the page
# the Site Owner is being shown.
#
# `guid` is skipped because it is an identifier rather than an address: rewriting
# it makes a feed reader treat every post as new.
echo "==> Rewriting production's addresses to staging's"
wp search-replace "$production_home" "$staging_home" --skip-columns=guid --all-tables-with-prefix --report-changed-only

# The media itself, which lives outside the checkout and outside the database.
# `--delete` so that a file removed on production goes from staging too: staging
# is a copy, not an accumulation.
echo "==> Copying the media library"
mkdir -p web/app/uploads
rsync -a --delete "$production_dir/web/app/uploads/" web/app/uploads/

# The imported database brings production's own row for every plugin and for the
# rewrite rules with it. Both are true of production and neither is known to be
# true here, and `deploy.sh` is where the answer to that already lives.
echo "==> Settling the database facts a deploy settles"
bash deploy.sh

echo
echo "Staging now holds production's content, at $staging_home."
echo "It is behind the staging password, and noindex — see docs/deployment.md."
