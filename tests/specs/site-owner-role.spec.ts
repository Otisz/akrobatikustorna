import { test, expect } from '@playwright/test';
import { openAdmin } from '../support/site-owner';

/**
 * The Site Owner holds the Editor role, never Administrator. This is the
 * deliberate correction of the outgoing system, where every authenticated user
 * had full administrative access, and it is what makes an otherwise powerful
 * editing environment safe to hand over.
 */

const forbidden = {
  'the template editor': 'site-editor.php',
  'the theme listing': 'themes.php',
  'the template file editor': 'theme-editor.php',
  'the plugin listing': 'plugins.php',
  'the site configuration': 'options-general.php',
  'the permalink configuration': 'options-permalink.php',
  'the user listing': 'users.php',
};

for (const [screen, file] of Object.entries(forbidden)) {
  test(`the Site Owner cannot reach ${screen}`, async ({ page }) => {
    const response = await openAdmin(page, file);

    expect(response.status()).toBe(403);
  });
}

test('the Site Owner can edit content', async ({ page }) => {
  const response = await openAdmin(page, 'edit.php');

  expect(response.status()).toBe(200);
  await expect(page.locator('#wpbody-content')).toBeVisible();
});

test('the Site Owner is offered no route into configuration', async ({ page }) => {
  await openAdmin(page, 'index.php');
  const menu = page.locator('#adminmenu');

  await expect(menu).toBeVisible();

  for (const file of Object.values(forbidden)) {
    await expect(menu.locator(`a[href$="${file}"]`)).toHaveCount(0);
  }
});
