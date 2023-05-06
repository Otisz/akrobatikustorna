import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: {
    // host: process.env.NEXT_PUBLIC_VERCEL_URL || "localhost:3000",
    hash: "",
    host: process.env.NEXT_PUBLIC_VERCEL_URL || "localhost:3000",
    hostname: process.env.NEXT_PUBLIC_VERCEL_URL || "localhost",
    href: process.env.NEXT_PUBLIC_VERCEL_URL || "localhost:3000",
    toString: () =>
      process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000",
    origin: "",
    password: "",
    pathname: "",
    port: "",
    protocol: process.env.NEXT_PUBLIC_VERCEL_URL ? "https" : "http",
    search: "",
    searchParams: new URLSearchParams(),
    username: "",
    toJSON: () => "",
  },
  title: {
    default: "Budai Akrobatikus Sport Egyesület",
    template: "%s - Budai Akrobatikus Sport Egyesület",
  },
  description: "Budai Akrobatikus Sport Egyesület",
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    title: "Budai Akrobatikus Sport Egyesület",
    description: "Budai Akrobatikus Sport Egyesület",
    images: "/images/logo_base.png",
  },
  twitter: {
    title: "Budai Akrobatikus Sport Egyesület",
    description: "Budai Akrobatikus Sport Egyesület",
    images: "/images/logo_base.png",
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

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <Navigation />
      <Banner />
      {children}
      <Footer />
    </div>
  );
}
