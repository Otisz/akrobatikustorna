# 09: Documents at `/dokumentumok`

**What to build:** The Site Owner uploads a Document and it appears in the downloads listing, so parents can
find forms and regulations; replacing it with a newer version means outdated forms stop circulating. A visitor
downloads a Document to complete offline.

Document files live in the media library, so their URLs change from the outgoing site. Redirects for the files
that receive real traffic are handled in ticket 13.

**Blocked by:** 02, 03.

**Status:** done

- [x] Document is a custom post type whose listing resolves at `/dokumentumok`
- [x] A Document has a title and a file held in the media library
- [x] Uploading a Document makes it appear in the listing with no further steps
- [x] Replacing the file makes the listing serve the newer version
- [x] Owner journey test: sign in as the Site Owner, upload a Document, download it from
      `/dokumentumok` as a visitor

## Comments

**Implemented.** `web/app/mu-plugins/base-documents.php` registers the Document post type, and the theme
renders the listing (`archive-document.php`, `template-parts/document.php`).

- **A Document is a title and a file, and the editing screen is exactly that.** Withholding `editor` means
  WordPress opens its classic screen rather than the block editor, as it does for a Slide, so the Site Owner
  is given a short form of the two things a Document is rather than a writing surface with nothing to write
  in. The file is a required Advanced Custom Fields file field in the *main* column, not the sidebar: unlike
  a Trainer's role or a Slide's link this is not something beside the content — it *is* the Document. Made
  required because a Document that downloads nothing is not a Document, and the editing screen is the one
  place the Site Owner can still see what went wrong.
- **Replacing the file is choosing another one in that field**, which is the whole of the "newer version"
  criterion: the listing reads the field, so it follows. The test proves it by reading the listing's link
  before and after the replacement and asserting the address *changed*, rather than only that it now
  mentions the newer fixture.
- **Documents are listed alphabetically**, as the outgoing site listed them (`Document::orderBy('title')`).
  A parent arrives looking for a named form, and it is the one order that asks the Site Owner to maintain
  nothing — which is what makes "uploading makes it appear with no further steps" true. The listing is
  unpaginated, as the Trainer and Department listings are.
- **A Document has one public address**, the same shape ticket 08 gave a Department: its own URL is a 301 to
  its place on `/dokumentumok`. Deliberately *not* a redirect to the file, which would give the same download
  two addresses on a rebuild whose point is to keep the club's search rankings.
- **The listing shows the file's extension and size** beside each name, so a parent knows whether they are
  about to open a reader or a word processor, and on what connection. The whole row is the link, and it
  carries the `download` attribute so a click saves the form rather than opening a viewer the parent then has
  to save from — which is what the outgoing site did, and what "complete offline" means.
- **No initial content, unlike the Departments and the Schedule.** The club's Documents are real files, not
  prose that can be written in a mu-plugin. The outgoing site's copies are on the `main` branch under
  `public/documents/`; moving them into the media library is hand-work for the content transfer, and the
  redirects for those of them that receive traffic are ticket 13.

**From code review:**

- The comment on the listing's `meta_query` claimed it caught a file deleted from the media library. It does
  not: deleting the attachment leaves its identifier in post meta, so the Document passes the query and is
  dropped a step later, where `template-parts/document.php` finds nothing to link to. Both places now say
  which case each actually catches, and so does the README.
- The redirect's silence about previews read as an oversight against ticket 08, which exempted them. It is a
  decision, and now says so: a Department draft is prose the Site Owner can read nowhere else, whereas a
  Document draft is a file the editing screen already names, sizes and links to, so a preview would show
  nothing new. There is therefore no `single-document.php`.
- `document_file()` returned the extension under the name `kind`, which said less than it knew.
- Two words named a Document as something `CONTEXT.md` says to avoid — "the club's downloads" and "the media
  library attachment a Document is". Both now say Document, or say *its file*.
- **The classic editing screen was a second verbatim copy.** `document-editor.ts` had reproduced
  `slide-editor.ts`'s `#title`, `#publish`, `#message.notice-success` and `#delete-action` handling. Those
  now live in `tests/support/classic-editor.ts` — the counterpart of `editor.ts` for post types without a
  body — and both screens' support files hold only what is their own. `saveSlide` and `trashSlide` were left
  delegating to it and have gone.

**Judgement calls, recorded rather than taken:**

- **Ticket 08's ordering-extraction trigger is not met.** It said to extract the shared `pre_get_posts` and
  `menu_order` column hooks "when the third full copy lands". A Document orders by *title*, has no
  `menu_order` at all and no Quick Edit column, so it is not a third copy of those three hooks — it is a
  different two. The trigger stands for whichever of Sponsor, Video or Recommended Page first wants the Site
  Owner's own numbering.
- **`setFile`, `chooseFile` and `FileFixture` keep the word "file"**, which `CONTEXT.md` lists among the
  words to avoid for a *Document*. They name the file a Document holds, which is the spec's own word for it
  ("custom post type — title, file"), and `chooseFile` names a media-modal action rather than any Document.
  The rule bites when "file" stands in for the Document itself, which nothing here does.
- **The admin list's file column and the missing-file suppression are not in the criteria.** They are what
  makes the required field survive contact with the cases it cannot reach — an imported Document, or a file
  deleted afterwards — and the column is the only place either becomes visible to the Site Owner.
- The archive query does not set `no_found_rows` even though `slides()` does, because the Trainer and
  Department archives do not either, and being the odd one out is worse than one avoidable `COUNT`.

**Left for other issues:**

- **Nothing links to `/dokumentumok` yet**, as with `/edzok` and `/szakosztalyok`. The archive is offered in
  the menu editor, and a deliberate navigation structure belongs with the pages still to come.
- **The club's own Documents still have to be uploaded.** The listing comes up empty on staging and
  production until someone moves `public/documents/` into the media library by hand.
- `/dokumentumok` without a trailing slash is a 301 to `/dokumentumok/`, the same shape as the other
  listings; whether that counts as parity, and the data-driven URL-parity test the spec asks for, are
  issue 13.

**Discovered while testing:** the media-library helper could not upload a fixture the library did not
already hold. It searched for the fixture, and left that search in place while uploading, so WordPress
returned to a filtered library the new upload did not match — nothing selected, the insert button dead, and
the modal open on a file that had in fact uploaded. Every image fixture was already in the developer's
library, so the suite had never taken that branch since the first run. The search is now cleared before the
upload, and the insert button is waited for rather than assumed.
