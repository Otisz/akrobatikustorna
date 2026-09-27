<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — staging
 * Description: Shuts the staging site to everyone without its password, and keeps it out of every search engine's index. Inert anywhere but staging: production and a developer's local site are untouched by it.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** What every response from staging tells a crawler, wherever it is sent from. */
const BASE_STAGING_ROBOTS = 'noindex, nofollow';

/**
 * Whether this is the staging site. `WP_ENV` comes from the environment file, so
 * this is a question about which server the code is running on, answered once.
 */
function base_staging_is_staging(): bool
{
    return defined('WP_ENV') && WP_ENV === 'staging';
}

/**
 * The credentials the gate accepts, from `config/environments/staging.php`.
 *
 * @return array{user: string, password: string}
 */
function base_staging_credentials(): array
{
    return [
        'user' => defined('BASE_STAGING_USER') ? (string) BASE_STAGING_USER : '',
        'password' => defined('BASE_STAGING_PASSWORD') ? (string) BASE_STAGING_PASSWORD : '',
    ];
}

/**
 * What the browser sent, if it sent anything.
 *
 * PHP fills `PHP_AUTH_USER` in on its own under most server configurations, and
 * does not under some FastCGI ones, where the header arrives unparsed instead.
 * Both are read, because the difference is a detail of the server the site
 * happens to be on and the gate must not come down over it.
 *
 * @return array{user: string, password: string}|null
 */
function base_staging_submitted_credentials(): ?array
{
    if (isset($_SERVER['PHP_AUTH_USER'])) {
        return [
            'user' => (string) $_SERVER['PHP_AUTH_USER'],
            'password' => (string) ($_SERVER['PHP_AUTH_PW'] ?? ''),
        ];
    }

    // `REDIRECT_` is the same header after an internal redirect, which is what a
    // rewritten request looks like to PHP.
    $header = (string) ($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');

    if (stripos($header, 'basic ') !== 0) {
        return null;
    }

    $decoded = base64_decode(substr($header, 6), true);

    if ($decoded === false || !str_contains($decoded, ':')) {
        return null;
    }

    [$user, $password] = explode(':', $decoded, 2);

    return ['user' => $user, 'password' => $password];
}

/**
 * Whether what was sent matches. Compared with `hash_equals` for the usual
 * reason, and the user name as well as the password, so that neither half is
 * learned from how long the answer took.
 */
function base_staging_credentials_accepted(): bool
{
    $expected = base_staging_credentials();
    $submitted = base_staging_submitted_credentials();

    if ($submitted === null) {
        return false;
    }

    return hash_equals($expected['user'], $submitted['user'])
        && hash_equals($expected['password'], $submitted['password']);
}

/**
 * The requests the gate lets past without asking.
 *
 * Three of them. WP-CLI (WordPress Command Line Interface) is how the deploy
 * script and a refresh from production reach this site, and neither can answer a
 * password prompt; both are already behind SSH (Secure Shell), which is a stronger
 * gate than this one. Anything else run from the command line is the same request
 * from the same place, and is exempt for the same reason rather than on WP-CLI's
 * word — a `php` invocation over SSH is not what this gate is for.
 *
 * The third is core's own cron request: WordPress asks for `wp-cron.php` over HTTP
 * (HyperText Transfer Protocol) on its own behalf, and a 401 there would leave
 * every scheduled task on the site unrun, silently. It carries no content and
 * renders no page.
 *
 * That last one is read from `DOING_CRON`, which `wp-cron.php` defines before it
 * loads WordPress, rather than from the address asked for. An address is the
 * visitor's to choose: nginx hands anything it cannot find on disk to `index.php`,
 * so a request for `/wp-cron.php?p=1` that matched on its path alone would render
 * the club's content with the gate stepped over. `DOING_CRON` is the cron script's
 * own word for what it is, and nothing a request can say puts it there.
 */
function base_staging_request_is_exempt(): bool
{
    if (defined('WP_CLI') && WP_CLI) {
        return true;
    }

    if (PHP_SAPI === 'cli') {
        return true;
    }

    return defined('DOING_CRON') && DOING_CRON;
}

/**
 * Stops the request with a page of its own.
 *
 * Plain text and a status code, rather than anything of the site's: this runs
 * before the theme is loaded, and a visitor who is being turned away is better
 * served by a sentence they can read than by a styled page that would need half
 * of WordPress to be up first.
 */
function base_staging_refuse(int $status, string $message): void
{
    if (function_exists('nocache_headers')) {
        nocache_headers();
    }

    http_response_code($status);
    header('Content-Type: text/plain; charset=utf-8');
    header('X-Robots-Tag: ' . BASE_STAGING_ROBOTS, true);

    echo $message . "\n";

    exit;
}

/**
 * The gate.
 *
 * It runs as this file is loaded, which is before the plugins, the theme and
 * every query the page would have made: nothing of the club's content is read,
 * let alone printed, on a request that is going to be turned away.
 *
 * A staging site whose password was never set refuses everybody rather than
 * letting everybody in. The content here is the club's real content — members'
 * names, the documents, the mailbox — and the one failure this gate must not have
 * is coming up open because a line was missing from a file nobody looked at.
 */
if (base_staging_is_staging() && !base_staging_request_is_exempt()) {
    $credentials = base_staging_credentials();

    if ($credentials['password'] === '') {
        base_staging_refuse(
            503,
            'A próbaoldal nincs beállítva: hiányzik a STAGING_PASSWORD. (Staging is not configured:'
            . ' STAGING_PASSWORD is missing, so the site serves nothing. See docs/deployment.md.)'
        );
    }

    if (!base_staging_credentials_accepted()) {
        header('WWW-Authenticate: Basic realm="Próbaoldal", charset="UTF-8"');
        base_staging_refuse(
            401,
            'Ez a próbaoldal jelszóval védett. (This is the staging site, and it is password-protected.)'
        );
    }
}

/**
 * Everything below is for the requests that got through, and is all about the
 * index rather than about access.
 *
 * The password already keeps a crawler out, which is most of why staging cannot
 * be indexed. These are here for the case the password comes off for an
 * afternoon — a duplicate of the club's whole site, indexed under another
 * address, is the one mistake on staging that would damage the live site's own
 * rankings, and it would be undone slowly and by hand.
 */
if (base_staging_is_staging()) {
    /**
     * The decisive one, because it is read whatever the page turns out to be and
     * whichever plugin wrote the markup.
     */
    add_filter('wp_headers', static function (array $headers): array {
        $headers['X-Robots-Tag'] = BASE_STAGING_ROBOTS;

        return $headers;
    });

    /**
     * Core's own switch, filtered rather than set in the database: staging's
     * database is a copy of production's, so a stored `0` would be overwritten by
     * the next refresh and a stored `1` would arrive with it. This is what puts
     * `noindex` in the markup; the sitemap is the next filter's business, because
     * the one this site publishes is a plugin's and pays this no attention.
     *
     * Both filters, because WordPress passes an absent row through
     * `default_option_` instead.
     */
    add_filter('pre_option_blog_public', static fn () => '0');
    add_filter('default_option_blog_public', static fn () => '0');

    /**
     * The sitemap, which is the SEO (Search Engine Optimisation) plugin's rather
     * than core's and pays no
     * attention to `blog_public`. Emptied of everything it could list, which is
     * what the plugin reads to decide whether to register the rewrite rules at
     * all — so `/sitemap.xml` on staging is a 404 rather than a copy of the
     * club's every address under staging's own domain.
     */
    add_filter('slim_seo_sitemap_post_types', static fn (): array => []);
    add_filter('slim_seo_sitemap_taxonomies', static fn (): array => []);
    add_filter('slim_seo_user_sitemap', static fn (): bool => false);

    /**
     * And the file a crawler asks for first. Core writes this itself from
     * `blog_public`, but only as far as `Disallow: /wp/wp-admin/`; on staging
     * there is nothing that is any crawler's business.
     *
     * Last of everything, because the SEO plugin appends a `Sitemap:` line of its
     * own to whatever this file says — an address to come and read, under a
     * heading that has just said not to.
     */
    add_filter('robots_txt', static fn (): string => "User-agent: *\nDisallow: /\n", PHP_INT_MAX);
}
