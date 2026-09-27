# Handover

The handover is this project's acceptance test. Everything else — the content types, the role, the URL
(Uniform Resource Locator) parity, the tests — was built so that the club's representative can publish
without a developer, and the only evidence that it worked is watching them do it. If the Site Owner cannot
replace a carousel image unaided on staging, the rebuild has not solved the problem that motivated it,
however well the code reads.

It happens in this order, and the order is the point: the Site Owner is convinced on staging *before* the
domain moves, so that the cutover is a DNS (Domain Name System) change rather than a leap.

## 1. Refresh staging

`bash staging-refresh.sh /home/forge/akrobatikustorna.hu`, from staging's own directory — see
[deployment.md](deployment.md#filling-it-with-productions-content). Run it on the day, not the week before:
the whole value of staging is that the Site Owner meets their own pages, with their own photographs, and
practising against last month's content teaches the wrong site.

Then check staging answers — the checks under
[Checking it](deployment.md#checking-it) — and confirm the guide still matches what the screens say. The
admin's wording comes from WordPress's and the plugins' own Hungarian translations, so a version bump can
rename a button the guide names.

## 2. The walkthrough

Sit with the Site Owner. Give them the address, the shared staging password, their own username and password,
and [the guide](site-owner-guide.hu.md) — printed, because it is read beside a screen that is already full.

Then let them work. The instruction is the task, never the click: *"replace the first carousel image with this
photograph"*, not *"open Diák, click the title…"*. Each of these is a thing they will do again, once a term,
alone:

1. **Replace a carousel image.** The acceptance test proper. They should reach the Diák screen, swap the
   image on an existing Slide, save, and see the new photograph on the home page.
2. **Edit the Schedule.** Change one row's time on one day, save, and read it back on `/edzeseink`.
3. **Publish a Post.** A title, a paragraph, a featured image; then find it on the home page and under
   `/hirek`.
4. **Add a Trainer, and move them up the listing.** The order is changed through Quick Edit in the admin
   list, which is the one step nothing on the editing screen hints at — so it is the one to watch.
5. **Replace a Document's file.** Into the same Document rather than a new one, so the listing does not end
   up with two forms under one name. Worth saying out loud while they do it: the outgoing site's
   `/documents/…` links are carried across by *file name*, so a newer version uploaded under a different
   name leaves those particular links behind — see
   [ADR-0008](adr/0008-moved-document-files-redirect-by-name-rather-than-by-a-list.md).
6. **Change a telephone number.** On the Kapcsolat screen, and then seen in the footer of every page.

**Write down every place they hesitate.** A hesitation is a defect in either the guide or the admin, and it
is cheaper to fix now than to answer by telephone every term. Two things known to need the guide's help,
because they cannot be fixed in the admin alone:

- The **Fájl** field on a Document is the free fields plugin's, whose Hungarian translation is missing
  *No file selected*, *Add File*, *Select* and *Remove* — four English words in an otherwise Hungarian
  screen, which the guide names and translates in place.
- **Order** is not on the editing screen for a Trainer or a Department. WordPress's block editor no longer
  offers the field, so it lives in the admin list's Quick Edit.

Finish by having them **reset their own password** from `/wp/wp-login.php` and read the mail in the club's
mailbox. Staging sends real mail through the club's real mailbox, so this rehearses the one thing that, if
broken, locks them out of the site with nothing they can do about it.

Do not move on until the Site Owner has done all six unaided. That is the sign-off.

## 3. Cut over

The steps, and the order they have to happen in, are
[deployment.md's Cutover and rollback](deployment.md#cutover-and-rollback). Follow them in that order: the
reason for it is there too.

Immediately afterwards, over SSH (Secure Shell) from the site's own directory:

```sh
bash verify-urls.sh https://akrobatikustorna.hu
```

The cutover is not finished until that passes; the script's own header says why it exists and what it reads.
Then the remaining two checks under
[After the first deploy to a new environment](deployment.md#after-the-first-deploy-to-a-new-environment):
a password reset that arrives in the club's mailbox, and a page that is styled.

## 4. The rollback window

What the window *is* — the Laravel site left deployable at an address of its own, and rolling back being the
domain and `WP_HOME` moved back with it — is [deployment.md step 4](deployment.md#cutover-and-rollback).
What is worth writing down here is the judgement.

The spec asks for the Laravel site to be kept **offline** rather than merely moved, and an address of its own
is not offline: left open at `regi.akrobatikustorna.hu` it is a second copy of the club's every page for a
search engine to find and weigh against the new site's. So when the domain moves, shut the old site to the
public the same way staging is shut — a password in its nginx configuration, and a `noindex` header with it.
Reachable for the developer checking a rollback, reachable for nobody else.

**Roughly two weeks**, because it spans a term's rhythm: a training week, a weekend competition, and at least
one occasion on which the Site Owner publishes something on their own. What would send us back is a thing
that cannot be fixed forward — content that did not survive the transfer, or addresses that turn out to have
moved — not a layout complaint.

## 5. Archive the Laravel branch

Once the window closes and nobody has asked to go back:

- Delete the Forge site for the Laravel application, after taking a final database dump off-server.
- Tag `main` at its last deployed commit — `laravel-final`, say — so the outgoing application stays readable
  at a name rather than a hash, and push the tag.
- Leave `main` in place. The `wordpress` branch is an orphan branch of this same repository precisely so that
  the history of what was replaced is still here; see
  [ADR-0002](adr/0002-wordpress-on-an-orphan-branch-of-the-laravel-repo.md).

The one thing to do before then rather than after: make sure everything the new site needs out of the old one
has actually been transferred. The Documents' files, the Sponsors' logos and the Recommended Pages are the
club's own content and are **not** in code — they live on `main` under `public/documents/`,
`resources/js/data/sponsors.ts` and in the `recommended_pages` table.
