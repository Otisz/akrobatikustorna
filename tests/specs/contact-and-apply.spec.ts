import { test, expect } from '@playwright/test';
import { applyPath, contactPath, openContactDetails, phoneNumber, setPhoneNumber } from '../support/contact-details';
import { canvas, openEditor, paste, publish, setBody, setTitle, trash } from '../support/editor';
import { asVisitor } from '../support/visitor';

/**
 * A parent arrives wanting two things: to know where the club trains, and to
 * enrol. These tests follow that, and the Site Owner's side of it — one screen
 * where a telephone number is changed, and everywhere it then appears.
 *
 * The club's own application form is a Google Form, as it was on the outgoing
 * site, so the last journey is the Site Owner embedding one in a page of their
 * own making.
 */

/** The application form the club has always taken enrolments through. */
const googleForm = 'https://docs.google.com/forms/d/e/1FAIpQLScuoLL1rYrgj1ohglnjoGDWRKFCPaCMdUhJ3zs96EXm4tytWw/viewform';

/**
 * Any Google Form served for a frame rather than for a browser tab. The Apply
 * page is asserted against the shape rather than against the club's own form,
 * because that form is initial content: a Site Owner who swaps it for next
 * season's has changed nothing this suite is here to protect.
 */
const embeddedForm = /^https:\/\/docs\.google\.com\/forms\/d\/e\/[\w-]+\/viewform\?embedded=true$/;

test('the contact details are published at /kapcsolat', async ({ browser }) => {
  const visitor = await asVisitor(browser);

  try {
    const page = await visitor.newPage();
    const response = await page.goto(contactPath);

    expect(response?.status()).toBe(200);

    const details = page.locator('[data-contact-details]');

    // A telephone number, an email address and a postal address: the three
    // things the page exists to carry.
    await expect(details.locator('a[href^="tel:"]').first()).toBeVisible();
    await expect(details.locator('a[href^="mailto:"]').first()).toBeVisible();
    await expect(details.locator('[data-postal-address]')).not.toBeEmpty();
  } finally {
    await visitor.close();
  }
});

test('/kapcsolat shows where the club trains on a map', async ({ browser }) => {
  const visitor = await asVisitor(browser);

  try {
    const page = await visitor.newPage();

    await page.goto(contactPath);

    // Google's own map, and not merely some frame: the address is the one the
    // editing screen accepts, and nothing else reaches this attribute. Google
    // itself is deliberately not called — a suite that fails on a network blip
    // says nothing about the site.
    await expect(page.locator('iframe[data-contact-map]')).toHaveAttribute(
      'src',
      /^https:\/\/(www\.|maps\.)?google\.com\/maps/
    );
  } finally {
    await visitor.close();
  }
});

test('/jelentkezes embeds the club\'s Google Form', async ({ browser }) => {
  const visitor = await asVisitor(browser);

  try {
    const page = await visitor.newPage();
    const response = await page.goto(applyPath);

    expect(response?.status()).toBe(200);

    // `embedded=true` is what Google Forms serves for a frame rather than for a
    // browser tab, so the address the Site Owner pastes is not enough on its own.
    await expect(page.locator('iframe.google-form')).toHaveAttribute('src', embeddedForm);
  } finally {
    await visitor.close();
  }
});

test('a parent finds the way to apply from the home page', async ({ browser }) => {
  const visitor = await asVisitor(browser);

  try {
    const page = await visitor.newPage();

    await page.goto('/');

    await expect(page.locator(`a[href$="${applyPath}"]`).first()).toBeVisible();
  } finally {
    await visitor.close();
  }
});

test('the Site Owner changes the telephone number and it changes everywhere', async ({ page, browser }) => {
  await openContactDetails(page);

  const before = await phoneNumber(page);
  const after = `+36 20 000 ${String(Date.now()).slice(-4)}`;

  await setPhoneNumber(page, after);

  // Put the club's real number back even when an assertion fails, so a run
  // leaves the site as it found it.
  try {
    const visitor = await asVisitor(browser);

    try {
      const published = await visitor.newPage();

      await published.goto(contactPath);
      await expect(published.locator('[data-contact-details] a[href^="tel:"]').first()).toHaveText(after);

      // Everywhere it appears: the footer carries the same number on every page.
      await published.goto('/');
      await expect(published.locator('footer [data-contact] a[href^="tel:"]').first()).toHaveText(after);
    } finally {
      await visitor.close();
    }
  } finally {
    await openContactDetails(page);
    await setPhoneNumber(page, before);
  }
});

test('the Site Owner embeds a Google Form in a page of their own', async ({ page, browser }) => {
  const title = `Űrlap ${Date.now() % 100000}`;

  await openEditor(page, 'post-new.php?post_type=page');
  await setTitle(page, title);

  // The whole mechanism asked of the Site Owner: the form's address, on a line
  // of its own. Nothing about embeds, and no HTML (HyperText Markup Language).
  await setBody(page, googleForm);

  const url = await publish(page);
  const editorUrl = page.url();

  // Cleaned up even when an assertion fails, so a run leaves no page behind.
  try {
    const visitor = await asVisitor(browser);

    try {
      const published = await visitor.newPage();

      await published.goto(url);

      await expect(published.locator('iframe.google-form')).toHaveAttribute(
        'src',
        `${googleForm}?embedded=true`
      );
    } finally {
      await visitor.close();
    }
  } finally {
    // Back to the editor, past the panel publishing left over the sidebar.
    await page.goto(editorUrl);
    await trash(page);
  }
});

test('a Google Form address pasted into the editor still becomes the form', async ({ page, browser }) => {
  const title = `Beillesztve ${Date.now() % 100000}`;

  // Pasting is what the Site Owner actually does, and it is not the same as
  // typing: the editor turns a pasted address into an embed block, which it then
  // cannot preview — Google publishes no oEmbed service for Forms. The published
  // page is what this asserts, because that is where the form has to appear.
  await openEditor(page, 'post-new.php?post_type=page');
  await setTitle(page, title);

  await canvas(page).locator('.block-editor-default-block-appender__content').click();
  await paste(page, googleForm);

  // The editor's own account of what the paste became, before the page is saved.
  await expect(canvas(page).locator('figure.wp-block-embed')).toBeVisible();

  const url = await publish(page);
  const editorUrl = page.url();

  try {
    const visitor = await asVisitor(browser);

    try {
      const published = await visitor.newPage();

      await published.goto(url);

      await expect(published.locator('iframe.google-form')).toHaveAttribute(
        'src',
        `${googleForm}?embedded=true`
      );
    } finally {
      await visitor.close();
    }
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});
