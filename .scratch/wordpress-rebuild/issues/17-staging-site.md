# 17: Staging site

**What to build:** A staging site on a subdomain of the same server that the Site Owner can reach and practise
on, but search engines cannot, so the handover can be rehearsed without risking the live site or its rankings.

**Blocked by:** 16.

**Status:** ready-for-agent

- [ ] Staging runs on a subdomain of the same server as production
- [ ] Staging is password-protected and the Site Owner can reach it
- [ ] Staging is excluded from search engine indexing
- [ ] Staging is populated with the real content the Site Owner will practise on
- [ ] Staging deploys from the same branch and deploy process as production

## Comments

**From 05 (carousel Slides):** staging is a separate database, so it needs the plugin activation step from
16 in its own right — an inactive Advanced Custom Fields (ACF) on staging would hide fields from the Site
Owner during the very walkthrough staging exists to rehearse.
