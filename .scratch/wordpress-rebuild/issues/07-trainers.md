# 07: Trainers at `/edzok`

**What to build:** The Site Owner adds a Trainer with a portrait, role, and biography the day they join,
controls the order Trainers are listed in to reflect the club's own sense of seniority, and removes a Trainer
who has left so the site shows no stale staff. A parent sees who will be teaching their child.

The outgoing per-Trainer free hex colour field is dropped. If the design wants a per-Trainer accent it is a
selection from a fixed palette, never a free colour picker.

**Blocked by:** 02, 03.

**Status:** ready-for-agent

- [ ] Trainer is a custom post type whose rewrite slug resolves at `/edzok/{slug}`
- [ ] A Trainer has a portrait, a role, and a biography
- [ ] The Site Owner controls the listing order
- [ ] Removing a Trainer removes them from the public listing
- [ ] No free colour picker is offered
- [ ] Owner journey test: sign in as the Site Owner, add a Trainer with a portrait, see them in the listing at
      the intended position
