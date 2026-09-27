<?php
/**
 * Staging: production's code and production's content, on an address only the
 * club can reach.
 *
 * It exists so the handover can be rehearsed — the Site Owner practising on the
 * real pages, with the real media, without a mistake landing on the live site or
 * in a search engine's index. What that costs is set here and enforced by
 * `web/app/mu-plugins/base-staging.php`; why the gate is PHP rather than the
 * server's own is in
 * `docs/adr/0012-staging-is-shut-in-php-so-the-gate-deploys-with-the-site.md`.
 *
 * Everything else is deliberately left as production has it, so that what is
 * rehearsed here is what the Site Owner will meet there.
 */

use Roots\WPConfig\Config;
use function Env\env;

/**
 * Core's own reading of which environment this is, which it shows in the admin
 * bar and passes to `wp_get_environment_type()`. Set so that an editor who has
 * both sites open can tell at a glance which one they are typing into.
 */
Config::define('WP_ENVIRONMENT_TYPE', 'staging');

/**
 * The credentials the gate asks for. Both belong to the environment rather than
 * to the code: staging is reached by the Site Owner and by the developer, and
 * nobody else, so there is one shared password rather than accounts.
 *
 * A staging site with no password set serves nothing at all — see the mu-plugin.
 * That is the whole point of reading them here: a blank is a refusal, never a way
 * in.
 */
Config::define('BASE_STAGING_USER', env('STAGING_USER') ?: 'staging');
Config::define('BASE_STAGING_PASSWORD', env('STAGING_PASSWORD') ?: '');
