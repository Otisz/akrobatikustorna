# 05: Carousel Slides on the home page

**What to build:** The Site Owner replaces the images in the home page carousel, reorders the Slides so the
most important image appears first, and gives a Slide a caption and an optional link pointing visitors
somewhere useful. Visitors see recent club photography at the top of the home page.

Slides are a custom post type with no public URL of their own. Replacing a carousel image unaided is the
single task the handover walkthrough is judged on.

**Blocked by:** 02, 03.

**Status:** done

- [x] Slide is a custom post type with an English identifier, Hungarian admin labels, and no public URL
- [x] A Slide has an image, a caption, and an optional link
- [x] The Site Owner controls the order Slides appear in
- [x] The home page carousel renders the published Slides in that order
- [x] Owner journey test: sign in as the Site Owner, replace a Slide's image, see the new image on the home
      page

## Comments

Implemented on the `wordpress` branch.

- `web/app/mu-plugins/base-slides.php` registers the `slide` post type — Hungarian labels, `public => false`
  so it has no URL, `post` capabilities so the Editor role governs it — plus the `slide_link` meta and the
  field group that fills it in. Registered in a must-use plugin rather than the theme, recorded as ADR-0005.
- The image is the featured image, the caption is the title, and the order is `page-attributes`' own number;
  withholding `editor` support gives the Site Owner WordPress's short classic form instead of an empty block
  canvas. The admin listing is sorted by that order, so what the list shows is what the carousel does.
- `template-parts/carousel.php` renders the published Slides where the home page's hero image used to be,
  falling back to that image when no Slide is published. Scroll snapping carries it without JavaScript; the
  arrows are rendered hidden and revealed by `resources/js/app.js`. A Slide saved without an image is left
  out of the carousel rather than shown as a blank panel.
- `tests/specs/carousel-slides.spec.ts` covers publishing a Slide with its caption and link, replacing a
  Slide's image — the journey the handover is judged on — and the order the Site Owner puts Slides in. The
  media modal moved into `tests/support/media-library.ts`, now shared with the Post tests.
