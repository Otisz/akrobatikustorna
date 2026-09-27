# Contact details are site options on a screen the Editor role can reach

The club's address, telephone numbers and email addresses are WordPress options, registered in
`base-contact.php` and edited on an admin screen of the site's own making. They are not a content type, not
fields on the Contact page, and not theme options in the Customizer.

There is exactly one set of contact details, so a post type would be a list with one row in it that the Site
Owner could accidentally make two of. Fields on the Contact page would tie the numbers to that page, and the
footer of every page needs them too — "edit in one place, update everywhere" is the whole requirement.

The Customizer is where WordPress itself keeps theme options, and it is out of reach: `edit_theme_options`
belongs to the Administrator, and the Site Owner holds the Editor role. The fields plugin's own options-page
API (Application Programming Interface) is Pro-only in the pinned free edition — `acf_add_options_page()`
does not exist — and an options page built through the plugin's admin screens would live only in the
database, which ADR-0005 rules out for the same reason field groups are declared in PHP.

What is left is WordPress's own Settings API (Application Programming Interface) on a top-level menu page
gated on `edit_pages`, which the Editor role holds. `options.php` asks for `manage_options` before saving
anything, so the screen's option group carries an `option_page_capability_` filter to lower that to
`edit_pages` for this group alone.

## Consequences

- **The club's real details are registered defaults, not rows in the database.** A fresh install — staging,
  or production before the Site Owner has opened the screen — comes up with the details the outgoing site
  carried. The first save makes them the Site Owner's; clearing a field stores an empty value, and an empty
  detail is left off the page rather than printed as a label with nothing after it.
- **Each detail is sanitised by its kind**, and the map's address is restricted to Google's own hosts. A
  frame source is the one detail on the screen that executes in a visitor's browser, and the Site Owner is
  being asked for a map, not for a page of someone else's choosing.
- **Both telephone numbers and both email addresses are separate options.** The free fields plugin has no
  repeater, and the club has exactly two of each; a second number is left empty rather than removed.
- **The Contact page renders the details from a template part, chosen by which page carries them** rather
  than by a `page-kapcsolat.php` template. WordPress would want that file named for the page's Hungarian
  slug, and slugs are visitor-facing strings rather than names for code.
