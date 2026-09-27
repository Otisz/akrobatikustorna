# 18: Hungarian guide and handover walkthrough

**What to build:** The Site Owner is walked through editing on staging and, unaided, replaces a carousel
image, edits the Schedule, and publishes a Post. They keep a short written guide in Hungarian so they can
remind themselves how to do a task they perform only once a term. Production is then switched to the new site.

The handover walkthrough is the acceptance test for the whole project. If the Site Owner cannot replace a
carousel image unaided on staging, the rebuild has not solved the problem that motivated it, regardless of how
well the code is written.

**Blocked by:** 13, 14, 15, 17.

**Status:** ready-for-human

- [x] A short guide in Hungarian covers each recurring task: Posts, Slides, Schedule, Trainers, Documents
- [ ] The Site Owner completes the walkthrough on staging and replaces a carousel image unaided
- [ ] Production is switched to the new site with every preserved URL resolving
- [ ] The Laravel site is kept intact but offline as a rollback for roughly two weeks
- [ ] The Laravel branch is archived after the rollback window closes

## Comments

The guide is written and is `docs/site-owner-guide.hu.md`. Everything else on this ticket is a human act —
sitting with the Site Owner, moving a domain, waiting out a fortnight — so what an agent could do for those
was to write down what is done, in what order and what would send us back: `docs/handover.md`, which owns the
walkthrough and points at `docs/deployment.md` for the cutover steps themselves. The ticket is therefore
`ready-for-human` rather than done.

**Every label in the guide was read off the running site, not off the translation files.** A throwaway
Playwright spec printed the actual text of each button, panel and menu item the guide names, which corrected
eight of them — the submenu is *Bejegyzés hozzáadása* rather than *Új bejegyzés*, the media modal's button on
a Slide is *Kép kiválasztása* rather than the post type's own *Legyen ez a dia képe*, saving an
already-published page in the block editor is *Mentés* rather than *Frissítés* (the classic screens a Slide
and a Document open are still *Frissítés*), and the login link is *Elfelejtett jelszó?*. The spec was deleted
afterwards: it asserted nothing, and a test that only prints is not one.

`verify-urls.sh` is new, and is what makes "with every preserved URL resolving" a thing someone can check
rather than believe. It asks a deployed site for every address in `tests/support/preserved-urls.ts` — the same
list `url-parity.spec.ts` reads locally, so there is still one place an address is written down — following
redirects and asserting that each one lands on the page it names, and it finds a published Post and Trainer
from the listings so the two slug-taking addresses are covered too. It passes against the local site and
fails loudly against a wrong one.

**One defect found and deliberately not fixed here.** The **Fájl** field on a Document shows four English
words in an otherwise Hungarian admin — *No file selected*, *Add File*, *Select*, *Remove* — because the free
fields plugin's Hungarian translation leaves `Add File` untranslated and `Remove` empty, and its media modal
passes its own untranslated `Select File`. The guide names and translates them in place, and `handover.md`
flags them as the thing to watch the Site Owner on, but the honest fix is a `gettext` filter over the four
strings in `base-documents.php`. That belongs to ticket 09's code rather than to this one, so it is a
follow-up rather than a change smuggled in here.

### Review

`/code-review` on both axes. Seven findings acted on, one declined.

Standards: `handover.md` miscounted two lists it points at; it claimed `verify-urls.sh` runs "from anywhere
with curl", which is false — the script reads `preserved-urls.ts`, so it needs a checkout; "one group's time"
used a word CONTEXT.md keeps away from a Schedule row. The script did not carry the `ERROR:` prefix
`deploy.sh` and `staging-refresh.sh` use, and threw curl's stderr away, so a name that would not resolve
printed as a bare `000`. All fixed, and `handover.md` §4 now links deployment.md rather than restating the
rollback arrangement.

Spec, and the two that mattered:

- **The guide stated the saving rule wrongly.** It said the button reads *Frissítés* "for Slides and
  Documents", but five content types withhold `editor` and so open the classic screen — a Video, a Sponsor and
  a Recommended Page too. A Site Owner re-editing one of those would have met a button the guide had told them
  they would not see. It is now a two-row table keyed on the screen rather than a list of types.
- **`verify-urls.sh` could report success without checking the two slug-taking addresses.** When no Post or
  Trainer was found it said so and passed anyway, ending on "Every preserved address resolves" — the exact
  silent gap the script exists to close. A missing entry is now a failure: by the cutover the club has
  published both, so finding neither means either that the content did not come across or that the listing's
  markup moved out from under the search. Both paths are exercised: it passes against the local site and
  fails, with reasons and exit 1, against a host that is not the club's.

Spec also read the ticket against `spec.md`'s cutover list and found that **"kept intact but offline"** is not
what step 4 arranges: an address of its own is not offline, and two weeks of the outgoing site answering every
page is a second copy for a search engine to weigh against the new one. `handover.md` §4 now says to shut it
the way staging is shut — a password and a `noindex`, reachable for the developer checking a rollback and
nobody else.

Declined: the Document English-label defect is written out in three places, which the Standards axis read as
duplication. Each has a different reader — the Site Owner needs the words translated where they meet them, the
developer needs them flagged before watching the walkthrough, and the ticket needs the follow-up recorded.
