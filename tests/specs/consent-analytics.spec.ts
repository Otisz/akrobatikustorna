import { test, expect } from '@playwright/test';
import {
  accept,
  analyticsScript,
  banner,
  recordAnalyticsRequests,
  refuse,
  settle,
} from '../support/consent';
import { asVisitor } from '../support/visitor';

/**
 * The club measures its site with the same PostHog property the outgoing site
 * used, and asks before it does. A banner is the easy half of that; the half
 * worth a test is that the answer decides anything. Analytics is printed by the
 * server only once a visitor has agreed, so a visitor who has not answered and a
 * visitor who declined are served no analytics code at all — which is why these
 * tests watch the network rather than the banner.
 *
 * Both run signed out: the Site Owner's stored session would arrive having
 * already answered, and a visitor is who the question is for.
 */

test('a visitor is asked before any analytics loads, and agreeing is what loads it', async ({
  browser,
}) => {
  const visitor = await asVisitor(browser);

  try {
    const page = await visitor.newPage();
    const requests = recordAnalyticsRequests(page);

    await page.goto('/');

    // Nothing has been agreed to, so there is nothing to agree from: no tag that
    // would load the library, and nothing on the wire.
    await expect(banner(page)).toBeVisible();
    await expect(analyticsScript(page)).toHaveCount(0);
    await settle(page);
    expect(requests).toEqual([]);

    await accept(page);

    // And the answer is what changes it. The banner reloads the page so that the
    // server can act on the answer, so this is the reloaded page.
    await expect(analyticsScript(page)).toBeAttached();
    await expect.poll(() => requests.length).toBeGreaterThan(0);
  } finally {
    await visitor.close();
  }
});

test('a visitor who declines is served no analytics anywhere on the site', async ({ browser }) => {
  const visitor = await asVisitor(browser);

  try {
    const page = await visitor.newPage();
    const requests = recordAnalyticsRequests(page);

    await page.goto('/');
    await refuse(page);

    // Declining is not "not yet answered": the question is not asked again, and
    // the pages visited afterwards carry no analytics either. Both a listing and
    // a page, because each is drawn by a different template.
    for (const path of ['/', '/hirek', '/kapcsolat']) {
      await page.goto(path);

      await expect(banner(page)).toBeHidden();
      await expect(analyticsScript(page)).toHaveCount(0);
      await settle(page);
    }

    expect(requests).toEqual([]);
  } finally {
    await visitor.close();
  }
});
