# Content types are registered in must-use plugins, not in the theme

Every custom post type the site introduces — Slide first, then Trainer, Department, Document, Recommended
Page, Sponsor and Video — is registered in its own file under `web/app/mu-plugins/`, alongside the permalink
structure that is already there. The theme renders content; it does not define what content exists.

The reason is that the club's content has to outlive the theme. A post type registered in `functions.php`
disappears the moment the theme is switched or replaced, taking the Site Owner's Slides out of the admin with
it while leaving the rows in the database. Must-use plugins also cannot be deactivated from the admin, which
matters here because the Site Owner holds the Editor role and must never be one click away from losing a
content type.

## Consequences

- **Post types and their fields are code, deployed by git**, the same as the permalink structure. Nothing
  about the content model is configured in the admin, and a fresh install comes up complete.
- **Field groups are declared in PHP**, through the fields plugin's own local-field API (Application
  Programming Interface), for the same reason. The Site Owner cannot reach the field editor, and a field
  group kept only in the database would not survive a fresh install.
- **The theme reads fields as plain post meta**, so a template renders whether or not the fields plugin is
  loaded — the plugin is how the Site Owner *enters* a value, not how the site *reads* one.
- **Whether a post type has an editing screen of its own is decided by what it supports.** A type with no
  body, such as a Slide, deliberately withholds `editor` support: WordPress then opens its classic screen,
  which is a short form of exactly the fields that type has, instead of a block canvas nobody types into.
- Ordering that the Site Owner controls uses WordPress's own `page-attributes` order field, rather than a
  plugin or a custom field, so the numbers in the admin list are the order on the page.
