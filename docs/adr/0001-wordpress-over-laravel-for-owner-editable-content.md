# WordPress over Laravel for owner-editable content

The previous site was a current, healthy Laravel 12 + Filament 4 + Inertia/React application, but most of
its content lived hardcoded in `.tsx` files, so the club owner had to wait on a developer to change even a
carousel image. We replaced it with WordPress (Roots Bedrock) because the site has no bespoke application
logic to preserve — signups are a Google Form, contact is static, there is no API — and WordPress lets the
owner edit content unaided, which was the only real requirement.

## Consequences

- Every piece of content must be a post, a field or a block. **Nothing that the owner might want to change
  may be hardcoded in the theme**, or this decision achieves nothing.
- We take on WordPress's update and security tax, which Laravel did not charge. Plugins are pinned in
  `composer.json` and updated via pull request, so plugin updates still need a developer.
- The plugin count is kept deliberately minimal; the old site's virtue was having almost no moving parts.
