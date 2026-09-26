# 06: Schedule page at `/edzeseink`

**What to build:** The Site Owner edits the training Schedule each term when session times change, entering
recurring weekly times once — the Schedule behaves like opening hours, not a calendar of dated events, so
there are no individual sessions to maintain. A parent finds the Schedule quickly and, on a phone, reads it
without horizontal scrolling.

The Schedule is a page containing an editable table rather than a repeating field group, because Advanced
Custom Fields free edition has no repeater field.

**Blocked by:** 02, 03.

**Status:** done

- [x] The Schedule resolves at `/edzeseink`
- [x] The Site Owner edits the times as a table in the block editor, with no developer involvement
- [x] The Schedule expresses recurring weekly times, not dated events
- [x] On a phone-width viewport the Schedule is readable without horizontal scrolling
- [x] The Schedule is reachable within one obvious step from the home page
- [x] Owner journey test: sign in as the Site Owner, change a training time, see the new time on `/edzeseink`

## Comments

**Implemented.** The Schedule is an ordinary WordPress page carrying a core table block, created and held at
`/edzeseink` by `web/app/mu-plugins/base-schedule.php`.

- **The page is created in code, once.** A page that existed only in the developer's database would not
  survive a fresh install, and staging and production would each come up without a Schedule. The mu-plugin
  publishes it on the first request after a deploy that has never had one, adopting a page already at the
  slug rather than publishing a second one beside it, and records the identifier so it is never repeated —
  a Site Owner who deletes the Schedule has decided something.
- **The slug is held to `edzeseink`.** Retitling a page renames its URL with it, which here would break the
  club's search rankings and every saved link without the Site Owner seeing it happen. Same reasoning as the
  permalink structure in `base-permalinks.php`.
- **The times are initial content, not configuration.** They were transferred by hand from the outgoing
  Laravel page (`resources/js/pages/schedule.tsx` on `main`) and written into the page once. From that
  moment the file is never read again, so nothing in code and the database can drift apart. The one
  simplification: the old first row packed three competitor levels into each cell with colour as the key,
  which is now three rows.
- **Phone readability is the theme's job, not the table's.** `inc/table.php` gives every body cell the text
  of its column heading as `data-label`, and below 64rem the stylesheet stacks each row into a card that
  prints the label above the time. Empty cells disappear rather than showing a day the group does not train.
  The head row is hidden visually but kept in the markup, because it is what a screen reader reads out.
- **Seeded block markup is a real risk**, because markup that does not match what the editor would itself
  save opens to a block recovery notice. The owner journey test asserts there is no such warning before it
  edits anything.

**From code review:**

- Table typography moved where ADR-0003 says it belongs: `theme.json` now sets the `core/table` size, and
  the rest of a table's shape lives in `resources/css/table.css`, which `editor.css` imports as well —
  the head row has no `theme.json` selector, and the Site Owner edits the Schedule *in the table itself*.
- `add_theme_support('align-wide')` was missing. The seeded table is wide, and without the support the
  Site Owner had no control to take it back — a developer-shaped gap in a ticket about doing without one.
- The no-sideways-scrolling test now runs at 1024px as well as 390px. The risk is not only the phone: just
  above the stacking width the table is a grid again, with six columns of times that must not spill.

**Left for other issues:**

- `/edzeseink` without a trailing slash is a 301 to `/edzeseink/`, the same shape as `/hirek/`. Whether that
  counts as parity belongs to issue 13.
- The `alignwide` table is wider than the content column. If later pages want a wide table by default rather
  than by the Site Owner's choice, that is a block style, not a change here.
