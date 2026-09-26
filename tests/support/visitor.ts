import { type Browser, type BrowserContext } from '@playwright/test';

/**
 * A signed-out browser context, for assertions about what the public can reach.
 * `browser.newContext()` inherits the project's stored Site Owner session, so an
 * empty one has to be spelled out.
 */
export async function asVisitor(browser: Browser): Promise<BrowserContext> {
  return browser.newContext({ storageState: { cookies: [], origins: [] } });
}
