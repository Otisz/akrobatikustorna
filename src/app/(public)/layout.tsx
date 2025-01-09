import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

import "@/styles/globals.css";
import Header from "@/components/header/header";
import Navbar from "@/components/navbar/navbar";

export const metadata: Metadata = {
  title: {
    default: "Budai Akrobatikus Sport Egyesület",
    template: "%s - Budai Akrobatikus Sport Egyesület",
  },
  description: "Budai Akrobatikus Sport Egyesület",
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
    <html lang="hu">
      <body className={`${inter.variable} bg-background text-foreground font-sans antialiased`}>
        <Header />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
