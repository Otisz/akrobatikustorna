# 15: SMTP and a password reset that actually arrives

**What to build:** The Site Owner resets their own password and receives the email, so they are never locked
out of their own site. Mail is routed through the club's existing mailbox, because the server's default mail
transport is unreliable and a failed password reset is a lockout.

**Blocked by:** 01.

**Status:** ready-for-human

- [x] An SMTP plugin is installed and pinned, routing mail through the club's existing mailbox — WP Mail SMTP
      4.9.0, pinned in `composer.json` and activated by `entrypoint.sh`, sending through the club's Gmail
      account `akrobatikustorna@gmail.com`, the address already published on the Contact page. Chosen over the
      twenty lines of `phpmailer_init` this project's short plugin list would normally prefer, for the one
      thing those lines cannot give: a record in the admin of every send that failed and what the mail server
      said when it refused, which is the difference between "the reset did not arrive" and "Gmail rejected the
      app password" — and the moment it is needed is the moment nobody can get in to add logging. Recorded as
      ADR-0010
- [x] Credentials are supplied by environment configuration, never committed — `SMTP_HOST`, `SMTP_PORT`,
      `SMTP_ENCRYPTION`, `SMTP_USER`, `SMTP_PASSWORD` and `MAIL_FROM` come from `.env` into `WPMS_*` constants
      in `config/application.php`, which the plugin prefers over anything on its settings screen. The password
      is a Gmail app password, revocable on its own. What the mail *looks* like — the club as sender, under the
      site's own title — is filtered over the plugin's options in `base-mail.php` instead, the way
      `base-analytics.php` configures the consent banner, so it survives a fresh install with nobody opening a
      setup wizard
- [x] A password reset requested from the login screen is received and works end to end —
      `tests/specs/password-reset.spec.ts` asks for the reset at `wp-login.php`, reads the email out of the
      mailbox, follows the link in it, sets the password and signs in with it. A `mailpit` service in
      `compose.yaml` is the local mailbox: it speaks SMTP, delivers nothing, and shows what was sent at
      <http://localhost:8025>. The PHP container has no sendmail binary, so a message that arrives there is
      proof of the transport rather than of WordPress having tried
- [ ] The reset is verified on the deployed environment, not only locally — **blocked on 16.** Neither
      production nor staging exists yet, and Gmail's SMTP is reachable only where the credentials are. Local
      Mailpit proves the site sends over SMTP and that the whole journey works; it cannot prove Gmail accepts
      these credentials from that server. Ticket 16 sets `SMTP_*` and `MAIL_FROM` on the deployed environment
      and walks the reset by hand

## Comments

**Beyond the acceptance criteria:** the From address is forced over core's own. Gmail refuses to send as any
address but the account that authenticated, and core's default is `wordpress@` on the site's host — an address
Gmail would reject and a recipient would not trust. `WPMS_SET_RETURN_PATH` puts the club's mailbox in the
return path too, so a bounce comes back somewhere a human reads. The From *name* is read from
`get_bloginfo('name')` rather than written out again, so the name in a recipient's inbox is the name the Site
Owner sees in the admin. Two of the plugin's extras are switched off in `base-mail.php`: the weekly summary
report email, addressed to an administrator inbox nobody reads, and the setup-wizard redirect that hijacks the
first admin page after activation.

**An environment with no `SMTP_HOST` sends nothing reliably**, and that is deliberate. The constants are
defined only when a host is given, so the site falls back to the server's own transport — the failure this
ticket exists to avoid. The alternative is guessing a host in `application.php`, and a staging site quietly
sending as the club is the worse mistake. The plugin says it is unconfigured in the admin, where only an
administrator sees it.

**The test resets the local administrator, not the Site Owner.** Resetting a password ends every session the
account has open, and the suite shares one signed-in Site Owner session — resetting theirs would fail the tests
running alongside it. The flow is core's own and identical whichever account asks for it. The password is set
back to what it started as, so a second run finds the account it expects.
