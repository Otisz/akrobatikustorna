import { test, expect, type Page } from '@playwright/test';
import {
  expectRefused,
  galleryPath,
  link,
  openNewVideo,
  setLink,
  setName,
} from '../support/video-editor';
import { permalink, save, submit, trash } from '../support/classic-editor';
import { asVisitor } from '../support/visitor';

/**
 * Putting a competition recording in the gallery is a task the Site Owner does
 * alone, with the one thing YouTube hands them: a link. These tests follow that
 * journey, and end where a visitor watches the recording without leaving the
 * site.
 */

/** The Videos in the gallery, in the order a visitor reads down them. */
function gallery(page: Page) {
  return page.locator('[data-video]');
}

/** A YouTube identifier no real recording has, so a run cannot match another's. */
function identifier(): string {
  const run = String(Date.now()).slice(-8);

  return `vid${run}`;
}

test('a Video the Site Owner adds by pasting a link is one a visitor watches in place', async ({
  page,
  browser,
}) => {
  const id = identifier();
  const name = `Országos bajnokság ${id}`;

  await openNewVideo(page);
  await setName(page, name);
  await setLink(page, `https://www.youtube.com/watch?v=${id}`);

  await save(page);

  const editorUrl = page.url();
  const url = await permalink(page);

  // Cleaned up even when an assertion fails, so a run leaves no Video behind.
  try {
    // Signed out, because what matters is what a visitor can watch, not what the
    // editing screen shows back to the Site Owner.
    const visitor = await asVisitor(browser);

    try {
      const videos = await visitor.newPage();

      await videos.goto(galleryPath);

      const video = gallery(videos).filter({ hasText: name });

      // No further steps between pasting the link and the gallery: publishing is
      // all the Site Owner did, and nothing about embeds was asked of them.
      await expect(video).toHaveCount(1);

      // Nothing is loaded from YouTube until a visitor asks for the recording,
      // so what stands in for the player carries the identifier.
      await video.locator('[data-video-play]').click();

      const player = video.locator('iframe');

      await expect(player).toBeVisible();
      await expect(player).toHaveAttribute('src', new RegExp(`/embed/${id}`));

      // In place: the recording plays on the gallery, and the visitor is still
      // on it.
      expect(new URL(videos.url()).pathname).toBe(galleryPath);

      // A Video has one public address, so its own URL (Uniform Resource
      // Locator) carries a visitor to the gallery rather than to a page holding
      // nothing the gallery does not already offer.
      await videos.goto(url);
      expect(new URL(videos.url()).pathname).toBe(galleryPath);
    } finally {
      await visitor.close();
    }
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});

test('any of the addresses YouTube hands out names the same Video', async ({ page }) => {
  const id = identifier();
  const name = `Edzőtábor ${id}`;

  await openNewVideo(page);
  await setName(page, name);
  // What the Share button copies, timestamp and tracking parameter and all —
  // the Site Owner pastes whatever they were given.
  await setLink(page, `https://youtu.be/${id}?t=42&si=AbCdEfGhIjKl`);

  await save(page);

  const editorUrl = page.url();

  try {
    // The screen shows back the recording it understood, rather than leaving the
    // Site Owner to wonder which part of what they pasted mattered.
    expect(await link(page)).toBe(`https://www.youtube.com/watch?v=${id}`);

    await page.goto(galleryPath);

    const video = gallery(page).filter({ hasText: name });

    await expect(video).toHaveAttribute('data-video', id);
  } finally {
    await page.goto(editorUrl);
    await trash(page);
  }
});

test('an address with no recording in it is refused at the editing screen', async ({ page }) => {
  await openNewVideo(page);
  await setName(page, `Semmi ${identifier()}`);

  const refused = [
    // YouTube, but not one recording: a channel, a playlist, the front page.
    'https://www.youtube.com/',
    // Somewhere else wearing a YouTube address's shape, which the site reads
    // the host of rather than looking for a recording anywhere in the text.
    `https://not-youtube.com/watch?v=${identifier()}`,
  ];

  for (const address of refused) {
    await setLink(page, address);
    await submit(page);

    // Refused where the Site Owner can still see what went wrong, rather than
    // published as a Video with nothing to play.
    await expectRefused(page);
    await expect(page.locator('#message.notice-success')).toHaveCount(0);
  }
});

test('the newest recording is at the top of the gallery', async ({ page }) => {
  const run = identifier();
  const older = `Régebbi ${run}`;
  const newer = `Újabb ${run}`;
  const editorUrls: string[] = [];

  try {
    for (const name of [older, newer]) {
      await openNewVideo(page);
      await setName(page, name);
      await setLink(page, `https://www.youtube.com/watch?v=${identifier()}`);
      await save(page);
      editorUrls.push(page.url());
    }

    await page.goto(galleryPath);

    const names = await gallery(page)
      .filter({ hasText: run })
      .locator('[data-name]')
      .allInnerTexts();

    // A gallery of recordings is read newest first: the competition a parent
    // came to watch is the one that just happened, and the Site Owner is given
    // no order to maintain.
    expect(names.map((text) => text.trim())).toEqual([newer, older]);
  } finally {
    for (const url of editorUrls) {
      await page.goto(url);
      await trash(page);
    }
  }
});
