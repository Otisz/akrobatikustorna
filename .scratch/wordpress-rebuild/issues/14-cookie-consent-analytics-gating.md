# 14: Cookie consent gating analytics

**What to build:** A visitor is asked before analytics cookies are set, and a visitor who declines gets no
analytics at all — declining means something. The existing PostHog property carries across unchanged, so
historical continuity survives the cutover and it is possible to judge whether the new site helped or hurt.

The consent plugin must genuinely prevent analytics from loading before consent, not merely display a banner.

**Blocked by:** 02, 03.

**Status:** done

- [x] A cookie-consent plugin is installed and pinned, and asks before any analytics cookie is set — Cookie
      Notice 3.1.12, pinned in `composer.json` and activated by `entrypoint.sh`. What it asks and how it
      behaves is filtered over its own settings in `base-analytics.php` rather than stored, the way
      `base-permalinks.php` handles permalinks, so it survives a fresh install and needs nobody to open a
      settings screen. Its banner text is the club's own Hungarian, because the plugin serves English from its
      defaults until an administrator opens that screen once
- [x] PostHog uses the club's existing analytics property — `POSTHOG_KEY` and `POSTHOG_HOST` from `.env`, with
      the same init options the outgoing site used (`defaults: 2025-05-24`, `capture_exceptions`), so the
      figures either side of the cutover are comparable. Without both, nothing is printed
- [x] Declining consent means no analytics code loads and no analytics requests are issued —
      `base-analytics.php` prints the snippet in `wp_enqueue_scripts` only when `cn_cookies_accepted()` is
      true, so an undecided or declining visitor is served a page with no analytics in it. The plugin's own
      in-browser blocking engine is deliberately unused: it keeps the code on the page. The gate fails closed
      if the plugin is ever deactivated. Recorded as ADR-0009
- [x] Test: no analytics network requests occur before consent is given — `consent-analytics.spec.ts`, two
      tests, both signed out: nothing on the wire before an answer, the request once a visitor agrees, and
      nothing across three pages after a refusal. Development points at `analytics.invalid`, which resolves
      nowhere, so the gate is exercised without a developer's clicks reaching the club's figures

## Comments

**Beyond the acceptance criteria:** the plugin ships with no decline button, so the filter adds one —
without it the banner has one answer. Revocation is enabled in `manual` mode, which keeps the plugin's own
floating bar off every page: the footer carries a *Süti beállítások* link that reopens the banner once an
answer has been given. Bot detection is switched off, because it suppresses the banner entirely for anything
on its crawler list and the local test browser is on it. The banner's close button is removed: the plugin
gives it `data-cookie-set="accept"`, so dismissing the question would have counted as agreeing to analytics.
The bar takes its colours from `theme.json` rather than arriving teal.

**Noticed while here, not fixed:** `config/application.php` requires `config/environments/<env>.php` before
its own `Config::define` calls, and `Roots\WPConfig\Config::define` is last-write-wins — so every override in
`development.php` (`WP_DEBUG_DISPLAY`, `WP_DEBUG_LOG`, `SCRIPT_DEBUG`) is silently discarded. Upstream Bedrock
requires that file last for this reason. The analytics defaults are therefore keyed on `WP_ENV` inside
`application.php` rather than placed in `development.php` where they would have had no effect. Worth its own
ticket.
