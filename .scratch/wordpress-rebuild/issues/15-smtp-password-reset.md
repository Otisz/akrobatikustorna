# 15: SMTP and a password reset that actually arrives

**What to build:** The Site Owner resets their own password and receives the email, so they are never locked
out of their own site. Mail is routed through the club's existing mailbox, because the server's default mail
transport is unreliable and a failed password reset is a lockout.

**Blocked by:** 01.

**Status:** ready-for-agent

- [ ] An SMTP plugin is installed and pinned, routing mail through the club's existing mailbox
- [ ] Credentials are supplied by environment configuration, never committed
- [ ] A password reset requested from the login screen is received and works end to end
- [ ] The reset is verified on the deployed environment, not only locally
