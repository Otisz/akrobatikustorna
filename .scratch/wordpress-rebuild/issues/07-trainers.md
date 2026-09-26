# 07: Trainers at `/edzok`

**What to build:** The Site Owner adds a Trainer with a portrait, role, and biography the day they join,
controls the order Trainers are listed in to reflect the club's own sense of seniority, and removes a Trainer
who has left so the site shows no stale staff. A parent sees who will be teaching their child.

The outgoing per-Trainer free hex colour field is dropped. If the design wants a per-Trainer accent it is a
selection from a fixed palette, never a free colour picker.

**Blocked by:** 02, 03.

**Status:** done

- [x] Trainer is a custom post type whose rewrite slug resolves at `/edzok/{slug}`
- [x] A Trainer has a portrait, a role, and a biography
- [x] The Site Owner controls the listing order
- [x] Removing a Trainer removes them from the public listing
- [x] No free colour picker is offered
- [x] Owner journey test: sign in as the Site Owner, add a Trainer with a portrait, see them in the listing at
      the intended position

## Comments

**Implemented.** `web/app/mu-plugins/base-trainers.php` registers the Trainer post type at `/edzok`, and the
theme renders the listing (`archive-trainer.php`) and a Trainer's own page (`single-trainer.php`).

- **A Trainer is the block editor's own shape.** The portrait is the featured image, the name is the title,
  the biography is the body, and the order is `page-attributes`' number — only the role needs a field, so it
  is a single text field declared in code. Unlike a Slide, a Trainer has a body, so `editor` support is kept
  and the Site Owner writes a biography in the same editor, with the same fonts and colours, as a Post.
- **The order field has left the block editor's sidebar.** WordPress now renders only the Parent row for a
  post type supporting `page-attributes`; the number is reachable through Quick Edit in the admin list (and
  through the editor's own Actions menu). The list is the better of the two anyway — it is where one
  Trainer's position can be seen against the others — so the mu-plugin prints each Trainer's number as a
  column there, sorts the list by it, and the test drives Quick Edit exactly as the Site Owner would.
- **`with_front` is off.** The permalink structure puts every post under `/hirek`, and without this a Trainer
  would resolve at `/hirek/edzok/{slug}`.
- **Rewrite rules now rebuild when a content type is added, not only when the permalink structure changes.**
  `base-permalinks.php` compared the cached signature against the structure alone, so a new post type came up
  404 until something else flushed. The signature is now read from the registered types' own paths, which
  means the next content type needs nothing remembered.
- **No colour anywhere.** The outgoing per-Trainer hex field is gone, and a test holds the editing screen to
  it, because this is the kind of field that returns by accident.
- **The listing shows the whole staff.** `posts_per_page` is unlimited on the archive: a club has few enough
  coaches that paginating would only break the order the Site Owner put them in.

**From code review:**

- The archive's heading and empty state were literals in the template while the post type already declared
  the same words as labels. They now come from the labels, so the Site Owner's word for Trainers is written
  once.
- The rewrite signature read only each type's single-post slug, so changing an archive path alone would have
  left exactly the stale rules it was written to prevent. It now covers the archive and `with_front` too.
- A Trainer saved without a portrait showed an empty grey tile in the listing. The frame is now drawn only
  when there is a picture, as a Post's card already does.
- The order test published its two Trainers outside the block that trashes them, so a failure halfway would
  have left staff on the site for the next run to find.
- The colour-picker test asserted two absences without ever asserting the form it was looking at had
  rendered, so it would have passed on a screen with no fields at all. It now checks the role field is there
  first.

**Left for other issues:**

- **Nothing links to `/edzok` yet.** The archive is offered in the menu editor as a post type archive, so the
  Site Owner can add it; a deliberate navigation structure belongs with the pages that are still to come.
- Whether `/edzok` without a trailing slash should redirect is part of issue 13, as it was for `/edzeseink`.
