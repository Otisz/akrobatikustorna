import { expect, type APIRequestContext } from '@playwright/test';

/**
 * The local stand-in for the club's mailbox: Mailpit, a `compose.yaml` service
 * that speaks SMTP (Simple Mail Transfer Protocol) and delivers nothing. Mail
 * reaches it only if the site really sent over SMTP — the PHP container has no
 * sendmail binary, so a message read back from here is proof of the transport and
 * not only of WordPress having tried.
 *
 * Reached by service name rather than through `localhost`, because the test
 * browser shares nginx's network namespace and nothing is listening on port 8025
 * inside it. See ADR-0004.
 */
const mailpit = 'http://mailpit:8025';

export type Message = {
  fromName: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
};

type Address = { Address: string; Name: string };
type Listed = { ID: string; Subject: string; From: Address; To: Address[] };

/**
 * Throws away every message Mailpit holds, so that "the message for this address"
 * means the one this test's actions sent rather than one a previous run left
 * behind. It empties the whole mailbox, not this test's share of it: Mailpit is
 * one service for the suite, and the suite runs in parallel. Nothing else here
 * sends mail, and a second spec that did would have to wait its turn.
 */
export async function emptyMailbox(api: APIRequestContext): Promise<void> {
  const response = await api.delete(`${mailpit}/api/v1/messages`);

  expect(response.ok(), 'Mailpit refused to empty the mailbox').toBeTruthy();
}

/**
 * Waits for a message addressed to `recipient` and reads it back. Sending is
 * asynchronous on both sides — WordPress hands the message over, Mailpit files it
 * — so this polls rather than reading once.
 */
export async function waitForMessageTo(
  api: APIRequestContext,
  recipient: string
): Promise<Message> {
  await expect
    .poll(async () => (await messagesTo(api, recipient)).length, {
      message: `No mail arrived for ${recipient}`,
      // Longer than the default, because this waits on WordPress opening a
      // connection to another container and Mailpit filing what it receives —
      // two hops that a loaded machine can make slow without making broken.
      timeout: 20_000,
    })
    .toBeGreaterThan(0);

  const [listed] = await messagesTo(api, recipient);
  const response = await api.get(`${mailpit}/api/v1/message/${listed.ID}`);
  expect(response.ok(), `Mailpit would not hand back message ${listed.ID}`).toBeTruthy();

  const { Text: text } = (await response.json()) as { Text: string };

  return {
    fromName: listed.From.Name,
    from: listed.From.Address,
    to: listed.To.map(({ Address: address }) => address),
    subject: listed.Subject,
    body: text,
  };
}

async function messagesTo(api: APIRequestContext, recipient: string): Promise<Listed[]> {
  const response = await api.get(`${mailpit}/api/v1/messages`, { params: { limit: 50 } });

  if (!response.ok()) {
    return [];
  }

  const { messages } = (await response.json()) as { messages: Listed[] };

  return messages.filter((message) =>
    message.To.some(({ Address: address }) => address === recipient)
  );
}

/**
 * The one link in a WordPress password reset email — the only part of it a
 * recipient is expected to act on, and so the only part worth pulling out.
 */
export function resetLinkIn(body: string): string {
  const link = body.match(/https?:\/\/\S*action=rp\S*/)?.[0];

  if (link === undefined) {
    throw new Error(`No password reset link in the email:\n${body}`);
  }

  return link.replace(/[.>,]+$/, '');
}
