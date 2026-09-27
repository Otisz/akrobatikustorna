# The SEO plugin is chosen for speaking Hungarian

Titles and meta descriptions come from **Slim SEO**, pinned in `composer.json` and activated by
`docker/php/entrypoint.sh` alongside its Hungarian translation. `base-seo.php` narrows it to the content that
has a page of its own.

The obvious candidate was The SEO Framework, which is the better-built plugin: no advertisements, no
upselling, a settings screen the Editor role cannot reach, and sensible output from the moment it is switched
on. It was installed first, and dropped for one reason — it has no Hungarian translation and never has had
one. Every other plugin decision in this project can be argued both ways; this one cannot. The Site Owner
reads these two fields every time they publish a page, and the whole project rests on them being able to work
unaided in their own language, to the point that `entrypoint.sh` treats a missing core translation as a failed
start rather than a site that quietly comes up in English. An SEO (Search Engine Optimisation) panel labelled
in English, inches from the Hungarian one WordPress itself renders, is the same failure in a smaller place.

Slim SEO's Hungarian is complete for the screens the Site Owner sees, including the ones its editor panel
draws in JavaScript, so the plugin's own translation is installed as a start-up step beside the core one.

## Consequences

- **Nothing needs configuring.** Slim SEO writes a title, a description, a canonical address and the social
  tags from the page itself, so a page published without either field touched is still findable. Its settings
  screen asks for `manage_options` and lives under Settings, where the Site Owner cannot reach it, and nothing
  on it has to be visited for the site to be correct.
- **It brings more than titles.** Breadcrumbs, schema, a sitemap, image alt text, a redirection module and an
  AI (Artificial Intelligence) assistant all ship in the same plugin, where The SEO Framework would have
  brought fewer. `base-seo.php` withholds the fields, the admin column and the sitemap entries from the four
  content types whose own address redirects to their listing; the rest is left as it comes.
- **The redirection module is what answers the plan's "a redirection plugin".** It is part of this plugin
  rather than a second one, its settings are Administrator-only, and the per-post redirect field it adds is in
  Hungarian beside the SEO fields. The club's *moved Document files* are not redirected through it — see
  ADR-0008 — but a page the Site Owner ever moves can be.
- **The sitemap includes each content type's listing**, which is the substance of this site and which The SEO
  Framework's sitemap would have omitted. `url-parity.spec.ts` asserts the listings are in it and the
  redirecting entries are not.
