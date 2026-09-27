# Deploys are in place, so the uploads directory is left alone

Laravel Forge offers two shapes of deploy. The default updates the site's one directory in place: it pulls
the branch over the working copy and runs the deploy script there. The other is **zero-downtime**, which
builds each deploy into a numbered release directory and, when the build succeeds, moves a symlink to it —
nothing the visitor sees changes until the whole release is ready.

This site deploys **in place**.

The reason is the uploads directory. Everything else this site is made of comes from version control or from
Composer, and can be rebuilt from the branch; `web/app/uploads` cannot. It holds the Site Owner's own
photographs and the club's forms, files that exist in one place and are irreplaceable, and it is excluded
from version control precisely because they are not the developer's to carry. Under an in-place deploy that
directory simply stays where it is: a `git pull` over a working copy does not touch a path git does not
track, and the deploy script's only dealing with it is a `mkdir -p` for the server that has never had one.
Under a zero-downtime deploy, uploads land inside a release directory that the *next* deploy replaces and the
one after that deletes — the Site Owner's media would go with it, unless a symlink out to a shared directory
is configured and stays configured. That symlink is the whole of what zero-downtime would require here, and
it is one configuration nobody would notice the absence of until the media was already gone.

What is bought with the risk is the seconds between `git pull` landing and `composer install` finishing,
during which a visitor can be served a page assembled from mismatched parts. On a club website read by a few
dozen people a day, that is worth less than not being able to destroy the media, and it is the only window
that is left: the theme's assets are built into a directory beside the live one and moved into place when the
build is finished, because Vite empties its output directory before it writes and that directory is the one
the site is being served out of — an unstyled site for the length of a build would be a longer and far more
visible outage than the deploy itself.

## Consequences

- **The deploy script is `deploy.sh` in the repository**, not text typed into the Forge panel. Forge's own
  field pulls the branch and runs that file, so what a deploy does is reviewed alongside the code it deploys,
  and production and staging cannot drift apart — staging (ticket 17) runs the same file from the same
  branch.
- **Zero-downtime deploys must stay off**, on both sites. Switching one on without first symlinking
  `web/app/uploads` to a shared directory outside the release would destroy the club's media on the second
  deploy after it. That is the only reason this file exists, and it is the one decision here the script
  enforces rather than documents: `deploy.sh` refuses to run from a path under `releases/`, which is where
  Forge builds a zero-downtime release, so switching it on fails the deploy instead of the media.
- **A deploy is all-or-nothing as far as it can be**, which is not entirely. The script runs under
  `set -euo pipefail`, so a failed step stops it rather than carrying on; the database steps are guarded by a
  query that separates a database which cannot be reached, where the deploy fails loudly, from one where
  WordPress has simply never been installed, where it says so and stops. What it cannot promise is the middle
  of `composer install`: an install interrupted part-way leaves a mixed `vendor`, and the fix is to deploy
  again rather than anything this script can do.
- **WP-CLI (WordPress Command Line Interface) is a production dependency**, not a development one. The deploy
  installs with `--no-dev`, and the steps that cannot be done from the checkout — activating a plugin,
  applying a core schema change, flushing the rewrite rules — are all WP-CLI. Having it in `composer.json`
  keeps it pinned and means nothing is installed on the server by hand; it is also what the developer reaches
  for over SSH.
- **The database is the one thing a deploy cannot roll back.** Reverting the branch and deploying again
  restores the code, but a schema change applied by `wp core update-db` stays applied. That is what the
  server-level database backups are for, and why they are configured before the site takes real content.
