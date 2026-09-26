# Browser tests against the local Docker environment are the only testing seam

Every test in this project is a Playwright browser test that signs in to the admin as the Site Owner,
changes something, and asserts the outcome on a public page. They run in a container against the local
Docker environment, so the suite needs nothing installed on the host — the same constraint the rest of the
project works under.

WordPress integration tests at the PHP level are deliberately not used. The project's acceptance criterion is
*"the Site Owner can do this unaided"*, and the useful assertions all cross the same boundary: post type
registration, field storage, permalinks, templates and role restrictions only matter in combination, on the
rendered page. A second harness asserting that a post type was registered would add maintenance and no
confidence, because it would test WordPress rather than the site.

## Consequences

- **The tests share the developer's database.** There is no fixture reset. Tests that create content give it
  a unique title and move it to the trash afterwards, so a run leaves the site as it found it.
- **The suite signs in exactly once**, in a Playwright setup project whose session every test reuses.
  WordPress keeps one account's session tokens in a single row, so two simultaneous sign-ins as the Site
  Owner invalidate each other and the loser is bounced to the login screen. A test that signs in again would
  break every test running beside it.
- **The test container shares the nginx container's network namespace**, because WordPress redirects any host
  other than its configured `WP_HOME` back to it — so the tests must reach the site at `localhost:8080`, the
  same address the developer's browser uses.
- **Selectors are WordPress's own class names and element ids, never button labels.** The admin is Hungarian,
  and labels move with every translation update.
- **Role restrictions are asserted as HTTP (HyperText Transfer Protocol) 403 responses**, not as refusal
  text, for the same reason. Reading a screen such as `plugins.php` suggests otherwise, because its own
  refusal omits a status code — but `wp-admin/menu.php` refuses first, with an explicit 403, for every screen
  absent from the user's menu.
- **A Site Owner account is created on first container start** with the Editor role, so that what the tests
  exercise is what the Site Owner can actually do. An Administrator account still exists for the developer.
