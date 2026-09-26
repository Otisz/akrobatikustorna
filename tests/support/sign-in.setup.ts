import { test as setup } from '@playwright/test';
import { sessionFile, signIn } from './site-owner';

setup('sign in as the Site Owner', async ({ page }) => {
  await signIn(page);
  await page.context().storageState({ path: sessionFile });
});
