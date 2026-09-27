# Staging is shut in PHP, so the gate deploys with the site

Staging is a second Forge site on the same server, on a subdomain of the club's domain, deploying the same
`wordpress` branch through the same `deploy.sh`. What makes it staging rather than a second live site is that
it holds a **copy of production's content** — the real pages, the real media, the real member-facing
documents — and that the Site Owner is going to practise on it. Both of those make it something no search
engine and no stranger may read.

There are two places that gate could live. The server's own: HTTP (HyperText Transfer Protocol) Basic
authentication in the site's nginx configuration, typed into the Forge panel. Or the site's: a must-use plugin in this repository that refuses
the request before WordPress has read any of the club's content.

It is **the site's** — `web/app/mu-plugins/base-staging.php`, keyed off `WP_ENV=staging`.

The reason is the same one ADR-0011 gives for `deploy.sh` being a file in the branch rather than text in a
panel: a gate that lives in the repository is reviewed with the code, and a new staging site inherits it by
being deployed rather than by somebody remembering. The nginx version has to be re-entered on every site that
needs it, survives no rebuild that Forge does not ask about, and is invisible from here — there is nothing in
this repository a reviewer could read to find out whether staging is open to the world.

What the PHP gate gives up in exchange is that it only covers requests PHP answers. A file in
`web/app/uploads` is served by nginx directly, so a media URL that somebody knows the whole of is readable
without the password. That is the reason the indexing half of this file is separate from the password half and
does not depend on it: `robots.txt` on staging disallows everything, so the address of an upload is not
something a crawler can come to know, and the password keeps it from being linked from any page a crawler
could read. The remaining exposure is somebody who already has a production media URL guessing the staging
one, which is the same file they already have.

The gate fails closed. A staging site whose `STAGING_PASSWORD` is unset answers **503 to every request**
rather than serving the club's content unprotected, and `deploy.sh` fails the deploy before that can be
discovered by a visitor. The failure this decision is most concerned with is not somebody guessing the
password; it is a staging site that came up wide open because one line was missing from an environment file
nobody thought to look at.

## Consequences

- **`WP_ENV=staging` is what makes a site staging**, and `config/environments/staging.php` is the whole of
  what that changes: core's environment type, and the two credentials. Everything else is production's
  configuration, because a rehearsal on a differently configured site rehearses the wrong site.
- **One shared password, not accounts.** Staging is reached by the Site Owner and the developer. The accounts
  *inside* staging are production's own, copied with the database, which is what lets the Site Owner practise
  as themselves.
- **Three kinds of request are exempt.** WP-CLI, and anything else run from the command line: the deploy and
  the refresh reach staging over SSH (Secure Shell), which is a stronger gate than this one, and cannot
  answer a password prompt. And core's own cron request — `wp-cron.php` is WordPress asking itself for a
  page, and a 401 there would leave every scheduled task unrun and say nothing. That one is recognised by
  `DOING_CRON`, which the cron script defines about itself, never by the address asked for: nginx hands an
  address it cannot find on disk to `index.php`, so an exemption keyed on the path would be an exemption
  anybody could ask for by name.
- **Indexing is denied four ways** — the `X-Robots-Tag` header on every response, `blog_public` filtered off
  so core writes `noindex` into the markup, the SEO (Search Engine Optimisation) plugin's sitemap emptied of
  everything it could list so that `/sitemap.xml` is a 404 rather than a copy of the club's every address
  under staging's own domain, and a `robots.txt` that disallows everything. The sitemap needs filters of its
  own because it is the plugin's rather than core's and pays `blog_public` no attention; the `robots.txt`
  filter runs last of everything, because the plugin appends a `Sitemap:` line of its own after it. Filters
  rather than stored rows throughout, because staging's database is overwritten by each refresh from
  production and a stored answer would not survive one.

  Note what this does *not* rest on: while the password is on, `robots.txt` answers 401 like everything else,
  so the `Disallow: /` is only read once the password comes off — which is the case it is there for. The
  header is on the 401 itself.

  Bedrock's own `config/environments/development.php` states the same intention as a `DISALLOW_INDEXING`
  constant. Nothing in WordPress or in this site reads that constant, so staging spells the four mechanisms
  out instead of defining it.
- **Staging sends real email.** Its `.env` carries the same Gmail credentials, because a handover rehearsal
  in which the password reset does not arrive rehearses nothing. Mail sent from staging is indistinguishable
  from mail sent from the live site, which is the point and also the thing to remember before generating
  content there.
- **Analytics stays off.** `POSTHOG_KEY` and `POSTHOG_HOST` are left out of staging's environment file, and
  `base-analytics.php` prints nothing without both — so a rehearsal does not land in the club's figures. This
  is the one production setting staging deliberately does not carry.
