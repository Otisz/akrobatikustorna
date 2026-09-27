# 11: Sponsors and Recommended Pages

**What to build:** The Site Owner adds a Sponsor with a logo and link so supporters are credited without a
developer, and adds or removes a Recommended Page so the club's outbound links stay current.

Both stay separate post types rather than collapsing into an options page, because "add a sponsor" matches a
list in the Site Owner's mental model better than a nested field group does.

**Blocked by:** 02, 03.

**Status:** done

- [x] Sponsor is a custom post type with a name, logo, and URL, and no public URL of its own
- [x] Sponsor logos appear on the public site, each linking to the sponsor's site
- [x] Recommended Page is a custom post type with a name and URL, listed at `/ajanlott-oldalak`
- [x] Adding or removing either is reflected publicly with no developer involvement
- [x] Owner journey test: sign in as the Site Owner, add a Sponsor with a logo, see it credited on the public
      site

## Comments

**Implemented.** `web/app/mu-plugins/base-sponsors.php` and `web/app/mu-plugins/base-recommended-pages.php`
register the two post types. The theme credits Sponsors in a `Támogatóink` section that closes the home page
(`front-page.php`, `template-parts/sponsor.php`) and lists Recommended Pages at `/ajanlott-oldalak`
(`archive-recommended_page.php`, `template-parts/recommended-page.php`).

A Sponsor's name is its title and its logo the featured image; the organisation's address is the one field, and
it is required, so a logo cannot be published leading nowhere. The logo cannot be required the same way — it
is a featured image — so a Sponsor saved before its logo arrived is left out of the credits rather than shown
as a name over a blank space, and the admin list prints each Sponsor's logo and address so either case is
visible.
Credits are alphabetical: the club credits its Sponsors as equals, which also leaves no order to maintain.

A Recommended Page is a name and a required address, listed alphabetically for the same reason a Document is,
and each row opens in a new tab because the visitor is being sent somewhere the club does not own. Its own URL
redirects to the listing, as a Document's and a Video's do; deliberately not to the organisation's own site,
which would hand this site's address to a page it does not own.

Covered by `tests/specs/sponsors.spec.ts` and `tests/specs/recommended-pages.spec.ts`.
