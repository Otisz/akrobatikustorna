# Mail goes over SMTP, because a lost password reset is a lockout

The site sends barely any email. The one it does send is the one that matters: a password reset. The Site
Owner is the only person who edits this site, holds the Editor role rather than Administrator, and has no
colleague with a spare account — a reset that does not arrive is not an inconvenience, it is the end of their
access. PHP's `mail()` on a VPS (Virtual Private Server) hands the message to a local transport whose
deliverability nobody has established, and whose failures are silent at both ends: WordPress reports the same
"check your email" either way.

So mail is carried over SMTP (Simple Mail Transfer Protocol) through the club's existing Gmail mailbox,
`akrobatikustorna@gmail.com` — the address already published on the Contact page. It is an account the club
already has and already reads, which means the sender is an address a recipient recognises, and a bounce comes
back somewhere a human looks.

**WP Mail SMTP**, pinned in `composer.json` and activated by `docker/php/entrypoint.sh`. A `phpmailer_init`
hook in a must-use plugin would be twenty lines and no dependency, which is the option this project's short
plugin list would normally take. It loses the part that is worth having: the plugin records every send it
*failed* to make, with what the mail server said when it refused, on a screen in the admin. That is the
difference between "the reset did not arrive" and "Gmail rejected the app password" — and the moment it is
needed is the moment nobody can get in to add logging. It does not log successful sends; the plugin's verbose
email debug is off by default and left off, because a message the server accepted and then filed as spam is
not something any log on this side can show.

Its settings are **not** stored on its settings screen. The transport is defined as `WPMS_*` constants in
`config/application.php`, which the plugin prefers over anything in the database, and the mailbox and its app
password are read there from `.env`. What the mail looks like is filtered over the plugin's options in
`base-mail.php`, the way `base-analytics.php` configures the consent banner and for the same reason: the Site
Owner cannot reach a plugin settings screen, and mail that worked only because somebody once completed a setup
wizard would not survive a fresh install.

## Consequences

- **The password lives in `.env` and nowhere else.** It is a Gmail app password rather than the account's own,
  so it is revocable on its own and grants nothing but sending. `.env` is not in version control; the deployed
  environments are set by hand.
- **The From address is forced.** Gmail refuses to send as any address but the account that authenticated, and
  core's default is `wordpress@` on the site's own host — an address Gmail would reject and a recipient would
  not trust. `WPMS_MAIL_FROM_FORCE` and `WPMS_SET_RETURN_PATH` put the club's mailbox in both.
- **The From name follows the site title**, read in `base-mail.php` from `get_bloginfo('name')` rather than
  written out again, so the name in a recipient's inbox is the name the Site Owner sees in the admin.
- **An environment with no `SMTP_HOST` sends nothing reliably.** The constants are defined only when a host is
  given, so such an environment falls back to the server's own transport — the failure this ADR exists to
  avoid. That is deliberate: the alternative is guessing a host here, and a staging site quietly sending as the
  club is worse. The plugin says it is unconfigured in the admin, and every deployed environment sets the
  variable.
- **Mail is verified locally against Mailpit**, a `compose.yaml` service that speaks SMTP, delivers nothing and
  shows what was sent at <http://localhost:8025>. The PHP container has no sendmail binary, so a message that
  reaches Mailpit is proof of the transport rather than of WordPress having tried.
  `tests/specs/password-reset.spec.ts` asks for a reset from the login screen, reads the email out of Mailpit,
  follows the link and signs in with the new password — the whole journey, not the banner at the end of it.
- **That test resets the local administrator, not the Site Owner.** Resetting a password ends every session the
  account has open, and the suite shares one signed-in Site Owner session; resetting theirs would fail the
  tests running alongside. The flow is core's own and identical whichever account asks for it.
- **The plugin's own extras are switched off in code**: the weekly summary report email, addressed to an
  administrator inbox nobody reads, and the setup-wizard redirect that hijacks the first admin page after
  activation.
- **Verifying this on the deployed site is ticket 16's to finish.** Gmail's SMTP is reachable only where the
  credentials are, and neither production nor staging exists yet. Local Mailpit proves the site sends over
  SMTP and that the journey works end to end; it cannot prove Gmail accepts these credentials from that server.
