import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Budai Akrobatikus Sport Egyesület",
  description: "Budai Akrobatikus Sport Egyesület",
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    title: "Budai Akrobatikus Sport Egyesület",
    description: "Budai Akrobatikus Sport Egyesület",
    url: "https://akrobatikustorna.leventeotta.com",
    images: "https://akrobatikustorna.leventeotta.com/images/logo_base.png",
  },
  twitter: {
    title: "Budai Akrobatikus Sport Egyesület",
    description: "Budai Akrobatikus Sport Egyesület",
    site: "https://akrobatikustorna.leventeotta.com",
    images: "https://akrobatikustorna.leventeotta.com/images/logo_base.png",
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

export default ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <body>
      <div className="relative min-h-screen bg-gray-100">
        <Navigation />
        <Banner />
        {children}
        <Footer />
      </div>
    </body>
  </html>
);
