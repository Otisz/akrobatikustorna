# 02: Theme foundation and design system

**What to build:** A visitor loading the site sees the refreshed design — the club's retained logo, a palette
derived from it, and a type scale — applied to a base layout with header, footer, and a home page shell. The
Site Owner composing content in the block editor sees the same colours and fonts as the live site, so what
they compose is what visitors get.

The design is refreshed rather than replicated, produced via the `design-taste-frontend` skill, targeting a
parent deciding whether to enrol their child: photography and the Schedule matter most, and warmth matters
more than edginess.

**Blocked by:** 01.

**Status:** done

- [x] A theme is active and renders a header, footer, and home page shell
- [x] Styling is Tailwind compiled by Vite from within the theme
- [x] The palette is derived from the existing club logo, which is retained
- [x] The palette and type scale are also expressed in the theme's block editor configuration
- [x] Composing a page in the block editor shows the same colours and fonts as the published page
- [x] The layout is readable on a phone

## Comments

**Implemented.** The theme is `web/app/themes/base`, a classic PHP-template theme rather than a block theme,
because later issues template custom post type archives and an editable Schedule table, which PHP templates
make straightforward.

Design read: a photo-led landing page for a parent choosing a children's sports club, warm and trust-first
rather than edgy. Dials were set low-to-middling on purpose (variance 6, motion 4, density 3): this audience
rewards clarity, and every animation is something the Site Owner cannot fix.

Palette sampled from the club logo: ring orange `#e17c2e` as the single accent, its strong and deep shades
for hover and for text contrast, the logo's gold core, and the near-black of its lettering as the ink.
Type is self-hosted Outfit for display and Source Sans 3 for body, both with the Latin Extended subsets the
Hungarian accents need.

`theme.json` and Tailwind split the work: see `docs/adr/0003-theme-json-owns-typography-and-colour.md`.
Editor parity was verified by inspecting the block editor settings, which carry the theme palette, both font
families, the heading styles and the self-hosted `@font-face` rules into the editor canvas.

Nothing on the home page is hardcoded. The opening section takes its heading from the site title, its
subtext from the tagline and its image from the home page's featured image; the rest of the page is whatever
the Site Owner composes in the block editor. The theme ships one club photograph as the empty state for that
image, and the logo is replaceable through the Customizer.

Review moved two things out. A Post listing on the home page was written and then removed: issue 04 owns
"the home page shows recent Posts", and it owns the owner journey that proves it. The word "hero" was
dropped from the code because `CONTEXT.md` reserves that language for **Slide**, and issue 05 puts Slides in
this very section.

One change here serves issue 03 as well as this one: the local nginx now listens on 8080 inside the
container as well as outside, so a browser running in a sibling container can request the same
`http://localhost:8080` the developer does. That is what made it possible to check the rendered design and
the phone layout.

**Left for other issues:**

- The hero and header link to `/jelentkezes` and `/edzeseink` only when those pages exist, and render
  without the buttons until then. Issues 06 and 12 create the pages, at which point the buttons appear.
- The mobile menu toggle has no automated coverage; the browser harness in issue 03 is the right place for it.
- The Forge deploy script must run the theme's asset build. Noted on issue 16.
