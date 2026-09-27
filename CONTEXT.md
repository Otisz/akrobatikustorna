# Budai Akrobatikus Sport Egyesület

The public website of a Hungarian acrobatic gymnastics club. Its purpose is to let prospective members'
parents understand the club and enrol, and to let the club owner publish content without a developer.

## Naming convention

**Code is English; visitors see Hungarian.** Identifiers, post types, fields, functions and file names use
the English term from this glossary. Admin labels, front-end copy and URLs use the Hungarian term.

## Language

**Site Owner**:
The club's representative, who publishes and edits all content. Holds the WordPress Editor role, never
Administrator.
_Avoid_: admin, client, user

**Trainer** (`edző`, URL `/edzok`):
A coach who leads training sessions, presented with a portrait, role and biography.
_Avoid_: coach, instructor, staff

**Department** (`szakosztály`, URL `/szakosztalyok`):
A sport section of the club that a member belongs to.
_Avoid_: section, division, group, team

**Schedule** (`edzéseink`, URL `/edzeseink`):
The club's recurring weekly training times, read like opening hours rather than a calendar of dated events.
_Avoid_: timetable, calendar, session, training event

**Post** (`hír`, URL `/hirek`):
A dated news item published by the Site Owner.
_Avoid_: news article, blog post, story

**Document** (`dokumentum`, URL `/dokumentumok`):
A downloadable club file, such as a form or regulation, listed for visitors.
_Avoid_: file, download, attachment

**Recommended Page** (`ajánlott oldal`, URL `/ajanlott-oldalak`):
An outbound link to a related organisation the club points visitors towards.
_Avoid_: partner, external link, useful link

**Slide** (`dia`):
One image in the home page carousel.
_Avoid_: banner, hero image

**Sponsor** (`támogató`):
An organisation supporting the club, shown as a logo linking to their site.
_Avoid_: partner, supporter

**Contact details** (`kapcsolati adatok`, URL `/kapcsolat`):
The club's telephone numbers, email addresses, postal address and the venue it trains in, edited on one
screen and shown on the Contact page and in the footer of every page.
_Avoid_: contact info, contact form, address book

**Venue** (`tornacsarnok`):
The gymnasium the club trains in, named and mapped on the Contact page. One of the Contact details rather
than a thing of its own: the club trains in one hall.
_Avoid_: gym, hall, location, site

**Apply** (`jelentkezés`, URL `/jelentkezes`):
The page carrying the Google Form a parent fills in to enrol a child. The club takes no applications any
other way.
_Avoid_: signup, registration, enrolment form

**Video** (`videó`, URL `/galeria`):
A YouTube recording embedded in the gallery.
_Avoid_: gallery item, media

**Consent** (`hozzájárulás`):
A visitor's answer to whether the site may measure their visit, given or declined in the banner and changeable
afterwards. Nothing is measured until it is given.
_Avoid_: cookie banner, GDPR notice, opt-in

**Analytics** (`látogatottsági mérés`):
What the club learns about how the site is used, from the same PostHog property the outgoing site reported to.
_Avoid_: tracking, statistics, metrics

**Staging** (`próbaoldal`):
A second deployed site on a subdomain of the same server, holding a copy of production's content, which the
Site Owner practises on before the handover. Reached only with the one shared password it is shut behind, and
kept out of every search engine's index. Its counterpart is **production** — the live site, the one visitors
read.
_Avoid_: test site, dev site, sandbox, preview
