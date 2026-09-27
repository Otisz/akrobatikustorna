# 10: Video gallery at `/galeria`

**What to build:** The Site Owner adds a Video to the gallery by pasting a YouTube link, without needing to
understand embeds, so recordings of competitions appear without a developer. A visitor watches gallery Videos
without leaving the site.

**Blocked by:** 02, 03.

**Status:** done

- [x] Video is a custom post type whose gallery resolves at `/galeria`
- [x] A Video has a title and a YouTube identifier the Site Owner supplies by pasting a link
- [x] Videos play in place on `/galeria`
- [x] Owner journey test: sign in as the Site Owner, add a Video by pasting a YouTube link, see it playable in
      the gallery

## Comments

**Implemented.** `web/app/mu-plugins/base-videos.php` registers the Video post type, and the theme renders
the gallery (`archive-video.php`, `template-parts/video.php`, the player in `resources/js/app.js`).

- **A Video is a title and a pasted address, and the editing screen is exactly that.** Withholding `editor`
  means WordPress opens its classic screen rather than the block editor, as it does for a Document, so the
  Site Owner gets a short form of the two things a Video is. The address is a required Advanced Custom
  Fields url field in the *main* column: like a Document's file and unlike a Trainer's role, the recording
  *is* the Video.
- **The address is reduced to YouTube's identifier where the meta is stored**, not in the field, so a Video
  written past the editing screen — imported, or made by WP-CLI (WordPress Command Line Interface) — holds
  what one saved from the screen holds. A watch address, a `youtu.be` one, an embed, a Short, a live stream
  and a bare identifier all name the same Video, and a timestamp or tracking parameter is discarded. The
  host is read rather than matched inside the text, so `not-youtube.com/watch?v=…` is not taken for YouTube.
- **The screen shows the canonical watch address back**, through `acf/load_value`, so the Site Owner can see
  which recording the site understood rather than wondering which part of what they pasted mattered. This is
  the one place the two readers disagree: the fields plugin hands out the address, the meta row holds the
  identifier, and everything reading a Video goes through `Base\video_identifier()`.
- **An address with no recording in it is refused at the screen**, in Hungarian, with what to do instead. A
  mistyped link would otherwise be published as a Video that plays nothing, and the gallery is the wrong
  place to find that out — the same reasoning that made a Document's file required.
- **Nothing is loaded from YouTube until a visitor presses play.** The gallery renders the recording's own
  thumbnail under a play control and swaps in the player *where it stands*, on the no-cookie host, which is
  what "plays in place" and "without leaving the site" mean together. Without JavaScript the control is an
  ordinary link to YouTube rather than a dead button, the same shape the carousel's arrows take.
- **The gallery is newest first**, with a tie broken by the newer identifier: a competition recording is
  watched from the one that just happened, and the Site Owner is given no order to maintain. The tie-break
  is not decoration — two Videos published in the same second came back in whatever order the database
  chose, which the ordering test caught.
- **A Video has one public address.** Its own URL (Uniform Resource Locator) is a 301 to its place on
  `/galeria`, as a Document's is to the listing, and no preview is exempted: the editing screen already
  shows the watch address, which the Site Owner can follow.

**From code review:**

- The identifier was read out of the pasted text with one regular expression, whose host patterns were
  unanchored — `https://evil-youtu.be/…` matched. The host is now parsed and checked against a list, and a
  refused off-host address is part of the editing-screen test.
- The alphabet check existed twice, in the plugin and in the theme. The theme's `video_identifier()` now
  delegates to the plugin's reader, which is also where the pattern is named.
- `base_video_youtube_id()` (parsed an address) and `Base\video_youtube_id()` (read a post) shared a name
  while taking different kinds of identifier. They are now `base_video_identifier()` and
  `Base\video_identifier()`, and the address-builder is `base_video_url()`, which the template uses rather
  than writing the watch address out a second time.
- The template wrote the watch address into an `href` through `esc_attr`; `esc_url` is the house form.
- The owner journey asserted the player's address but not that a visitor could see it. It now asserts both.

**Judgement calls, recorded rather than taken:**

- **The gallery is a facade rather than the embeds the spec says carry across "unchanged".** What carries
  across is the recordings and their addresses; a dozen players loading unasked on one page is a cost the
  outgoing site paid and this one need not. It also leaves ticket 14 less to undo, since YouTube sets
  nothing until a visitor has asked for a recording.
- **The heading and the browser title say "Galéria", not "Videók"**, through a `post_type_archive_title`
  filter, because a visitor arrives at the club's gallery while the Site Owner edits Videos — the glossary
  gives the type and its page different words.
- **`save()` in `classic-editor.ts` now waits longer for the success notice.** The failure it fixes was not
  this feature's: the suite runs in parallel against a PHP (Hypertext Preprocessor) pool of five workers,
  and a save queued behind several others outran an assertion's usual window. Left as a local timeout rather
  than a global `expect` timeout, so a genuine failure anywhere else still fails fast.
- **`video-gallery.spec.ts` rather than `videos.spec.ts`**, following `carousel-slides.spec.ts`: the file is
  named for the behaviour under test, which is a Video reaching the gallery.
- **The admin list's identifier column and the empty-identifier suppression are not in the criteria**, as
  the equivalents were not in ticket 09's. They are what makes a required field survive the cases it cannot
  reach, and the column is the only place a Video with no recording becomes visible to the Site Owner.

**Left for other issues:**

- **Nothing links to `/galeria` yet**, as with `/edzok`, `/szakosztalyok` and `/dokumentumok`. The archive is
  offered in the menu editor, and the navigation structure belongs with the pages still to come.
- **The club's recordings still have to be added**, by hand, from the club's YouTube channel: the gallery
  comes up empty on staging and production until someone pastes the links.
- Whether `/galeria` matches the outgoing site's gallery URLs exactly, and the data-driven parity test, are
  issue 13.
