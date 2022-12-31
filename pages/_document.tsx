import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="hu">
      <Head>
        <meta
          property="og:url"
          content="https://akrobatikustorna.leventeotta.com/"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Budai Akrobatikus Sport Egyesület" />
        <meta
          property="og:description"
          content="Budai Akrobatikus Sport Egyesület"
        />
        <meta
          property="og:image"
          content="https://akrobatikustorna.leventeotta.com/images/logo_base.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:domain"
          content="akrobatikustorna.leventeotta.com"
        />
        <meta
          property="twitter:url"
          content="https://akrobatikustorna.leventeotta.com/"
        />
        <meta
          name="twitter:title"
          content="Budai Akrobatikus Sport Egyesület"
        />
        <meta
          name="twitter:description"
          content="Budai Akrobatikus Sport Egyesület"
        />
        <meta
          name="twitter:image"
          content="https://akrobatikustorna.leventeotta.com/images/logo_base.png"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
