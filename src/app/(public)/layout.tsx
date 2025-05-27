import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header/header";
import Navbar from "@/components/navbar/navbar";

export const metadata: Metadata = {
  title: {
    default: "Budai Akrobatikus Sport Egyesület",
    template: "%s | Budai Akrobatikus Sport Egyesület",
  },
  description: "Budai Akrobatikus Sport Egyesület",
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://www.akrobatikustorna.hu"),
  openGraph: {
    type: "website",
    title: "Budai Akrobatikus Sport Egyesület",
    description: "Budai Akrobatikus Sport Egyesület",
    images: "/logo_base.png",
  },
  twitter: {
    title: "Budai Akrobatikus Sport Egyesület",
    description: "Budai Akrobatikus Sport Egyesület",
    images: "/logo_base.png",
  },
  icons: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
  ],
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className="scroll-smooth">
      <body className={`${inter.variable} bg-background font-sans text-foreground antialiased`}>
        <Header />
        <Navbar />
        <div className="min-h-[calc(100dvh---spacing(38))]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
