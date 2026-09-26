# 01: Bedrock skeleton running locally in Docker

**What to build:** The developer clones the `wordpress` branch, runs `docker compose up`, and reaches a
working WordPress site and admin on localhost with no tooling installed on the host machine. The admin
interface is in Hungarian. Core and plugin versions are pinned in the project's dependency manifest, and the
admin's own update interface is disabled so an admin-initiated update cannot be reverted by the next deploy.

**Blocked by:** None (can start immediately).

**Status:** done

- [x] `docker compose up` from a fresh clone brings up WordPress and its database with no host tooling
- [x] Containers run PHP 8.4 and MySQL, matching production
- [x] The project is a Roots Bedrock layout, with `web/` as the document root
- [x] The uploads directory is excluded from version control
- [x] The admin interface displays in Hungarian
- [x] WordPress core and every plugin are pinned to explicit versions in the dependency manifest
- [x] Core minor releases auto-update; major releases do not
- [x] The admin update screens are disabled
