# 14: Cookie consent gating analytics

**What to build:** A visitor is asked before analytics cookies are set, and a visitor who declines gets no
analytics at all — declining means something. The existing PostHog property carries across unchanged, so
historical continuity survives the cutover and it is possible to judge whether the new site helped or hurt.

The consent plugin must genuinely prevent analytics from loading before consent, not merely display a banner.

**Blocked by:** 02, 03.

**Status:** ready-for-agent

- [ ] A cookie-consent plugin is installed and pinned, and asks before any analytics cookie is set
- [ ] PostHog uses the club's existing analytics property
- [ ] Declining consent means no analytics code loads and no analytics requests are issued
- [ ] Test: no analytics network requests occur before consent is given
