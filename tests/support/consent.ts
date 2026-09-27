import { expect, type Page, type Request } from '@playwright/test';

/**
 * The host the club's analytics answers on locally, which deliberately does not
 * resolve: `config/application.php` points development at `https://analytics.invalid`,
 * so a request the gate lets through is visible here without any local machine
 * reaching the club's real PostHog property. What a test asserts is that the
 * request was *issued* — that is the whole of what consent decides — and not that
 * it arrived.
 *
 * Kept in step with that file by name; nothing else in the suite matches on it.
 */
export const analyticsHost = 'analytics.invalid';

/** Every analytics request the page has made since this was called. */
export function recordAnalyticsRequests(page: Page): string[] {
  const requests: string[] = [];

  page.on('request', (request: Request) => {
    if (request.url().includes(analyticsHost)) {
      requests.push(request.url());
    }
  });

  return requests;
}

export const banner = (page: Page) => page.locator('#cookie-notice');
export const acceptButton = (page: Page) => page.locator('#cn-accept-cookie');
export const refuseButton = (page: Page) => page.locator('#cn-refuse-cookie');

/** The tag the analytics library would be loaded by, present only once agreed to. */
export const analyticsScript = (page: Page) => page.locator('#base-analytics-js');

/**
 * A moment past the page's own load event, in which a request issued late — the
 * kind a gate is most likely to leak — would show up. `networkidle` would say
 * this better, but the home page's carousel leaves an image request open and it
 * never fires.
 */
export function settle(page: Page): Promise<void> {
  return page.waitForTimeout(500);
}

/** Whether the visitor's answer has been recorded, whichever way it went. */
async function answerRecorded(page: Page): Promise<string | undefined> {
  const cookies = await page.context().cookies();

  return cookies.find((cookie) => cookie.name === 'cookie_notice_accepted')?.value;
}

/**
 * Answers the banner and waits for the answer to be recorded, which is the one
 * thing that survives what happens next: the gate is the server's, so the banner
 * reloads the page — on either answer — and a wait on anything in the old page
 * would be racing that. The cookie is read from the browser context rather than
 * the document, so it is readable across the reload.
 */
async function answer(page: Page, button: 'accept' | 'refuse'): Promise<void> {
  await banner(page).waitFor({ state: 'visible' });
  await (button === 'accept' ? acceptButton(page) : refuseButton(page)).click();

  await expect
    .poll(() => answerRecorded(page))
    .toBe(button === 'accept' ? 'true' : 'false');
}

/** Agrees to analytics. What follows is the reloaded page, with analytics in it. */
export const accept = (page: Page) => answer(page, 'accept');

/** Declines analytics, which leaves every page afterwards without any. */
export const refuse = (page: Page) => answer(page, 'refuse');
