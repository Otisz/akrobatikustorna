# Analytics is printed by the server only after consent

The club's PostHog property is carried across from the outgoing site, and a visitor is asked before it loads.
The asking is **Cookie Notice**, pinned in `composer.json` and activated by `docker/php/entrypoint.sh`. The
gating is not: `base-analytics.php` prints the PostHog snippet in `wp_enqueue_scripts` only when
`cn_cookies_accepted()` is true, so a visitor who has not answered and a visitor who declined are served a page
with no analytics in it.

The plugin's own answer to this is a blocking engine: load everything, hold the third-party scripts back in the
browser, release them when the visitor agrees. The ticket asked for a plugin that "genuinely prevents analytics
from loading before consent, not merely displays a banner", and a blocker is still the weaker of the two
mechanisms — it keeps the code on the page and depends on somebody else's JavaScript being right about every
route into it. Deciding it server-side leaves nothing to release: there is no snippet, no request, and no
mistake in the blocker that could reach the club's property. That also frees the site from the plugin's free
tier, whose blocking engine is quota-capped and steered towards a hosted service the club is not connected to.

It costs one thing. What a visitor answered takes effect on the next response rather than immediately, so the
banner is configured to reload the page (`redirection`). The plugin reloads on a refusal as well as on
agreement, which a refusal does not need — nothing was loaded to undo — but which is the plugin's own
behaviour and harmless.

The banner is configured the way `base-permalinks.php` configures permalinks — by filtering
`option_cookie_notice_options` rather than by storing the settings. The Site Owner holds the Editor role and
cannot reach a plugin settings screen, and a consent banner that works only because somebody once ticked the
right boxes would not survive a fresh install. The filter names the keys that matter and leaves the rest as the
plugin ships them.

## Consequences

- **The banner's Hungarian is the club's own**, written in `base-analytics.php`, not the plugin's translation.
  Left to itself the plugin serves the English text from its defaults until an administrator opens its settings
  screen once — a start-up step with no visible failure is exactly the kind of thing that reaches production
  unnoticed. The plugin does have a Hungarian translation, which ADR-0007 would have insisted on; it is not
  installed, because the only screens it would cover are the Administrator's.
- **Declining is possible, and revocable.** The plugin ships without a decline button, so the filter adds one.
  It also enables revocation in `manual` mode, which keeps the plugin's own floating bar off every page: the
  footer carries a *Süti beállítások* link that reopens the banner, shown once an answer has been given.
- **The banner's close button is removed.** The plugin gives it `data-cookie-set="accept"`, so dismissing the
  question would be recorded as agreeing to analytics. `cn_cookie_notice_output` takes it out, leaving the two
  buttons as the only two answers. That filter matches the plugin's own markup with a pattern, which is
  fragile — the version is pinned, and the failure is the button reappearing rather than anything silent.
- **The bar wears the theme's colours**, forced through the options filter, because the plugin writes its own
  into a `style` attribute where no stylesheet can reach them. `ink`, `paper` and `brand-strong` from
  `theme.json` are duplicated there, and nowhere else.
- **Bot detection is off.** It exists to keep a paid plan's visit count down, it suppresses the banner entirely
  for anything it matches, and the local test browser is on its list of crawlers.
- **A missing plugin means no analytics**, not unguarded analytics: `base_analytics_consented()` answers false
  when `cn_cookies_accepted()` is undefined. The gate fails closed.
- **An environment with no key reports nowhere.** `POSTHOG_KEY` and `POSTHOG_HOST` come from `.env`; either
  one unset prints nothing at all. Neither is given a fallback outside development — the region a PostHog
  property answers on is not something to guess at, and a staging site quietly reporting into the club's live
  figures is the mistake that guess would make. Development falls back to a key and a host at
  `analytics.invalid`, which RFC (Request For Comments) 2606 reserves and nothing resolves, so the gate can
  be exercised locally — `consent-analytics.spec.ts` watches for requests to that host — without a
  developer's clicks landing in the club's figures.
- **Page caching would break the gate**, because the same cached HTML (HyperText Markup Language) would be
  served to a visitor who agreed and one who did not. No page cache is in use; one added later has to vary on
  the `cookie_notice_accepted` cookie.
