# 03: End-to-end test harness and the Site Owner's Editor role

**What to build:** The Site Owner signs in to the admin with the Editor role and can edit content, but cannot
reach templates, plugins, or global site configuration — so they cannot break the site while editing. This is
the deliberate correction of the outgoing system, where every authenticated user had full administrative
access.

This ticket also establishes the project's single testing seam: end-to-end browser tests run against the local
Docker environment, signing in as the Site Owner, changing something in the admin, and observing the change on
the public page. There is no prior art in this repository, so these tests set the convention. WordPress
integration tests at the PHP level are deliberately not used.

**Blocked by:** 01.

**Status:** done

- [x] A Site Owner account exists with the Editor role, never Administrator
- [x] Browser tests run against the local Docker environment with no host tooling
- [x] A test signs in as the Site Owner and asserts the template, plugin, and site-configuration screens are
      unreachable
- [x] The harness exposes a reusable way for later tickets to sign in as the Site Owner and assert an outcome
      on a public page
- [x] Tests can be run with a single documented command

## Comments

Built. `docker compose run --rm playwright` is the single command; the suite is Playwright in the official
Playwright container, sharing the nginx container's network namespace so the site answers on
`http://localhost:8080` there too — the address WordPress is installed under and redirects every other host
back to. The decisions are recorded in `docs/adr/0004-browser-tests-are-the-only-testing-seam.md`.

A Site Owner account (`owner` / `owner`, Editor role) is created on first container start next to the
developer's Administrator. Seven admin screens are asserted unreachable — the template editor, the theme
listing, the template file editor, the plugin listing, the site and permalink configuration, and the user
listing — plus two tests that keep those assertions honest: the Site Owner *can* reach the Posts screen, and
the admin menu offers no link to any of the seven.

Two things the build taught, both now in the ADR:

- **The suite signs in exactly once**, in a setup project whose session every test reuses. WordPress keeps
  one account's session tokens in a single row, so parallel sign-ins as the Site Owner invalidate each other
  and the losers are bounced to the login screen with `reauth=1`. This was a real, intermittent failure
  before the fix, and it will bite any later ticket that signs in again mid-run.
- **403 is the right assertion for every forbidden screen**, even though reading core suggests otherwise.
  `plugins.php`, `theme-editor.php` and both options screens refuse without a status code, but
  `wp-admin/menu.php` refuses first with an explicit 403 for any screen absent from the user's menu.

**Overlaps issue 04:** `tests/support/editor.ts` drives the block editor (open, title, publish, trash), and
`site-owner-publishes.spec.ts` uses it to prove the admin-to-public round trip the harness exists for. Issue
04 owns the Post behaviour itself — the permalink under `/hirek/`, the featured image, scheduling, and the
home page listing — and should build on these helpers rather than repeat them.

**Left for other issues:**

- The mobile menu toggle, noted on issue 02 as wanting this harness, has no coverage yet.
- URL parity (issue 13) and consent gating (issue 14) are the two other suites the spec names; neither is
  started.
- Nothing runs the suite in CI (Continuous Integration). No pipeline exists yet, so there is nowhere to put
  it; `forbidOnly` and a `list` reporter already switch on `CI` for whenever one arrives.
