<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — analytics
 * Description: Loads the club's PostHog analytics only once a visitor has agreed to it, and settles what the consent banner asks in code rather than on a settings screen. A visitor who has not answered, and a visitor who declined, are served no analytics code and make no analytics request.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Whether a visitor has agreed to analytics.
 *
 * `cn_cookies_accepted()` is the consent plugin's own reading of the cookie it
 * set. A missing function — the plugin deactivated, or a request that somehow
 * runs before it loads — answers no: the gate has to fail closed, or the one
 * thing this file exists to guarantee would depend on a plugin being switched on.
 */
function base_analytics_consented(): bool
{
    return function_exists('cn_cookies_accepted') && cn_cookies_accepted();
}

/** Where the analytics library is loaded from, and where it reports to. */
function base_analytics_host(): string
{
    return rtrim((string) BASE_POSTHOG_HOST, '/');
}

/**
 * Whether analytics is to be printed at all: an environment that was given no
 * property reports to nobody, which is what a local site and a developer's clicks
 * should do. Both halves are required, because a key without a host is a request
 * to somewhere unintended rather than a half-configured one.
 */
function base_analytics_configured(): bool
{
    return BASE_POSTHOG_KEY !== '' && base_analytics_host() !== '';
}

/**
 * How the library is set up, kept as the outgoing site had it — the same property
 * measured the same way is what makes the figures either side of the cutover
 * comparable, which is the whole reason the property was carried across.
 *
 * @return array<string, mixed>
 */
function base_analytics_init_options(): array
{
    return [
        'api_host' => base_analytics_host(),
        'defaults' => '2025-05-24',
        'capture_exceptions' => true,
    ];
}

/**
 * The gate itself. Printing the library from the server, rather than loading it
 * always and asking it to hold back, is what makes declining mean something: a
 * visitor who has not agreed is served a page with no analytics in it, so there
 * is nothing to hold back and nothing that a mistake in somebody else's
 * JavaScript could let through.
 *
 * The cost is that agreeing takes effect on the next response rather than this
 * one, which is why the banner is configured to reload the page.
 */
add_action('wp_enqueue_scripts', static function (): void {
    if (!base_analytics_configured() || !base_analytics_consented()) {
        return;
    }

    // Unversioned, because the address is PostHog's own and they decide what it
    // serves; a `?ver=` of ours would only break their caching.
    wp_enqueue_script('base-analytics', base_analytics_host() . '/static/array.js', [], null, false);

    wp_add_inline_script(
        'base-analytics',
        sprintf(
            'posthog.init(%s, %s);',
            wp_json_encode(BASE_POSTHOG_KEY),
            wp_json_encode(base_analytics_init_options())
        )
    );
});

/**
 * What the banner asks, and how it behaves, filtered over whatever the plugin
 * has in the database — the same approach `base-permalinks.php` takes, and for
 * the same reason: the Site Owner holds the Editor role and cannot reach the
 * settings screen, and a consent banner that only works because somebody once
 * ticked the right boxes would not survive a fresh install.
 *
 * Only the keys that matter are named. Everything else — colours, position,
 * how long an answer is remembered — is left as the plugin ships it.
 *
 * @param mixed $stored
 * @return mixed
 */
function base_analytics_banner_options($stored)
{
    if (!is_array($stored)) {
        return $stored;
    }

    return array_merge($stored, [
        // The club's own words, in Hungarian, which is the only language this
        // site speaks. Left to the plugin these would be whatever English text
        // its defaults hold until an administrator opened the settings screen.
        'message_text' => __('Ez az oldal sütiket használ ahhoz, hogy mérni tudjuk, hogyan használják a látogatók. Ehhez a hozzájárulását kérjük.', 'base'),
        'accept_text' => __('Elfogadom', 'base'),
        'refuse_text' => __('Elutasítom', 'base'),
        'revoke_text' => __('Hozzájárulás visszavonása', 'base'),

        // Without a decline button the banner has one answer, and a visitor who
        // wants the other is left closing it. The plugin ships this off.
        'refuse_opt' => true,

        // Which also puts revocation within reach: withdrawing has to be as easy
        // as agreeing was. `manual` keeps the plugin's own floating bar off every
        // page — the footer's link is what opens the banner again.
        'revoke_cookies' => true,
        'revoke_cookies_opt' => 'manual',

        // The answer is acted on by the server, so the page has to be asked for
        // again before it can take effect. The plugin reloads on either answer.
        'redirection' => true,

        // The bar as the site's own, rather than the plugin's teal on charcoal.
        // The plugin writes these into a `style` attribute, so a stylesheet would
        // have to fight them; these are `ink`, `paper` and `brand-strong` from
        // the theme's palette, which is the one place they are duplicated.
        'colors' => [
            'text' => '#fdfdfc',
            'button' => '#ab5e23',
            'bar' => '#1c1f26',
            'bar_opacity' => 100,
        ],

        // Whoever is asking is asked. Bot detection exists to keep a paid plan's
        // visit count down, and the local test browser is on its list of crawlers
        // — the banner is not served at all to anything it matches.
        'bot_detection' => false,

        // Stop the plugin writing its own translated defaults over the texts
        // above the first time an administrator opens an admin page.
        'translate' => false,

        // This plugin's free tier advertises a hosted service that would take
        // over the banner, the blocking and the texts. The site is not connected
        // to it, holds no credentials for it, and its nags are not the
        // administrator's problem.
        'app_id' => '',
        'app_key' => '',
        'app_blocking' => false,
        'ui_mode' => 'legacy',
        'review_notice' => false,
        'update_notice' => false,
    ]);
}

// Both filters, because WordPress passes an absent option through
// `default_option_` instead — and the banner having no decline button would be a
// quiet way for a deleted row to change what a visitor is asked.
add_filter('option_cookie_notice_options', 'base_analytics_banner_options');
add_filter('default_option_cookie_notice_options', 'base_analytics_banner_options');

/**
 * Takes the banner's close button out. The plugin gives it
 * `data-cookie-set="accept"`, so dismissing the question counts as answering it
 * yes — a visitor who wanted the banner out of the way would be recorded as
 * having agreed to analytics. The two buttons are the only two answers.
 *
 * A pattern over the plugin's own markup, which is as fragile as it looks. The
 * version is pinned, and the failure is visible rather than silent: the button
 * reappears.
 */
add_filter('cn_cookie_notice_output', static function (string $output): string {
    return (string) preg_replace('#<button[^>]*id="cn-close-notice".*?</button>#s', '', $output);
});

/**
 * Whether the visitor has answered the banner, which is what decides whether a
 * way to change that answer is worth offering. Before the first answer the banner
 * is on the screen already, and a footer link that reopens what is open reads as
 * broken.
 */
function base_analytics_answered(): bool
{
    return function_exists('cn_cookies_set') && cn_cookies_set();
}
