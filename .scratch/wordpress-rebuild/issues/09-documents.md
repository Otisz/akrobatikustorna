# 09: Documents at `/dokumentumok`

**What to build:** The Site Owner uploads a Document and it appears in the downloads listing, so parents can
find forms and regulations; replacing it with a newer version means outdated forms stop circulating. A visitor
downloads a Document to complete offline.

Document files live in the media library, so their URLs change from the outgoing site. Redirects for the files
that receive real traffic are handled in ticket 13.

**Blocked by:** 02, 03.

**Status:** ready-for-agent

- [ ] Document is a custom post type whose listing resolves at `/dokumentumok`
- [ ] A Document has a title and a file held in the media library
- [ ] Uploading a Document makes it appear in the listing with no further steps
- [ ] Replacing the file makes the listing serve the newer version
- [ ] Owner journey test: sign in as the Site Owner, upload a Document, download it from
      `/dokumentumok` as a visitor
