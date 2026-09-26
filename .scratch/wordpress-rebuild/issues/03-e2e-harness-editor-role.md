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

**Status:** ready-for-agent

- [ ] A Site Owner account exists with the Editor role, never Administrator
- [ ] Browser tests run against the local Docker environment with no host tooling
- [ ] A test signs in as the Site Owner and asserts the template, plugin, and site-configuration screens are
      unreachable
- [ ] The harness exposes a reusable way for later tickets to sign in as the Site Owner and assert an outcome
      on a public page
- [ ] Tests can be run with a single documented command
