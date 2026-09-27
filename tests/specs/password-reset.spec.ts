import { test, expect } from '@playwright/test';
import { emptyMailbox, resetLinkIn, waitForMessageTo } from '../support/mailbox';
import { asVisitor } from '../support/visitor';

/**
 * A password reset that does not arrive is a lockout: the Site Owner has no other
 * way into the site and nobody to ask. So what is tested is not that WordPress
 * offered to send the email — it is that the email was carried by SMTP (Simple
 * Mail Transfer Protocol), landed in a mailbox, and that the link in it gets the
 * account signed in again.
 *
 * The account reset here is the local administrator rather than the Site Owner.
 * Resetting a password ends every session the account has open, and the Site
 * Owner's session is shared by every other test in the suite — resetting theirs
 * would fail the tests running alongside this one. The flow is core's own and
 * identical whichever account asks for it.
 */
const localAdministrator = {
  user: 'admin',
  password: 'admin',
  email: 'admin@example.test',
};

/** The mailbox the club reads, which everything the site sends is sent from. */
const clubMailbox = 'akrobatikustorna@gmail.com';

/**
 * And the name it arrives under. Written out rather than read from the site,
 * because `base-mail.php` takes it from the site's own title and a test that read
 * it the same way would assert nothing.
 */
const clubName = 'Budai Akrobatikus Sport Egyesület';

test('the administrator asks for a password reset, gets the email, and is let back in', async ({
  browser,
  request,
}) => {
  const visitor = await asVisitor(browser);

  try {
    await emptyMailbox(request);

    const page = await visitor.newPage();

    await page.goto('/wp/wp-login.php?action=lostpassword');
    await page.locator('#user_login').fill(localAdministrator.user);
    await page.locator('#wp-submit').click();

    // WordPress says the same thing whether or not the mail went anywhere, so its
    // confirmation is worth nothing on its own. The mailbox is the assertion.
    const email = await waitForMessageTo(request, localAdministrator.email);

    expect(email.from).toBe(clubMailbox);
    expect(email.fromName).toBe(clubName);
    expect(email.to).toEqual([localAdministrator.email]);

    // Hungarian, because core's own translation is installed and the account
    // reading this is the club's. An English subject would mean the site came up
    // without its language.
    expect(email.subject).toContain('Jelszó visszaállítás');

    await page.goto(resetLinkIn(email.body));

    // Back to the password it started as, so that a second run of the suite finds
    // the account it expects. Core rates it weak and asks to be sure.
    await page.locator('#pass1').fill(localAdministrator.password);
    await page.locator('#pw-weak').check();
    await page.locator('#wp-submit').click();

    await page.goto('/wp/wp-login.php');
    await page.locator('#user_login').fill(localAdministrator.user);
    await page.locator('#user_pass').fill(localAdministrator.password);
    await page.locator('#wp-submit').click();

    await expect(page.locator('#adminmenu')).toBeVisible();
  } finally {
    await visitor.close();
  }
});
