# Spec: WordPress rebuild of the club website

Status: ready-for-agent

## Problem Statement

The club's website is a Laravel 12 + Filament 4 + Inertia/React application. It is modern and healthy, but
most of its content — the home carousel, the training Schedule, Department descriptions, contact details,
the gallery, sponsor logos — is hardcoded in React component files. The Site Owner cannot change any of it.

The consequence is that the Site Owner waits on a developer to replace a single image. Content that should
change every term, such as the Schedule, changes only when a developer has time. The club's website is
therefore perpetually slightly out of date, and the developer is a permanent bottleneck on work that carries
no engineering value.

## Solution

Replace the site with WordPress, managed as a Roots Bedrock project, so that the Site Owner publishes and
edits all content themselves through a Hungarian admin interface, and the developer is needed only for
design and structural change.

Every piece of content becomes a post, a field, or a block. Nothing the Site Owner might reasonably want to
change is hardcoded in the theme — this is the constraint that determines whether the project succeeds, and
it is what separates this rebuild from simply moving the same problem to a different framework.

The visual design is refreshed at the same time, targeting the primary visitor: a parent deciding whether to
enrol their child. Public URLs are preserved exactly, so existing search rankings survive the change.

## User Stories

### Site Owner — content

1. As the Site Owner, I want to add, edit, and delete news Posts, so that I can announce club events without
   a developer.
2. As the Site Owner, I want to attach a featured image to a Post, so that news items look complete on the
   home page and in listings.
3. As the Site Owner, I want to schedule a Post to publish at a future date, so that I can prepare
   announcements in advance.
4. As the Site Owner, I want to replace the images in the home page carousel, so that the site reflects
   recent club activity.
5. As the Site Owner, I want to reorder the carousel Slides, so that the most important image appears first.
6. As the Site Owner, I want to add a caption and an optional link to a Slide, so that a carousel image can
   point visitors somewhere useful.
7. As the Site Owner, I want to edit the training Schedule, so that I can update it each term when session
   times change.
8. As the Site Owner, I want the Schedule to behave like opening hours rather than a calendar of dated
   events, so that I enter recurring weekly times once instead of maintaining individual sessions.
9. As the Site Owner, I want to add a Trainer with a portrait, role, and biography, so that new coaches
   appear on the site the day they join.
10. As the Site Owner, I want to control the order in which Trainers are listed, so that the listing reflects
    the club's own sense of seniority.
11. As the Site Owner, I want to remove a Trainer who has left, so that the site does not show stale staff.
12. As the Site Owner, I want to upload a Document and have it appear in the downloads listing, so that
    parents can find forms and regulations.
13. As the Site Owner, I want to replace a Document with a newer version, so that outdated forms are not
    circulated.
14. As the Site Owner, I want to edit Department descriptions and images, so that each sport section
    describes itself accurately.
15. As the Site Owner, I want to add a Sponsor with a logo and link, so that supporters are credited without
    a developer.
16. As the Site Owner, I want to add a Video to the gallery by pasting a YouTube link, so that recordings of
    competitions appear without me understanding embeds.
17. As the Site Owner, I want to add or remove a Recommended Page, so that the outbound links stay current.
18. As the Site Owner, I want to edit the contact details, address, phone number, and email in one place, so
    that they update everywhere they appear.
19. As the Site Owner, I want to create a brand new page and embed a Google Form in it, so that I can run a
    signup or survey without asking for a new feature.
20. As the Site Owner, I want to see the admin interface in Hungarian, so that I can work in my own language.
21. As the Site Owner, I want the block editor to show the same colours and fonts as the live site, so that
    what I compose is what visitors see.

### Site Owner — safety and confidence

22. As the Site Owner, I want to be unable to alter templates, plugins, or global site structure, so that I
    cannot break the site while editing content.
23. As the Site Owner, I want to preview a change before publishing it, so that I can check my work.
24. As the Site Owner, I want to be able to reset my password and actually receive the email, so that I am
    never locked out of my own site.
25. As the Site Owner, I want a short written guide in Hungarian, so that I can remind myself how to do a
    task I perform only once a term.
26. As the Site Owner, I want to practise editing on a staging site before launch, so that I am confident the
    new site is genuinely mine to run.

### Visitor

27. As a parent considering the club, I want to see recent photographs and news, so that I can judge whether
    the club is active and well run.
28. As a parent considering the club, I want to find the training Schedule quickly, so that I can check
    whether the times fit our week.
29. As a parent considering the club, I want to read about each Department, so that I can work out which one
    suits my child.
30. As a parent considering the club, I want to see who the Trainers are, so that I know who will be teaching
    my child.
31. As a parent considering the club, I want an obvious way to apply, so that I can enrol without hunting for
    a contact address.
32. As a visitor, I want to download club Documents, so that I can complete forms offline.
33. As a visitor, I want to read a news Post at the same URL a search engine gave me, so that existing links
    and bookmarks continue to work.
34. As a visitor on a phone, I want the Schedule to be readable without horizontal scrolling, so that I can
    check times on the move.
35. As a visitor, I want to watch gallery Videos without leaving the site, so that browsing is uninterrupted.
36. As a visitor, I want to find the club's location on a map, so that I can get there.
37. As a visitor, I want to be asked before analytics cookies are set, so that my consent is genuine.
38. As a visitor who declines cookies, I want analytics not to run at all, so that declining means something.

### Developer

39. As the developer, I want the local environment to run entirely in Docker, so that no tooling is installed
    on my machine.
40. As the developer, I want the local environment to match the production PHP and database versions, so that
    problems surface locally rather than on the VPS.
41. As the developer, I want plugins pinned in the project's dependency manifest, so that a deploy cannot
    silently revert a plugin version.
42. As the developer, I want deploys to run the dependency install step automatically, so that a deploy is
    never half-applied.
43. As the developer, I want uploads to survive deploys, so that deploying never destroys the Site Owner's
    media.
44. As the developer, I want a staging site the Site Owner can reach but search engines cannot, so that we
    can rehearse the handover.
45. As the developer, I want the old Laravel site to remain deployable until the new site is proven, so that
    I have a rollback.
46. As the developer, I want a test that asserts every preserved URL still resolves, so that a permalink
    mistake cannot ship silently.

## Implementation Decisions

### Platform and hosting

- WordPress, managed as a **Roots Bedrock** project. Recorded as ADR-0001.
- The project lives on the `wordpress` **orphan branch** of the existing `akrobatikustorna` repository,
  checked out as a git worktree alongside the Laravel checkout. Recorded as ADR-0002.
- Local development runs on **plain `docker compose`** committed to the repo — no locally installed tooling.
  Containers match production: **PHP 8.4** and **MySQL**.
- Hosting is **Laravel Forge** on the club's existing VPS, as a new site. Forge's git deploy runs the
  dependency install step, which is what Bedrock requires.
- The Forge site's web directory must be Bedrock's **`web/`**, not the project root.
- The uploads directory is excluded from version control and must persist across deploys. Forge zero-downtime
  deploys are not used unless uploads are symlinked outside the release directory.
- A **staging site** on a subdomain of the same server, password-protected and excluded from indexing.

### Content model

All content types use English identifiers with Hungarian admin labels and Hungarian URLs, per the naming
convention in `CONTEXT.md`.

| Content | Shape | Public URL |
| --- | --- | --- |
| Post | native WordPress posts | `/hirek/{slug}` |
| Trainer | custom post type — role, portrait, biography, order | `/edzok/{slug}` |
| Document | custom post type — title, file | `/dokumentumok` |
| Department | custom post type — name, description, image | `/szakosztalyok` |
| Recommended Page | custom post type — name, URL | `/ajanlott-oldalak` |
| Slide | custom post type — image, caption, optional link | none |
| Sponsor | custom post type — logo, name, URL | none |
| Video | custom post type — YouTube identifier, title | `/galeria` |
| Schedule | a page containing an editable table | `/edzeseink` |
| Contact details | theme options, surfaced on a page | `/kapcsolat` |
| Apply | a page containing a Google Form embed | `/jelentkezes` |

- The old per-Trainer hex colour field is **dropped**. If the new design wants a per-Trainer accent, it is a
  selection from a fixed palette, never a free colour picker.
- Custom fields use **Advanced Custom Fields, free edition**. This means **no repeater fields**: lists are
  modelled as custom post types, and the Schedule is an editable table rather than a repeating field group.
- Four small content types (Recommended Page, Slide, Sponsor, Video) are kept as separate post types rather
  than collapsed into an options page, because "add a sponsor" matches a list in the Site Owner's mental
  model better than a nested field group does.

### Permissions

- The Site Owner is granted the **Editor** role, never Administrator. Editors cannot modify templates,
  plugins, or global site configuration. This is what makes an otherwise powerful editing environment safe,
  and it is the deliberate correction of the outgoing system, where every authenticated user had full
  administrative access.

### Design

- The visual design is **refreshed**, not replicated, produced via the `design-taste-frontend` skill.
- The primary visitor is **a parent deciding whether to enrol a child**, which makes photography and the
  Schedule the two most important elements, and warmth more important than edginess.
- The existing club logo is retained; the palette is derived from it.
- Styling is **Tailwind compiled by Vite** within the theme. The palette and type scale are additionally
  expressed in the theme's block editor configuration, so the editing experience matches the published page.

### URLs, migration, and SEO

- **Every public page URL is preserved exactly.** Posts use a permalink structure matching the existing news
  path; each custom post type declares a rewrite slug matching its existing path.
- Document files move into the media library. Their URLs therefore change; redirects are added for the files
  that analytics show receive real traffic, rather than for all of them.
- Content is transferred **by hand** — the volume is small and no migration script is justified.
- Content currently hardcoded in React component files does not exist in any database and must be authored
  fresh.

### Plugins

Deliberately minimal. Each addition is a thing the Site Owner can trip over and the developer must maintain.

- **Advanced Custom Fields (free)** — structured fields.
- **An SEO plugin** — titles and meta descriptions, to carry across the existing SEO work.
- **A redirection plugin** — for moved Document files.
- **An SMTP plugin** — routed through the club's existing mailbox, because the server's default mail
  transport is unreliable and a failed password reset locks the Site Owner out.
- **A cookie-consent plugin** — which must genuinely prevent analytics from loading before consent, not merely
  display a banner.

Anything beyond this list requires justification.

### Retained integrations

The Google Form used for applications, the Google Maps embed, YouTube gallery embeds, and the existing
PostHog analytics property all carry across unchanged. Retaining the same analytics property preserves
historical continuity across the cutover, which is what makes it possible to judge whether the new site
helped or hurt.

### Operations

- Plugin and core versions are pinned in the dependency manifest and updated by pull request. The admin
  update interface is disabled, because an admin-initiated update would be reverted by the next deploy.
- Core minor releases auto-update; major releases are applied manually.
- Database backups are handled at the server level rather than by a plugin.

### Cutover

1. Build and populate the staging site.
2. Walk the Site Owner through editing on staging, and hand over the Hungarian guide.
3. Switch production to the new site.
4. Keep the Laravel site intact but offline as a rollback for roughly two weeks.
5. Archive the Laravel branch.

## Testing Decisions

### What makes a good test here

A good test exercises what the Site Owner or a visitor actually does, through the same interface they use,
and asserts an observable outcome on the public site. It does not assert that WordPress registered a post
type, that a field exists, or that a template function returned a string — those are assertions about the
framework and about implementation detail, and they will break on every refactor while catching nothing.

The project's real acceptance criterion is *"the Site Owner can do this unaided."* Tests should be readable
as evidence for that claim.

### The seam

**One seam: end-to-end browser tests against the local Docker environment.** Every behaviour worth testing
crosses the same boundary — sign in as the Site Owner, change something in the admin, observe the change on
the public page. That single seam exercises post type registration, field storage, permalinks, templates, and
role restrictions together, without a second test harness.

WordPress integration tests at the PHP level are **deliberately not used**. They would largely assert that
WordPress behaves like WordPress, and would require maintaining a second harness for no additional
confidence.

There is no prior art in this repository — it is a new project — so these tests establish the convention.

### What is tested

- **Owner journeys**, one test each for the highest-value tasks: replacing a carousel Slide, editing the
  Schedule, publishing a Post, adding a Trainer, uploading a Document. These are the tasks whose difficulty
  caused the rebuild.
- **Role restriction**: a user with the Editor role cannot reach template, plugin, or site-configuration
  screens.
- **URL parity**: a data-driven test asserting that every preserved public URL resolves successfully. This is
  the cheapest possible guard on the SEO work and the easiest thing to break silently.
- **Consent gating**: no analytics requests are issued before consent is given.

Coverage is deliberately shallow beyond these. This is a brochure site with no business logic; exhaustive
testing would cost more than the site is worth.

## Out of Scope

- **Any member-management, competition-results, booking, or payment functionality.** Applications continue to
  go through the existing Google Form.
- **A native contact form.** The contact page remains static details plus a map, as today.
- **Multilingual content.** The site is Hungarian only; no second locale is introduced.
- **MCP integration.** The official WordPress MCP server requires either WordPress.com hosting or a paid
  Jetpack plan, which is not justified for a convenience that benefits only the developer. A self-hosted MCP
  adapter may be revisited after launch; command-line access over SSH covers the same ground at no cost.
- **Preserving the outgoing application's data structures.** Nothing is exported programmatically.
- **Replicating the previous visual design.** The design is intentionally refreshed.

## Further Notes

- **A live security issue on the outgoing site should be fixed independently of this work, and sooner.** The
  Laravel application still routes registration requests to a working controller even though no interface for
  it exists, and its admin panel authorises every authenticated user unconditionally. Anyone able to reach
  the site may therefore be able to register themselves into full administrative access. This is minutes of
  work and should not queue behind the rebuild.
- **The production database engine is unconfirmed.** Exploration found conflicting signals between the
  environment configuration and the schema. The consequence is negligible because content is being retyped,
  but it should be confirmed before anyone assumes an export is possible.
- **The handover walkthrough is the acceptance test for the whole project.** If the Site Owner cannot replace
  a carousel image unaided on staging, the rebuild has not solved the problem that motivated it, regardless
  of how well the code is written.
- Several content types in the outgoing system — FAQ entries, a document library, and a configurable
  navigation structure — existed in the schema via a third-party package but were unused by the public site.
  They are not carried across.
