#!/bin/sh
set -eu

cd /var/www/html

if [ ! -f .env ]; then
  cp .env.example .env
  # A fresh clone ships placeholder salts; replace them with real ones.
  php -r '
    $keys = ["AUTH_KEY","SECURE_AUTH_KEY","LOGGED_IN_KEY","NONCE_KEY","AUTH_SALT","SECURE_AUTH_SALT","LOGGED_IN_SALT","NONCE_SALT"];
    $env = file_get_contents(".env");
    foreach ($keys as $key) {
        $salt = bin2hex(random_bytes(32));
        $env = preg_replace("/^" . $key . "=.*$/m", $key . "=\x27" . $salt . "\x27", $env);
    }
    file_put_contents(".env", $env);
  '
fi

# WP_HOME and the bootstrap administrator are configured in .env, which the
# shell does not read on its own.
set -a
. ./.env
set +a

# Unconditional, so that raising a pin in composer.json takes effect on restart.
composer install --no-interaction --no-progress

# Uploads are excluded from version control, so the directory may not exist yet.
mkdir -p web/app/uploads
chown -R www-data:www-data web/app/uploads

# Bring the database up on a fresh clone. Idempotent: an installed site is left alone.
if ! wp core is-installed --allow-root >/dev/null 2>&1; then
  wp core install \
    --allow-root \
    --url="${WP_HOME:-http://localhost:8080}" \
    --title="Budai Akrobatikus Sport Egyesület" \
    --admin_user="${WP_ADMIN_USER:-admin}" \
    --admin_password="${WP_ADMIN_PASSWORD:-admin}" \
    --admin_email="${WP_ADMIN_EMAIL:-admin@example.test}" \
    --skip-email
fi

# The Site Owner holds the Editor role, never Administrator, so that they cannot
# alter templates, plugins or site configuration while editing content. Created
# here because the browser tests sign in as them; production and staging accounts
# are created by hand.
if ! wp user get "${WP_OWNER_USER:-owner}" --allow-root >/dev/null 2>&1; then
  wp user create \
    --allow-root \
    --role=editor \
    --user_pass="${WP_OWNER_PASSWORD:-owner}" \
    "${WP_OWNER_USER:-owner}" \
    "${WP_OWNER_EMAIL:-owner@example.test}"
fi

# Advanced Custom Fields supplies the structured fields the content types are
# built from. Composer installs it, but whether a plugin is active is a database
# fact, so a fresh clone has to be switched on here.
if ! wp plugin is-active advanced-custom-fields --allow-root >/dev/null 2>&1; then
  wp plugin activate advanced-custom-fields --allow-root
fi

# The Site Owner works in Hungarian, so a missing translation is a failed start,
# not a site that quietly comes up in English. Skipped once installed, so a
# restart without network still works.
if ! wp language core is-installed hu_HU --allow-root >/dev/null 2>&1; then
  wp language core install hu_HU --allow-root
fi

exec "$@"
