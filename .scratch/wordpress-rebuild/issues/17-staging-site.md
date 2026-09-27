# 17: Staging site

**What to build:** A staging site on a subdomain of the same server that the Site Owner can reach and practise
on, but search engines cannot, so the handover can be rehearsed without risking the live site or its rankings.

**Blocked by:** 16.

**Status:** ready-for-human

- [ ] Staging runs on a subdomain of the same server as production
- [ ] Staging is password-protected and the Site Owner can reach it
- [ ] Staging is excluded from search engine indexing
- [ ] Staging is populated with the real content the Site Owner will practise on
- [ ] Staging deploys from the same branch and deploy process as production

## Comments

**From 05 (carousel Slides):** staging is a separate database, so it needs the plugin activation step from
16 in its own right — an inactive Advanced Custom Fields (ACF) on staging would hide fields from the Site
Owner during the very walkthrough staging exists to rehearse.

**From the implementation pass (2026-09-27):** the repository side is done and the Forge side is not — the
second Forge site, the DNS (Domain Name System) record for the subdomain, the certificate, staging's own
database and its `.env` all need the panel and the server. None of the criteria are ticked, for the same
reason as on 16: every one of them is a statement about a deployed site, and there is no staging site yet.
Each is a step in the runbook and is ticked when it has been done for real.

What the branch now carries:

- `config/environments/staging.php` — what `WP_ENV=staging` changes, and deliberately little: core's
  environment type, so an editor with both sites open can tell them apart, and the two credentials read out
  of the environment. Everything else is production's configuration, because a rehearsal on a differently
  configured site rehearses the wrong site.
- `web/app/mu-plugins/base-staging.php` — the gate, keyed off `WP_ENV` and inert everywhere else. It answers
  401 with a Hungarian sentence and a Basic authentication challenge before the plugins, the theme or a
  single query of the club's content have run; it exempts WP-CLI (WordPress Command Line Interface), which is
  how the deploy and the refresh reach the site and is already behind SSH (Secure Shell), and `wp-cron.php`,
  which is WordPress asking itself for a page and where a 401 would leave every scheduled task unrun in
  silence. **A staging site whose `STAGING_PASSWORD` is unset answers 503 to everything** rather than serving
  the club's real content to anyone who asks — the failure worth designing against here is not a guessed
  password but a site that came up wide open because a line was missing from a file nobody read.

  Indexing is refused separately from access, so that it survives the password coming off for an afternoon:
  the `X-Robots-Tag: noindex, nofollow` header on every response, `blog_public` filtered off so core writes
  `noindex` into the markup, the SEO plugin's sitemap emptied of everything it could list so `/sitemap.xml`
  is a 404 rather than a copy of the club's every address under staging's domain, and a `robots.txt` that
  disallows everything. (The SEO (Search Engine Optimisation) plugin's sitemap, not core's, which is why
  `blog_public` alone does not settle it.) Filters rather than stored rows, because staging's database is overwritten by each
  refresh from production. The `robots_txt` filter runs at `PHP_INT_MAX`: Slim SEO appends a `Sitemap:` line
  of its own after it, which would be an invitation printed under a refusal.
- `staging-refresh.sh` — the answer to the criterion about real content, and run before each rehearsal rather
  than once at setup: exports production's database with production's own WP-CLI, empties staging's and
  imports it, rewrites production's addresses to staging's (`--skip-columns=guid`), `rsync --delete`s the
  media library across, and hands off to `deploy.sh` for the plugin and rewrite facts. Production is only
  ever read. Before it touches anything it refuses to run unless the site it was run from says
  `WP_ENV=staging`, unless the site it was pointed at says `WP_ENV=production`, and unless the two name
  different databases and different addresses — it destroys the site it is run from, so being run from the
  wrong directory is the one mistake it must not be able to make.
- `deploy.sh` — one addition: a staging site with no `STAGING_PASSWORD` fails the deploy with that as the
  reason, rather than deploying successfully into a site that answers 503 for an unstated one. Everything
  else is unchanged, which is the criterion about deploying by the same process: staging is the same branch
  through the same script.
- `docs/deployment.md` — a Staging section: the subdomain, its own database, its `.env` (staging's `WP_ENV`
  and `WP_HOME`, the staging password, fresh salts, production's SMTP (Simple Mail Transfer Protocol) block,
  and no `POSTHOG_*`), no `wp core install`, the refresh command, and five checks to run against the site
  once it is up.
- `docs/adr/0012-staging-is-shut-in-php-so-the-gate-deploys-with-the-site.md` — why the gate is a must-use
  plugin in this repository rather than HTTP Basic authentication in the site's nginx configuration, and what
  that trades away: a file under `web/app/uploads` is served by nginx without passing through PHP, so a media
  URL somebody already knows is readable without the password. That is the reason the indexing half does not
  depend on the password half.

Verified locally rather than argued: the gate probed over HTTP against the site running with `WP_ENV=staging`
— 401 with the challenge for no credentials and for wrong ones, through to WordPress for the right ones, 401
on `/wp/wp-login.php` too, 503 on every request with the password unset, and 200 on `wp-cron.php` in both
cases; the four indexing filters read back under `WP_ENV=staging` and confirmed unchanged under
`development`; both scripts shellcheck clean; and the full browser suite green (68 tests), which is what
says the gate is inert on a site that is not staging.

Two things this leaves for the deployed site. Both scripts' server-side halves are unrun — `staging-refresh.sh`
has never had two real sites to stand between, so its checks are verified by reading and its copy is not.
And no browser test covers the gate: it keys off an environment the local site is not in, and standing a
second configured site up inside `compose.yaml` to assert a 401 would be a larger change than the file it
tests.

**From the review pass:** the spec reviewer found the gate bypassable and it is now closed. The cron
exemption matched any path *ending* in `/wp-cron.php`, and nginx hands an address it cannot find on disk to
`index.php` — so `GET /wp-cron.php?p=1` rendered the club's content with the gate stepped over. It now reads
`DOING_CRON`, which `wp-cron.php` defines about itself before it loads WordPress and which nothing a request
can say puts there. Probed: the two fake cron addresses answer 401, the real script still answers 200.

Four smaller findings, all applied: the `X-Robots-Tag` value is named once rather than written twice; the
`base_staging_refuse()` headers parameter had one caller passing one header and is gone; the third exemption
(any request from the command line, beside WP-CLI's own) was undocumented and is now stated in both the
docblock and the ADR, which also no longer credits `blog_public` with withholding a sitemap that is not
core's; `staging-refresh.sh` compares `DB_HOST` with `DB_NAME` rather than the name alone; the runbook says
that a staging site deployed but never refreshed has no active plugins, because `deploy.sh` stops short of
its database half until there is a database; **Staging** is in `CONTEXT.md`; and the acronyms the repo spells
out are spelled out here too.

Two findings left as they are, on purpose. The uploads directory is readable without the password, which
ADR-0012 states as the price of a gate in PHP rather than in nginx. And `robots.txt` answers 401 like
everything else while the password is on — it is read only once the password comes off, which is the case it
exists for; the `X-Robots-Tag` header is on the 401 itself.
