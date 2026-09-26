# 16: Production Forge site

**What to build:** Deploying from the `wordpress` branch produces a fully working site on the club's existing
VPS, with no half-applied deploys and no destroyed media. The outgoing Laravel site remains deployable as a
rollback.

Hosting is Laravel Forge as a new site on the existing VPS. Forge's git deploy runs the dependency install
step, which is what Bedrock requires. Database backups are handled at the server level, not by a plugin.

**Blocked by:** 01.

**Status:** ready-for-agent

- [ ] The Forge site's web directory is Bedrock's `web/`, not the project root
- [ ] The deploy script runs the dependency install step automatically, so a deploy is never half-applied
- [ ] The uploads directory persists across deploys and is never destroyed by one
- [ ] Zero-downtime deploys are used only if uploads are symlinked outside the release directory
- [ ] Database backups are configured at the server level
- [ ] Every plugin the site depends on is active on the deployed site, and stays active after a deploy
- [ ] The Laravel site remains intact and deployable as a rollback

## Comments

**From 02 (theme foundation):** the theme's CSS and JavaScript are built by Vite into
`web/app/themes/base/build/`, which is gitignored. The Forge deploy script must run the asset build
(`npm ci && npm run build` in `web/app/themes/base`) alongside `composer install`, or the deployed site
will render unstyled.

**From 05 (carousel Slides):** whether a plugin is *active* is a row in the database, not a file, so
`composer install` alone leaves Advanced Custom Fields (ACF) installed but switched off — and a content type
whose field group never loads gives the Site Owner no way to enter the field. Locally
`docker/php/entrypoint.sh` activates it on container start; the deploy script needs the same step
(`wp plugin activate advanced-custom-fields`, guarded by `wp plugin is-active` so it is idempotent). The list
grows as the SEO, redirection, SMTP (Simple Mail Transfer Protocol) and cookie-consent plugins arrive.
