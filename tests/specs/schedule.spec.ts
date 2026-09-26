import { test, expect, type Page } from '@playwright/test';
import { canvas } from '../support/editor';
import { cellFor, openSchedule, retime, schedulePath, update } from '../support/schedule-editor';
import { asVisitor } from '../support/visitor';

/**
 * The Schedule changes every term, and a parent checks it on a phone. These
 * tests follow the two journeys that matter: the Site Owner changing a training
 * time unaided, and a visitor reading the result on a narrow screen.
 */

/**
 * A phone, which is where most parents meet the Schedule, and the narrowest
 * width at which it is still a grid — the two places a seventh column could
 * push the page sideways.
 */
const widths = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'small laptop', width: 1024, height: 800 },
];

test('the Schedule is published at /edzeseink as a weekly table', async ({ browser }) => {
  const visitor = await asVisitor(browser);

  try {
    const page = await visitor.newPage();
    const response = await page.goto(schedulePath);

    expect(response?.status()).toBe(200);

    // Opening hours, not a calendar: the columns are the days of the week, and
    // no cell carries a date.
    const days = await page.locator('.wp-block-table thead th').allInnerTexts();

    expect(days.map((day) => day.trim())).toEqual([
      'Kategória',
      'Hétfő',
      'Kedd',
      'Szerda',
      'Csütörtök',
      'Péntek',
      'Szombat',
    ]);

    await expect(page.locator('.wp-block-table tbody tr')).not.toHaveCount(0);
  } finally {
    await visitor.close();
  }
});

test('the Schedule is one click from the home page', async ({ browser }) => {
  const visitor = await asVisitor(browser);

  try {
    const page = await visitor.newPage();

    await page.goto('/');

    const link = page.locator(`a[href$="${schedulePath}"]`);

    await expect(link.first()).toBeVisible();
  } finally {
    await visitor.close();
  }
});

for (const { name, width, height } of widths) {
  test(`a visitor on a ${name} reads the Schedule without scrolling sideways`, async ({ browser }) => {
    const visitor = await asVisitor(browser);

    try {
      const page = await visitor.newPage();

      await page.setViewportSize({ width, height });
      await page.goto(schedulePath);

      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );

      expect(overflows).toBe(false);

      // Stacked, a time would lose the day above it, so every cell carries its
      // own column heading whichever way the table is read.
      const cell = await cellFor(page, 'Mozgásképzés', 'Péntek');

      await expect(cell).toHaveAttribute('data-label', 'Péntek');
    } finally {
      await visitor.close();
    }
  });
}

test('the Site Owner changes a training time and a visitor sees the new one', async ({ page, browser }) => {
  const group = 'Gyöngy és Gyémánt';
  const day = 'Kedd';

  await openSchedule(page);

  // The Schedule's starting table is written as block markup in code, so the
  // first thing the journey proves is that the editor accepts it as blocks
  // rather than offering to recover it.
  await expect(canvas(page).locator('.block-editor-warning')).toHaveCount(0);

  const editable = await cellFor(canvas(page), group, day);
  const before = (await editable.innerText()).trim();
  const after = `16:45–18:15 (${Date.now()})`;

  await retime(editable, after);
  await update(page);

  // Put the real time back even when an assertion fails, so a run leaves the
  // Schedule as it found it.
  try {
    const visitor = await asVisitor(browser);

    try {
      const published = await visitor.newPage();

      await published.goto(schedulePath);

      await expect(await cellFor(published, group, day)).toHaveText(after);
    } finally {
      await visitor.close();
    }
  } finally {
    await openSchedule(page);
    await retime(await cellFor(canvas(page), group, day), before);
    await update(page);
  }
});
