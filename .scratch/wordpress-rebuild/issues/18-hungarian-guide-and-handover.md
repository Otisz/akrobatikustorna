# 18: Hungarian guide and handover walkthrough

**What to build:** The Site Owner is walked through editing on staging and, unaided, replaces a carousel
image, edits the Schedule, and publishes a Post. They keep a short written guide in Hungarian so they can
remind themselves how to do a task they perform only once a term. Production is then switched to the new site.

The handover walkthrough is the acceptance test for the whole project. If the Site Owner cannot replace a
carousel image unaided on staging, the rebuild has not solved the problem that motivated it, regardless of how
well the code is written.

**Blocked by:** 13, 14, 15, 17.

**Status:** ready-for-agent

- [ ] A short guide in Hungarian covers each recurring task: Posts, Slides, Schedule, Trainers, Documents
- [ ] The Site Owner completes the walkthrough on staging and replaces a carousel image unaided
- [ ] Production is switched to the new site with every preserved URL resolving
- [ ] The Laravel site is kept intact but offline as a rollback for roughly two weeks
- [ ] The Laravel branch is archived after the rollback window closes
