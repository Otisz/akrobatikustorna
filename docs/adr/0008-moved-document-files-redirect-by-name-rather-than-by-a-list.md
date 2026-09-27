# Moved Document files redirect by name rather than through a list

The club's forms were served straight out of `public/documents/` on the outgoing site, and moving them into
the media library changed every one of their addresses. `base-document-redirects.php` catches a 404 under the
outgoing `/documents/` path and sends it, permanently, to whichever media library file a published Document
now offers under that name. There is no list of redirects anywhere.

The plan this work came from expected a hand-written redirect per file, for the files analytics showed still
received traffic, entered into a redirection plugin. Two things argued against it.

The first is that those redirects would live only in the database. The whole shape of this project puts what
the site's structure depends on in code — the permalink structure in `base-permalinks.php`, the structural
pages in `base-pages.php`, the field groups in each content type's file — because the Site Owner holds the
Editor role and because staging and production have to come up the same way as a fresh clone. A table of
redirects a developer typed into an admin screen once is the one thing in this site nobody could review,
reproduce, or notice the loss of.

The second is that the analytics question answers itself. The outgoing site had some two dozen files, and the
Site Owner transfers by hand the ones the club still circulates. That act *is* the judgement a traffic report
was going to inform — made by the person who knows which forms are current — so matching on the file's own
name redirects exactly the files that were kept, leaves a retired form to 404 as it should, and has nothing
to maintain afterwards and nothing to forget when a form is added next term.

The redirection module that came with the SEO (Search Engine Optimisation) plugin is left for what it is good
at: a page the Site Owner moves, or a one-off address nobody foresaw. See ADR-0007.

## Consequences

- **A form transferred under a new name is not redirected.** The old address matches nothing and 404s. This is
  the mechanism's one real gap; it is accepted because a renamed form is a different document in every sense a
  visitor cares about, and because a hand-written list would have gone stale the first time one was replaced.
- **Both sides of the comparison are normalised by the same function.** Uploading turns a space into a hyphen
  and drops what a file system would object to, so the outgoing name goes through the same treatment —
  `base_document_file_key()` — before the two are held against each other. A name normalised two different
  ways is a redirect that silently stops matching.
- **The lookup runs only on a 404 under `/documents/`.** Nothing this site serves is intercepted on its way,
  and the query it then makes reads a club's worth of Documents.
- **The redirect follows the Document rather than the file.** Replacing a form with a newer upload of the same
  name keeps the old address working; trashing the Document retires the address with it.
