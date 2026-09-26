import { defineConfig, devices } from '@playwright/test';
import { sessionFile } from './support/site-owner';

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? 'list' : [['list'], ['html', { open: 'never' }]],
  use: {
    // The address the site is installed under, which WordPress redirects every
    // other host back to. See ADR-0004 on how the container reaches it.
    baseURL: 'http://localhost:8080',
    trace: 'retain-on-failure',
    locale: 'hu-HU',
  },
  projects: [
    {
      name: 'sign-in',
      testMatch: 'support/sign-in.setup.ts',
    },
    {
      // Signed in as the Site Owner, once, for every test to share.
      name: 'chromium',
      testDir: './specs',
      dependencies: ['sign-in'],
      use: { ...devices['Desktop Chrome'], storageState: sessionFile },
    },
  ],
});
