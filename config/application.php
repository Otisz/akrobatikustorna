<?php
/**
 * Base configuration shared by every environment.
 */

use Roots\WPConfig\Config;
use function Env\env;

Env\Env::$options = Env\Env::USE_ENV_ARRAY;

$root_dir = dirname(__DIR__);
$webroot_dir = $root_dir . '/web';

if (file_exists($root_dir . '/.env')) {
    $env_files = file_exists($root_dir . '/.env.local')
        ? ['.env', '.env.local']
        : ['.env'];

    $dotenv = Dotenv\Dotenv::createUnsafeImmutable($root_dir, $env_files, false);
    $dotenv->load();
    $dotenv->required(['WP_HOME', 'WP_SITEURL']);

    if (!env('DATABASE_URL')) {
        $dotenv->required(['DB_NAME', 'DB_USER', 'DB_PASSWORD']);
    }
}

define('WP_ENV', env('WP_ENV') ?: 'production');

$env_config = __DIR__ . '/environments/' . WP_ENV . '.php';

if (file_exists($env_config)) {
    require_once $env_config;
}

Config::define('WP_HOME', env('WP_HOME'));
Config::define('WP_SITEURL', env('WP_SITEURL'));
Config::define('CONTENT_DIR', '/app');
Config::define('WP_CONTENT_DIR', $webroot_dir . Config::get('CONTENT_DIR'));
Config::define('WP_CONTENT_URL', Config::get('WP_HOME') . Config::get('CONTENT_DIR'));

/**
 * Visitors and the Site Owner both work in Hungarian.
 */
Config::define('WPLANG', 'hu_HU');

/**
 * Database
 */
Config::define('DB_NAME', env('DB_NAME'));
Config::define('DB_USER', env('DB_USER'));
Config::define('DB_PASSWORD', env('DB_PASSWORD'));
Config::define('DB_HOST', env('DB_HOST') ?: 'localhost');
Config::define('DB_CHARSET', 'utf8mb4');
Config::define('DB_COLLATE', '');
$table_prefix = env('DB_PREFIX') ?: 'wp_';

/**
 * Authentication keys and salts
 */
Config::define('AUTH_KEY', env('AUTH_KEY'));
Config::define('SECURE_AUTH_KEY', env('SECURE_AUTH_KEY'));
Config::define('LOGGED_IN_KEY', env('LOGGED_IN_KEY'));
Config::define('NONCE_KEY', env('NONCE_KEY'));
Config::define('AUTH_SALT', env('AUTH_SALT'));
Config::define('SECURE_AUTH_SALT', env('SECURE_AUTH_SALT'));
Config::define('LOGGED_IN_SALT', env('LOGGED_IN_SALT'));
Config::define('NONCE_SALT', env('NONCE_SALT'));

/**
 * Updates
 *
 * Core and plugins are pinned in composer.json, so nothing may be installed or
 * updated from the admin. Core minor releases are the one exception: they are
 * security releases, and the pinned version is bumped by pull request to match.
 */
Config::define('DISALLOW_FILE_EDIT', true);
Config::define('AUTOMATIC_UPDATER_DISABLED', false);
Config::define('WP_AUTO_UPDATE_CORE', 'minor');

/**
 * Custom settings
 *
 * A core theme stands in until ticket 02 builds the club's own, so that a fresh
 * clone renders something rather than a blank page.
 */
Config::define('WP_DEFAULT_THEME', 'twentytwentyfive');
Config::define('DISABLE_WP_CRON', env('DISABLE_WP_CRON') ?: false);

/**
 * Mail
 *
 * The transport WP Mail SMTP carries the site's email over, which it reads from
 * these constants in preference to anything on its settings screen — so the
 * mailbox password stays in `.env` and a fresh install needs no setup wizard. Why
 * SMTP (Simple Mail Transfer Protocol) at all, and what `base-mail.php` settles
 * instead of this file, is in
 * `docs/adr/0010-mail-goes-over-smtp-because-a-lost-password-reset-is-a-lockout.md`.
 *
 * Defined only where a host was given, so an environment with none is left
 * unconfigured and saying so in the admin rather than pointed at a host guessed
 * here.
 */
if (env('SMTP_HOST')) {
    Config::define('WPMS_ON', true);
    Config::define('WPMS_MAILER', 'smtp');
    Config::define('WPMS_SMTP_HOST', env('SMTP_HOST'));
    Config::define('WPMS_SMTP_PORT', (int) (env('SMTP_PORT') ?: 587));
    Config::define('WPMS_SSL', env('SMTP_ENCRYPTION') ?: 'tls');

    // Authentication is what a real mailbox needs and what Mailpit has no use for,
    // so it follows whether a user was given rather than being asserted here.
    Config::define('WPMS_SMTP_AUTH', (bool) env('SMTP_USER'));
    Config::define('WPMS_SMTP_USER', env('SMTP_USER') ?: '');
    Config::define('WPMS_SMTP_PASS', env('SMTP_PASSWORD') ?: '');

    // Who the mail comes from, forced over core's own `wordpress@` on this host:
    // Gmail refuses to send as any address but the account that authenticated. The
    // return path follows, so a bounce lands somewhere the club reads.
    Config::define('WPMS_MAIL_FROM', env('MAIL_FROM'));
    Config::define('WPMS_MAIL_FROM_FORCE', true);
    Config::define('WPMS_SET_RETURN_PATH', true);
}

/**
 * Analytics
 *
 * The club's existing PostHog property, which `base-analytics.php` prints only to
 * a visitor who has agreed to it. It belongs to an environment rather than to the
 * code, so it is read from there; either value unset means no analytics at all,
 * because an environment is never guessed into reporting somewhere.
 *
 * Development falls back to a property nothing answers for: `.invalid` is
 * reserved by RFC (Request For Comments) 2606 and resolves nowhere, so the
 * consent gate can be exercised — by hand and by `consent-analytics.spec.ts`,
 * which matches requests against that host by name — without a developer's clicks
 * landing in the club's figures. Either can still be set in `.env` to point a
 * local site at a real property. See
 * `docs/adr/0009-analytics-is-printed-by-the-server-only-after-consent.md`.
 */
$analytics_fallback = WP_ENV === 'development'
    ? ['key' => 'phc_development', 'host' => 'https://analytics.invalid']
    : ['key' => '', 'host' => ''];

Config::define('BASE_POSTHOG_KEY', env('POSTHOG_KEY') ?: $analytics_fallback['key']);
Config::define('BASE_POSTHOG_HOST', env('POSTHOG_HOST') ?: $analytics_fallback['host']);

/**
 * Debugging
 */
Config::define('WP_DEBUG_DISPLAY', false);
Config::define('WP_DEBUG_LOG', false);
Config::define('SCRIPT_DEBUG', false);

ini_set('display_errors', Config::get('WP_DEBUG_DISPLAY') ? '1' : '0');

Config::apply();
